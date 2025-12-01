from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import auth_router, documents_router, moderation_router
from .api.middleware import error_handler_middleware, logging_middleware
from .api.routes import router as legacy_router

app = FastAPI(
    title="Bibliothéko API",
    description="API pour la gestion d'une bibliothèque numérique",
    version="2.0.0",
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware personnalisés
app.middleware("http")(error_handler_middleware)
app.middleware("http")(logging_middleware)

# Inclusion des routers modulaires
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(moderation_router)
app.include_router(legacy_router)  # send-book endpoint


# Health check endpoint
@app.get("/health")
async def health():
    """Endpoint de santé de l'API"""
    return {"status": "ok", "version": "2.0.0"}


@app.get("/")
async def root():
    """Page d'accueil de l'API"""
    return {
        "message": "Bienvenue sur l'API Bibliothéko",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
    }
