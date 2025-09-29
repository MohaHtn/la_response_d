from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router as api_router

app = FastAPI(title="la_response_d API")
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou spécifie tes domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple health endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}
