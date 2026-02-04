import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const rulesConfig = {
  clk: {
    imagePath: path.join(rootDir, 'src', 'img', 'clkrules.png'),
    name: 'clk / compe',
    emoji: '⚔️'
  },
  vv2: {
    imagePath: path.join(rootDir, 'src', 'img', 'vv2rules.png'),
    name: 'VV2',
    emoji: '🎮'
  }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { 
      react: { text: '📋', key: m.key } 
    }).catch(() => {})

    const ruleType = args[0]?.toLowerCase()

    if (!ruleType || !rulesConfig[ruleType]) {
      const availableRules = Object.keys(rulesConfig)
        .map(key => `${rulesConfig[key].emoji} *${key.toUpperCase()}*`)
        .join('\n')

      return conn.reply(
        m.chat,
        `╔═══════════════════════╗
║   📋 REGLAS DOLPHIN   ║
╚═══════════════════════╝

⚠️ Especifica el tipo de reglas:

${availableRules}

*Uso:* ${usedPrefix + command} <tipo>

*Ejemplo:* 
• ${usedPrefix + command} clk
• ${usedPrefix + command} vv2

🐬 *DOLPHIN BOT SYSTEM*`,
        m
      )
    }

    const config = rulesConfig[ruleType]

    if (!fs.existsSync(config.imagePath)) {
      console.log(`❌ Ruta no encontrada: ${config.imagePath}`)
      return conn.reply(
        m.chat,
        `❌ Error: No se encontró la imagen de reglas ${config.name}.\n\nRuta: ${config.imagePath}\n\nContacta al administrador del bot.`,
        m
      )
    }

    console.log(`✓ Imagen encontrada: ${config.imagePath}`)

    const imageBuffer = fs.readFileSync(config.imagePath)
    console.log(`✓ Imagen leída correctamente, tamaño: ${imageBuffer.length} bytes`)

    await conn.sendFile(
      m.chat,
      imageBuffer,
      `reglas-${ruleType}.png`,
      `\n> *Reglas ${config.name} By DolphinBot 🐬 Carlos G*`,
      m
    )

    await conn.sendMessage(m.chat, { 
      react: { text: '✅', key: m.key } 
    }).catch(() => {})

  } catch (error) {
    console.error('❌ Error en comando rules:', error)
    await conn.reply(
      m.chat,
      `❌ Error al mostrar las reglas. Intenta de nuevo con: ${usedPrefix}rules <tipo>`,
      m
    )
  }
}

handler.help = ['rules', 'reglas']
handler.tags = ['info', 'group']
handler.command = ['rules', 'reglas', 'rule', 'regla']
handler.register = true

export default handler