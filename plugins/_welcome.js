import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let defaultImage = 'https://files.catbox.moe/5efgl2.webp'

  if (chat.welcome) {
    let img
    try {
      let pp = await conn.profilePictureUrl(who, 'image')
      img = await (await fetch(pp)).buffer()
    } catch {
      img = await (await fetch(defaultImage)).buffer()
    }

    let defaultWelcome = `✨ Bienvenido/a ✨

${taguser}
*${groupMetadata.subject}*

Un nuevo miembro se une a la comunidad. Esperamos que tu estancia sea agradable y puedas compartir momentos increíbles con nosotros.

No olvides leer las reglas del grupo y respetar a todos los miembros.

¡Disfruta tu estadía! 🌊`

    let defaultLeave = `👋 Despedida

${taguser}
*${groupMetadata.subject}*

Un miembro ha decidido abandonar el grupo. Le deseamos lo mejor en su camino.

Que encuentres lo que buscas. Hasta pronto. 🌅`

    let defaultKick = `⚠️ Expulsión

${taguser}
*${groupMetadata.subject}*

Un miembro ha sido removido del grupo por incumplir las normas establecidas.

Mantengamos un ambiente de respeto para todos. 🛡️`

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = chat.customWelcome || defaultWelcome
      bienvenida = bienvenida
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })

    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let leave = chat.customLeave || defaultLeave
      leave = leave
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: leave, mentions: [who] })

    } else if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      let kick = chat.customKick || defaultKick
      kick = kick
        .replace(/@user/gi, taguser)
        .replace(/{group}/gi, groupMetadata.subject)

      await conn.sendMessage(m.chat, { image: img, caption: kick, mentions: [who] })
    }
  }

  return true
}