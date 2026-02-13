import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def load_chunks(path):
    with open(path, 'r') as f:
        return json.load(f)

def retrieve(query, chunks, top_k):
    query_embedding = model.encode([query], convert_to_numpy=True)
    doc_embeddings = np.array([chunk["embedding"] for chunk in chunks])
    scores = cosine_similarity(query_embedding, doc_embeddings)[0]

    rank_indices = np.argsort(scores)[::-1][:top_k]
    results = []
    for i in rank_indices:
        results.append({
            "chunk_text": chunks[i]["text"],
            "source": chunks[i]["source"],
            "score": float(scores[i])
        })

    return results


if __name__ == "__main__":
    chunks = load_chunks("chunks.json")

    print("Ready for queries. Type 'quit' to exit")

    while True:
        query = input("Enter your query: ")
        if query.lower() == 'quit':
            break

        results = retrieve(query, chunks, top_k=5)
        for i, res in enumerate(results, 1):
            print(f"Result {i}")
            print(f"Source: {res['source']}")
            print(f"Score: {res['score']:.4f}")
            print(f"Text: {res['chunk_text']}")