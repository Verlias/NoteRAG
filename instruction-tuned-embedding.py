from google import genai
from google.genai import types
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

client = genai.Client()

texts = [
    "What is the meaning of life?",
    "What is the purpose of chickens",
    "How do I make a cake",
]

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=texts,
    #Replace with RETRIEVAL_DOCUMENT task type
    config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
)

df = pd.DataFrame(
    cosine_similarity([e.values for e in result.embeddings]),
    index=texts,
    columns=texts,
)

print(df)