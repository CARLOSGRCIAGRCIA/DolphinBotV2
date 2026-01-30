#!/bin/bash

# Script de diagnóstico para Dolphin-Bot
# Ejecuta: bash diagnostico.sh

echo "🔍 DIAGNÓSTICO DE DOLPHIN-BOT"
echo "=============================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# 1. Verificar Node.js
echo -e "${CYAN}1. Versión de Node.js:${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js instalado: $NODE_VERSION${NC}"
    
    # Verificar si la versión es >= 16
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        echo -e "${RED}⚠️  ADVERTENCIA: Se requiere Node.js >= 16${NC}"
    fi
else
    echo -e "${RED}✗ Node.js no encontrado${NC}"
fi
echo ""

# 2. Verificar NPM
echo -e "${CYAN}2. Versión de NPM:${NC}"
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓ NPM: $(npm -v)${NC}"
else
    echo -e "${RED}✗ NPM no encontrado${NC}"
fi
echo ""

# 3. Verificar PM2
echo -e "${CYAN}3. PM2:${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 instalado: $(pm2 -v)${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 no instalado (se instalará al iniciar)${NC}"
fi
echo ""

# 4. Verificar dependencias
echo -e "${CYAN}4. Dependencias:${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules existe${NC}"
    PACKAGES=$(ls node_modules | wc -l)
    echo "  Paquetes instalados: $PACKAGES"
else
    echo -e "${RED}✗ node_modules no encontrado${NC}"
    echo -e "${YELLOW}  Ejecuta: npm install${NC}"
fi
echo ""

# 5. Verificar sesión
echo -e "${CYAN}5. Sesión de WhatsApp:${NC}"
if [ -d "DolphinBotSession" ]; then
    echo -e "${GREEN}✓ Carpeta DolphinBotSession existe${NC}"
    if [ -f "DolphinBotSession/creds.json" ]; then
        echo -e "${GREEN}✓ creds.json encontrado (sesión activa)${NC}"
        CREDS_SIZE=$(stat -f%z "DolphinBotSession/creds.json" 2>/dev/null || stat -c%s "DolphinBotSession/creds.json" 2>/dev/null)
        echo "  Tamaño: $CREDS_SIZE bytes"
    else
        echo -e "${YELLOW}⚠️  creds.json no encontrado (necesita iniciar sesión)${NC}"
    fi
    
    # Contar pre-keys
    PREKEYS=$(find DolphinBotSession -name "pre-key-*" 2>/dev/null | wc -l)
    echo "  Pre-keys: $PREKEYS"
else
    echo -e "${YELLOW}⚠️  Carpeta de sesión no existe${NC}"
fi
echo ""

# 6. Verificar base de datos
echo -e "${CYAN}6. Base de datos:${NC}"
if [ -f "src/database/database.json" ]; then
    echo -e "${GREEN}✓ database.json encontrado${NC}"
    DB_SIZE=$(stat -f%z "src/database/database.json" 2>/dev/null || stat -c%s "src/database/database.json" 2>/dev/null)
    echo "  Tamaño: $DB_SIZE bytes"
else
    echo -e "${YELLOW}⚠️  database.json no encontrado (se creará al iniciar)${NC}"
fi
echo ""

# 7. Verificar archivos principales
echo -e "${CYAN}7. Archivos principales:${NC}"
FILES=("index.js" "núcleo•dolphin/config.js" "núcleo•dolphin/start.js" "núcleo•dolphin/handler.js")
for FILE in "${FILES[@]}"; do
    if [ -f "$FILE" ]; then
        echo -e "${GREEN}✓ $FILE${NC}"
    else
        echo -e "${RED}✗ $FILE NO ENCONTRADO${NC}"
    fi
done
echo ""

# 8. Verificar plugins problemáticos
echo -e "${CYAN}8. Verificando plugins problemáticos:${NC}"
if [ -f "plugins/main-allfake.js" ]; then
    echo -e "${YELLOW}⚠️  main-allfake.js encontrado${NC}"
    if grep -q "files.catbox.moe" plugins/main-allfake.js; then
        echo -e "${RED}  ⚠️  PROBLEMA: Contiene URL problemática (catbox.moe)${NC}"
        echo -e "${YELLOW}  → Revisa FIX_ALLFAKE.md para solucionarlo${NC}"
    else
        echo -e "${GREEN}  ✓ No contiene URLs problemáticas${NC}"
    fi
else
    echo -e "${GREEN}✓ main-allfake.js no encontrado o renombrado${NC}"
fi
echo ""

# 9. Estado de PM2
echo -e "${CYAN}9. Estado de PM2:${NC}"
if command -v pm2 &> /dev/null; then
    pm2 describe dolphin-bot > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ dolphin-bot está registrado en PM2${NC}"
        pm2 status
    else
        echo -e "${YELLOW}⚠️  dolphin-bot no está en PM2${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  PM2 no instalado${NC}"
fi
echo ""

# 10. Últimos logs de error
echo -e "${CYAN}10. Últimos errores (si existen):${NC}"
if [ -f "logs/pm2-error.log" ]; then
    ERROR_COUNT=$(wc -l < logs/pm2-error.log)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}Encontrados $ERROR_COUNT líneas de error:${NC}"
        echo "────────────────────────────────────────"
        tail -20 logs/pm2-error.log
        echo "────────────────────────────────────────"
    else
        echo -e "${GREEN}✓ No hay errores registrados${NC}"
    fi
else
    echo -e "${GREEN}✓ No hay archivo de errores${NC}"
fi
echo ""

# 11. Uso de memoria
echo -e "${CYAN}11. Uso de recursos:${NC}"
if command -v pm2 &> /dev/null; then
    pm2 describe dolphin-bot > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "────────────────────────────────────────"
        pm2 describe dolphin-bot | grep -E "memory|cpu|uptime"
        echo "────────────────────────────────────────"
    fi
fi
echo ""

# Resumen y recomendaciones
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${CYAN}RESUMEN Y RECOMENDACIONES:${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"

# Comprobar problemas críticos
CRITICAL=0

if ! command -v node &> /dev/null; then
    echo -e "${RED}⚠️  CRÍTICO: Node.js no instalado${NC}"
    CRITICAL=1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${RED}⚠️  CRÍTICO: Dependencias no instaladas${NC}"
    echo -e "${YELLOW}   Solución: npm install${NC}"
    CRITICAL=1
fi

if [ -f "plugins/main-allfake.js" ] && grep -q "files.catbox.moe" plugins/main-allfake.js; then
    echo -e "${YELLOW}⚠️  Plugin problemático detectado: main-allfake.js${NC}"
    echo -e "${YELLOW}   Solución: Revisar FIX_ALLFAKE.md${NC}"
fi

if [ ! -f "DolphinBotSession/creds.json" ]; then
    echo -e "${YELLOW}⚠️  No hay sesión activa${NC}"
    echo -e "${YELLOW}   Solución: bash start-bot.sh qr  (o 'code')${NC}"
fi

if [ "$CRITICAL" -eq 0 ]; then
    echo -e "${GREEN}✓ No se detectaron problemas críticos${NC}"
    echo ""
    echo -e "${GREEN}Para iniciar el bot:${NC}"
    echo "  bash start-bot.sh qr    (con código QR)"
    echo "  bash start-bot.sh code  (con código de 8 dígitos)"
fi

echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"