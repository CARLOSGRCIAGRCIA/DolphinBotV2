/**
 * YouTube Download Handler for Dolphin-Bot with Termux/Desktop Support
 * @file Downloads YouTube videos/audio with platform-specific optimizations
 * @author Carlos G <https://github.com/CARLOSGRCIAGRCIA>
 * @version 3.1.0
 * @license MIT
 * 
 * @module youtubeDownloadHandler
 * 
 * @requires yts - YouTube Search library
 * @requires node-fetch - HTTP client for downloading yt-dlp
 * @requires fs - File system module
 * @requires path - Path handling module
 * @requires child_process - For spawning external processes
 * @requires os - For system information
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2|GitHub Repository}
 * @see {@link https://www.instagram.com/carlos.gxv|Developer's Instagram}
 */

import yts from "yt-search";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import os from "os";

/**
 * Module name for identification
 * @constant {string} name
 */
const name = 'Downloads - DolphinBot';

/**
 * Detects if running in Termux Android environment
 * @constant {boolean} isTermux
 */
const isTermux = process.env.PREFIX && process.env.PREFIX.includes('com.termux');

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
 * extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
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
 * @param {number} [timeout=90000] - Timeout in milliseconds (default 90s)
 * @returns {Promise<string>} - Command stdout output
 * @throws {Error} - If command fails or times out
 */
