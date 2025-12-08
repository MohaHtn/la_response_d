from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import auth_router, documents_router, moderation_router, setup_router
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
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8080",  # Au cas où vous utiliseriez un autre port
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Username",  # Pour votre endpoint send-book
    ],
)

# Middleware personnalisés
app.middleware("http")(error_handler_middleware)
app.middleware("http")(logging_middleware)

# Inclusion des routers modulaires
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(moderation_router)
app.include_router(setup_router)
app.include_router(legacy_router)  # send-book endpoint


# Health check endpoint
@app.get("/health")
async def health():
    """Endpoint de santé de l'API"""
    return {"status": "ok", "version": "2.0.0"}


@app.get("/test-cors")
async def test_cors():
    """Endpoint pour tester la configuration CORS"""
    return {
        "message": "CORS fonctionne correctement",
        "timestamp": "2024-12-08T12:00:00Z",
        "headers": "Check developer tools for CORS headers"
    }


@app.options("/test-cors")
async def test_cors_preflight():
    """Gestion des requêtes OPTIONS pour CORS"""
    return {"message": "CORS preflight OK"}


@app.get("/")
async def root():
    """Page d'accueil de l'API"""
    return {
        "message": "Bienvenue sur l'API Bibliothéko",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
    }
