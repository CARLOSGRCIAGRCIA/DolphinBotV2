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
global.botNumber = ''; // Ejemplo: 521234567890

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.owner = [
  ['5219516526675', '🜲 𝗖𝗿𝗲𝗮𝗱𝗼𝗿 👻', true],
  ['5217971289909'],
  ['5217971282613', '', false],
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
global.gt = '͟͞𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏 🐬͟͞';
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
      itemCount: -999999, 
      status: 1, 
      surface: 1, 
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

global.APIKeys = global.APIKeys || {};
global.APIs = global.APIs || {};

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

// OPTIMIZACIÓN DE CACHÉ
// Configuración de timeouts y límites de caché
global.cacheTimeout = 1000 * 60 * 5; // 5 minutos
global.maxCacheSize = 500; // Límite de elementos en caché

// Caché de metadata de grupos con gestión mejorada
class CacheManager {
  constructor(maxSize = 500, timeout = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.timeout = timeout;
    this.accessCount = new Map();
  }

  set(key, value) {
    // Si el caché está lleno, eliminar el menos usado
    if (this.cache.size >= this.maxSize) {
      const leastUsed = Array.from(this.accessCount.entries())
        .sort((a, b) => a[1] - b[1])[0];
      if (leastUsed) {
        this.cache.delete(leastUsed[0]);
        this.accessCount.delete(leastUsed[0]);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Verificar si el elemento ha expirado
    if (Date.now() - item.timestamp > this.timeout) {
      this.cache.delete(key);
      this.accessCount.delete(key);
      return null;
    }

    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() - item.timestamp > this.timeout) {
      this.cache.delete(key);
      this.accessCount.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key) {
    this.accessCount.delete(key);
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }

  get size() {
    return this.cache.size;
  }

  // Limpiar elementos expirados
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.timeout) {
        this.cache.delete(key);
        this.accessCount.delete(key);
      }
    }
  }
}

// Instanciar caché managers
global.groupMetadataCache = new CacheManager(500, 5 * 60 * 1000);
global.lidCache = new CacheManager(1000, 10 * 60 * 1000);
global.userCache = new CacheManager(1000, 10 * 60 * 1000);

// Variables de control para escritura de DB
global.dbWritePending = false;
global.lastBio = null;

// Limpieza periódica de caché optimizada
setInterval(() => {
  try {
    if (global.groupMetadataCache) {
      const beforeSize = global.groupMetadataCache.size;
      global.groupMetadataCache.cleanup();
      const afterSize = global.groupMetadataCache.size;
      
      if (beforeSize !== afterSize) {
        console.log(chalk.cyan(`[CACHE] Metadata de grupos limpiada: ${beforeSize} → ${afterSize}`));
      }
    }
    
    if (global.lidCache) {
      const beforeSize = global.lidCache.size;
      global.lidCache.cleanup();
      const afterSize = global.lidCache.size;
      
      if (beforeSize !== afterSize) {
        console.log(chalk.cyan(`[CACHE] LID cache limpiado: ${beforeSize} → ${afterSize}`));
      }
    }

    if (global.userCache) {
      const beforeSize = global.userCache.size;
      global.userCache.cleanup();
      const afterSize = global.userCache.size;
      
      if (beforeSize !== afterSize) {
        console.log(chalk.cyan(`[CACHE] User cache limpiado: ${beforeSize} → ${afterSize}`));
      }
    }

    // Forzar garbage collection si está disponible
    if (global.gc) {
      global.gc();
      console.log(chalk.cyan('[CACHE] Garbage collection ejecutado'));
    }
  } catch (error) {
    console.error(chalk.red('[CACHE] Error en limpieza:'), error);
  }
}, 10 * 60 * 1000); // Cada 10 minutos

// Limpieza agresiva cada hora
setInterval(() => {
  try {
    if (global.groupMetadataCache) {
      global.groupMetadataCache.clear();
      console.log(chalk.yellow('[CACHE] Metadata cache completamente limpiado'));
    }
    
    if (global.userCache) {
      global.userCache.clear();
      console.log(chalk.yellow('[CACHE] User cache completamente limpiado'));
    }
  } catch (error) {
    console.error(chalk.red('[CACHE] Error en limpieza agresiva:'), error);
  }
}, 60 * 60 * 1000); // Cada hora

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'núcleo•dolphin/config.js\''));
  import(`${file}?update=${Date.now()}`);
});