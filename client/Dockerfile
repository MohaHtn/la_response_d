# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copie package.json et install des dépendances
COPY package*.json ./
RUN npm install

# Copie tous les fichiers nécessaires en une seule fois pour éviter les problèmes
COPY . ./

# Nettoyage des fichiers non nécessaires après copie
RUN rm -rf node_modules .git .pytest_cache dist 2>/dev/null || true

# Vérification que les fichiers critiques sont présents
RUN echo "=== DIAGNOSTIC POST-COPIE ===" && \
    pwd && \
    echo "Contenu du répertoire de travail:" && \
    ls -la && \
    echo "Vérification des fichiers critiques:" && \
    test -f index.html && echo "✅ index.html OK" || echo "❌ index.html MANQUANT" && \
    test -f vite.config.js && echo "✅ vite.config.js OK" || echo "❌ vite.config.js MANQUANT" && \
    test -d src && echo "✅ src/ OK" || echo "❌ src/ MANQUANT" && \
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
