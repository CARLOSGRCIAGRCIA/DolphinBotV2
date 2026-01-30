#!/bin/bash

# Script para detener el bot de forma limpia
# Uso: bash stop-bot.sh

echo "🛑 Deteniendo Dolphin-Bot..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}❌ PM2 no está instalado${NC}"
    exit 1
fi

# Verificar si el bot está corriendo
pm2 describe dolphin-bot > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  El bot no está corriendo en PM2${NC}"
    exit 0
fi

# Detener PM2
echo -e "${CYAN}Deteniendo bot...${NC}"
pm2 stop dolphin-bot

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Bot detenido correctamente${NC}"
else
    echo -e "${RED}❌ Error al detener el bot${NC}"
    exit 1
fi

echo ""

# Preguntar si se desea eliminar del PM2
read -p "¿Deseas eliminar el bot de PM2? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    pm2 delete dolphin-bot
    echo -e "${GREEN}✓ Bot eliminado de PM2${NC}"
    pm2 save
fi

# Preguntar si se desea liberar el wake lock (solo Termux)
if command -v termux-wake-unlock &> /dev/null; then
    echo ""
    read -p "¿Deseas liberar el wake lock? (s/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        termux-wake-unlock
        echo -e "${GREEN}✓ Wake lock liberado${NC}"
    fi
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Proceso completado${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Para iniciar el bot nuevamente:"
echo "  bash start-bot.sh qr    (con código QR)"
echo "  bash start-bot.sh code  (con código de 8 dígitos)"