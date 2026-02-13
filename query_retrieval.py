import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize

model = SentenceTransformer('BAAI/bge-base-en-v1.5')

def load_chunks(path):
    with open(path, 'r') as f:
        return json.load(f)

def retrieve(query, chunks, top_k):
    query_embedding = model.encode(["query: " + query], convert_to_numpy=True)
    query_embedding = normalize(query_embedding)
    doc_embeddings = np.array([chunk["embedding"] for chunk in chunks])
    scores = np.dot(doc_embeddings, query_embedding.T).squeeze()

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