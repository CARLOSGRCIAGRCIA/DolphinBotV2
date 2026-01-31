<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=DolphinBot%20V2&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32" width="100%"/>

### Advanced WhatsApp Bot with Intelligent Features

[![Author](https://img.shields.io/badge/Author-CARLOS_OFC-00CED1?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/529516526675)
[![Instagram](https://img.shields.io/badge/@carlos.gxv-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://instagram.com/carlos.gxv)
[![License](https://img.shields.io/github/license/CARLOSGRCIAGRCIA/DolphinBotV2?style=flat-square&color=00CED1)](LICENSE)
[![Stars](https://img.shields.io/github/stars/CARLOSGRCIAGRCIA/DolphinBotV2?style=flat-square&color=00CED1&logo=github)](https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/stargazers)
[![Forks](https://img.shields.io/github/forks/CARLOSGRCIAGRCIA/DolphinBotV2?style=flat-square&color=00CED1&logo=github)](https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/network)

<img src="https://raw.githubusercontent.com/CARLOSGRCIAGRCIA/DolphinBotV2/main/src/img/Dolphin.png" width="280" alt="DolphinBot">

```
┌─────────────────────────────────────────────────────────────┐
│  Independent development - Not affiliated with WhatsApp LLC │
└─────────────────────────────────────────────────────────────┘
```

[Features](#features) • [Installation](#installation) • [List System](#list-system-v20) • [Troubleshooting](#troubleshooting) • [Support](#official-links)

</div>

<br>

## Recent Updates

<table>
<tr>
<td width="50%">

### Version 2.3.0 - List System v2.0

**New Features**
- Automatic cache expiration (8 hours)
- Unique identifiers for each list
- Color support for multi-squad events
- Multiple simultaneous lists
- Automatic cleanup every 30 minutes

</td>
<td width="50%">

### Critical Fixes

**Resolved Issues**
- ETIMEDOUT error fixed
- Menu command stabilized
- Registration system working
- Handler optimized
- Improved error management

</td>
</tr>
</table>

<details>
<summary><b>View Full Changelog</b></summary>

<br>

**Technical Improvements**
- Optimized cache with automatic cleanup
- More efficient database management
- Configurable timeouts for all requests
- Automatic fallbacks for external media
- Cleaner and more useful logs

**New Tools**
- Improved QR/Code selection
- Automatic management scripts
- Integrated diagnostics
- Intelligent reconnection with exponential backoff

</details>

<br>

## Features

### Core Functionality

<table>
<tr>
<td width="50%">

**Communication**
- Voice and text interaction
- Intelligent chatbot (SimSimi)
- Custom auto-responder
- AI-powered conversations

**Group Management**
- Advanced configuration
- Anti-delete protection
- Anti-link protection
- Anti-spam protection
- Anti-view-once

</td>
<td width="50%">

**Multimedia**
- Create stickers from media
- Image/video/gif support
- URL to sticker conversion
- Personalized welcome images

**Bot Network**
- SubBot (Jadibot)
- Unlimited QR codes
- Multiple instances

</td>
</tr>
</table>

### Entertainment & Utilities

<table>
<tr>
<td width="33%">

**Games**
- Tic-tac-toe
- Math challenges
- Trivia questions
- Complete RPG system
- Interactive menus

</td>
<td width="33%">

**Downloads**
- YouTube music/video
- TikTok content
- Instagram media
- Facebook videos
- Format converter

</td>
<td width="33%">

**Advanced Systems**
- Dynamic lists
- Reaction-based
- Auto-expiration
- Color support
- Multi-list support

</td>
</tr>
</table>

<br>

## Installation

<div align="center">

### Choose Your Platform

[![Termux](https://img.shields.io/badge/Termux-Recommended-00CED1?style=for-the-badge&logo=android)](https://www.mediafire.com/file/3hsvi3xkpq3a64o/termux_118.a)
[![Docker](https://img.shields.io/badge/Docker-Servers-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#docker-recommended-for-servers)
[![Cloud](https://img.shields.io/badge/Cloud_Shell-Quick_Start-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](#cloud-shell)

</div>

### Termux (Recommended)

<details open>
<summary><b>Click to view installation steps</b></summary>

<br>

**Step 1: Install Dependencies**

```bash
termux-setup-storage
```

```bash
apt update && apt upgrade && pkg install -y git nodejs ffmpeg imagemagick yarn
```

**Step 2: Clone Repository**

```bash
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2
cd DolphinBotV2
npm install
```

**Step 3: Start Bot**

<table>
<tr>
<td width="33%">

**QR Code**
```bash
npm run qr
```
or
```bash
bash start-bot.sh qr
```

</td>
<td width="33%">

**8-Digit Code**
```bash
npm run code
```
or
```bash
bash start-bot.sh code
```

</td>
<td width="33%">

**Normal Start**
```bash
npm start
```
(for existing session)

</td>
</tr>
</table>

**Step 4: Verify Installation**

```bash
bash diagnostico.sh
```

</details>

### Docker (Recommended for Servers)

<details>
<summary><b>Click to view Docker installation</b></summary>

<br>

**Requirements**
- Docker Engine 20.10+
- Docker Compose 2.0+

**Quick Start**

```bash
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2
cd DolphinBotV2
docker compose build
```

**First Time Setup**

```bash
# Get QR Code
docker compose --profile qr up

# Or with pairing code
docker compose --profile code up
```

**Run 24/7**

```bash
docker compose --profile default up -d
```

**Management Commands**

| Command | Description |
|---------|-------------|
| `docker compose logs -f` | View logs in real-time |
| `docker compose down` | Stop bot |
| `docker compose restart` | Restart bot |
| `docker compose --profile default up -d` | Start in background |

**Advantages**

```
┌─────────────────────────────────────────┐
│  Easy installation                      │
│  System isolation                       │
│  Auto-restart on failure                │
│  Portable between servers               │
│  Simple updates                         │
└─────────────────────────────────────────┘
```

</details>

### Cloud Shell

<details>
<summary><b>Click to view Cloud Shell installation</b></summary>

<br>

```bash
apt update && apt upgrade
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2 && cd DolphinBotV2
yarn install && npm install
```

**Start Bot**

```bash
# With QR code
npm run qr

# Or with 8-digit code
npm run code
```

</details>

<br>

## List System v2.0

### Overview

```
┌──────────────────────────────────────────────────────────────┐
│             DYNAMIC LIST SYSTEM WITH REACTIONS               │
├──────────────────────────────────────────────────────────────┤
│  • Automatic 8-hour expiration                               │
│  • Unique ID for each list                                   │
│  • Color support for team differentiation                    │
│  • Multiple simultaneous lists                               │
│  • Reaction-based join/leave                                 │
└──────────────────────────────────────────────────────────────┘
```

### Lists with Color Support

<table>
<tr>
<td width="33%">

**Trilatero**
```bash
.trilatero 9pm black
```
- 4 squads
- 4 players each
- Color display

</td>
<td width="33%">

**Cuadrilatero**
```bash
.cuadrilatero 8pm red
```
- 3 squads
- 4 players each
- Color display

</td>
<td width="33%">

**Hexagonal**
```bash
.hexagonal 7pm blue
```
- 2 squads
- 4 players each
- Color display

</td>
</tr>
</table>

### Standard Lists

| Command | Format | Description |
|---------|--------|-------------|
| `.ascenso 9pm` | 1 squad, 4 players | Standard ascenso list |
| `.vv2 21:00` | 1 squad, 6 players | VV2 match list |
| `.scrim 8pm` | 1 squad, 4 players | Scrim practice list |
| `.clk 19:00` | 1 squad, 4 players | CLK event list |

### Supported Time Formats

<div align="center">

| 12-Hour Format | 24-Hour Format |
|:--------------:|:--------------:|
| `9pm` | `21:00` |
| `9:00 pm` | `14:30` |
| `09:00 pm` | `19:45` |

</div>

### Usage Example

```bash
# Create list with color
.trilatero 9pm black

# Users react with any emoji to join
# Bot updates list automatically after 3 seconds
# List expires after 8 hours
```

<br>

## Management Commands

### Termux Commands

<table>
<tr>
<td width="50%">

**Starting the Bot**

```bash
# Navigate to directory
cd DolphinBotV2

# Start with QR
bash start-bot.sh qr

# Start with code
bash start-bot.sh code

# Normal start
npm start
```

</td>
<td width="50%">

**Managing the Bot**

```bash
# Stop bot
bash stop-bot.sh

# Restart bot
pm2 restart dolphin-bot

# View logs
pm2 logs dolphin-bot

# Monitor resources
pm2 monit
```

</td>
</tr>
</table>

### 24/7 Activation with PM2

```bash
termux-wake-lock
bash start-bot.sh qr
# After scanning QR, bot runs 24/7 automatically
```

### Get New QR Code

```bash
pm2 stop dolphin-bot 2>/dev/null
pm2 delete dolphin-bot 2>/dev/null
rm -rf DolphinBotSession
bash start-bot.sh qr
```

### Update DolphinBot

```bash
grep -q 'bash\|wget' <(dpkg -l) || apt install -y bash wget && wget -O - https://raw.githubusercontent.com/CARLOSGRCIAGRCIA/DolphinBotV2/main/termux.sh | bash
```

<br>

## Troubleshooting

<div align="center">

### Common Issues & Solutions

</div>

<details>
<summary><b>ETIMEDOUT Error</b></summary>

<br>

**Symptom:** Bot shows constant timeout errors when loading images

**Solution:**
```bash
bash instalar-fixes.sh
```

</details>

<details>
<summary><b>Commands Not Responding</b></summary>

<br>

**Symptom:** Bot is connected but commands don't work

**Solution:**
```bash
bash diagnostico.sh
bash instalar-fixes.sh
pm2 restart dolphin-bot
```

</details>

<details>
<summary><b>Bot Not Reading Messages After QR</b></summary>

<br>

**Symptom:** QR scanned but bot doesn't respond to commands

**Solution:**
```bash
pm2 stop dolphin-bot 2>/dev/null
pm2 delete dolphin-bot 2>/dev/null
rm -f .arranque-ok
bash start-bot.sh qr
```

</details>

<details>
<summary><b>Constant Disconnections</b></summary>

<br>

**Symptom:** Bot disconnects frequently

**Solution:**
```bash
ls -la DolphinBotSession/creds.json
# If file is very small (<1KB):
rm -rf DolphinBotSession
bash start-bot.sh qr
```

</details>

### Complete Diagnostic

```bash
bash diagnostico.sh
```

<div align="center">

**This script automatically checks:**

| Check | Description |
|-------|-------------|
| Node.js | Version verification |
| Dependencies | Installation status |
| Session | WhatsApp connection |
| Database | Data integrity |
| Plugins | Problem detection |
| Resources | Memory and CPU usage |

</div>

<br>

## Available Scripts

<div align="center">

| Script | Command | Description |
|:-------|:--------|:------------|
| Start (QR) | `npm run qr` or `bash start-bot.sh qr` | Start bot with QR code |
| Start (Code) | `npm run code` or `bash start-bot.sh code` | Start bot with 8-digit code |
| Normal Start | `npm start` | Start with existing session |
| Stop | `bash stop-bot.sh` | Stop bot safely |
| Diagnostic | `bash diagnostico.sh` | Complete system check |
| Auto Fix | `bash instalar-fixes.sh` | Install corrections |
| Disable Plugin | `bash fix-plugin.sh` | Disable problematic plugins |

</div>

<br>

## Official Links

<div align="center">

<table>
<tr>
<td align="center" width="25%">
<img src="https://img.icons8.com/fluency/96/instagram-new.png" width="64"/><br>
<b>Instagram</b><br>
<sub>News & Updates</sub><br>
<a href="https://www.instagram.com/carlos.gxv/">@carlos.gxv</a>
</td>
<td align="center" width="25%">
<img src="https://img.icons8.com/fluency/96/whatsapp.png" width="64"/><br>
<b>Support Group</b><br>
<sub>Community Help</sub><br>
<a href="https://chat.whatsapp.com/EdND7QAHE9w0XPYGx2ZfQw">Join Group</a>
</td>
<td align="center" width="25%">
<img src="https://img.icons8.com/fluency/96/whatsapp.png" width="64"/><br>
<b>Direct Contact</b><br>
<sub>Creator Support</sub><br>
<a href="https://wa.me/529516526675">Message</a>
</td>
<td align="center" width="25%">
<img src="https://img.icons8.com/fluency/96/telegram-app.png" width="64"/><br>
<b>WhatsApp Channel</b><br>
<sub>Official Updates</sub><br>
<a href="https://whatsapp.com/channel/0029VbAfBzIKGGGKJWp5tT3L">Follow</a>
</td>
</tr>
</table>

</div>

<br>

## Project Creator

<div align="center">

<a href="https://github.com/CARLOSGRCIAGRCIA">
  <img src="https://github.com/CARLOSGRCIAGRCIA.png" width="180" style="border-radius: 50%; border: 3px solid #00CED1;" alt="Carlos G"/>
</a>

### Carlos G

<sub>Full Stack Developer | Bot Creator</sub>

<br>

[![Instagram](https://img.shields.io/badge/Instagram-%40carlos.gxv-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/carlos.gxv)
[![TikTok](https://img.shields.io/badge/TikTok-%40carlos.grcia0-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://www.tiktok.com/@carlos.grcia0)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/529516526675)

</div>

<br>

## Project Statistics

<div align="center">

<!-- <img src="https://github-readme-stats.vercel.app/api?username=CARLOSGRCIAGRCIA&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0D1117&title_color=00CED1&icon_color=00CED1&text_color=fff" width="48%" /> -->

<img src="https://github-readme-streak-stats.herokuapp.com/?user=CARLOSGRCIAGRCIA&theme=tokyonight&hide_border=true&background=0D1117&stroke=00CED1&ring=00CED1&fire=00CED1&currStreakLabel=00CED1" width="48%" />

<br><br>

![Stars](https://img.shields.io/github/stars/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![Forks](https://img.shields.io/github/forks/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![Issues](https://img.shields.io/github/issues/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![License](https://img.shields.io/github/license/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&color=00CED1)

</div>

<br>

## Support the Project

<div align="center">

If you find this project useful, please consider:

**Starring the repository**  
**Sharing with others**  
**Reporting bugs**  
**Suggesting features**  
**Contributing code**

<br>

```
┌──────────────────────────────────────────┐
│  Made with care by DolphinBot Team      │
│  Powered by Node.js & Baileys            │
└──────────────────────────────────────────┘
```

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

</div>