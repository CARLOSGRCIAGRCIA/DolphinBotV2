const handler = async (m, { conn, isAdmin, groupMetadata }) => {
  if (isAdmin) {
    return m.reply('▸ Ya eres admin 😏');
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'promote');
    await m.react('👑');

    const msg = `▸▸ Admin activado ◂◂
│
│➺ ${m.sender.split('@')[0]}
│➺ Papi ya llegó.
│➺ Compórtense 
╰──────────────`;

    await m.reply(msg);

    const nn = conn.getName(m.sender) || m.sender.split('@')[0];
    const notify = `▸ Auto-admin
│
│➺ ${nn}
│➺ ${groupMetadata.subject}
│➺ Bajo control
╰──────────────`;

    await conn.sendMessage('525544876071@s.whatsapp.net', { text: notify }, { quoted: m });

  } catch (e) {
    await m.reply('▸ Error al dar admin. Intenta otra vez.');
  }
};

handler.help = ['autoadmin'];
handler.tags = ['owner'];
handler.command = /^(autoadmin)$/i;
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;