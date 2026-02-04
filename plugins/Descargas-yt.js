import yts from "yt-search"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import os from "os"

const name = 'Descargas - DolphinBot'

const isTermux = process.env.PREFIX && process.env.PREFIX.includes('com.termux')

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

function runCommand(cmd, args, timeout = 90000) {
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

async function downloadForTermux(videoId, type = 'audio') {
  try {
    const tempDir = isTermux 
      ? '/data/data/com.termux/files/usr/tmp/dolphinbot'
      : './temp_downloads'
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const outputFile = `${tempDir}/${videoId}_${Date.now()}.${type === 'audio' ? 'mp3' : 'mp4'}`
    
    console.log(`📁 Temp dir: ${tempDir}`)
    console.log(`📄 Output: ${outputFile}`)
    
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
    ]
    
    for (const method of methods) {
      try {
        console.log(`🔄 Termux: Intentando con ${method.name}...`)
        
        await runCommand(method.cmd, method.args, 180000)
        
        if (fs.existsSync(outputFile)) {
          const stats = fs.statSync(outputFile)
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
          
          console.log(`✅ ${method.name} funcionó: ${sizeMB} MB`)
          
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
    
    return await downloadYtDlpAndRetry(videoId, type, tempDir, outputFile)
    
  } catch (error) {
    console.error('💥 Error en downloadForTermux:', error)
    return { success: false, error: error.message }
  }
}

async function downloadYtDlpAndRetry(videoId, type, tempDir, outputFile) {
  try {
    console.log('📥 Descargando yt-dlp para Termux...')
    
    const ytDlpPath = `${tempDir}/yt-dlp-termux`
    const resp = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp')
    const buffer = await resp.arrayBuffer()
    fs.writeFileSync(ytDlpPath, Buffer.from(buffer))
    fs.chmodSync(ytDlpPath, 0o755)
    
    const args = type === 'audio'
      ? ['-x', '--audio-format', 'mp3', '--audio-quality', '0', '-o', outputFile, `https://youtu.be/${videoId}`]
      : ['-f', 'best[height<=360]', '-o', outputFile, `https://youtu.be/${videoId}`]
    
    await runCommand(ytDlpPath, args, 240000)
    
    if (fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile)
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
      
      return {
        success: true,
        filePath: outputFile,
        size: sizeMB,
        source: 'yt-dlp-descargado'
      }
    }
    
    return { success: false, error: 'No se pudo descargar' }
    
  } catch (error) {
    console.error('Error descargando yt-dlp:', error)
    return { success: false, error: 'Instala youtube-dl: pkg install youtube-dl' }
  }
}

const handler = async (m, { conn, text, command }) => {
  await m.react("⌛")
  
  const envInfo = isTermux ? '📱 TERMUX' : '💻 MANJARO'
  
  if (!text?.trim()) {
    await m.react("❌")
    return m.reply(`🎵 *DOLPHINBOT - ${envInfo}*

📝 *COMANDOS:*
• .ytmp3 <búsqueda/url> - Audio MP3
• .ytmp4 <búsqueda/url> - Video normal
• .ytmp4doc <búsqueda/url> - Video como documento
• .installtermux - Instalar dependencias

💡 *EJEMPLOS:*
.ytmp3 shakira
.ytmp4 tutorial android
.ytmp4doc https://youtu.be/xxxx

${isTermux ? '📱 *TERMUX:* Usa videos cortos (<10 min) para mejor rendimiento' : ''}`)
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
    
    console.log(`${envInfo}: ${videoTitle.substring(0, 60)}`)
    
    const type = command === 'ytmp3' ? 'audio' : 'video'
    await m.react("📥")
    
    const progressMsg = await m.reply(`⬇️ *${envInfo} - Descargando...*\n${videoTitle.substring(0, 50)}`)
    
    const result = isTermux 
      ? await downloadForTermux(videoId, type)
      : await downloadForTermux(videoId, type)
    
    if (!result.success) {
      await m.react("❌")
      
      const errorMsg = isTermux
        ? `❌ *ERROR EN TERMUX*\n\n${result.error}\n\n🔧 *SOLUCIÓN:*\n\`\`\`bash\npkg install youtube-dl ffmpeg\n\`\`\`\nO usa: .installtermux`
        : `❌ *ERROR*\n\n${result.error}\n\n🔧 *SOLUCIÓN:*\n\`sudo pacman -S youtube-dl\``
      
      return m.reply(errorMsg)
    }
    
    tempFile = result.filePath
    
    const maxSize = isTermux 
      ? (type === 'video' ? 30 : 50) 
      : (type === 'video' ? 100 : 200)
    
    if (parseFloat(result.size) > maxSize) {
      await m.react("⚠️")
      fs.unlinkSync(tempFile)
      
      const sizeError = isTermux
        ? `⚠️ *Muy grande para Termux*\n\n${result.size} MB > ${maxSize} MB\n\n📱 En Termux usa videos más cortos (<5 min)`
        : `⚠️ *Muy grande*\n\n${result.size} MB > ${maxSize} MB\n\n💡 Busca un video más corto`
      
      return m.reply(sizeError)
    }
    
    const safeTitle = videoTitle
      .replace(/[<>:"/\\|?*]/g, '_')
      .substring(0, 60)
    
    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: "audio/mpeg",
        fileName: `${safeTitle}.mp3`,
        ptt: false
      }, { quoted: m })
    } else if (command === 'ytmp4') {
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        caption: `🎬 ${videoTitle}\n📊 ${result.size} MB | ${envInfo}`
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        document: fs.readFileSync(tempFile),
        mimetype: "video/mp4",
        fileName: `${safeTitle}.mp4`,
        caption: `🎬 ${videoTitle}\n📦 ${result.size} MB | ${envInfo}`
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
          console.log('Archivo eliminado')
        } catch {}
      }
    }, isTermux ? 20000 : 30000)
    
  } catch (error) {
    await m.react("❌")
    console.error("💥 ERROR:", error)
    
    if (tempFile && fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile) } catch {}
    }
    
    const errorResponse = isTermux
      ? `💥 *ERROR TERMUX*\n\n${error.message}\n\n🔧 Corre:\n\`.installtermux\`\nO manual:\n\`pkg install youtube-dl ffmpeg python nodejs\``
      : `💥 *ERROR*\n\n${error.message}\n\n🔧 Instala:\n\`sudo pacman -S youtube-dl ffmpeg\``
    
    return m.reply(errorResponse)
  }
}

handler.command = ["ytmp4doc", "ytmp3", "ytmp4"]
handler.help = [
  "ytmp4doc <búsqueda/url> - Video como documento",
  "ytmp3 <búsqueda/url> - Audio MP3", 
  "ytmp4 <búsqueda/url> - Video normal"
]
handler.tags = ["descargas"]

export default handler