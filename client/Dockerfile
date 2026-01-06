# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copie package.json et install des dépendances
COPY package*.json ./
RUN npm install

# Copier tout le contexte disponible
COPY . .

# Créer le dossier public s'il n'existe pas
RUN mkdir -p public

# Créer index.html s'il n'existe pas
RUN if [ ! -f index.html ]; then \
    echo '<!doctype html>' > index.html && \
    echo '<html lang="en">' >> index.html && \
    echo '  <head>' >> index.html && \
    echo '    <meta charset="UTF-8" />' >> index.html && \
    echo '    <link rel="icon" type="image/svg+xml" href="/book.svg" />' >> index.html && \
    echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />' >> index.html && \
    echo '    <title>La Réponse D | Biblioteko</title>' >> index.html && \
    echo '  </head>' >> index.html && \
    echo '  <body>' >> index.html && \
    echo '    <div id="root"></div>' >> index.html && \
    echo '    <script type="module" src="/src/main.jsx"></script>' >> index.html && \
    echo '  </body>' >> index.html && \
    echo '</html>' >> index.html && \
    echo "✅ index.html créé"; \
    else echo "✅ index.html existant"; fi

# Créer vite.config.js s'il n'existe pas
RUN if [ ! -f vite.config.js ]; then \
    echo "import { defineConfig } from 'vite'" > vite.config.js && \
    echo "import react from '@vitejs/plugin-react'" >> vite.config.js && \
    echo "" >> vite.config.js && \
    echo "export default defineConfig({" >> vite.config.js && \
    echo "  plugins: [react()]," >> vite.config.js && \
    echo "  server: {" >> vite.config.js && \
    echo "    port: 5173," >> vite.config.js && \
    echo "    host: true" >> vite.config.js && \
    echo "  }" >> vite.config.js && \
    echo "})" >> vite.config.js && \
    echo "✅ vite.config.js créé"; \
    else echo "✅ vite.config.js existant"; fi

# Vérification que les fichiers critiques sont présents
RUN echo "=== DIAGNOSTIC POST-CRÉATION ===" && \
    ls -la && \
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
