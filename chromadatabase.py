import os
import chromadb
from chromadb.utils.embedding_functions import GoogleGenaiEmbeddingFunction

os.environ["GOOGLE_API_KEY"] = "YOUR_ACTUAL_API_KEY_HERE"

gemini_ef = GoogleGenaiEmbeddingFunction(
    model_name="models/text-embedding-004"
)

chroma_client = chromadb.Client()

collection = chroma_client.get_or_create_collection(
    name="study_rag_model",
    embedding_function=gemini_ef
)

collection.upsert(
    documents=["This is a document about pineapple", "This is about oranges"],
    ids=["id1", "id2"]
)

results = collection.query(
    query_texts=["Where do pineapples grow?"],
    n_results=1
)

print(results)