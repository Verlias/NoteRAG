from google import genai
import os

prompt = input("Enter your Prompt:")
GEMINI_API_KEY = os.getenv("gemini_api")

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Where is Drexel University Located"
)

print(response.text)