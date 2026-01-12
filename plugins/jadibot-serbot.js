/*
⚠ CODIGO ADAPTADO PARA DOLPHINBOT ⚠ 

El codigo de este archivo fue adaptado para:
- DolphinBot (Bot temático de delfines)

Basado en el trabajo original de:
- Aiden_NotLogic (https://github.com/ferhacks)
- BrunoSobrino >> https://github.com/BrunoSobrino

⚠ ADAPTACIÓN DOLPHINBOT ⚠ -- ⚠ VERSIÓN DELFÍN ⚠
*/


import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
import { fileURLToPath } from 'url'
import { makeWASocket } from '../lib/simple.js'

const { exec } = await import('child_process')
const { CONNECTING } = ws

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"

let drm1 = ""
let drm2 = ""

let rtx =
`🐬✨『 𝗗𝗼𝗹𝗽𝗵𝗶𝗻𝗕𝗼𝘁 - 𝗦𝘂𝗯 𝗕𝗼𝘁 』✨🐬  

📲 *Escanea el código QR desde tu WhatsApp:*  
⋮ > *Dispositivos vinculados* > *Escanear código*  

⏳ *La conexión marina dura solo 45 segundos...*

🌊 *Conviértete en un Delfín Sub-Bot y únete a la manada*  
🐚 *Tu energía quedará sincronizada con el océano principal*`

let rtx2 =
`🐬✨『 𝗗𝗼𝗹𝗽𝗵𝗶𝗻𝗕𝗼𝘁 - 𝗦𝘂𝗯 𝗕𝗼𝘁 』✨🐬  
 
🌊 *Usa este Código Marino para convertirte en un ✧ Delfín Sub-Bot y nadar junto a la manada del océano.*  

⏳ *Atención, Delfín del Mar:* esta conexión es delicada.  
⚠️ *No uses tu cuenta principal, emplea una cuenta secundaria o de respaldo.*  

🐚 *SISTEMA ➤ [ CÓDIGO ACTIVO ] — Activa la conexión cuando estés preparado* 🌊`

const maxSubBots = 500

let blackJBOptions = {}

