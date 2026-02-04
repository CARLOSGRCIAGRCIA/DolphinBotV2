# DolphinBot V2

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=DolphinBot%20V2&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32" width="100%"/>

## Advanced WhatsApp Bot with Intelligent Features

[![Author](https://img.shields.io/badge/Author-CARLOS_OFC-00CED1?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/529516526675)
[![Instagram](https://img.shields.io/badge/@carlos.gxv-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://instagram.com/carlos.gxv)
[![License](https://img.shields.io/github/license/CARLOSGRCIAGRCIA/DolphinBotV2?style=flat-square&color=00CED1)](LICENSE)
[![Stars](https://img.shields.io/github/stars/CARLOSGRCIAGRCIA/DolphinBotV2?style=flat-square&color=00CED1&logo=github)](https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/stargazers)
[![Forks](https://img.shields.io/badge/Downloads-1k+-00CED1?style=flat-square&logo=github)](https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/network)

<img src="https://raw.githubusercontent.com/CARLOSGRCIAGRCIA/DolphinBotV2/main/src/img/Dolphin.png" width="280" alt="DolphinBot">

```
===============================================================
  Independent development - Not affiliated with WhatsApp LLC
===============================================================
```

[Latest Updates](#latest-updates-february-2026) • [Features](#features) • [Installation](#installation) • [Download System](#download-system) • [Rules System](#rules-system) • [Performance](#performance-optimizations) • [Troubleshooting](#troubleshooting)

</div>

## Latest Updates - February 2026

### **YouTube Downloads Fixed!**

**New Commands:**
```
.ytmp3 [song]    # Download MP3 audio
.ytmp4 [video]   # Download video
.ytmp4doc [vid]  # Video as document
.play [song]     # Alternative for audio
```

**Cross-Platform Compatibility:**
- **Termux (Android)** - Auto-install with `.installtermux`
- **Manjaro/Linux** - Auto-install with `.installtools`
- **No external APIs required** - Everything works locally
- **Automatic dependency installation**

### **New Rules System**

**Community Rules Display:**
```
.reglas vv2    # Show VV2 community rules
.reglas clk    # Show CLK community rules
```

**Features:**
- Image-based rules for better visualization
- Instant response with community-specific images
- Automatic display without configuration needed
- Centralized management for easy updates

### **Technical Improvements**

**Core System Enhancements (start.js):**
- **Global connection verification** - `global.isConnectionOpen()` function
- **Enhanced bio update system** - Error 428 handling completely fixed
- **Connection state management** - Improved reconnection logic
- **Optimized intervals** - Reduced from 1-minute to 5-minute updates
- **Automatic cleanup** - All intervals verify connection state before execution

**Download System Rewrite:**
- Multi-method fallback system (youtube-dl -> yt-dlp -> portable version)
- Automatic dependency detection and installation
- Platform-specific optimizations for Termux and Manjaro
- Intelligent file cleanup and temporary file management
- Enhanced error messages with specific solutions for each platform

**RPG System Fixes:**
- Character invocation bugs resolved
- Lists display optimized for better readability
- Ranking system calculations improved
- Zombie mode gameplay stabilized

**New Plugins Added:**
- `_rulesclk.js` - Community rules display system
- New rule images added to `src/img/` directory
- Complete documentation updated for all new features

## Features

### Download System (NEW)

**Audio Downloads:**
```
.ytmp3 bad bunny
.play shakira
```
- MP3 format with 128kbps+ quality
- Automatic search by name or URL
- Cross-platform compatibility (Termux & Manjaro)
- Smart size limits (up to 200MB)

**Video Downloads:**
```
.ytmp4 tutorial android
.ytmp4doc movie scene
```
- Two formats available: normal video & document
- Quality auto-selected: 360p/480p/720p based on size
- WhatsApp-optimized file sizes
- Ready for both Termux and Manjaro systems

### Community Rules System (NEW)

```
.reglas vv2    # Visual rules for VV2 community
.reglas clk    # Visual rules for CLK community
```

**Benefits:**
- Image-based rules for easy reading and sharing
- Fast access with single command
- Always updated through centralized management
- Community-specific content tailored to each group

### Performance Optimizations

**Connection Management:**
- State verification before any operation execution
- Error 428 handling completely resolved
- Optimized update intervals reduced server load
- Smart reconnection with automatic session recovery

**Resource Management:**
- Automatic cleanup of temporary download files
- Connection-aware interval management
- Reduced server load with efficient bio updates
- Memory optimization for better session handling

### Entertainment & Utilities

**Games & RPG System:**
- Complete character creation and management
- Interactive battle system
- Real-time rankings and leaderboards
- Zombie survival mode with progression

**Media Tools:**
- Sticker creator from images/videos
- Format conversion tools
- Anime image search with multiple sources
- URL to media conversion

**Group Management:**
- Anti-spam protection with configurable thresholds
- Custom welcome messages with media support
- Auto-moderation tools
- Link protection and filtering

### Dynamic List System v2.0

**Color-Supported Lists:**
```
.trilatero 9pm blue    # 4 teams with colored display
.cuadrilatero 8pm red  # 3 teams automatic management
.hexagonal 7pm green   # 2 teams color-coded
```

**Standard Lists:**
```
.ascenso 9pm          # Standard ascenso format
.vv2 21:00            # VV2 match format
.scrim 8pm            # Practice scrim format
.clk 19:00            # CLK event format
```

**Features:**
- Color support for team differentiation
- 8-hour automatic expiration
- Reaction-based participation system
- Unique identifiers for each list
- Multiple simultaneous lists supported

## Installation

### Termux (Android) - Recommended

**Step 1: Install Dependencies**
```bash
termux-setup-storage
apt update && apt upgrade && pkg install -y git nodejs ffmpeg imagemagick yarn
```

**Step 2: Clone Repository**
```bash
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2
cd DolphinBotV2
npm install
```

**Step 3: Start Bot**

| Method | Command |
|--------|---------|
| QR Code | `npm run qr` or `bash start-bot.sh qr` |
| 8-Digit Code | `npm run code` or `bash start-bot.sh code` |
| Normal Start | `npm start` (existing session) |

**Step 4: Install Download Dependencies**
```bash
# Automatic installation
.installtermux

# Or manual installation
pkg install youtube-dl python ffmpeg
pip install yt-dlp
```

### Manjaro/Linux Installation

**Step 1: System Preparation**
```bash
sudo pacman -Syu
sudo pacman -S git nodejs npm ffmpeg imagemagick yarn
```

**Step 2: Clone and Setup**
```bash
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2
cd DolphinBotV2
npm install
```

**Step 3: Install Download System**
```bash
# Automatic installation
.installtools

# Or manual installation
sudo pacman -S youtube-dl ffmpeg
# Or with yt-dlp
pip install yt-dlp
```

### Docker Installation (Servers)

**Requirements:**
- Docker Engine 20.10+
- Docker Compose 2.0+

**Quick Start:**
```bash
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2
cd DolphinBotV2
docker compose build
```

**First Time Setup:**
```bash
# Get QR Code
docker compose --profile qr up

# Or with pairing code
docker compose --profile code up
```

**Run 24/7:**
```bash
docker compose --profile default up -d
```

**Management Commands:**
| Command | Description |
|---------|-------------|
| `docker compose logs -f` | View real-time logs |
| `docker compose down` | Stop bot |
| `docker compose restart` | Restart bot |
| `docker compose --profile default up -d` | Start in background |

### Cloud Shell Quick Installation

```bash
apt update && apt upgrade
git clone https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2 && cd DolphinBotV2
yarn install && npm install
```

**Start Options:**
```bash
# With QR code
npm run qr

# With 8-digit code
npm run code
```

## Download System

### How It Works

The download system uses a multi-layer approach:

```
[User Command] -> [Search YouTube] -> [Download Method] -> [Send to User]
      |                |                   |
  .ytmp3 song      Find video ID    Try youtube-dl first
  .ytmp4 video     Get metadata     Try yt-dlp second
  .ytmp4doc url    Validate         Download yt-dlp if needed
```

### Platform-Specific Configuration

**Termux (Android):**
- Uses `/data/data/com.termux/files/usr/tmp` for temporary files
- Lower memory limits for mobile devices
- Optimized for ARM architecture
- Automatic storage permission handling

**Manjaro/Linux:**
- Uses `./temp_downloads` directory
- Higher file size limits
- Better multi-threading support
- System package manager integration

### Commands Reference

| Command | Description | Max Size | Output Format |
|---------|-------------|----------|---------------|
| `.ytmp3 <search>` | Download audio | 200MB | MP3 audio |
| `.play <search>` | Alternative audio | 200MB | MP3 audio |
| `.ytmp4 <search>` | Download video | 50MB | MP4 video |
| `.ytmp4doc <search>` | Video as document | 100MB | MP4 document |

### Supported Search Formats

```
1. By song/video name: .ytmp3 "bad bunny"
2. By YouTube URL: .ytmp4 https://youtu.be/VIDEO_ID
3. By search terms: .ytmp4doc tutorial de programacion
4. Direct video ID: .ytmp3 dQw4w9WgXcQ
```

### Automatic Dependency Installation

The system includes self-healing capabilities:

1. **Detection**: Checks for required tools (youtube-dl, yt-dlp, ffmpeg)
2. **Installation**: Automatically installs missing dependencies
3. **Fallback**: Downloads portable versions if system installation fails
4. **Verification**: Confirms all components are working correctly

## Rules System

### Implementation Details

The rules system provides community-specific guidelines through visual images:

**File Structure:**
```
src/img/
├── clkrules.png    # CLK community rules
└── vv2rules.png    # VV2 community rules
```

**Plugin Features:**
- Automatic image loading and validation
- Command aliases support (`rules`, `reglas`, `normas`)
- Error handling for missing images
- Quick response time (< 1 second)
- No external dependencies required

### Usage Examples

**Basic Usage:**
```
User: .reglas vv2
Bot: [Sends vv2rules.png image]
```

**Alternative Commands:**
```
.rules vv2
.normas clk
.reglas clk
```

**Benefits for Community Admins:**
- Centralized rules management
- Easy updates (just replace the image)
- Consistent presentation across groups
- Reduced administrative workload

## Performance Optimizations

### Connection Management

**Global Connection Verification:**
```javascript
// New function in start.js
global.isConnectionOpen = function() {
    return this.connection && 
           this.connection.user && 
           this.connection.state === 'open';
}
```

**Benefits:**
- Prevents operations when connection is closed
- Reduces error 428 occurrences
- Improves bot stability
- Better resource utilization

**Bio Update Optimization:**
- Interval increased from 60s to 300s (5 minutes)
- Connection state verification before updating
- Error 428 specific handling
- Last bio tracking to prevent duplicates

### Interval Management

All system intervals now verify connection state:

**Before:**
```javascript
setInterval(() => {
    // Would run even if connection was closed
    updateBio();
}, 60000);
```

**After:**
```javascript
setInterval(() => {
    if (global.isConnectionOpen()) {
        updateBio();
    }
}, 300000); // 5 minutes
```

**Optimized Intervals:**
1. **Bio Updates**: 300s (connection verified)
2. **File Cleanup**: 1800s (connection verified)
3. **Session Purge**: 3600s (connection verified)
4. **Temporary Cleanup**: 7200s (connection verified)

### Memory Management

**Session Handling:**
- Automatic cleanup of orphaned sessions
- Connection state-based resource allocation
- Reduced memory footprint during disconnections
- Better garbage collection coordination

**File System Management:**
- Automatic temporary file deletion
- Size-based cleanup priorities
- Platform-specific optimization
- Connection-aware cleanup scheduling

## Troubleshooting

### Common Issues and Solutions

**Issue: "Error 428 - Connection Closed"**
```
Solution: Update to latest start.js file
The fix: Connection verification before bio updates
Command: Replace núcleo•dolphin/start.js and restart
```

**Issue: Downloads Not Working**
```
Solution 1 (Termux): .installtermux
Solution 2 (Manjaro): .installtools
Solution 3 (Manual): pkg install youtube-dl ffmpeg
Solution 4 (Portable): Bot will auto-download yt-dlp
```

**Issue: Bot Not Responding After QR**
```
Solution: Complete restart procedure
Commands:
pm2 stop dolphin-bot 2>/dev/null
pm2 delete dolphin-bot 2>/dev/null
rm -rf DolphinBotSession
bash start-bot.sh qr
```

**Issue: Commands Not Recognized**
```
Solution: Run diagnostic script
Command: bash diagnostico.sh
This checks: Node.js, dependencies, session, plugins
```

### Diagnostic Commands

**Complete System Check:**
```bash
bash diagnostico.sh
```

**Automatic Fix Installation:**
```bash
bash instalar-fixes.sh
```

**Plugin-Specific Fixes:**
```bash
bash fix-plugin.sh [plugin_name]
```

**Connection Testing:**
```bash
# Check if bot can connect
npm run test-connection

# View detailed connection logs
pm2 logs dolphin-bot --lines 100
```

### Platform-Specific Troubleshooting

**Termux Issues:**
```
1. Storage permissions: termux-setup-storage
2. Package updates: pkg update && pkg upgrade
3. Missing tools: pkg install python nodejs ffmpeg
4. Bot restart: pm2 restart dolphin-bot
```

**Manjaro Issues:**
```
1. System updates: sudo pacman -Syu
2. Missing packages: sudo pacman -S youtube-dl ffmpeg
3. Permission issues: sudo chmod +x start-bot.sh
4. Service management: systemctl restart pm2
```

## Available Scripts

### Management Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start (QR) | `npm run qr` or `bash start-bot.sh qr` | Start with QR code authentication |
| Start (Code) | `npm run code` or `bash start-bot.sh code` | Start with 8-digit pairing code |
| Normal Start | `npm start` | Start with existing session |
| Stop Bot | `bash stop-bot.sh` | Safe bot shutdown |
| Diagnostic | `bash diagnostico.sh` | Complete system analysis |
| Auto Fix | `bash instalar-fixes.sh` | Automatic problem resolution |
| Plugin Fix | `bash fix-plugin.sh` | Disable problematic plugins |
| Update Bot | `bash update-bot.sh` | Update to latest version |

### Utility Scripts

**24/7 Activation (Termux):**
```bash
termux-wake-lock
bash start-bot.sh qr
# After QR scan, bot runs continuously
```

**Get New QR Code:**
```bash
pm2 stop dolphin-bot 2>/dev/null
pm2 delete dolphin-bot 2>/dev/null
rm -rf DolphinBotSession
bash start-bot.sh qr
```

**Update DolphinBot:**
```bash
grep -q 'bash\|wget' <(dpkg -l) || apt install -y bash wget && wget -O - https://raw.githubusercontent.com/CARLOSGRCIAGRCIA/DolphinBotV2/main/termux.sh | bash
```

**Monitor Resources:**
```bash
# Real-time monitoring
pm2 monit

# Log viewing
pm2 logs dolphin-bot

# Status check
pm2 status
```

## Official Links

### Support and Community

**Developer Contact:**
- **WhatsApp**: [Carlos G](https://wa.me/529516526675)
- **Instagram**: [@carlos.gxv](https://instagram.com/carlos.gxv)
- **TikTok**: [@carlos.grcia0](https://www.tiktok.com/@carlos.grcia0)

**Community Groups:**
- **Support Group**: [Join WhatsApp Group](https://chat.whatsapp.com/EdND7QAHE9w0XPYGx2ZfQw)
- **Updates Channel**: [Follow WhatsApp Channel](https://whatsapp.com/channel/0029VbAfBzIKGGGKJWp5tT3L)

### Project Information

**Repository:**
- **GitHub**: [CARLOSGRCIAGRCIA/DolphinBotV2](https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2)
- **License**: MIT License
- **Maintainer**: Carlos G

**Statistics:**
```
- Stars: Growing community
- Forks: Active development
- Downloads: 1000+ users
- Last Update: February 2026
```

## Support the Project

If you find DolphinBot V2 useful, consider:

1. **Star the repository** on GitHub
2. **Share with friends** and communities
3. **Report bugs** through issues
4. **Suggest features** for future updates
5. **Contribute code** to improve the project

## Project Creator

<div align="center">

<a href="https://github.com/CARLOSGRCIAGRCIA">
  <img src="https://github.com/CARLOSGRCIAGRCIA.png" width="180" style="border-radius: 50%; border: 3px solid #00CED1;" alt="Carlos G"/>
</a>

### Carlos G

Full Stack Developer | Bot Creator

[![Instagram](https://img.shields.io/badge/Instagram-%40carlos.gxv-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/carlos.gxv)
[![TikTok](https://img.shields.io/badge/TikTok-%40carlos.grcia0-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://www.tiktok.com/@carlos.grcia0)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/529516526675)

</div>

## Project Statistics

<div align="center">

<!-- GitHub Stats Placeholder -->

![Stars](https://img.shields.io/github/stars/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![Forks](https://img.shields.io/github/forks/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![Issues](https://img.shields.io/github/issues/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&logo=github&color=00CED1&logoColor=white)
![License](https://img.shields.io/github/license/CARLOSGRCIAGRCIA/DolphinBotV2?style=for-the-badge&color=00CED1)

</div>

## Final Notes

```
===============================================================
  Made with care by DolphinBot Team
  Powered by Node.js & Baileys
  February 2026 Update - Download System Fixed
===============================================================
```

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>
</div>