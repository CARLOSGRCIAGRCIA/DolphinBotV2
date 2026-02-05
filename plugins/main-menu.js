import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const charset = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' }
const textCyberpunk = t => t.toLowerCase().replace(/[a-z]/g, c => charset[c])

const tags = {
  main: textCyberpunk('sistema'),
  group: textCyberpunk('grupos'),
  serbot: textCyberpunk('sub bots')
}

const defaultMenu = {
  before: `
⧼⋆꙳• *REGISTRO DOLPHIN* ⋆꙳•⧽

> 🐬 𝙉𝙤𝙢𝙗𝙧𝙚   » %name
> ⚙️ 𝙉𝙞𝙫𝙚𝙡     » %level
> ⚡ 𝙀𝙭𝙥        » %exp / %maxexp
> 🌐 𝙈𝙤𝙙𝙤      » %mode
> ⏳ 𝘼𝙘𝙩𝙞𝙫𝙤   » %muptime
> 👥 𝙐𝙨𝙪𝙖𝙧𝙞𝙤𝙨 » %totalreg

🤖 » 𝐌𝐄𝐍𝐔 𝐃𝐎𝐋𝐏𝐇𝐈𝐍 𝐁𝐎𝐓 «
👑 » 𝗢𝗽𝗲𝗿𝗮𝗱𝗼𝗿:—͟͟͞͞ 𝐂𝐚𝐫𝐥𝐨𝐬 𝐆 «
%readmore
`.trimStart(),
  header: '\n⧼⋆꙳•〔 🐬 %category 〕⋆꙳•⧽',
  body: '> 🐬 %cmd',
  footer: '╰⋆꙳•❅‧*₊⋆꙳︎‧*❆₊⋆╯',
  after: '\n⌬ 𝗗𝗢𝗟𝗣𝗛𝗜𝗡 𝗠𝗘𝗡𝗨 🌊 - Sistema ejecutado con éxito.'
}

const menuDir = './media/menu'
fs.mkdirSync(menuDir, { recursive: true })

const getMenuMediaFile = jid =>
  path.join(menuDir, `menuMedia_${jid.replace(/[:@.]/g, '_')}.json`)

const loadMenuMedia = jid => {
  const file = getMenuMediaFile(jid)
  if (!fs.existsSync(file)) return {}
  try { return JSON.parse(fs.readFileSync(file)) } catch { return {} }
}

// Función mejorada para fetch con timeout y fallback
const fetchBuffer = async (url, timeout = 8000, fallbackPath = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`⚠️ Error fetching ${url}: ${error.message}`);
    
    // Intentar usar fallback si existe
    if (fallbackPath && fs.existsSync(fallbackPath)) {
      console.log(`✓ Usando fallback: ${fallbackPath}`);
      return fs.readFileSync(fallbackPath);
    }
    
    // Si no hay fallback, retornar buffer pequeño placeholder
    return Buffer.from([]);
  }
}

// Cargar medios con fallbacks
let defaultThumb, defaultVideo;

try {
  console.log('📥 Cargando thumbnail del menú...');
  defaultThumb = await fetchBuffer(
    'https://files.catbox.moe/2p3mon.png',
    8000,
    './src/img/Dolphin.png'
  );
  
  if (!defaultThumb || defaultThumb.length === 0) {
    throw new Error('Thumbnail vacío');
  }
  
  console.log('✓ Thumbnail cargado correctamente');
} catch (error) {
  console.log('⚠️ Error cargando thumbnail, usando local');
  try {
    defaultThumb = fs.readFileSync('./src/img/Dolphin.png');
  } catch (e) {
    console.log('❌ No se pudo cargar imagen local, usando placeholder');
    // Crear un buffer placeholder muy pequeño (1x1 pixel PNG transparente)
    defaultThumb = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);
  }
}

