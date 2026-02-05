from rank_bm25 import BM25Okapi

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
    "bm25 is a ranking function used by search engines",
    "python libraries can implement bm25 for information retrieval",
    "tf idf and bm25 are related but bm25 is usually better for search"
]

if __name__ == "__main__":
    
    #Tokenize documents
    tokenized_docs = [d.lower().split() for d in docs]

    bm25 = BM25Okapi(tokenized_docs)

    query = "bm25 in python"
    tokenized_query = query.lower().split()

    scores = bm25.get_scores(tokenized_query)
    top_n = bm25.get_top_n(tokenized_query, docs, n=3)

    print(f"Scores: ", scores)
    print("Top Docs: ", top_n)


    
