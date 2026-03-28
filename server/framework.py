from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/")
async def postreq():
    return {"message": "Hello World"}

