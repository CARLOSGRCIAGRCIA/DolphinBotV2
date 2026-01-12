//código adaptado para DolphinBot 🐬
//basado en el trabajo original de The Carlos 👑
//no olvides dejar créditos 

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const tmpDir = './tmp'
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

async function ensureImage(filename, url) {
  const filePath = path.join(tmpDir, filename)
  if (!fs.existsSync(filePath)) {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filePath, buffer)
  }
  return filePath
}

const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || ''
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN || ''

async function verificaInstagram(username) {
  if (!INSTAGRAM_USER_ID || !IG_ACCESS_TOKEN) return true
  try {
    const url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/followers?access_token=${IG_ACCESS_TOKEN}`
    const req = await fetch(url)
    const json = await req.json()
    if (!json || !json.data) return true
    return json.data.some(f => f.username && username && f.username.toLowerCase() === username.toLowerCase())
  } catch (e) {
    return true
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  const followKey = 'siguiendo'

  if (user.followed) {
    const igUser = (m.pushName || '').replace(/\s+/g, '').toLowerCase()
    const sigue = await verificaInstagram(igUser)
    if (!sigue) {
      user.followed = false
      return conn.sendMessage(m.chat, { text: `⚠️ Has dejado de seguir al creador en Instagram.\nPor favor síguelo nuevamente:\n👉 https://www.instagram.com/_carlitos.zx\n\nLuego escribe:\n*${usedPrefix + command} ${followKey}*` }, { quoted: m })
    }
  }

  if (!user.followed) {
    if ((text || '').toLowerCase() === followKey) {
      const igUser = (m.pushName || '').replace(/\s+/g, '').toLowerCase()
      const sigue = await verificaInstagram(igUser)
      if (!sigue) {
        return conn.sendMessage(m.chat, { text: `❌ No detecto que sigas al creador\n\n👉 https://www.instagram.com/carlos.gxv\n\nCuando lo sigas escribe:\n*${usedPrefix + command} ${followKey}*` }, { quoted: m })
      }
      user.followed = true
      return conn.sendMessage(m.chat, { text: `✅ ¡Perfecto! Verificado que sigues a Carlos Garcia.\nAhora puedes usar *${usedPrefix + command} Nombre.Edad* para unirte a la manada.` }, { quoted: m })
    }

    return conn.sendMessage(m.chat, { text: `⚠️ Para poder usar el bot primero debes seguir al creador en Instagram:\n\n👉 https://www.instagram.com/carlos.gxv\n\nDespués de seguirlo, escribe:\n\n*${usedPrefix + command} ${followKey}*` }, { quoted: m })
  }

  if (user.registered === true) {
    return conn.sendMessage(m.chat, { text: `⚠️ Ya estás registrado en la manada.\nUsa *${usedPrefix}perfil* para ver tu perfil de delfín.` }, { quoted: m })
  }

  const regex = /^([a-zA-ZÀ-ÿñÑ\s]+)\.(\d{1,2})$/i
  if (!regex.test(text)) {
    return conn.sendMessage(m.chat, { text: `⚠️ Formato incorrecto. Usa:\n*${usedPrefix + command} Nombre.Edad*\n\nEjemplo:\n*${usedPrefix + command} Flipper.18*` }, { quoted: m })
  }

  let match = text.match(regex)
  let name = match[1]
  let age = parseInt(match[2])

  if (age < 5 || age > 100) {
    return conn.sendMessage(m.chat, { text: `⚠️ Edad no válida (entre 5 y 100 años).` }, { quoted: m })
  }

  const oceanos = ['Pacífico', 'Atlántico', 'Índico', 'Ártico']
  const habilidades = ['🌊 Salto Acrobático', '🐚 Sonar Potente', '💨 Velocidad Marina', '🌀 Espiral de Agua', '⚡ Impulso Eléctrico', '🌙 Navegación Nocturna', '☀️ Brillante Solar']

  const country = oceanos[Math.floor(Math.random() * oceanos.length)]
  const afinidad = habilidades[Math.floor(Math.random() * habilidades.length)]
  const nivelMagico = Math.floor(Math.random() * 10) + 1
  const grimorioColor = '🐬 Delfín de la Manada'

  user.name = name.trim()
  user.age = age
  user.country = country
  user.registered = true
  user.regTime = +new Date()
  user.afinidad = afinidad
  user.nivelMagico = nivelMagico

  let profilePic
  try {
    profilePic = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    profilePic = 'https://qu.ax/AfutJ.jpg'
  }

  const registroImg = await ensureImage('perfil.jpg', profilePic)
  const thumbnailBuffer = fs.readFileSync(await ensureImage('registro_completo.jpg', 'https://qu.ax/AfutJ.jpg'))

  let responseMessage = `> *🌊!**R E G I S T R O  M A R I N O*\n\n`
  responseMessage += `> *!* ✧──『 🐬 𝗗𝗔𝗧𝗢𝗦 🐬 』\n`
  responseMessage += `> *!* 🐋 *Nombre:* ${name}\n`
  responseMessage += `> *!* 🎂 *Edad:* ${age} años\n`
  responseMessage += `> *!* 🌊 *Océano:* ${country}\n`
  responseMessage += `> *!* 🌀 *Habilidad:* ${afinidad}\n`
  responseMessage += `> *!* 💠 *Nivel Marino:* ${nivelMagico}\n`
  responseMessage += `> *!* 🐬 *Tipo:* ${grimorioColor}\n`
  responseMessage += `> *!* ✧────────────────✧\n\n`
  responseMessage += `> *!* 🐚 𝑬𝒍 𝒗í𝒏𝒄𝒖𝒍𝒐 𝒎𝒂𝒓𝒊𝒏𝒐 𝒔𝒆 𝒉𝒂 𝒆𝒔𝒕𝒂𝒃𝒍𝒆𝒄𝒊𝒅𝒐.\n`
  responseMessage += `> *🌊!* 🐬 𝑩𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒐, *${name.toUpperCase()}* 𝒅𝒆𝒍 𝑶𝒄é𝒂𝒏𝒐 ${country}.\n`
  responseMessage += `> *!* 🌺 ¡𝑬𝒍 𝒐𝒄é𝒂𝒏𝒐 𝒕𝒆 𝒆𝒔𝒑𝒆𝒓𝒂!`

  const newsletterId = ''
  const newsletterName = 'Dolphin Ocean'

  const contextInfo = {
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: newsletterId,
      newsletterName: newsletterName,
      serverMessageId: 100
    },
    externalAdReply: {
      showAdAttribution: false,
      title: `🐬 registro marino`,
      body: `🌊 DolphinBot-MD • Carlos G`,
      mediaType: 2,
      sourceUrl: global.redes || '',
      thumbnail: global.icons || thumbnailBuffer
    }
  }

  try {
    await conn.sendMessage(
      m.chat,
      {
        image: { url: registroImg },
        caption: responseMessage,
        mentions: [...new Set(((responseMessage.match(/@(\d{5,16})/g)) || []).map(v => v.replace('@', '') + '@s.whatsapp.net'))],
        contextInfo
      },
      { quoted: m }
    )
  } catch (e) {
    await conn.sendMessage(m.chat, { text: responseMessage }, { quoted: m })
  }
}

handler.command = ['registrarme', 'registrar', 'reg']
export default handler