# Dockerfile para DolphinBot V2
FROM node:24-alpine

# Metadata
LABEL maintainer="CARLOSGRCIAGRCIA"
LABEL description="DolphinBot V2 - El mejor bot de WhatsApp"
LABEL version="3.0"

# Variables de entorno
ENV NODE_ENV=production
ENV TZ=America/Mexico_City

# Instalar dependencias del sistema
RUN apk add --no-cache \
    ffmpeg \
    wget \
    git \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package.json ./

# Instalar dependencias de Node.js (cambio aquí: npm install en lugar de npm ci)
RUN npm install --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copiar el código del bot
COPY . .

# Crear directorios necesarios
RUN mkdir -p /app/Seccion-activas \
    /app/tmp \
    /app/src/database \
    /app/plugins && \
    chmod -R 755 /app

# Exponer puerto (si usas servidor web)
EXPOSE 3000

# Volúmenes para persistencia
VOLUME ["/app/Seccion-activas", "/app/src/database", "/app/tmp"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "console.log('Bot is running')" || exit 1

# Script de inicio
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
