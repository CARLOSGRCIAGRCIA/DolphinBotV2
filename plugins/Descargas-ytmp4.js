/**
 * YouTube Video Download Handler for Dolphin-Bot (MP4 Format)
 * @file Downloads YouTube videos in MP4 format with quality optimization
 * @author Carlos G <https://github.com/CARLOSGRCIAGRCIA>
 * @version 3.5.0
 * @license MIT
 * 
 * @module youtubeVideoDownloadHandler
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
 * Downloads YouTube video with multiple fallback methods and quality optimization
 * @async
 * @function downloadVideo
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} - Download result object
 * @property {boolean} success - Whether download succeeded
 * @property {string} [filePath] - Path to downloaded video file
 * @property {string} [size] - File size in megabytes (MB)
 * @property {string} [source] - Tool used for download
 * @property {string} [error] - Error message if failed
 */
async function downloadVideo(videoId) {
  try {
    const tempDir = './temp_videos';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.mp4`;
    
    /**
     * Download methods to try in order (with quality optimization)
     * @type {Array<Object>}
     */
    const methods = [
      {
        name: 'yt-dlp HD',
        cmd: 'yt-dlp',
        args: ['-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]', '-o', outputFile, `https://youtu.be/${videoId}`],
        description: '720p max quality'
      },
      {
        name: 'youtube-dl',
        cmd: 'youtube-dl',
        args: ['-f', 'best[height<=480]', '-o', outputFile, `https://youtu.be/${videoId}`],
        description: '480p max quality'
      },
      {
        name: 'yt-dlp portable',
        cmd: './yt-dlp-bin',
        args: ['-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`],
        download: true,
        description: '360p portable binary'
      }
    ];
    
    for (const method of methods) {
      try {
        console.log(`🔄 Trying with ${method.name} (${method.description})...`);
        
        if (method.download && !fs.existsSync(method.cmd)) {
          console.log('📥 Downloading yt-dlp binary...');
          const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp');
          const buffer = await resp.arrayBuffer();
          fs.writeFileSync(method.cmd, Buffer.from(buffer));
          fs.chmodSync(method.cmd, 0o755);
        }
        
        await runCommand(method.cmd, method.args, 150000);
        
        if (fs.existsSync(outputFile)) {
          console.log(`✅ ${method.name} worked`);
          
          const stats = fs.statSync(outputFile);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          
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
    
    return { success: false, error: 'Could not download the video' };
    
  } catch (error) {
    console.error('💥 Error in downloadVideo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main YouTube video download handler (MP4 format)
 * @async
 * @function handler
 * @param {Object} m - Received message object
 * @param {string} m.chat - Chat ID
 * @param {Object} conn - WhatsApp connection object
 * @param {string} text - Search query or YouTube URL
 * @param {string} command - Executed command name
 * 
 * @example
 * // Download video by search:
 * // .ytmp4 no hay nadie mas
 * 
 * @example
 * // Download video by URL:
 * // .ytmp4 https://youtu.be/dQw4w9WgXcQ
 * 
 * @returns {Promise<void>} - Sends downloaded video to chat as video (not document)
 * 
 * @throws {Error} - If no input provided
 * @throws {Error} - If video not found
 * @throws {Error} - If download fails
 * @throws {Error} - If file size exceeds limit
 */
const handler = async (m, { conn, text, command }) => {
  await m.react("⌛");
  
  if (!text?.trim()) {
    await m.react("❌");
    return m.reply(`🎬 *DOWNLOAD YOUTUBE VIDEOS*

*Usage:* .ytmp4 <search or url>

*Examples:*
.ytmp4 no hay nadie mas
.ytmp4 https://youtu.be/xxxx
.ytmp4 python tutorial

*Note:* Videos sent as normal video (not document)
*Limit:* ~50MB per video

👨‍💻 *Developer:* Carlos G
📂 GitHub: CARLOSGRCIAGRCIA
📸 Instagram: @Carlos_gxv`);
  }

  let tempFile = null;
  
  try {
    let videoId, videoTitle;
    
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      videoId = extractVideoId(text);
      if (!videoId) {
        await m.react("❌");
        return m.reply("❌ Invalid YouTube URL");
      }
      
      const search = await yts({ videoId });
      videoTitle = search.title || "YouTube Video";
    } else {
      await m.react("🔍");
      const search = await yts.search({ query: text, pages: 1 });
      
      if (!search.videos.length) {
        await m.react("❌");
        return m.reply("❌ Could not find that video");
      }
      
      videoId = search.videos[0].videoId;
      videoTitle = search.videos[0].title;
    }
    
    console.log(` Downloading video: ${videoTitle.substring(0, 60)}`);
    
    await m.react("📥");
    const progressMsg = await m.reply(`*Downloading video...*\n\n${videoTitle.substring(0, 50)} \n> DolphinBot by Carlos G`);
    
    const result = await downloadVideo(videoId);
    
    if (!result.success) {
      await m.react("❌");
      return m.reply(`❌ Error: ${result.error}\n\nInstall: \`sudo pacman -S youtube-dl\`

📞 *Support:*
👨‍💻 Carlos G
📸 Instagram: @Carlos_gxv`);
    }
    
    tempFile = result.filePath;
    
    const MAX_VIDEO_SIZE_MB = 50;
    if (parseFloat(result.size) > MAX_VIDEO_SIZE_MB) {
      await m.react("⚠️");
      fs.unlinkSync(tempFile);
      return m.reply(`⚠️ Video too large (${result.size} MB)\n\n💡 Use \`.ytmp4doc\` for larger videos\n   or search for a shorter video

📊 *Current size:* ${result.size} MB
📏 *Max allowed:* ${MAX_VIDEO_SIZE_MB} MB`);
    }
    
    /**
     * Sanitize video title for safe display
     * @function sanitizeTitle
     */
    const safeTitle = videoTitle
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50);
    
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(tempFile),
      mimetype: "video/mp4",
      caption: `🎬 ${videoTitle}\n\n👨‍💻 DolphinBot by Carlos G\n📂 GitHub: CARLOSGRCIAGRCIA`
    }, { quoted: m });
    
    try {
      await conn.sendMessage(m.chat, { delete: progressMsg.key });
    } catch {}
    
    await m.react("✅");
    
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
    
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch {}
    }
    
    return m.reply(`Error: ${error.message}\n\nUse \`.installtools\` to install dependencies

🛠️ *Quick fix:*
\`sudo pacman -S yt-dlp ffmpeg\`

📞 *Support:*
👨‍💻 Carlos G
📸 Instagram: @Carlos_gxv`);
  }
};

/**
 * Command aliases
 * @type {string[]}
 */
handler.command = ["ytmp4"];

/**
 * Help descriptions for each command
 * @type {string[]}
 */
handler.help = ["ytmp4 <search/url> - Download YouTube video (MP4)"];

/**
 * Command categories
 * @type {string[]}
 */
handler.tags = ["downloads", "youtube", "video", "media"];

/**
 * Can be used in groups
 * @type {boolean}
 */
handler.group = true;

/**
 * Cooldown limit (uses per user)
 * @type {number}
 */
handler.limit = 3;

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
 * Maximum video size allowed (in MB)
 * @constant {number}
 */
handler.MAX_VIDEO_SIZE_MB = 50;

/**
 * Command description for help menu
 * @type {string}
 */
handler.description = 'Download YouTube videos in MP4 format with quality optimization';

/**
 * Usage examples for help menu
 * @type {string}
 */
handler.usage = `.ytmp4 <song name> | .ytmp4 <youtube-url>`;

/**
 * Command cooldown in seconds
 * @type {number}
 */
handler.cooldown = 20;

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