from fastapi import FastAPI
from .api import router as api_router

app = FastAPI(title="la_response_d API")
app.include_router(api_router)

# Simple health endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}
