import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─✞─ CONFIGURACIÓN GLOBAL ─✞─*

// BETA: Número del bot
global.botNumber = ''; // Ejemplo: 525568138672
//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.owner = [
  ['5219516526675', '🜲 𝗖𝗿𝗲𝗮𝗱𝗼𝗿 👻', true],
  ['5217971289909'],
  ['5217971282613', '', false], // Espacios opcionales
  ['573244278232', 'neji.x.s', true],
  ['', '', false]
];
global.mods = ['5215544876071'];
global.suittag = ['5215544876071'];
global.prems = ['5215544876071'];

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.libreria = 'Baileys';
global.baileys = 'V 6.7.9';
global.languaje = 'Español';
global.vs = '2.2.0';
global.vsJB = '5.0';
global.nameqr = 'Dolphin-bot';
global.sessions = 'DolphinBotSession';
global.jadi = 'dolphinJadiBot';
global.blackJadibts = true;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.packsticker = `
  𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 𝙭 𝘾𝘼𝙍𝙇𝙊𝙎 𝙂`;

global.packname = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬';

global.author = `
♾━━━━━━━━━━━━━━━♾`;
//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.wm = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬';
global.titulowm = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬';
global.igfg = '𝘾𝘼𝙍𝙇𝙊𝙎 𝙂'
global.botname = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ the Legends '
global.textbot = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 𝙭 𝘾𝘼𝙍𝙇𝙊𝙎 𝙂'
global.gt = '͟͞𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬͟͞';
global.namechannel = '𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 𝙭 𝘾𝘼𝙍𝙇𝙊𝙎 𝙂'
// Moneda interna
global.monedas = 'monedas';

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.gp1 = 'https://chat.whatsapp.com/EdND7QAHE9w0XPYGx2ZfQw';
global.gp2 = 'https://chat.whatsapp.com/EdND7QAHE9w0XPYGx2ZfQw';
global.comunidad1 = 'https://whatsapp.com/channel/0029VbAfBzIKGGGKJWp5tT3L';
global.channel = 'https://whatsapp.com/channel/0029VbAfBzIKGGGKJWp5tT3L';
global.cn = global.channel;
global.yt = 'https://www.youtube.com/@Carlos.dev01';
global.md = 'https://github.com/CARLOSGRCIAGRCIA/DolphinBotV1';
global.correo = 'carlosgarciagarcia3c@gmail.com';

global.catalogo = fs.readFileSync(new URL('../src/img/Dolphin.png', import.meta.url));
global.photoSity = [global.catalogo];

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.estilo = { 
  key: {  
    fromMe: false, 
    participant: '0@s.whatsapp.net', 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: global.packname, 
      orderTitle: 'Bang', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

global.ch = { ch1: "" };
global.rcanal = global.ch.ch1;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.multiplier = 69;
global.maxwarn = 3;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'núcleo•dolphin/config.js\''));
  import(`${file}?update=${Date.now()}`);
});