if (!global.conns) global.conns = []

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`El Comando *${command}* está desactivado temporalmente.`)
  }

  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date() - global.db.data.users[m.sender].Subs < 120000) {
    let remaining = time - new Date()
    setTimeout(() => {
      conn.reply(m.chat, `> 🐬 Ya estás listo para conectarte de nuevo a la manada`, m)
    }, remaining)
    return conn.reply(m.chat, `⏳ Debes esperar ${msToTime(remaining)} para volver a vincular un *Delfín Sub-Bot.*`, m)
  }

  const subBots = [...new Set(
    global.conns.filter(c =>
      c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED
    ).map(c => c)
  )]

  const subBotsCount = subBots.length

  if (subBotsCount >= maxSubBots) {
    return m.reply(`❌ No hay espacios disponibles en el océano para más *Delfines Sub-Bots*.`)
  }
  
  const availableSlots = maxSubBots - subBotsCount

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split('@')[0]}`
  let pathblackJadiBot = path.join(process.cwd(), 'núcleo•dolphin', 'dolphinJadiBot', id)

  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  
  blackJBOptions.pathblackJadiBot = pathblackJadiBot
  blackJBOptions.m = m
  blackJBOptions.conn = conn
  blackJBOptions.args = args
  blackJBOptions.usedPrefix = usedPrefix
  blackJBOptions.command = command
  blackJBOptions.fromCommand = true

  await blackJadiBot(blackJBOptions)

  global.db.data.users[m.sender].Subs = new Date() * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']

export default handler

export async function blackJadiBot(options) {
  let { pathblackJadiBot, m, conn, args, usedPrefix, command } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim())
    ? true
    : args[1] && /(--code|code)/.test(args[1].trim())
      ? true
      : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  const pathCreds = path.join(pathblackJadiBot, "creds.json")
  if (!fs.existsSync(pathblackJadiBot)) {
    fs.mkdirSync(pathblackJadiBot, { recursive: true })
  }
  try {
    if (args[0] && args[0] != undefined) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
    }
  } catch {
    conn.reply(m.chat, `⚠️ Use correctamente el comando » ${usedPrefix + command}`, m)
    return
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const { version } = await fetchLatestBaileysVersion()
    const msgRetry = () => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathblackJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
      version: version,
      generateHighQualityLinkPreview: true
    }

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
        } else {
          return
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
        }
        return
      }
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split('@')[0]))
        secret = secret.match(/.{1,4}/g)?.join("-")
        txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
        codeBot = await m.reply(secret)
        console.log(secret)
      }
      if (txtCode && txtCode.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
      }
      if (codeBot && codeBot.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
      }

      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === 'close') {
        if (reason === 428 || reason === 408) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 La conexión del delfín (+${path.basename(pathblackJadiBot)}) se cerró inesperadamente. Intentando reconectar...\n╰─────────────────────────`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason === 440) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 La conexión del delfín (+${path.basename(pathblackJadiBot)}) fue reemplazada por otra sesión activa.\n╰─────────────────────────`))
          try {
            if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: '🌊 HEMOS DETECTADO UNA NUEVA SESIÓN, CIERRA LA NUEVA SESIÓN PARA CONTINUAR\n\n> SI HAY ALGÚN PROBLEMA VUELVE A CONECTARTE' }, { quoted: m || null }) : ""
          } catch {}
        }
        if (reason == 405 || reason == 401) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 La sesión del delfín (+${path.basename(pathblackJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado.\n╰─────────────────────────`))
          try {
            if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: '🌊 SESIÓN PENDIENTE\n\n> INTENTA NUEVAMENTE VOLVER A SER DELFÍN SUB-BOT' }, { quoted: m || null }) : ""
          } catch {}
          fs.rmdirSync(pathblackJadiBot, { recursive: true })
        }
        if (reason === 500) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 Conexión perdida en el océano (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
          if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathblackJadiBot)}@s.whatsapp.net`, { text: '🌊 CONEXIÓN PERDIDA\n\n> INTENTA MANUALMENTE VOLVER A SER DELFÍN SUB-BOT' }, { quoted: m || null }) : ""
          return creloadHandler(true).catch(console.error)
        }
        if (reason === 515) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 Reinicio automático del delfín (+${path.basename(pathblackJadiBot)}).\n╰─────────────────────────`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason === 403) {
          console.log(chalk.bold.cyan(`\n╭─────────────────────────\n│ 🐬 Sesión cerrada o cuenta en soporte para el delfín (+${path.basename(pathblackJadiBot)})\n╰─────────────────────────`))
          fs.rmdirSync(pathblackJadiBot, { recursive: true })
        }
      }
      if (connection == 'open') {
        if (!global.db.data) loadDatabase()
        if (!global.db.data?.users) loadDatabase()
        let userName = sock.authState.creds.me.name || 'Delfín Anónimo'
        console.log(chalk.bold.cyan(`\n❒────────────【• 🐬 DOLPHIN SUB-BOT 🐬 •】────────────❒\n│\n│ 🌊 ${userName} (+${path.basename(pathblackJadiBot)}) nadando en el océano exitosamente.\n│\n❒────────────【• 🐬 CONECTADO 🐬 •】────────────❒`))
        sock.isInit = true
        global.conns.push(sock)

        if (m?.chat) await conn.sendMessage(m.chat, { text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado como delfín, leyendo mensajes entrantes...` : `@${m.sender.split('@')[0]}, *¡Genial! Ya eres parte de la manada de DolphinBot.*\n🐬 Bienvenido al océano, disfruta nadando con nosotros 🌊`, mentions: [m.sender] }, { quoted: m })
      }
    }

    setInterval(async () => {
      if (!sock.user) {
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)

    let handler = await import('../núcleo•dolphin/handler.js')
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../núcleo•dolphin/handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) { }
      if (restatConn) {
        const oldChats = sock.chats
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        sock = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
      }
      if (!isInit) {
        sock.ev.off("messages.upsert", sock.handler)
        sock.ev.off("connection.update", sock.connectionUpdate)
        sock.ev.off('creds.update', sock.credsUpdate)
      }
      sock.handler = handler.handler.bind(sock)
      sock.connectionUpdate = connectionUpdate.bind(sock)
      sock.credsUpdate = saveCreds.bind(sock, true)
      sock.ev.on("messages.upsert", sock.handler)
      sock.ev.on("connection.update", sock.connectionUpdate)
      sock.ev.on("creds.update", sock.credsUpdate)
      isInit = false
      return true
    }
    creloadHandler(false)
  })
}