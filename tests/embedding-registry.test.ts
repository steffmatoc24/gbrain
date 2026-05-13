import { describe, it, expect } from 'bun:test';
import { getDimensionsForModel, MODEL_DIMENSIONS } from '../src/core/ai/embedding-registry';

describe('embedding-registry', () => {
  describe('getDimensionsForModel', () => {
    it('returns 1024 for mistral:mistral-embed', () => {
      expect(getDimensionsForModel('mistral:mistral-embed')).toBe(1024);
    });

    it('returns 3072 for openai:text-embedding-3-large', () => {
      expect(getDimensionsForModel('openai:text-embedding-3-large')).toBe(3072);
    });

    it('throws Error with model name for unknown model', () => {
      expect(() => getDimensionsForModel('foo:bar')).toThrow(/foo:bar/);
    });

    it('includes known model list in error message', () => {
      expect(() => getDimensionsForModel('foo:bar')).toThrow(/Known models:/);
    });
  });

  describe('MODEL_DIMENSIONS', () => {
    it('contains all 11 expected entries', () => {
      expect(Object.keys(MODEL_DIMENSIONS).length).toBe(11);
    });

    it('maps openai:text-embedding-3-small to 1536', () => {
      expect(MODEL_DIMENSIONS['openai:text-embedding-3-small']).toBe(1536);
    });

    it('maps openai:text-embedding-ada-002 to 1536', () => {
      expect(MODEL_DIMENSIONS['openai:text-embedding-ada-002']).toBe(1536);
    });

    it('maps voyage:voyage-3-lite to 512', () => {
      expect(MODEL_DIMENSIONS['voyage:voyage-3-lite']).toBe(512);
    });
  });
});
