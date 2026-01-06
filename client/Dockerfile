# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copie package.json et package-lock.json (si présent)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copie la configuration Vite et autres fichiers de config
COPY vite.config.js ./
COPY index.html ./
COPY eslint.config.js ./

# Copie le code source et les assets
COPY src/ ./src/
COPY public/ ./public/

# Debug: lister les fichiers pour vérifier
RUN ls -la

# Build l'application
RUN npm run build

# Production stage avec Nginx
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

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
