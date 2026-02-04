import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import chalk from 'chalk'

const tmpDir = './tmp'
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

const imageCache = new Map()

async function ensureImage(filename, url) {
  const filePath = path.join(tmpDir, filename)
  
  if (imageCache.has(filePath) && fs.existsSync(filePath)) {
    return filePath
  }
  
  if (!fs.existsSync(filePath)) {
    try {
      const res = await fetch(url, { timeout: 10000 })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(filePath, buffer)
      imageCache.set(filePath, true)
    } catch (error) {
      console.error(chalk.red(`[ENSUREIMAGE] Error descargando ${filename}:`), error)
      return null
    }
  } else {
    imageCache.set(filePath, true)
  }
  
  return filePath
}

const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || ''
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN || ''

const igVerificationCache = new Map()
const IG_CACHE_DURATION = 5 * 60 * 1000 

async function verificaInstagram(username) {
  if (!INSTAGRAM_USER_ID || !IG_ACCESS_TOKEN) return true
  
  if (!username) return false
  
  const cacheKey = username.toLowerCase()
  const cached = igVerificationCache.get(cacheKey)
  
  if (cached && (Date.now() - cached.timestamp < IG_CACHE_DURATION)) {
    return cached.follows
  }
  
  try {
    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/followers?access_token=${IG_ACCESS_TOKEN}`
    const req = await fetch(url, { timeout: 10000 })
    const json = await req.json()
    
    if (!json || !json.data) return true
    
    const follows = json.data.some(f => 
      f.username && 
      f.username.toLowerCase() === cacheKey
    )
    
    igVerificationCache.set(cacheKey, {
      follows,
      timestamp: Date.now()
    })
    
    return follows
  } catch (e) {
    console.error(chalk.red('[INSTAGRAM] Error verificando seguidor:'), e)
    return true 
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!global.db || !global.db.data) {
      await global.loadDatabase()
    }
    
    if (!global.db.data.users) {
      global.db.data.users = {}
    }
    
    if (!global.db.data.users[m.sender]) {
      global.db.data.users[m.sender] = {
        exp: 0,
        monedas: 10,
        registered: false,
        followed: false,
        name: m.pushName || 'Usuario',
        age: -1,
        regTime: -1
      }
    }
    
    const user = global.db.data.users[m.sender]
    const followKey = 'siguiendo'
    
    if (user.followed) {
      const igUser = (m.pushName || '').replace(/\s+/g, '').toLowerCase()
      
      if (igUser) {
        const sigue = await verificaInstagram(igUser)
        
        if (!sigue) {
          user.followed = false
          if (global.scheduleDbWrite) {
            global.scheduleDbWrite()
          }
          
          return conn.sendMessage(m.chat, { 
            text: `⚠️ Has dejado de seguir al creador en Instagram.\n\n👉 Por favor síguelo nuevamente:\nhttps://www.instagram.com/carlos.gxv\n\nLuego escribe:\n*${usedPrefix + command} ${followKey}*` 
          }, { quoted: m })
        }
      }
    }
    
    if (!user.followed) {
      if ((text || '').toLowerCase() === followKey) {
        const igUser = (m.pushName || '').replace(/\s+/g, '').toLowerCase()
        
        if (!igUser) {
          return conn.sendMessage(m.chat, { 
            text: `⚠️ No se pudo obtener tu nombre de usuario.\nAsegúrate de tener un nombre visible en WhatsApp.` 
          }, { quoted: m })
        }
        
        const sigue = await verificaInstagram(igUser)
        
        if (!sigue) {
          return conn.sendMessage(m.chat, { 
            text: `❌ No detecto que sigas al creador\n\n👉 https://www.instagram.com/carlos.gxv\n\nCuando lo sigas escribe:\n*${usedPrefix + command} ${followKey}*` 
          }, { quoted: m })
        }
        
        user.followed = true
        
        if (global.scheduleDbWrite) {
          global.scheduleDbWrite()
        }
        
        return conn.sendMessage(m.chat, { 
          text: `✅ ¡Perfecto! Verificado que sigues a Carlos Garcia.\n\nAhora puedes usar *${usedPrefix + command} Nombre.Edad* para unirte a la manada.` 
        }, { quoted: m })
      }
      
      return conn.sendMessage(m.chat, { 
        text: `⚠️ Para poder usar el bot primero debes seguir al creador en Instagram:\n\n👉 https://www.instagram.com/carlos.gxv\n\nDespués de seguirlo, escribe:\n\n*${usedPrefix + command} ${followKey}*` 
      }, { quoted: m })
    }
    
    if (user.registered === true) {
      return conn.sendMessage(m.chat, { 
        text: `⚠️ Ya estás registrado en la manada.\n\nUsa *${usedPrefix}perfil* para ver tu perfil de delfín, o usa *${usedPrefix}unreg* para borrar el registro actual` 
      }, { quoted: m })
    }
    
    const regex = /^([a-zA-ZÀ-ÿñÑ\s]+)\.(\d{1,2})$/i
    
    if (!text || !regex.test(text)) {
      return conn.sendMessage(m.chat, { 
        text: `⚠️ Formato incorrecto. Usa:\n*${usedPrefix + command} Nombre.Edad*\n\nEjemplo:\n*${usedPrefix + command} Flipper.18*` 
      }, { quoted: m })
    }
    
    const match = text.match(regex)
    const name = match[1].trim()
    const age = parseInt(match[2])
    
    if (age < 5 || age > 100) {
      return conn.sendMessage(m.chat, { 
        text: `⚠️ Edad no válida (entre 5 y 100 años).` 
      }, { quoted: m })
    }
    
    const oceanos = ['Pacífico', 'Atlántico', 'Índico', 'Ártico']
    const habilidades = [
      '🌊 Salto Acrobático', 
      '🐚 Sonar Potente', 
      '💨 Velocidad Marina', 
      '🌀 Espiral de Agua', 
      '⚡ Impulso Eléctrico', 
      '🌙 Navegación Nocturna', 
      '☀️ Brillante Solar'
    ]
    
    const country = oceanos[Math.floor(Math.random() * oceanos.length)]
    const afinidad = habilidades[Math.floor(Math.random() * habilidades.length)]
    const nivelMagico = Math.floor(Math.random() * 10) + 1
    const grimorioColor = '🐬 Delfín de la Manada'
    
    user.name = name
    user.age = age
    user.country = country
    user.registered = true
    user.regTime = Date.now()
    user.afinidad = afinidad
    user.nivelMagico = nivelMagico
    user.grimorioColor = grimorioColor
    
    try {
      if (global.db && global.db.write) {
        await global.db.write()
        console.log(chalk.green(`[REGISTRO] Usuario ${m.sender} registrado y guardado en DB`))
      }
    } catch (error) {
      console.error(chalk.red('[REGISTRO] Error guardando en DB:'), error)
      if (global.scheduleDbWrite) {
        global.scheduleDbWrite()
      }
    }
    
    let profilePic
    try {
      profilePic = await conn.profilePictureUrl(m.sender, 'image')
    } catch {
      profilePic = 'https://qu.ax/AfutJ.jpg'
    }
    
    const registroImg = await ensureImage('perfil.jpg', profilePic)
    const thumbnailPath = await ensureImage('registro_completo.jpg', 'https://qu.ax/AfutJ.jpg')
    
    let thumbnailBuffer
    try {
      if (thumbnailPath && fs.existsSync(thumbnailPath)) {
        thumbnailBuffer = fs.readFileSync(thumbnailPath)
      } else {
        thumbnailBuffer = global.catalogo || Buffer.from([])
      }
    } catch (error) {
      console.error(chalk.red('[REGISTRO] Error leyendo thumbnail:'), error)
      thumbnailBuffer = global.catalogo || Buffer.from([])
    }
    
    let responseMessage = `> *🌊 R E G I S T R O  M A R I N O*\n\n`
    responseMessage += `> *✧──『 🐬 𝗗𝗔𝗧𝗢𝗦 🐬 』*\n`
    responseMessage += `> *🐋 Nombre:* ${name}\n`
    responseMessage += `> *🎂 Edad:* ${age} años\n`
    responseMessage += `> *🌊 Océano:* ${country}\n`
    responseMessage += `> *🌀 Habilidad:* ${afinidad}\n`
    responseMessage += `> *💠 Nivel Marino:* ${nivelMagico}\n`
    responseMessage += `> *🐬 Tipo:* ${grimorioColor}\n`
    responseMessage += `> *✧────────────────✧*\n\n`
    responseMessage += `> *🐚 𝑬𝒍 𝒗í𝒏𝒄𝒖𝒍𝒐 𝒎𝒂𝒓𝒊𝒏𝒐 𝒔𝒆 𝒉𝒂 𝒆𝒔𝒕𝒂𝒃𝒍𝒆𝒄𝒊𝒅𝒐.*\n`
    responseMessage += `> *🌊 🐬 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒐, ${name.toUpperCase()} 𝒅𝒆𝒍 𝑶𝒄é𝒂𝒏𝒐 ${country}.*\n`
    responseMessage += `> *🌺 ¡𝑬𝒍 𝒐𝒄é𝒂𝒏𝒐 𝒕𝒆 𝒆𝒔𝒑𝒆𝒓𝒂!*`
    
    const contextInfo = {
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.ch?.ch1 || '',
        newsletterName: 'Dolphin Ocean',
        serverMessageId: 100
      },
      externalAdReply: {
        showAdAttribution: false,
        title: `🐬 registro marino`,
        body: `🌊 DolphinBot-MD • Carlos G`,
        mediaType: 2,
        sourceUrl: global.channel || '',
        thumbnail: thumbnailBuffer
      }
    }
    
    try {
      if (registroImg && fs.existsSync(registroImg)) {
        await conn.sendMessage(
          m.chat,
          {
            image: { url: registroImg },
            caption: responseMessage,
            mentions: [m.sender],
            contextInfo
          },
          { quoted: m }
        )
      } else {
        await conn.sendMessage(
          m.chat, 
          { text: responseMessage, mentions: [m.sender] }, 
          { quoted: m }
        )
      }
      
      console.log(chalk.green(`[REGISTRO] Usuario ${name} (${m.sender}) registrado exitosamente`))
    } catch (error) {
      console.error(chalk.red('[REGISTRO] Error enviando mensaje:'), error)
      await conn.sendMessage(
        m.chat, 
        { text: responseMessage }, 
        { quoted: m }
      )
    }
    
  } catch (error) {
    console.error(chalk.red('[REGISTRO] Error general:'), error)
    await conn.sendMessage(
      m.chat, 
      { text: '❌ Ocurrió un error durante el registro. Por favor intenta nuevamente.' }, 
      { quoted: m }
    )
  }
}

handler.command = ['registrarme', 'registrar', 'reg']
handler.tags = ['registro']
handler.help = ['reg <nombre.edad>']

export default handler