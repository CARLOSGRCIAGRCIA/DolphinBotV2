import yts from "yt-search"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { spawn } from "child_process"

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

async function downloadVideo(videoId) {
  try {
    const tempDir = './temp_videos'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.mp4`
    
    const methods = [
      {
        name: 'yt-dlp HD',
        cmd: 'yt-dlp',
        args: ['-f', 'bestvideo[height<=720]+bestaudio/best[height<=720]', '-o', outputFile, `https://youtu.be/${videoId}`]
      },
      {
        name: 'youtube-dl',
        cmd: 'youtube-dl',
        args: ['-f', 'best[height<=480]', '-o', outputFile, `https://youtu.be/${videoId}`]
      },
      {
        name: 'yt-dlp portable',
        cmd: './yt-dlp-bin',
        args: ['-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`],
        download: true
      }
    ]
    
    for (const method of methods) {
      try {
        console.log(`🔄 Intentando con ${method.name}...`)
        
        if (method.download && !fs.existsSync(method.cmd)) {
          console.log('📥 Descargando yt-dlp...')
          const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp')
          const buffer = await resp.arrayBuffer()
          fs.writeFileSync(method.cmd, Buffer.from(buffer))
          fs.chmodSync(method.cmd, 0o755)
        }
        
        await runCommand(method.cmd, method.args, 150000)
        
        if (fs.existsSync(outputFile)) {
          console.log(`✅ ${method.name} funcionó`)
          
          const stats = fs.statSync(outputFile)
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
          
          return {
            success: true,
            filePath: outputFile,
            size: sizeMB,
            source: method.name
          }
        }
      } catch (error) {
        console.log(`❌ ${method.name} falló:`, error.message)
        continue
      }
    }
    
    return { success: false, error: 'No se pudo descargar el video' }
    
  } catch (error) {
    console.error('💥 Error en downloadVideo:', error)
    return { success: false, error: error.message }
  }
}

const handler = async (m, { conn, text, command }) => {
  await m.react("⌛")
  
  if (!text?.trim()) {
    await m.react("❌")
    return m.reply(`🎬 *DESCARGAR VIDEOS DE YOUTUBE*

*Uso:* .ytmp4 <búsqueda o url>

*Ejemplos:*
.ytmp4 no hay nadie mas
.ytmp4 https://youtu.be/xxxx
.ytmp4 tutorial de python

*Nota:* Videos enviados como video normal (no documento)
*Límite:* ~50MB por video`)
  }

  let tempFile = null
  
  try {
    let videoId, videoTitle
    
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      videoId = extractVideoId(text)
      if (!videoId) {
        await m.react("❌")
        return m.reply("❌ URL de YouTube no válida")
      }
      
      const search = await yts({ videoId })
      videoTitle = search.title || "YouTube Video"
    } else {
      await m.react("🔍")
      const search = await yts.search({ query: text, pages: 1 })
      
      if (!search.videos.length) {
        await m.react("❌")
        return m.reply("❌ No encontré ese video")
      }
      
      videoId = search.videos[0].videoId
      videoTitle = search.videos[0].title
    }
    
    console.log(` Descargando video: ${videoTitle.substring(0, 60)}`)
    
    await m.react("📥")
    const progressMsg = await m.reply(`*Descargando video...*\n\n${videoTitle.substring(0, 50)} \n> DolphinBot`)
    
    const result = await downloadVideo(videoId)
    
    if (!result.success) {
      await m.react("❌")
      return m.reply(`❌ Error: ${result.error}\n\nInstala: \`sudo pacman -S youtube-dl\``)
    }
    
    tempFile = result.filePath
    
    if (parseFloat(result.size) > 50) {
      await m.react("⚠️")
      fs.unlinkSync(tempFile)
      return m.reply(`⚠️ Video demasiado grande (${result.size} MB)\n\n💡 Usa \`.ytmp4doc\` para videos más grandes\n   o busca un video más corto`)
    }
    
    const safeTitle = videoTitle
      .replace(/[<>:"/\\|?*]/g, '')
      .substring(0, 50)
    
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(tempFile),
      mimetype: "video/mp4",
      caption: `🎬 ${videoTitle}\n\n> DolphinBot x Carlos G`
    }, { quoted: m })
    
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
    
    return m.reply(`Error: ${error.message}\n\nUsa \`.installtools\` para instalar dependencias`)
  }
}

handler.command = ["ytmp4"]
handler.help = ["ytmp4 <búsqueda/url> - Descargar video"]
handler.tags = ["descargas"]

export default handler