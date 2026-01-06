from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os

from .api.routers import auth_router, documents_router, moderation_router, setup_router, admin_router
from .api.middleware import error_handler_middleware, logging_middleware
from .api.routes import router as legacy_router
from .infra.i18n import get_lang, translate

app = FastAPI(
    title="Bibliotheko API",
    description="API for managing a digital library",
    version="2.0.0",
)

# Configuration CORS - Origines autorisées
# En production Docker, le client passe par Nginx qui proxy vers le serveur
# donc les requêtes viennent de la même origine ou de l'origine du client
cors_origins = [
    "http://localhost:3000",      # React dev server
    "http://localhost:5173",      # Vite dev server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://localhost:5187",      # Docker client (production)
    "http://127.0.0.1:5187",
    "http://localhost:80",
    "http://localhost",
]

# Ajouter des origines personnalisées depuis les variables d'environnement
extra_origins = os.getenv("CORS_ORIGINS", "")
if extra_origins:
    cors_origins.extend([origin.strip() for origin in extra_origins.split(",") if origin.strip()])

# En mode développement ou si explicitement configuré, autoriser toutes les origines
allow_all_origins = os.getenv("CORS_ALLOW_ALL", "false").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else cors_origins,
    allow_credentials=not allow_all_origins,  # credentials ne fonctionne pas avec "*"
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Username",  # For your send-book endpoint
    ],
)

# Custom middlewares
app.middleware("http")(error_handler_middleware)
app.middleware("http")(logging_middleware)

# Routers
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(moderation_router)
app.include_router(setup_router)
app.include_router(admin_router)
app.include_router(legacy_router)  # send-book endpoint


# Health check endpoint
@app.get("/health")
async def health(request: Request):
    """API health endpoint"""
    lang = get_lang(request)
    return {"status": translate(lang, "health.ok", default="ok"), "version": "2.0.0"}


@app.get("/test-cors")
async def test_cors(request: Request):
    """Endpoint to test CORS configuration"""
    lang = get_lang(request)
    return {
        "message": translate(lang, "cors.ok", default="CORS works correctly"),
        "timestamp": "2024-12-08T12:00:00Z",
        "headers": "Check developer tools for CORS headers"
    }


@app.options("/test-cors")
async def test_cors_preflight(request: Request):
    """Handle OPTIONS requests for CORS"""
    lang = get_lang(request)
    return {"message": translate(lang, "cors.preflight", default="CORS preflight OK")}


@app.get("/")
async def root(request: Request):
    """API root endpoint"""
    lang = get_lang(request)
    return {
        "message": translate(lang, "root.welcome", default="Welcome to the Bibliotheko API"),
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
    }
