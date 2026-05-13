# Embedding Model Dimensions — Provider Sources

All dimensions verified against official provider documentation on 2025-05-12.

| Model | Dimension | Source | Verified |
|-------|-----------|--------|----------|
| mistral:mistral-embed | 1024 | https://docs.mistral.ai/resources/cookbooks/mistral-embeddings-embeddings | 2025-05-12 |
| openai:text-embedding-3-small | 1536 | https://platform.openai.com/docs/guides/embeddings | 2025-05-12 |
| openai:text-embedding-3-large | 3072 | https://platform.openai.com/docs/guides/embeddings | 2025-05-12 |
| openai:text-embedding-ada-002 | 1536 | https://platform.openai.com/docs/guides/embeddings | 2025-05-12 |
| voyage:voyage-3-large | 1024 | https://blog.voyageai.com/2025/01/07/voyage-3-large/ | 2025-05-12 |
| voyage:voyage-3 | 1024 | https://blog.voyageai.com/2024/09/18/voyage-3/ | 2025-05-12 |
| voyage:voyage-3-lite | 1024 | https://blog.voyageai.com/2024/09/18/voyage-3/ | 2025-05-12 |
| cohere:embed-multilingual-v3.0 | 1024 | https://docs.cohere.com/docs/embeddings | 2025-05-12 |
| cohere:embed-english-v3.0 | 1024 | https://docs.cohere.com/docs/embeddings | 2025-05-12 |
| gemini:text-embedding-004 | 768 | https://ai.google.dev/gemini-api/docs/models | 2025-05-12 |
| minimax:embo-01 | 1536 | https://platform.minimax.io/document/Text-Embedding | 2025-05-12 |

## Notes

- **Cohere**: Default output dimension is 1024 for embed-v4.0 when `output_dimension` not specified. embed-multilingual-v3.0 and embed-english-v3.0 produce 1024-dimensional vectors.
- **Voyage**: voyage-3, voyage-3-lite, voyage-3-large all default to 1024 dimensions (256/512/2048 available via Matryoshka representation learning).
- **Gemini**: text-embedding-004 produces 768-dimensional embeddings (older model-001 produces 768,gemini-embeddings-001).
- **MiniMax**: embod-01 produces 1536-dimensional embeddings per official documentation.
