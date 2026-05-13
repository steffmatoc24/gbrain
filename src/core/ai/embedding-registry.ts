/**
 * Embedding Model Registry — dimensions per provider:model
 *
 * All dimensions are verified against current provider documentation.
 * Update values ONLY when the provider officially changes the model output dimension.
 * A dimension mismatch between this registry and the actual provider API
 * will cause pgvector INSERT failures at embed time.
 *
 * Sources (verified 2025-05):
 * - Mistral:   docs.mistral.ai/resources/cookbooks/mistral-embeddings-embeddings
 * - OpenAI:    platform.openai.com/docs/guides/embeddings
 * - Voyage:   docs.voyageai.com/embeddings
 * - Cohere:   docs.cohere.com/docs/embeddings
 * - Gemini:   ai.google.dev/gemini-api/docs/models
 * - MiniMax:  platform.minimax.io/document/Text-Embedding
 */

export const MODEL_DIMENSIONS: Record<string, number> = {
  // Mistral
  'mistral:mistral-embed': 1024,

  // OpenAI
  'openai:text-embedding-3-small': 1536,
  'openai:text-embedding-3-large': 3072,
  'openai:text-embedding-ada-002': 1536,

  // Voyage AI
  'voyage:voyage-3-large': 1024,
  'voyage:voyage-3': 1024,
  'voyage:voyage-3-lite': 512,

  // Cohere
  'cohere:embed-multilingual-v3.0': 1024,
  'cohere:embed-english-v3.0': 1024,

  // Google Gemini
  'gemini:text-embedding-004': 768,

  // MiniMax
  'minimax:embo-01': 1536,
};

/**
 * Resolve the embedding dimension for a given provider:model string.
 *
 * @param model - Provider:model string (e.g. "mistral:mistral-embed")
 * @returns The exact dimension count the model produces
 * @throws Error if the model is not in the registry
 */
export function getDimensionsForModel(model: string): number {
  const dim = MODEL_DIMENSIONS[model];
  if (!dim) {
    const known = Object.keys(MODEL_DIMENSIONS).join(', ');
    throw new Error(
      `Unknown embedding model "${model}". ` +
      `Add it to MODEL_DIMENSIONS in src/core/ai/embedding-registry.ts. ` +
      `Known models: ${known}`
    );
  }
  return dim;
}