try {
  console.log('📥 Cargando video del menú...');
  defaultVideo = await fetchBuffer(
    'https://files.catbox.moe/nqw5zd.mp4',
    8000,
    './src/media/menu.mp4'
  );
  
  if (!defaultVideo || defaultVideo.length === 0) {
    throw new Error('Video vacío');
  }
  
  console.log('✓ Video cargado correctamente');
} catch (error) {
  console.log('⚠️ Error cargando video, usando local o placeholder');
  try {
    if (fs.existsSync('./src/media/menu.mp4')) {
      defaultVideo = fs.readFileSync('./src/media/menu.mp4');
    } else if (fs.existsSync('./media/menu.mp4')) {
      defaultVideo = fs.readFileSync('./media/menu.mp4');
    } else {
      // Usar thumbnail como video si no hay video disponible
      defaultVideo = defaultThumb;
    }
  } catch (e) {
    console.log('❌ No se pudo cargar video, usando thumbnail');
    defaultVideo = defaultThumb;
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🐬', key: m.key } }).catch(() => {})

    const botJid = conn.user.jid
    const menuMedia = loadMenuMedia(botJid)
    const menu = global.subBotMenus?.[botJid] || defaultMenu

    const user = global.db.data.users[m.sender] || { level: 0, exp: 0 }
    const { min, xp } = xpRange(user.level, global.multiplier)

    const replace = {
      name: await conn.getName(m.sender),
      level: user.level,
      exp: user.exp - min,
      maxexp: xp,
      totalreg: Object.keys(global.db.data.users).length,
      mode: global.opts.self ? 'Privado' : 'Público',
      muptime: clockString(process.uptime() * 1000),
      readmore: String.fromCharCode(8206).repeat(4001)
    }

    const help = Object.values(global.plugins || {})
      .filter(p => !p.disabled)
      .map(p => ({
        help: [].concat(p.help || []),
        tags: [].concat(p.tags || []),
        prefix: 'customPrefix' in p
      }))

    for (const { tags: tg } of help)
      for (const t of tg)
        if (t && !tags[t]) tags[t] = textCyberpunk(t)

    const text = [
      menu.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(p => p.tags.includes(tag))
          .flatMap(p => p.help.map(c =>
            menu.body.replace('%cmd', p.prefix ? c : usedPrefix + c)
          )).join('\n')
        return `${menu.header.replace('%category', tags[tag])}\n${cmds}\n${menu.footer}`
      }),
      menu.after
    ].join('\n').replace(/%(\w+)/g, (_, k) => replace[k] ?? '')

    // Cargar thumbnails con fallbacks
    let thumb = defaultThumb;
    if (menuMedia.thumbnail && fs.existsSync(menuMedia.thumbnail)) {
      try {
        thumb = fs.readFileSync(menuMedia.thumbnail)
      } catch (e) {
        console.log('⚠️ Error leyendo thumbnail personalizado, usando default')
      }
    }

    // Cargar video con fallbacks
    let video = defaultVideo;
    if (menuMedia.video && fs.existsSync(menuMedia.video)) {
      try {
        video = fs.readFileSync(menuMedia.video)
      } catch (e) {
        console.log('⚠️ Error leyendo video personalizado, usando default')
      }
    }

    // Hacer thumbnail único por bot
    const uniqueThumb = Buffer.concat([thumb, Buffer.from(botJid)])

    // Enviar mensaje con manejo de errores
    try {
      await conn.sendMessage(m.chat, {
        video,
        gifPlayback: true,
        jpegThumbnail: uniqueThumb,
        caption: text,
        footer: '🐬 DOLPHIN BOT SYSTEM 🌊',
        buttons: [
          { buttonId: `${usedPrefix}menurpg`, buttonText: { displayText: '🏛️ M E N U R P G' }, type: 1 },
          { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🕹 ＳＥＲＢＯＴ' }, type: 1 }
        ],
        contextInfo: {
          externalAdReply: {
            title: menuMedia.menuTitle || '𝕯𝖔𝖑𝖕𝖍𝖎𝖓 𝕭𝖔𝖙 | 𝕯𝖔𝖑𝖕𝖍𝖎𝖓 𝕰𝖉𝖎𝖙𝖎𝖔𝖓 🐬',
            body: 'ִ┊࣪ ˖𝐃𝐞𝐯 • 𝐂𝐚𝐫𝐥𝐨𝐬 𝐆 🌊',
            thumbnail: uniqueThumb,
            sourceUrl: 'https://github.com/CARLOSGRCIAGRCIA/DolphinV2',
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })
    } catch (error) {
      console.error('❌ Error enviando menú con video, intentando solo texto:', error.message)
      
      // Fallback: enviar solo texto con imagen
      try {
        await conn.sendMessage(m.chat, {
          image: uniqueThumb,
          caption: text,
          footer: '🐬 DOLPHIN BOT SYSTEM 🌊',
          contextInfo: {
            externalAdReply: {
              title: menuMedia.menuTitle || '𝕯𝖔𝖑𝖕𝖍𝖎𝖓 𝕭𝖔𝖙 | 𝕯𝖔𝖑𝖕𝖍𝖎𝖓 𝕰𝖉𝖎𝖙𝖎𝖔𝖓 🐬',
              body: 'ִ┊࣪ ˖𝐃𝐞𝐯 • 𝐂𝐚𝐫𝐥𝐨𝐬 𝐆 🌊',
              thumbnail: uniqueThumb,
              sourceUrl: 'https://github.com/CARLOSGRCIAGRCIA/DolphinV2',
              mediaType: 1,
              renderLargerThumbnail: false
            }
          }
        }, { quoted: m })
      } catch (error2) {
        console.error('❌ Error enviando menú con imagen, enviando solo texto:', error2.message)
        
        // Fallback final: solo texto
        await conn.reply(m.chat, text, m)
      }
    }
  } catch (error) {
    console.error('❌ Error crítico en comando menu:', error)
    await conn.reply(m.chat, `❌ Error al mostrar el menú. Intenta de nuevo con: ${usedPrefix}menu`, m)
  }
}

handler.help = ['menu', 'menú']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'ayuda']
handler.register = false;
export default handler

const clockString = ms =>
  [3600000, 60000, 1000].map((v, i) =>
    String(Math.floor(ms / v) % (i ? 60 : 99)).padStart(2, '0')
  ).join(':')