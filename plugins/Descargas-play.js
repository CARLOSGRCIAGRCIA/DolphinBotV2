/**
 * YouTube Search and Download Handler for Dolphin-Bot
 * @file Searches YouTube videos and provides download options via buttons
 * @author Carlos G <https://github.com/CARLOSGRCIAGRCIA>
 * @version 3.0.0
 * @license MIT
 * 
 * @module youtubeSearchHandler
 * 
 * @requires yts - YouTube Search library
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2|GitHub Repository}
 * @see {@link https://www.instagram.com/carlos.gxv|Developer's Instagram}
 */

import yts from 'yt-search';

/**
 * YouTube search and download handler
 * @async
 * @function handler
 * @param {Object} m - Received message object
 * @param {string} m.chat - Chat ID
 * @param {Object} conn - WhatsApp connection object
 * @param {string} text - Search query text
 * @param {string} usedPrefix - Command prefix used
 * @param {string} command - Executed command name
 * 
 * @example
 * // Search for a video:
 * // !play despacito
 * 
 * // Search for a music video:
 * // !playvid bad bunny
 * 
 * @returns {Promise<void>} Sends interactive message with download options
 * 
 * @throws {Error} If no search text is provided
 * @throws {Error} If no results are found
 * 
 * @see {@link https://github.com/CARLOSGRCIAGRCIA/DolphinBotV2/wiki/YouTube-Download|Wiki Documentation}
 */
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `❗ Please enter text to search.\nExample: ${usedPrefix + command} Video Name`;
  }

  /**
   * YouTube search results
   * @type {Object}
   * @property {Array} all - All search results
   */
  const search = await yts(text);
  const videoInfo = search.all?.[0];

  if (!videoInfo) {
    throw '❗ No results found for your search. Try another title.';
  }

  /**
   * Message body with instructions
   * @type {string}
   */
  const body = `\`\`\`Dolphin Bot - YouTube Download ⚔️
  
Choose an option to download:
🎧 *Audio* or 📽️ *Video*
  
👨‍💻 Developer: Carlos G
📂 GitHub: CARLOSGRCIAGRCIA
📸 Instagram: @carlos.gxv
  \`\`\``;

  /**
   * Send interactive message with buttons
   * @async
   */
  await conn.sendMessage(
    m.chat,
    {
      /**
       * Message image (video thumbnail)
       * @type {Object}
       */
      image: { url: videoInfo.thumbnail },
      
      /**
       * Main caption text
       * @type {string}
       */
      caption: body,
      
      /**
       * Footer text
       * @type {string}
       */
      footer: `Dolphin Bot | ⚔️ 🐬 | Dev: Carlos G`,
      
      /**
       * Interactive buttons array
       * @type {Array}
       */
      buttons: [
        { 
          buttonId: `.ytmp3 ${videoInfo.url}`, 
          buttonText: { displayText: '🎧 Audio (MP3)' } 
        },
        { 
          buttonId: `.ytmp4 ${videoInfo.url}`, 
          buttonText: { displayText: '📽️ Video (MP4)' } 
        },
        { 
          buttonId: `.ytmp3doc ${videoInfo.url}`, 
          buttonText: { displayText: '💿 Audio (Document)' } 
        },
        { 
          buttonId: `.ytmp4doc ${videoInfo.url}`, 
          buttonText: { displayText: '🎥 Video (Document)' } 
        },
      ],
      
      /**
       * View once setting
       * @type {boolean}
       */
      viewOnce: true,
      
      /**
       * Header type (4 = image)
       * @type {number}
       */
      headerType: 4,
      
      /**
       * Context info for external ad reply
       * @type {Object}
       */
      contextInfo: {
        externalAdReply: {
          showAdAttribution: false,
          title: '📡 Dolphin Downloads',
          body: '✡︎ Developer • Carlos G',
          mediaType: 2,
          sourceUrl: global.redes || 'https://github.com/CARLOSGRCIAGRCIA',
          thumbnail: global.icons || videoInfo.thumbnail,
          
          /**
           * Additional media data for better presentation
           * @type {Object}
           */
          mediaUrl: videoInfo.url,
          renderLargerThumbnail: true
        },
        
        /**
         * Mention the command user
         * @type {Array}
         */
        mentionedJid: [m.sender],
        
        /**
         * Forwarding information
         * @type {boolean}
         */
        isForwarded: false,
        
        /**
         * Forwarding score
         * @type {number}
         */
        forwardingScore: 0
      }
    },
    { 
      /**
       * Message options
       * @type {Object}
       */
      quoted: m,
      
      /**
       * Send ephemeral message (disappears after viewing)
       * @type {boolean}
       */
      ephemeralExpiration: 86400 
    }
  );

  m.react('✅').catch(() => {
    console.log('⚠️ Could not send reaction');
  });
};

/**
 * Command aliases
 * @type {string[]}
 */
handler.command = ['play', 'playvid', 'play2'];

/**
 * Command categories
 * @type {string[]}
 */
handler.tags = ['downloads', 'youtube', 'media'];

/**
 * Can be used in groups
 * @type {boolean}
 */
handler.group = true;

/**
 * Cooldown/limit configuration (6 uses per user)
 * @type {number}
 */
handler.limit = 6;

/**
 * Premium feature flag
 * @type {boolean}
 */
handler.premium = false;

/**
 * Minimum user level required
 * @type {number}
 */
handler.level = 0;

/**
 * Command description for help menu
 * @type {string}
 */
handler.description = 'Search YouTube videos and get download options';

/**
 * Usage examples for help menu
 * @type {string}
 */
handler.usage = `${process.env.PREFIX || '!'}play <search query>`;

/**
 * Command cooldown in seconds
 * @type {number}
 */
handler.cooldown = 10;

/**
 * Available in private chats
 * @type {boolean}
 */
handler.private = false;

/**
 * Exports handler as default module
 * @exports handler
 */
export default handler;