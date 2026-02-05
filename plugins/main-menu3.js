//código adaptado para DolphinBot 🐬
//basado en el trabajo original de The Carlos 👑
//no olvides dejar créditos 

let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const owners = global.owner.map(([id]) => id)
  const esLiderManada = owners.includes(m.sender)
  const tituloEspecial = esLiderManada ? '🔱 *LÍDER DE LA MANADA SUPREMO* 🔱\n' : ''

  const texto = `
╭━━━[ 🐬 *MENÚ RPG MARINO* ]━━━╮
┃ 🎮 *Comandos de Aventura Oceánica:*
┃ ⛏️ .minar → Extrae perlas y gana conchas
┃ 🎁 .daily → Reclama tu tesoro marino diario
┃ ❓ .acertijo → Resuelve acertijos y gana recompensas
┃ 🗡️ .robar2 @user → Intenta saquear a otro delfín
┃ 🛒 .comprar <nombre> → Compra un delfín para tu manada
┃ 📜 .mispersonajes → Revisa tus delfines marinos
┃ 🔮 .pjs → Lista de delfines disponibles
┃ 💼 .banco → Consulta tus ahorros oceánicos
┃ 💸 .enviar @user <cantidad> → Envía conchas a un aliado
┃ ⚔️ .duelo → Desafía a otro jugador en combate marino
┃ 🩸 .sacrificar → Sacrifica por poder del océano
┃ 🎲 .cajamisteriosa → Abre una caja con sorpresas acuáticas
┃ 🏆 .toppersonajes → Ranking de los mejores coleccionistas
┃ 🧟 .invasionzombie → Defiende el océano de las criaturas oscuras
┃ 🏹 .cazar → Caza criaturas marinas y gana recompensas
┃ 👑 .reinado → Lucha por el trono del océano
┃ ⚡ .cambiarexp → Intercambia tu exp por conchas
┃ 💰 .mismonedas → Revisa cuántas conchas tienes
┃ 🔨 .trabajar → Trabaja y gana conchas con esfuerzo
┃ 💀 .invocacion → Invoca a un delfín misterioso
┃ 🛡️ .antirobo → Protege tus waifus de los saqueadores
┃ ➕ .math <dificultad> → Reta tu mente con matemáticas
┃ 💘 .rw → Compra nuevas waifus
┃ 🎁 .c → Reclama tu waifu gratis
┃ 💖 .miswaifus → Consulta tu colección de waifus
┃ 🔓 .desbloquear → Desbloquea tu base por unos minutos
┃ 🫶 .robarwaifu → Intenta robar waifus de otros
┃ 📖 .listawaifus → Descubre todas las waifus disponibles
┃ 🥇 .topwaifus → Ve quién tiene las waifus más valiosas
╰━━━━━━━━━━━━━━━━━━━━⬯

╭━━━[ 📊 *TU ESTADO MARINO* ]━━━╮
┃ 🌊 Nivel Oceánico: *${user.level || 0}*
┃ ✨ Experiencia: *${user.exp || 0}*
┃ 🐚 Conchas: *${(user.monedas || 0).toLocaleString()} 🐚*
╰━━━━━━━━━━━━━━━━━━━━⬯

${tituloEspecial}
🌟 *Sigue nadando, aventurero marino*. ¡El océano espera tus hazañas!
💡 Usa los comandos sabiamente y alcanza la gloria de las profundidades.
`.trim()

  const url = 'https://files.catbox.moe/nvjw2u.png'

  await conn.sendMessage(m.chat, {
    image: { url },
    caption: texto
  }, { quoted: m })
}

handler.help = ['menurpg']
handler.tags = ['rpg']
handler.command = ['menurpg', 'rpgmenu', 'menur']
handler.register = false

export default handler