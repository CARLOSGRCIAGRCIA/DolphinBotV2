#!/bin/bash

# Script de inicio mejorado para Dolphin-Bot
# Uso: bash start-bot.sh [qr|code]

echo "🐬 Iniciando Dolphin-Bot..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Activar wake lock para evitar suspensión (solo en Termux)
if command -v termux-wake-lock &> /dev/null; then
    echo -e "${CYAN}Activando wake lock...${NC}"
    termux-wake-lock
fi

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 no encontrado. Instalando...${NC}"
    npm install -g pm2
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Instalando dependencias...${NC}"
    npm install
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Verificar si existe sesión
SESSION_EXISTS=false
if [ -d "DolphinBotSession" ] && [ -f "DolphinBotSession/creds.json" ]; then
    SESSION_EXISTS=true
    echo -e "${GREEN}✓ Sesión existente encontrada${NC}"
fi

# Determinar método de autenticación
AUTH_METHOD=""
if [ "$SESSION_EXISTS" = false ]; then
    echo ""
    echo -e "${CYAN}No se encontró sesión activa${NC}"
    echo -e "${YELLOW}Selecciona método de autenticación:${NC}"
    echo "1) Código QR"
    echo "2) Código de 8 dígitos"
    echo ""
    
    # Si se pasó argumento, usarlo
    if [ "$1" = "qr" ]; then
        AUTH_METHOD="qr"
        echo -e "${GREEN}Usando método: QR (desde argumento)${NC}"
    elif [ "$1" = "code" ]; then
        AUTH_METHOD="code"
        echo -e "${GREEN}Usando método: Código (desde argumento)${NC}"
    else
        read -p "Opción [1-2]: " opcion
        case $opcion in
            1)
                AUTH_METHOD="qr"
                ;;
            2)
                AUTH_METHOD="code"
                ;;
            *)
                echo -e "${RED}Opción inválida, usando QR por defecto${NC}"
                AUTH_METHOD="qr"
                ;;
        esac
    fi
fi

# Detener instancia anterior si existe
pm2 delete dolphin-bot 2>/dev/null

# Modificar ecosystem.config.json según el método
if [ "$AUTH_METHOD" = "qr" ]; then
    echo -e "${CYAN}Configurando para usar código QR...${NC}"
    cat > ecosystem.config.json << 'EOF'
{
  "apps": [{
    "name": "dolphin-bot",
    "script": "index.js",
    "args": "qr",
    "cwd": "./",
    "exec_mode": "fork",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "500M",
    "env": {
      "NODE_ENV": "production"
    },
    "error_file": "./logs/pm2-error.log",
    "out_file": "./logs/pm2-out.log",
    "log_file": "./logs/pm2-combined.log",
    "time": true,
    "merge_logs": true,
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "max_restarts": 10,
    "min_uptime": "10s",
    "restart_delay": 4000,
    "kill_timeout": 5000,
    "listen_timeout": 10000,
    "wait_ready": false,
    "exp_backoff_restart_delay": 100
  }]
}
EOF
elif [ "$AUTH_METHOD" = "code" ]; then
    echo -e "${CYAN}Configurando para usar código de 8 dígitos...${NC}"
    cat > ecosystem.config.json << 'EOF'
{
  "apps": [{
    "name": "dolphin-bot",
    "script": "index.js",
    "args": "code",
    "cwd": "./",
    "exec_mode": "fork",
    "instances": 1,
    "autorestart": true,
    "watch": false,
    "max_memory_restart": "500M",
    "env": {
      "NODE_ENV": "production"
    },
    "error_file": "./logs/pm2-error.log",
    "out_file": "./logs/pm2-out.log",
    "log_file": "./logs/pm2-combined.log",
    "time": true,
    "merge_logs": true,
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
    "max_restarts": 10,
    "min_uptime": "10s",
    "restart_delay": 4000,
    "kill_timeout": 5000,
    "listen_timeout": 10000,
    "wait_ready": false,
    "exp_backoff_restart_delay": 100
  }]
}
EOF
fi

# Iniciar el bot con PM2
echo -e "${GREEN}Iniciando bot con PM2...${NC}"
pm2 start ecosystem.config.json

echo -e "${CYAN}Guardando configuración de PM2...${NC}"
pm2 save

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Bot iniciado correctamente!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

if [ "$AUTH_METHOD" = "qr" ]; then
    echo -e "${YELLOW}Escanea el código QR que aparecerá en los logs${NC}"
elif [ "$AUTH_METHOD" = "code" ]; then
    echo -e "${YELLOW}Ingresa el código de 8 dígitos en WhatsApp${NC}"
fi

echo ""
echo -e "${CYAN}Comandos útiles:${NC}"
echo "  pm2 logs dolphin-bot    - Ver logs en tiempo real"
echo "  pm2 status              - Ver estado del bot"
echo "  pm2 restart dolphin-bot - Reiniciar bot"
echo "  pm2 stop dolphin-bot    - Detener bot"
echo "  pm2 monit               - Monitorear recursos"
echo "  bash stop-bot.sh        - Detener bot de forma segura"
echo ""
echo -e "${CYAN}Mostrando logs (Ctrl+C para salir)...${NC}"
sleep 2
pm2 logs dolphin-bot