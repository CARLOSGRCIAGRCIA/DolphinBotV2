/**
 * Simplified YouTube Download Handler for Dolphin-Bot
 * @file Downloads YouTube videos/audio with simplified architecture
 * @author Carlos G <https://github.com/CARLOSGRCIAGRCIA>
 * @version 3.0.0
 * @license MIT
 * 
 * @module youtubeDownloadSimpleHandler
 * 
 * @requires yts - YouTube Search library
 * @requires node-fetch - HTTP client for downloading yt-dlp binary
 * @requires fs - File system module
 * @requires path - Path handling module
 * @requires child_process - For spawning external download processes
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2|GitHub Repository}
 * @see {@link https://www.instagram.com/carlos.gxv|Developer's Instagram}
 */

import yts from "yt-search";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 * Module name for identification
 * @constant {string} name
 */
const name = 'Downloads - DolphinBot';

/**
 * Extracts YouTube video ID from various URL formats
 * @function extractVideoId
 * @param {string} url - YouTube URL or video ID
 * @returns {string|null} - Extracted video ID or null if invalid
 * 
 * @example
 * // Returns 'dQw4w9WgXcQ'
 * extractVideoId('https://youtu.be/dQw4w9WgXcQ')
 * 
 * @example  
 * // Returns 'dQw4w9WgXcQ'
 * extractVideoId('dQw4w9WgXcQ')
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Executes a shell command with timeout support
 * @function runCommand
 * @param {string} cmd - Command to execute
 * @param {string[]} args - Command arguments
 * @param {number} [timeout=60000] - Timeout in milliseconds (default 60s)
 * @returns {Promise<string>} - Command stdout output
 * @throws {Error} - If command fails or times out
 */
