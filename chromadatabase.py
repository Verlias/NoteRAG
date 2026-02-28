import chromadb
chroma_client = chromadb.Client()

collection = chroma_client.get_or_create_collection(name="study_rag_model")

collection.upsert(
    documents=[
        "This is a document about pineapple", # JSON files from text_extract_clean.py
        "This is a document about oranges"
    ],
    ids=["id1", "id2"]
)

results = collection.query(
    query_texts=["This is a query document about florida"], # Chroma will embed this for you
    n_results=2 # how many results to return
)

print(results)