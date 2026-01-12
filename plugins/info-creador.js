import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let nomorown = '5219516526675' // Propietario
  let bio = (await conn.fetchStatus(nomorown + '@s.whatsapp.net').catch(_ => {}))?.status || 'Propietario de Dolphin Bot'
  let biobot = (await conn.fetchStatus(conn.user.jid).catch(_ => {}))?.status || 'Bot Oficial Dolphin'

  await sendContactArray(conn, m.chat, [
    [`${nomorown}`, `🥷🏻 Propietario`, `𝘾𝙖𝙧𝙡𝙤𝙨 𝙂`, dev, correo, `CDMX`, `${global.yt}`, bio],
    [`${conn.user.jid.split('@')[0]}`, `Dolphin Bot 🤖`, `${packname}`, `📵 No Hacer Spam`, correo, `CDMX`, md, biobot],
    [`5219516526675`, `Asistente`, `Bot Helper`, 'Soporte', correo, `CDMX`, md, biobot]
  ], m)

  throw false
}

handler.help = ["creador","owner"]
handler.tags = ["info"]
handler.command = ['owner','creador']
export default handler

async function sendContactArray(conn, jid, data, quoted, options) {
  if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
  let contacts = []

  for (let [number, name, org, label, email, region, url, note] of data) {
    number = number.replace(/[^0-9]/g, '')
    
    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:${name.replace(/\n/g, '\\n')};;;;
FN:${name.replace(/\n/g, '\\n')}
ORG:${org}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
EMAIL;type=INTERNET:${email}
ADR:;;${region};;;;
URL:${url}
NOTE:${note}
END:VCARD`.trim()
    
    contacts.push({ vcard, displayName: name })
  }

  return await conn.sendMessage(
    jid,
    {
      contacts: {
        displayName: (contacts.length > 1 ? `${contacts.length} contactos` : contacts[0].displayName) || null,
        contacts,
      }
    },
    {
      quoted,
      ...options
    }
  )
}