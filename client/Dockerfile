# Build stage
FROM node:18-alpine as build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de configuration des dépendances
COPY package.json package-lock.json ./

# Installe les dépendances (fallback vers npm install si npm ci échoue)
RUN npm ci --omit=dev || npm install --omit=dev

# Copie le code source
COPY . .

# Build l'application
RUN npm run build

# Production stage
FROM nginx:alpine

# Crée la configuration Nginx personnalisée
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api/ { \
        proxy_pass http://la_response_d-server:8000/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    \
    client_max_body_size 50M; \
}' > /etc/nginx/conf.d/default.conf

# Copie les fichiers buildés depuis l'étape de build
COPY --from=build /app/dist /usr/share/nginx/html

# Expose le port 80
EXPOSE 80

# Démarre Nginx
CMD ["nginx", "-g", "daemon off;"]
