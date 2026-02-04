/**
 * Rules Module for Dolphin-Bot
 * @file Displays images with specific rules for different modes/competitions
 * @author Carlos G <https://github.com/CARLOSGRCIAGRCIA>
 * @version 3.2.0
 * @license MIT
 * 
 * @module rulesHandler
 * 
 * @requires fs - File system module
 * @requires path - Path handling module
 * @requires url - URL handling module
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2|GitHub Repository}
 * @see {@link https://www.instagram.com/carlos.gxv|Developer's Instagram}
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Available rules configuration
 * @constant {Object} rulesConfig
 * @property {Object} clk - Configuration for clk/competition rules
 * @property {string} clk.imagePath - Path to clk rules image
 * @property {string} clk.name - Descriptive name
 * @property {string} clk.emoji - Representative emoji
 * @property {Object} vv2 - Configuration for VV2 rules
 * @property {string} vv2.imagePath - Path to vv2 rules image
 * @property {string} vv2.name - Descriptive name
 * @property {string} vv2.emoji - Representative emoji
 */
const rulesConfig = {
  clk: {
    imagePath: path.join(rootDir, 'src', 'img', 'clkrules.png'),
    name: 'clk / competition',
    emoji: '⚔️'
  },
  vv2: {
    imagePath: path.join(rootDir, 'src', 'img', 'vv2rules.png'),
    name: 'VV2',
    emoji: '🎮'
  }
};

/**
 * Rules command handler
 * @async
 * @function handler
 * @param {Object} m - Received message object
 * @param {string} m.chat - Chat ID
 * @param {Object} m.key - Message key information
 * @param {Object} conn - WhatsApp connection object
 * @param {string[]} args - Command arguments
 * @param {string} usedPrefix - Command prefix used
 * @param {string} command - Executed command name
 * 
 * @example
 * // To view CLK rules:
 * // !rules clk
 * 
 * // To view VV2 rules:
 * // !rules vv2
 * 
 * @returns {Promise<void>} No explicit return value, sends messages to chat
 * 
 * @throws {Error} If there are issues reading the image file
 * @throws {Error} If specified image is not found
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/wiki/Rules-Command|Wiki Documentation}
 */
let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { 
      react: { text: '📋', key: m.key } 
    }).catch(() => {});

    const ruleType = args[0]?.toLowerCase();

    /**
     * Validation of requested rules type
     * @type {string|null}
     */
    if (!ruleType || !rulesConfig[ruleType]) {
      const availableRules = Object.keys(rulesConfig)
        .map(key => `${rulesConfig[key].emoji} *${key.toUpperCase()}*`)
        .join('\n');

      return conn.reply(
        m.chat,
        `╔═══════════════════════╗
║   📋 DOLPHIN RULES   ║
╚═══════════════════════╝

⚠️ Specify the rules type:

${availableRules}

*Usage:* ${usedPrefix + command} <type>

*Example:* 
• ${usedPrefix + command} clk
• ${usedPrefix + command} vv2

🐬 *DOLPHIN BOT SYSTEM*
👨‍💻 *Developer:* Carlos G
📂 *GitHub:* CARLOSGRCIAGRCIA
📸 *Instagram:* @carlos.gxv`,
        m
      );
    }

    /**
     * Selected configuration
     * @type {Object}
     */
    const config = rulesConfig[ruleType];

    if (!fs.existsSync(config.imagePath)) {
      console.log(`❌ Path not found: ${config.imagePath}`);
      return conn.reply(
        m.chat,
        `❌ Error: Could not find the ${config.name} rules image.

🔍 *Path searched:* ${config.imagePath}

📞 *Contact administrator:*
👨‍💻 Carlos G
📂 GitHub: CARLOSGRCIAGRCIA
📸 Instagram: @carlos.gxv`,
        m
      );
    }

    console.log(`✓ Image found: ${config.imagePath}`);

    /**
     * Buffer containing rules image
     * @type {Buffer}
     */
    const imageBuffer = fs.readFileSync(config.imagePath);
    console.log(`✓ Image read successfully, size: ${imageBuffer.length} bytes`);

    /**
     * Image sending with description
     * @async
     */
    await conn.sendFile(
      m.chat,
      imageBuffer,
      `rules-${ruleType}.png`,
      `\n> *${config.name} Rules By DolphinBot* 🐬

👨‍💻 *Developer:* Carlos G
📂 *Repository:* github.com/CARLOSGRCIAGRCIA
📸 *Instagram:* @carlos.gxv

⚡ *Dolphin Bot v2.2.0*`,
      m
    );

    await conn.sendMessage(m.chat, { 
      react: { text: '✅', key: m.key } 
    }).catch(() => {});

  } catch (error) {
    /**
     * General error handling
     * @type {Error}
     */
    console.error('❌ Error in rules command:', error);
    
    await conn.reply(
      m.chat,
      `❌ *Error displaying rules*

*Command:* ${usedPrefix}rules <type>
*Available types:* clk, vv2

📞 *Technical Support:*
👨‍💻 Carlos G
📸 Instagram: @carlos.gxv
📂 GitHub: CARLOSGRCIAGRCIA

🐬 *Dolphin Bot System*`,
      m
    );
  }
};

/**
 * Command help information
 * @type {string[]}
 */
handler.help = ['rules', 'reglas'];

/**
 * Command categories
 * @type {string[]}
 */
handler.tags = ['info', 'group', 'rules'];

/**
 * Commands that trigger this handler
 * @type {string[]}
 */
handler.command = ['rules', 'reglas', 'rule', 'regla'];

/**
 * Indicates command requires previous registration
 * @type {boolean}
 */
handler.register = true;

/**
 * Indicates command can be used in groups
 * @type {boolean}
 */
handler.group = true;

/**
 * Exports handler as default module
 * @exports handler
 */
export default handler;