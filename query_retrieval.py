from rank_bm25 import BM25Okapi
import numpy as np
import json

def load_chunks(path):
    with open(path, 'r') as f:
        chunks = json.load(f)
    return chunks

def build_index(chunks):
    tokenized_docs = [chunk["text"].lower().split() for chunk in chunks]
    bm25 = BM25Okapi(tokenized_docs)
    return bm25

def retrieve(query, bm25, chunks, top_k):
    tokenized_query = query.lower().split()
    scores = bm25.get_scores(tokenized_query)

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
    bm25 = build_index(chunks)

    print("Ready for queries. Type 'quit' to exit")

    while True:
        query = input("Enter your query: ")
        if query.lower() == 'quit':
            break

        results = retrieve(query, bm25, chunks, top_k=5)
        for i, res in enumerate(results, 1):
            print(f"Result {i}")
            print(f"Source: {res['source']}")
            print(f"Score: {res['score']:.4f}")
            print(f"Text: {res['chunk_text']}")