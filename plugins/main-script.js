const handler = async (m, { conn }) => {
  const texto = `
 _*𝕯𝕺𝕷𝕻𝕳𝕴𝕹 𝕭𝕺𝕿 *_ 🥷

\`\`\`Repositorio OFC:\`\`\`
https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2 

> 🌟 Deja tu estrellita ayudaría mucho :D

🔗 *Grupo oficial del bot:* https://chat.whatsapp.com/LfeYIFkvzZtJ8hQCYwqI1W?mode=ac_t
  `.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['script']
handler.tags = ['info']
handler.command = ['script']

export default handler
