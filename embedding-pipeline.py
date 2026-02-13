import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

"""
Non Neural Method of Embedding

Tf-IDF (Weighted Word Counts)

No Semantic Understanding

Rare words high score
TF (Term Freq) * IDF(Inverse Document Freq)

# Complexity levels:
# Level 1: Bag of Words (count words)
# Level 1.5: TF-IDF (weight by importance)
# Level 2: BM25 ← HERE
# Level 3: Word2Vec (neural word embeddings)
# Level 4: BERT (contextual transformers)
# Level 5: Sentence Transformers (optimized for similarity)
# Level 6: Instruction-tuned (E5, BGE)
"""

docs = [
    {
        "text": "bm25 is a ranking function used by search engines",
        "source": "doc1.pdf"
    },
    {
        "text": "python libraries can implement bm25 for information retrieval",
        "source": "doc2.pdf"
    },
    {
        "text": "tf idf and bm25 are related but bm25 is usually better for search",
        "source": "doc3.pdf"
    }
]

def save_chunks(chunks, path="chunks.json"):
    with open(path, "w") as f:
        json.dump(chunks, f, indent=4)

if __name__ == "__main__":

    #Tokenize documents
    tokenized_docs = [d["text"] for d in docs]

    embeddings = model.encode(tokenized_docs, convert_to_numpy=True)

    for i, chunk in enumerate(docs):
        chunk["embedding"] = embeddings[i].tolist()

    save_chunks(docs)

    print("embeddings saved to chunks.json")


    
