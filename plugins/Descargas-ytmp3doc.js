import yts from "yt-search"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { spawn } from "child_process"

const name = 'Descargas - DolphinBot'

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function runCommand(cmd, args, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args)
    let stdout = ''
    let stderr = ''
    
    const timer = setTimeout(() => {
      process.kill()
      reject(new Error('Timeout'))
    }, timeout)
    
    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    process.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(stderr || `Exit code: ${code}`))
      }
    })
    
    process.on('error', reject)
  })
}

async function downloadSimple(videoId, type = 'audio') {
  try {
    const tempDir = './temp_downloads'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`
    
    try {
      const cmd = type === 'audio' 
        ? ['youtube-dl', '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : ['youtube-dl', '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
      
      await runCommand(cmd[0], cmd.slice(1), 120000)
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' }
      }
    } catch {}
    
    try {
      const cmd = type === 'audio'
        ? ['yt-dlp', '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : ['yt-dlp', '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
      
      await runCommand(cmd[0], cmd.slice(1), 120000)
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' }
      }
    } catch {}
    
    try {
      const ytDlpPath = './yt-dlp-bin'
      if (!fs.existsSync(ytDlpPath)) {
        console.log('Descargando yt-dlp...')
        const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp')
        const buffer = await resp.arrayBuffer()
        fs.writeFileSync(ytDlpPath, Buffer.from(buffer))
        fs.chmodSync(ytDlpPath, 0o755)
      }
      
      const cmd = type === 'audio'
        ? [ytDlpPath, '-x', '--audio-format', 'mp3', '-o', outputFile, `https://youtu.be/${videoId}`]
        : [ytDlpPath, '-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
      
      await runCommand(cmd[0], cmd.slice(1), 180000)
      
      if (fs.existsSync(outputFile)) {
        return { success: true, filePath: outputFile, title: 'YouTube Download' }
      }
    } catch (error) {
      console.error('Error con yt-dlp binario:', error)
    }
    
    return { success: false, error: 'No se pudo descargar' }
    
  } catch (error) {
    console.error('Error en downloadSimple:', error)
    return { success: false, error: error.message }
  }
}

const handler = async (m, { conn, text, command }) => {
  await m.react("⌛")
  
  if (!text?.trim()) {
    await m.react("❌")
    return m.reply(`🎵 *DESCARGAS SIMPLIFICADAS*

📝 *Comandos:*
.ytmp3 <búsqueda/url> - Audio MP3
.ytmp4doc <búsqueda/url> - Video MP4

💡 *Ejemplos:*
.ytmp3 "canción"
.ytmp4doc "video corto"

⚠️ *Primera vez:* Se descargará yt-dlp automáticamente`)
  }

  let tempFile = null
  
  try {
    let videoId, videoTitle
    
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      videoId = extractVideoId(text)
      if (!videoId) {
        await m.react("❌")
        return m.reply("❌ URL no válida")
      }
      
      const search = await yts({ videoId })
      videoTitle = search.title || "YouTube Video"
    } else {
      await m.react("🔍")
      const search = await yts.search({ query: text, pages: 1 })
      
      if (!search.videos.length) {
        await m.react("❌")
        return m.reply("❌ No encontré resultados")
      }
      
      videoId = search.videos[0].videoId
      videoTitle = search.videos[0].title
    }
    
    console.log(`Buscando: ${videoTitle.substring(0, 60)}`)
    
    const type = command === 'ytmp3' ? 'audio' : 'video'
    await m.react("📥")
    
    const progressMsg = await m.reply(`Dolphin Bot esta Descargando: ${videoTitle.substring(0, 50)}...`)
    
    const result = await downloadSimple(videoId, type)
    
    if (!result.success) {
      await m.react("❌")
      return m.reply(`❌ Error: ${result.error}

🔧 *SOLUCIÓN:*
1. Instala youtube-dl (más fácil):
   \`sudo pacman -S youtube-dl\`

2. O crea entorno virtual:
   \`\`\`bash
   cd ~/Documents/bot/DolphinBotV2
   python -m venv venv
   source venv/bin/activate
   pip install yt-dlp
   \`\`\``)
    }
    
    tempFile = result.filePath
    
    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: "audio/mpeg",
        fileName: `${videoTitle.substring(0, 70).replace(/[^\w\s.-]/g, '_')}.mp3`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        fileName: `${videoTitle.substring(0, 70).replace(/[^\w\s.-]/g, '_')}.mp4`,
        caption: `🎬 ${videoTitle}`
      }, { quoted: m })
    }
    
    try {
      await conn.sendMessage(m.chat, { delete: progressMsg.key })
    } catch {}
    
    await m.react("✅")
    
    setTimeout(() => {
      if (tempFile && fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile)
        } catch {}
      }
    }, 30000)
    
  } catch (error) {
    await m.react("❌")
    console.error("ERROR:", error)
    
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile) } catch {}
    }
    
    return m.reply(`Error: ${error.message}

🛠️ *Instala YOUTUBE-DL (más fácil):*
\`sudo pacman -S youtube-dl ffmpeg\`

Luego prueba de nuevo.`)
  }
}

handler.command = ["ytmp4doc", "ytmp3"]
handler.help = ["ytmp4doc <búsqueda/url>", "ytmp3 <búsqueda/url>"]
handler.tags = ["descargas"]

export default handler