function runCommand(cmd, args, timeout = 90000) {
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
 * Downloads YouTube video/audio specifically for Termux environment
 * @async
 * @function downloadForTermux
 * @param {string} videoId - YouTube video ID
 * @param {string} [type='audio'] - Download type ('audio' or 'video')
 * @returns {Promise<Object>} - Download result object
 * @property {boolean} success - Whether download succeeded
 * @property {string} [filePath] - Path to downloaded file
 * @property {string} [size] - File size in MB
 * @property {string} [source] - Tool used for download
 * @property {string} [error] - Error message if failed
 */
async function downloadForTermux(videoId, type = 'audio') {
  try {
    const tempDir = isTermux 
      ? '/data/data/com.termux/files/usr/tmp/dolphinbot'
      : './temp_downloads';
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`;
    
    console.log(`📁 Temp dir: ${tempDir}`);
    console.log(`📄 Output: ${outputFile}`);
    
    /**
     * Download methods to try in order
     * @type {Array<Object>}
     */
    const methods = [
      {
        name: 'youtube-dl',
        cmd: 'youtube-dl',
        args: type === 'audio' 
          ? ['-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
          : ['-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
      },
      {
        name: 'yt-dlp',
        cmd: 'yt-dlp',
        args: type === 'audio'
          ? ['-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', outputFile, `https://youtu.be/${videoId}`]
          : ['-f', 'best[height<=480]', '-o', outputFile, `https://youtu.be/${videoId}`]
      },
      {
        name: 'python-ytdlp',
        cmd: 'python',
        args: type === 'audio'
          ? ['-m', 'yt_dlp', '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
          : ['-m', 'yt_dlp', '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
      }
    ];
    
    // Try each download method
    for (const method of methods) {
      try {
        console.log(`🔄 Termux: Trying with ${method.name}...`);
        
        await runCommand(method.cmd, method.args, 180000);
        
        if (fs.existsSync(outputFile)) {
          const stats = fs.statSync(outputFile);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
          console.log(`✅ ${method.name} worked: ${sizeMB} MB`);
          
          return {
            success: true,
            filePath: outputFile,
            size: sizeMB,
            source: method.name
          };
        }
      } catch (error) {
        console.log(`❌ ${method.name} failed:`, error.message);
        continue;
      }
    }
    
    // If all methods fail, download yt-dlp and try again
    return await downloadYtDlpAndRetry(videoId, type, tempDir, outputFile);
    
  } catch (error) {
    console.error('💥 Error in downloadForTermux:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Downloads yt-dlp binary and retries download (fallback method)
 * @async
 * @function downloadYtDlpAndRetry
 * @param {string} videoId - YouTube video ID
 * @param {string} type - Download type ('audio' or 'video')
 * @param {string} tempDir - Temporary directory path
 * @param {string} outputFile - Output file path
 * @returns {Promise<Object>} - Download result object
 */
async function downloadYtDlpAndRetry(videoId, type, tempDir, outputFile) {
  try {
    console.log('📥 Downloading yt-dlp for Termux...');
    
    const ytDlpPath = `${tempDir}/yt-dlp-termux`;
    const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp');
    const buffer = await resp.arrayBuffer();
    fs.writeFileSync(ytDlpPath, Buffer.from(buffer));
    fs.chmodSync(ytDlpPath, 0o755);
    
    const args = type === 'audio'
      ? ['-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', outputFile, `https://youtu.be/${videoId}`]
      : ['-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`];
    
    await runCommand(ytDlpPath, args, 240000);
    
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      return {
        success: true,
        filePath: outputFile,
        size: sizeMB,
        source: 'yt-dlp-downloaded'
      };
    }
    
    return { success: false, error: 'Could not download' };
    
  } catch (error) {
    console.error('Error downloading yt-dlp:', error);
    return { success: false, error: 'Install youtube-dl: pkg install youtube-dl' };
  }
}

/**
 * Main YouTube download handler
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
 * // .ytmp3 bad bunny
 * 
 * @example
 * // Download video from URL:
 * // .ytmp4 https://youtu.be/dQw4w9WgXcQ
 * 
 * @returns {Promise<void>} - Sends downloaded file to chat
 * 
 * @throws {Error} - If no input provided
 * @throws {Error} - If video not found
 * @throws {Error} - If download fails
 */
const handler = async (m, { conn, text, command }) => {
  await m.react("⌛");
  
  const envInfo = isTermux ? '📱 TERMUX' : '💻 DESKTOP';
  
  // Show help if no input
  if (!text?.trim()) {
    await m.react("❌");
    return m.reply(`🎵 *DOLPHINBOT - ${envInfo}*

📝 *COMMANDS:*
• .ytmp3 <search/url> - Audio MP3
• .ytmp4 <search/url> - Normal video
• .ytmp4doc <search/url> - Video as document
• .installtermux - Install dependencies

💡 *EXAMPLES:*
.ytmp3 shakira
.ytmp4 android tutorial
.ytmp4doc https://youtu.be/xxxx

${isTermux ? '📱 *TERMUX:* Use short videos (<10 min) for better performance' : ''}

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
    
    console.log(`${envInfo}: ${videoTitle.substring(0, 60)}`);
    
    const type = command === 'ytmp3' ? 'audio' : 'video';
    await m.react("📥");
    
    // Send progress message
    const progressMsg = await m.reply(`⬇️ *${envInfo} - Downloading...*\n${videoTitle.substring(0, 50)}`);
    
    // Download based on environment
    const result = isTermux 
      ? await downloadForTermux(videoId, type)
      : await downloadForTermux(videoId, type);
    
    if (!result.success) {
      await m.react("❌");
      
      const errorMsg = isTermux
        ? `❌ *TERMUX ERROR*\n\n${result.error}\n\n🔧 *SOLUTION:*\n\`\`\`bash\npkg install youtube-dl ffmpeg\n\`\`\`\nOr use: .installtermux`
        : `❌ *ERROR*\n\n${result.error}\n\n🔧 *SOLUTION:*\n\`sudo pacman -S youtube-dl\``;
      
      return m.reply(errorMsg);
    }
    
    tempFile = result.filePath;
    
    // Check file size limits
    const maxSize = isTermux 
      ? (type === 'video' ? 30 : 50) 
      : (type === 'video' ? 100 : 200);
    
    if (parseFloat(result.size) > maxSize) {
      await m.react("⚠️");
      fs.unlinkSync(tempFile);
      
      const sizeError = isTermux
        ? `⚠️ *Too large for Termux*\n\n${result.size} MB > ${maxSize} MB\n\n📱 On Termux use shorter videos (<5 min)`
        : `⚠️ *Too large*\n\n${result.size} MB > ${maxSize} MB\n\n💡 Search for a shorter video`;
      
      return m.reply(sizeError);
    }
    
    // Sanitize filename
    const safeTitle = videoTitle
      .replace(/[<>:"/\\|?*]/g, '_')
      .substring(0, 60);
    
    // Send file based on type
    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: "audio/mpeg",
        fileName: `${safeTitle}.mp3`,
        ptt: false
      }, { quoted: m });
    } else if (command === 'ytmp4') {
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        caption: `🎬 ${videoTitle}\n📊 ${result.size} MB | ${envInfo}\n👨‍💻 Developer: Carlos G`
      }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        fileName: `${safeTitle}.mp4`,
        caption: `🎬 ${videoTitle}\n📦 ${result.size} MB | ${envInfo}\n👨‍💻 Developer: Carlos G`
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
          console.log('File deleted');
        } catch {}
      }
    }, isTermux ? 20000 : 30000);
    
  } catch (error) {
    await m.react("❌");
    console.error("💥 ERROR:", error);
    
    // Cleanup on error
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    
    const errorResponse = isTermux
      ? `💥 *TERMUX ERROR*\n\n${error.message}\n\n🔧 Run:\n\`.installtermux\`\nOr manually:\n\`pkg install youtube-dl ffmpeg python nodejs\``
      : `💥 *ERROR*\n\n${error.message}\n\n🔧 Install:\n\`sudo pacman -S youtube-dl ffmpeg\``;
    
    return m.reply(errorResponse);
  }
};

/**
 * Command aliases
 * @type {string[]}
 */
handler.command = ["ytmp4doc", "ytmp3", "ytmp4"];

/**
 * Help descriptions for each command
 * @type {string[]}
 */
handler.help = [
  "ytmp4doc <search/url> - Video as document",
  "ytmp3 <search/url> - Audio MP3", 
  "ytmp4 <search/url> - Normal video"
];

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
handler.limit = 5;

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
handler.description = 'Download YouTube videos/audio with platform optimization';

/**
 * Usage examples for help menu
 * @type {string}
 */
handler.usage = `.ytmp3 <search> | .ytmp4 <url> | .ytmp4doc <url>`;

/**
 * Command cooldown in seconds
 * @type {number}
 */
handler.cooldown = 30;

/**
 * Available in private chats
 * @type {boolean}
 */
handler.private = false;

/**
 * Exports handler as default module
 * @exports handler
 */
export default handler;