function runCommand(cmd, args, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args);
    let stdout = '';
    let stderr = '';
    
    const timer = setTimeout(() => {
      process.kill();
      reject(new Error('Timeout'));
    }, timeout);
    
    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    process.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Exit code: ${code}`));
      }
    });
    
    process.on('error', reject);
  });
}

/**
 * Simplified YouTube download function with fallback mechanisms
 * @async
 * @function downloadSimple
 * @param {string} videoId - YouTube video ID
 * @param {string} [type='audio'] - Download type ('audio' or 'video')
 * @returns {Promise<Object>} - Download result object
 * @property {boolean} success - Whether download succeeded
 * @property {string} [filePath] - Path to downloaded file
 * @property {string} [title] - Video title placeholder
 * @property {string} [error] - Error message if failed
 */
async function downloadSimple(videoId, type = 'audio') {
  try {
    const tempDir = './temp_downloads';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`;
    
    /**
     * Attempt 1: Using youtube-dl (pre-installed)
     */
    try {
      const cmd = type === 'audio' 
        ? ['youtube-dl', '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : ['youtube-dl', '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`];
      
      await runCommand(cmd[0], cmd.slice(1), 120000);
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' };
      }
    } catch (error) {
      console.log('Attempt 1 (youtube-dl) failed, trying next method...');
    }
    
    /**
     * Attempt 2: Using yt-dlp (if installed)
     */
    try {
      const cmd = type === 'audio'
        ? ['yt-dlp', '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : ['yt-dlp', '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`];
      
      await runCommand(cmd[0], cmd.slice(1), 120000);
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' };
      }
    } catch (error) {
      console.log('Attempt 2 (yt-dlp) failed, trying binary download...');
    }
    
    /**
     * Attempt 3: Download yt-dlp binary and use it
     */
    try {
      const ytDlpPath = './yt-dlp-bin';
      if (!fs.existsSync(ytDlpPath)) {
        console.log('Downloading yt-dlp binary...');
        const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp');
        const buffer = await resp.arrayBuffer();
        fs.writeFileSync(ytDlpPath, Buffer.from(buffer));
        fs.chmodSync(ytDlpPath, 0o755);
      }
      
      const cmd = type === 'audio'
        ? [ytDlpPath, '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : [ytDlpPath, '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`];
      
      await runCommand(cmd[0], cmd.slice(1), 180000);
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' };
      }
    } catch (error) {
      console.error('Error with yt-dlp binary:', error);
    }
    
    return { success: false, error: 'Could not download' };
    
  } catch (error) {
    console.error('Error in downloadSimple:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main simplified YouTube download handler
 * @async
 * @function handler
 * @param {Object} m - Received message object
 * @param {string} m.chat - Chat ID
 * @param {Object} conn - WhatsApp connection object
 * @param {string} text - Search query or YouTube URL
 * @param {string} command - Executed command name
 * 
 * @example
 * // Download audio from search:
 * // .ytmp3 "bad bunny songs"
 * 
 * @example
 * // Download video as document:
 * // .ytmp4doc https://youtu.be/dQw4w9WgXcQ
 * 
 * @returns {Promise<void>} - Sends downloaded file to chat
 * 
 * @throws {Error} - If no input provided
 * @throws {Error} - If video not found
 * @throws {Error} - If download fails
 */
const handler = async (m, { conn, text, command }) => {
  await m.react("⌛");
  
  // Show help if no input
  if (!text?.trim()) {
    await m.react("❌");
    return m.reply(`🎵 *SIMPLIFIED DOWNLOADS - DOLPHIN BOT*

📝 *Commands:*
.ytmp3 <search/url> - Audio MP3
.ytmp4doc <search/url> - Video MP4

💡 *Examples:*
.ytmp3 "song name"
.ytmp4doc "short video"

⚠️ *First time:* yt-dlp will be downloaded automatically

👨‍💻 *Developer:* Carlos G
📂 GitHub: CARLOSGRCIAGRCIA
📸 Instagram: @Carlos_gxv`);
  }

  let tempFile = null;
  
  try {
    let videoId, videoTitle;
    
    // Handle URL or search query
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      videoId = extractVideoId(text);
      if (!videoId) {
        await m.react("❌");
        return m.reply("❌ Invalid URL");
      }
      
      const search = await yts({ videoId });
      videoTitle = search.title || "YouTube Video";
    } else {
      await m.react("🔍");
      const search = await yts.search({ query: text, pages: 1 });
      
      if (!search.videos.length) {
        await m.react("❌");
        return m.reply("❌ No results found");
      }
      
      videoId = search.videos[0].videoId;
      videoTitle = search.videos[0].title;
    }
    
    console.log(`Searching: ${videoTitle.substring(0, 60)}`);
    
    const type = command === 'ytmp3' ? 'audio' : 'video';
    await m.react("📥");
    
    // Send progress message
    const progressMsg = await m.reply(`Dolphin Bot is downloading: ${videoTitle.substring(0, 50)}...`);
    
    // Download the file
    const result = await downloadSimple(videoId, type);
    
    if (!result.success) {
      await m.react("❌");
      return m.reply(`❌ Error: ${result.error}

🔧 *SOLUTION:*
1. Install youtube-dl (easier):
   \`sudo pacman -S youtube-dl\`

2. Or create virtual environment:
   \`\`\`bash
   cd ~/Documents/bot/DolphinBotV2
   python -m venv venv
   source venv/bin/activate
   pip install yt-dlp
   \`\`\`

👨‍💻 Need help? Contact:
📸 Instagram: @Carlos_gxv
📂 GitHub: CARLOSGRCIAGRCIA`);
    }
    
    tempFile = result.filePath;
    
    // Sanitize filename for safety
    const sanitizeFilename = (name, maxLength = 70) => {
      return name
        .substring(0, maxLength)
        .replace(/[^\w\s.-]/g, '_');
    };
    
    // Send file based on type
    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: "audio/mpeg",
        fileName: `${sanitizeFilename(videoTitle)}.mp3`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        fileName: `${sanitizeFilename(videoTitle)}.mp4`,
        caption: `🎬 ${videoTitle}\n\n👨‍💻 Dolphin Bot by Carlos G`
      }, { quoted: m });
    }
    
    // Delete progress message
    try {
      await conn.sendMessage(m.chat, { delete: progressMsg.key });
    } catch {}
    
    await m.react("✅");
    
    // Cleanup temp file after delay
    setTimeout(() => {
      if (tempFile && fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch {}
      }
    }, 30000);
    
  } catch (error) {
    await m.react("❌");
    console.error("ERROR:", error);
    
    // Cleanup on error
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    
    return m.reply(`Error: ${error.message}

🛠️ *Install YOUTUBE-DL (easier method):*
\`sudo pacman -S youtube-dl ffmpeg\`

Then try again.

📞 *Support:*
👨‍💻 Carlos G
📸 Instagram: @Carlos_gxv
📂 GitHub: CARLOSGRCIAGRCIA`);
  }
};

/**
 * Command aliases
 * @type {string[]}
 */
handler.command = ["ytmp4doc", "ytmp3"];

/**
 * Help descriptions for each command
 * @type {string[]}
 */
handler.help = ["ytmp4doc <search/url>", "ytmp3 <search/url>"];

/**
 * Command categories
 * @type {string[]}
 */
handler.tags = ["downloads", "youtube", "media"];

/**
 * Can be used in groups
 * @type {boolean}
 */
handler.group = true;

/**
 * Cooldown limit (uses per user)
 * @type {number}
 */
handler.limit = 4;

/**
 * Premium feature flag
 * @type {boolean}
 */
handler.premium = false;

/**
 * Minimum user level required
 * @type {number}
 */
handler.level = 0;

/**
 * Command description for help menu
 * @type {string}
 */
handler.description = 'Download YouTube videos/audio with simplified architecture';

/**
 * Usage examples for help menu
 * @type {string}
 */
handler.usage = `.ytmp3 <song> | .ytmp4doc <video>`;

/**
 * Command cooldown in seconds
 * @type {number}
 */
handler.cooldown = 25;

/**
 * Available in private chats
 * @type {boolean}
 */
handler.private = false;

/**
 * Sanitizes filenames for safe file operations
 * @function sanitizeFilename
 * @param {string} name - Original filename
 * @param {number} [maxLength=70] - Maximum length of filename
 * @returns {string} - Sanitized filename
 */
handler.sanitizeFilename = (name, maxLength = 70) => {
  return name
    .substring(0, maxLength)
    .replace(/[^\w\s.-]/g, '_');
};

/**
 * Exports handler as default module
 * @exports handler
 */
export default handler;