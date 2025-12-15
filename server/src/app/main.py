from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import auth_router, documents_router, moderation_router, setup_router, admin_router
from .api.middleware import error_handler_middleware, logging_middleware
from .api.routes import router as legacy_router
from .infra.i18n import get_lang, translate

app = FastAPI(
    title="Bibliotheko API",
    description="API for managing a digital library",
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
        "http://localhost:8080",  # In case you use another port
        "http://localhost:5187",  # Nginx client container mapped port
        "http://127.0.0.1:5187",
    ],
    allow_credentials=True,
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
