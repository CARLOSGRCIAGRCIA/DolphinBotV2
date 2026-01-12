#!/bin/sh
set -e

echo "🐬 Iniciando DolphinBot V2..."

# Verificar Node.js
echo "📦 Verificando Node.js $(node --version)"
echo "📦 npm version: $(npm --version)"

# Crear directorios si no existen
mkdir -p /app/Seccion-activas
mkdir -p /app/tmp
mkdir -p /app/src/database
mkdir -p /app/logs

# Verificar permisos
chmod -R 755 /app/Seccion-activas
chmod -R 755 /app/tmp
chmod -R 755 /app/src/database

# Limpiar cache temporal si existe
if [ -d "/app/tmp" ]; then
    echo "🧹 Limpiando archivos temporales..."
    find /app/tmp -type f -mtime +1 -delete 2>/dev/null || true
fi

# Mostrar modo de inicio
case "${BOT_MODE}" in
    qr)
        echo "📱 Modo: QR Code"
        echo "⏳ Esperando código QR..."
        ;;
    code)
        echo "🔢 Modo: Código de emparejamiento"
        echo "⏳ Esperando código de emparejamiento..."
        ;;
    *)
        echo "🚀 Modo: Normal"
        ;;
esac

# Verificar si existe sesión previa
if [ -d "/app/Seccion-activas" ] && [ "$(ls -A /app/Seccion-activas)" ]; then
    echo "✅ Sesión existente encontrada"
else
    echo "⚠️  No hay sesión guardada, se creará una nueva"
fi

echo "🌊 DolphinBot V2 está listo para iniciar..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Ejecutar el comando pasado
exec "$@"
