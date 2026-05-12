/**
 * gbrain migrate-embedding-dimension --to <N>
 *
 * Offline migration: drops the content_chunks.embedding column and recreates
 * it with the target dimension. Re-indexes via HNSW. Marks all chunks as
 * embedding_pending so `gbrain embed --all` re-processes them.
 */
import { loadConfig } from '../core/config.ts';
import { createEngine } from '../core/engine-factory.ts';
import { getEmbeddingDimensions } from '../core/ai/gateway.ts';
import { getDimensionsForModel } from '../core/ai/embedding-registry.ts';
import type { BrainEngine } from '../core/engine.ts';

export async function runMigrateEmbeddingDimension(engine: BrainEngine, args: string[]): Promise<void> {
  const toIdx = args.indexOf('--to');
  if (toIdx === -1) {
    console.error('Usage: gbrain migrate-embedding-dimension --to <N>');
    console.error('  N = target vector dimension (e.g. 1024, 3072)');
    process.exit(1);
  }
  const targetDim = parseInt(args[toIdx + 1], 10);
  if (isNaN(targetDim) || targetDim <= 0) {
    console.error(`Invalid dimension: ${args[toIdx + 1]}. Must be a positive integer.`);
    process.exit(1);
  }

  // Verify the dimension is known in the registry
  const config = loadConfig();
  const model = config?.embedding_model ?? 'openai:text-embedding-3-large';
  const expectedDim = model === config?.embedding_model
    ? getDimensionsForModel(model)
    : getEmbeddingDimensions();

  if (targetDim !== expectedDim) {
    console.warn(
      `Warning: target dimension ${targetDim} differs from current model "${model}" ` +
      `expected dimension ${expectedDim}. Continue only if you are switching providers.`
    );
  }

  console.log(`Migrating content_chunks.embedding to vector(${targetDim})...`);

  // Step 1: count affected rows
  const countRows = await engine.withReservedConnection(async (conn) =>
    conn.executeRaw<{ count: string }>(`SELECT COUNT(*) AS count FROM content_chunks WHERE embedding IS NOT NULL`)
  );
  const rowCount = parseInt(countRows[0]?.count ?? '0', 10);
  console.log(`  Affected rows (with embedding): ${rowCount}`);

  // Step 2: DROP INDEX
  console.log('  Dropping index content_chunks_embedding_idx...');
  await engine.withReservedConnection(async (conn) =>
    conn.executeRaw(`DROP INDEX IF EXISTS content_chunks_embedding_idx`)
  );
  console.log('  Index dropped.');

  // Step 3: DROP COLUMN
  console.log('  Dropping column embedding...');
  await engine.withReservedConnection(async (conn) =>
    conn.executeRaw(`ALTER TABLE content_chunks DROP COLUMN embedding`)
  );
  console.log('  Column dropped.');

  // Step 4: ADD COLUMN with new dimension
  console.log(`  Adding column embedding vector(${targetDim})...`);
  await engine.withReservedConnection(async (conn) =>
    conn.executeRaw(`ALTER TABLE content_chunks ADD COLUMN embedding vector(${targetDim})`)
  );
  console.log('  Column added.');

  // Step 5: CREATE INDEX
  console.log('  Creating HNSW index...');
  await engine.withReservedConnection(async (conn) =>
    conn.executeRaw(
      `CREATE INDEX content_chunks_embedding_idx ON content_chunks USING hnsw (embedding vector_cosine_ops)`
    )
  );
  console.log('  Index created.');

  // Step 6: Mark all chunks as embedding_pending
  console.log('  Marking all chunks as embedding_pending...');
  await engine.withReservedConnection(async (conn) =>
    conn.executeRaw(`UPDATE content_chunks SET embedding_pending = true`)
  );
  const updated = await engine.withReservedConnection(async (conn) =>
    conn.executeRaw<{ count: string }>(`SELECT COUNT(*) AS count FROM content_chunks WHERE embedding_pending = true`)
  );
  console.log(`  Marked ${updated[0]?.count ?? 0} chunks as embedding_pending.`);

  console.log(`\nMigration complete. Schema now uses vector(${targetDim}).`);
  console.log('Run `gbrain embed --all` to re-embed all chunks.');
}
