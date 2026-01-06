# Build stage
FROM node:20-alpine as build

# Installer git
RUN apk add --no-cache git

WORKDIR /app

# Cloner le dépôt Git directement pour avoir tous les fichiers
ARG GIT_REPO=https://github.com/MohaHtn/la_response_d.git
ARG GIT_BRANCH=main

RUN git clone --depth 1 --branch ${GIT_BRANCH} ${GIT_REPO} /tmp/repo && \
    cp -r /tmp/repo/client/* . && \
    rm -rf /tmp/repo && \
    echo "✅ Fichiers clonés depuis Git"

# Supprimer package-lock.json et node_modules pour éviter le bug npm avec rollup
# Puis réinstaller proprement les dépendances natives pour cette architecture
RUN rm -rf node_modules package-lock.json && \
    npm install --prefer-offline=false && \
    npm install @rollup/rollup-linux-x64-musl --save-optional || true

# Créer le dossier public s'il n'existe pas
RUN mkdir -p public

# Vérification que les fichiers critiques sont présents
RUN echo "=== DIAGNOSTIC POST-CLONE ===" && \
    ls -la && \
    test -f index.html && echo "✅ index.html OK" || echo "❌ index.html MANQUANT" && \
    test -f vite.config.js && echo "✅ vite.config.js OK" || echo "❌ vite.config.js MANQUANT" && \
    test -d src && echo "✅ src/ OK" || echo "❌ src/ MANQUANT" && \
    test -d src/i18n && echo "✅ src/i18n/ OK" || echo "❌ src/i18n/ MANQUANT" && \
    test -d public && echo "✅ public/ OK" || echo "❌ public/ MANQUANT"

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Configuration Nginx
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://la_response_d-server:8000/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    client_max_body_size 50M; \
}' > /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Check what was copied
RUN echo "Files in nginx html:" && ls -la /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
