//código adaptado para DolphinBot 🐬
//basado en el trabajo original de The Carlos 👑
//no olvides dejar créditos 

import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'

const imagen1 = 'https://files.catbox.moe/7sc3os.jpg'

var handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0]
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender

  let pp
  try {
    pp = await conn.profilePictureUrl(who, 'image')
  } catch {
    pp = imagen1
  }

  let user = global.db.data.users[m.sender]
  if (!user) {
    global.db.data.users[m.sender] = {
      premium: false,
      level: 0,
      cookies: 0,
      exp: 0,
      lastclaim: 0,
      registered: false,
      regTime: -1,
      age: 0,
      role: '⭑ Delfín Novato ⭑'
    }
    user = global.db.data.users[m.sender]
  }

  let { premium, level, exp, registered, role } = user
  let username = await conn.getName(who)

  let animacion = `
〘 *Sistema Marino* 〙🐬

🔒 Detectando ondas marinas...
⏳ Analizando perfil del delfín...
💠 Sincronizando con el océano...

🌊🌊🌊 𝙰𝙲𝚃𝙸𝚅𝙰𝙲𝙸𝙾́𝙽 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙰 🌊🌊🌊

*El perfil marino se ha abierto...*
`.trim()

  await conn.sendMessage(m.chat, { text: animacion }, { quoted: m })

  let noprem = `
『 ＰＥＲＦＩＬ ＭＡＲＩＮＯ 』🐚

🐬 *Delfín:* ${username}
🆔 *Identificador:* @${who.replace(/@.+/, '')}
📜 *Registrado:* ${registered ? '✅ Activado' : '❌ No'}

🌊 *Estado Marino:*
⚡ *Nivel:* ${level}
✨ *Experiencia:* ${exp}
📈 *Rango:* ${role}
🔮 *Premium:* ❌ No activo

🐚 *Tipo:* Delfín Común 🐬
🔒 *Habilidad:* Desconocida

📌 Mejora tu rango para desbloquear más habilidades...

━━━━━━━━━━━━━━━━━━
`.trim()

  let prem = `
🌀〘 𝐌𝐎𝐃𝐎 𝐎𝐂𝐄́𝐀𝐍𝐈𝐂𝐎: *𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎* 〙🌀

🌊 ＤＥＬＦÍＮ ＳＵＰＲＥＭＯ 』

🐋 *Delfín Élite:* ${username}
🧿 *ID:* @${who.replace(/@.+/, '')}
✅ *Registrado:* ${registered ? 'Sí' : 'No'}
👑 *Rango:* 🔱 *Guardián del Océano*

🔮 *Energía Marina:*
⚡ *Nivel:* ${level}
🌟 *Experiencia:* ${exp}
🪄 *Rango Acuático:* ${role}
💠 *Estado Premium:* ✅ ACTIVADO

🐬 *Tipo:* ☯️ Delfín Legendario de 5 Aletas
🔥 *Modo Especial:* ✦ *Despertar del Océano Profundo*
🧩 *Habilidad:* Impulso Marino & Sonar Supremo

📜 *Habilidad Desbloqueada:* 
❖ 「𝙳𝚘𝚕𝚙𝚑𝚒𝚗 𝚃𝚜𝚞𝚗𝚊𝚖𝚒 🌊」
   ↳ Ola masiva que domina las aguas.

📔 *Nota:* Este delfín ha conquistado todos los océanos... 🌊

🌊⟣══════════════⟢🌊
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: premium ? prem : noprem,
    mentions: [who]
  }, { quoted: m })
}

handler.help = ['profile']
handler.register = true
handler.group = true
handler.tags = ['rg']
handler.command = ['profile', 'perfil']
export default handler