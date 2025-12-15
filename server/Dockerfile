# syntax=docker/dockerfile:1

FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY ../requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy server sources
COPY ./src /app/src

# Expose API port
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8000/health || exit 1

# Default env (can be overridden by compose)
ENV REDIS_HOST=redis \
    REDIS_PORT=6379 \
    REDIS_DB=0

# Start server
CMD ["uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
