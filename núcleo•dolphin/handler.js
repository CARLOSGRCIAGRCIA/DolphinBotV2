import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
import { smsg } from "../lib/simple.js";
import { format } from "util";
import { fileURLToPath } from "url";
import path, { join } from "path";
import { unwatchFile, watchFile } from "fs";
import fs from "fs";
import chalk from "chalk";
import ws from "ws";

const { proto } = (await import("@whiskeysockets/baileys")).default;
const isNumber = (x) => typeof x === "number" && !isNaN(x);
const delay = (ms) =>
  isNumber(ms) && new Promise((resolve) => setTimeout(() => resolve(), ms));

export async function handler(chatUpdate) {
  this.msgqueque ||= [];
  this.uptime ||= Date.now();
  
  if (!chatUpdate) return;
  
  try {
    this.pushMessage(chatUpdate.messages).catch((err) => {
      console.error(chalk.red('[HANDLER] Error al pushear mensaje:'), err);
    });
  } catch (error) {
    console.error(chalk.red('[HANDLER] Error crítico en pushMessage:'), error);
    return;
  }

  let m = chatUpdate.messages[chatUpdate.messages.length - 1];
  if (!m) return;
  
  if (!global.db.data) {
    try {
      await global.loadDatabase();
    } catch (error) {
      console.error(chalk.red('[HANDLER] Error cargando database:'), error);
      return;
    }
  }

  try {
    m = smsg(this, m) || m;
    if (!m) return;
    
    if (m.isBaileys) return;
    
    global.mconn = m;
    m.exp = 0;
    m.monedas = false;

    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.chats) global.db.data.chats = {};
    if (!global.db.data.settings) global.db.data.settings = {};
    if (!global.db.data.stats) global.db.data.stats = {};

    try {
      let user = global.db.data.users[m.sender];
      
      if (!user || typeof user !== "object" || Array.isArray(user)) {
        console.log(chalk.yellow(`[HANDLER] Inicializando usuario: ${m.sender}`));
        global.db.data.users[m.sender] = {};
        user = global.db.data.users[m.sender];
      }

      const userDefaults = {
        exp: 0,
        monedas: 10,
        joincount: 1,
        diamond: 3,
        lastadventure: 0,
        lastclaim: 0,
        health: 100,
        crime: 0,
        lastcofre: 0,
        lastdiamantes: 0,
        lastpago: 0,
        lastcode: 0,
        lastcodereg: 0,
        lastduel: 0,
        lastmining: 0,
        muto: false,
        premium: false,
        premiumTime: 0,
        registered: false,
        followed: false,
        genre: "",
        birth: "",
        marry: "",
        description: "",
        packstickers: null,
        name: m.name || m.pushName || "Usuario",
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: "",
        role: "Nuv",
        banned: false,
        bannedReason: "",
        useDocument: false,
        level: 0,
        bank: 0,
        warn: 0,
        country: "",
        afinidad: "",
        nivelMagico: 0,
        grimorioColor: ""
      };

      for (const [key, defaultValue] of Object.entries(userDefaults)) {
        if (!(key in user)) {
          user[key] = defaultValue;
        } else if (typeof defaultValue === 'number' && !isNumber(user[key])) {
          console.log(chalk.yellow(`[HANDLER] Corrigiendo tipo numérico para ${key} del usuario ${m.sender}`));
          user[key] = defaultValue;
        } else if (typeof defaultValue === 'boolean' && typeof user[key] !== 'boolean') {
          console.log(chalk.yellow(`[HANDLER] Corrigiendo tipo booleano para ${key} del usuario ${m.sender}`));
          user[key] = defaultValue;
        } else if (typeof defaultValue === 'string' && typeof user[key] !== 'string') {
          console.log(chalk.yellow(`[HANDLER] Corrigiendo tipo string para ${key} del usuario ${m.sender}`));
          user[key] = defaultValue;
        }
      }

      if (typeof user.registered !== 'boolean') {
        console.log(chalk.yellow(`[HANDLER] Corrigiendo campo registered para ${m.sender}: ${user.registered} -> false`));
        user.registered = false;
      }
      
      if (typeof user.followed !== 'boolean') {
        user.followed = false;
      }

      let chat = global.db.data.chats[m.chat];
      if (!chat || typeof chat !== "object" || Array.isArray(chat)) {
        global.db.data.chats[m.chat] = {};
        chat = global.db.data.chats[m.chat];
      }
      
      const chatDefaults = {
        isBanned: false,
        sAutoresponder: "",
        welcome: true,
        autolevelup: false,
        autoAceptar: true,
        autosticker: false,
        autoRechazar: true,
        autoresponder: false,
        detect: true,
        antiBot: true,
        antiBot2: true,
        modoadmin: false,
        antiLink: true,
        reaction: false,
        nsfw: false,
        antifake: false,
        delete: false,
        expired: 0
      };

      for (const [key, defaultValue] of Object.entries(chatDefaults)) {
        if (!(key in chat)) {
          chat[key] = defaultValue;
        } else if (typeof defaultValue === 'number' && !isNumber(chat[key])) {
          chat[key] = defaultValue;
        } else if (typeof defaultValue === 'boolean' && typeof chat[key] !== 'boolean') {
          chat[key] = defaultValue;
        }
      }

      var settings = global.db.data.settings[this.user.jid];
      if (!settings || typeof settings !== "object") {
        global.db.data.settings[this.user.jid] = {};
        settings = global.db.data.settings[this.user.jid];
      }
      
      const settingsDefaults = {
        self: false,
        restrict: true,
        jadibotmd: true,
        antiPrivate: false,
        autoread: false,
        status: 0
      };

      for (const [key, defaultValue] of Object.entries(settingsDefaults)) {
        if (!(key in settings)) {
          settings[key] = defaultValue;
        }
      }
      
      global.db.data.settings[this.user.jid] = settings;
    } catch (e) {
      console.error(chalk.red('[HANDLER] Error inicializando datos:'), e);
    }

    if (typeof m.text !== "string") m.text = "";
    globalThis.setting = global.db.data.settings[this.user.jid];

    const detectwhat = m.sender.includes("@lid") ? "@lid" : "@s.whatsapp.net";
    const isROwner = [...(global.owner || []).map(([number]) => number)]
      .map((v) => v.replace(/\D/g, "") + detectwhat)
      .includes(m.sender);
    const isOwner = isROwner || m.fromMe;
    const isPrems = isROwner || global.db.data.users[m.sender].premiumTime > 0;
    const isMods = global.mods ? global.mods.map(v => v.replace(/\D/g, "") + detectwhat).includes(m.sender) : false;

    if (opts["queque"] && m.text && !isMods) {
      const queque = this.msgqueque;
      const previousID = queque[queque.length - 1];
      queque.push(m.id || m.key.id);
      
      if (queque.length > 100) queque.shift();
    }
    
    m.exp += Math.ceil(Math.random() * 10);
    let usedPrefix;
    let _user = global.db.data.users[m.sender];

    async function getLidFromJid(id, conn) {
      if (id.endsWith("@lid")) return id;
      
      if (global.lidCache && global.lidCache.has(id)) {
        return global.lidCache.get(id);
      }
      
      try {
        const res = await conn.onWhatsApp(id).catch(() => []);
        const lid = res[0]?.lid || id;
        
        if (global.lidCache) {
          global.lidCache.set(id, lid);
        }
        
        return lid;
      } catch (error) {
        console.error(chalk.red('[HANDLER] Error obteniendo LID:'), error);
        return id;
      }
    }

    const senderLid = await getLidFromJid(m.sender, this);
    const botLid = await getLidFromJid(this.user.jid, this);
    const senderJid = m.sender;
    const botJid = this.user.jid;

    const groupMetadata = m.isGroup
      ? (() => {
          if (global.groupMetadataCache && global.groupMetadataCache.has(m.chat)) {
            return global.groupMetadataCache.get(m.chat);
          }
          
          this.groupMetadata(m.chat)
            .then(metadata => {
              if (global.groupMetadataCache) {
                global.groupMetadataCache.set(m.chat, metadata);
              }
            })
            .catch(err => {
              console.error(chalk.red('[HANDLER] Error obteniendo metadata:'), err);
            });
          
          return (global.groupMetadataCache && global.groupMetadataCache.get(m.chat)) || {};
        })()
      : {};
    
    const participants = (() => {
      if (!m.isGroup || !groupMetadata) return [];
      if (!groupMetadata.participants || !Array.isArray(groupMetadata.participants)) {
        return [];
      }
      return groupMetadata.participants;
    })();

    const user = participants.find(
      (p) =>
        [p?.id, p?.jid].includes(senderLid) ||
        [p?.id, p?.jid].includes(senderJid)
    ) || {};
    
    const bot = participants.find(
      (p) =>
        [p?.id, p?.jid].includes(botLid) || 
        [p?.id, p?.jid].includes(botJid)
    ) || {};

    const isRAdmin = user.admin === "superadmin";
    const isAdmin = isRAdmin || user.admin === "admin";
    const isBotAdmin = !!bot.admin;

    const ___dirname = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "./plugins"
    );
    
    for (let name in global.plugins) {
      let plugin = global.plugins[name];
      if (!plugin || plugin.disabled) continue;
      const __filename = join(___dirname, name);

      if (typeof plugin.all === "function") {
        try {
          await plugin.all.call(this, m, { 
            chatUpdate, 
            __dirname: ___dirname, 
            __filename 
          });
        } catch (error) {
          console.error(chalk.red(`[HANDLER] Error en plugin.all (${name}):`), error);
        }
      }
      
      if (!opts["restrict"] && plugin.tags?.includes("admin")) continue;

      const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
      let _prefix = plugin.customPrefix || this.prefix || global.prefix;
      let match = (
        _prefix instanceof RegExp
          ? [[_prefix.exec(m.text), _prefix]]
          : Array.isArray(_prefix)
            ? _prefix.map((p) => [
                p instanceof RegExp
                  ? p.exec(m.text)
                  : new RegExp(str2Regex(p)).exec(m.text),
                p instanceof RegExp ? p : new RegExp(str2Regex(p)),
              ])
            : [
                [
                  new RegExp(str2Regex(_prefix)).exec(m.text),
                  new RegExp(str2Regex(_prefix)),
                ],
              ]
      ).find((p) => p[1]);

      if (typeof plugin.before === "function") {
        try {
          if (await plugin.before.call(this, m, {
            match,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isPrems,
            chatUpdate,
            __dirname: ___dirname,
            __filename,
          })) continue;
        } catch (error) {
          console.error(chalk.red(`[HANDLER] Error en plugin.before (${name}):`), error);
        }
      }
      
      if (typeof plugin !== "function") continue;

      if ((usedPrefix = (match[0] || "")[0])) {
        let noPrefix = m.text.replace(usedPrefix, "");
        let [command, ...args] = noPrefix.trim().split` `.filter(Boolean);
        args = args || [];
        let _args = noPrefix.trim().split` `.slice(1);
        let text = _args.join` `;
        command = (command || "").toLowerCase();
        let fail = plugin.fail || global.dfail;
        let isAccept =
          plugin.command instanceof RegExp
            ? plugin.command.test(command)
            : Array.isArray(plugin.command)
              ? plugin.command.some((cmd) =>
                  cmd instanceof RegExp ? cmd.test(command) : cmd === command
                )
              : plugin.command === command;

        global.comando = command;
        
        if (
          m.id.startsWith("NJX-") ||
          (m.id.startsWith("BAE5") && m.id.length === 16) ||
          (m.id.startsWith("B24E") && m.id.length === 20)
        ) return;
        
        if (!isAccept) continue;

        m.plugin = name;
        let chat = global.db.data.chats[m.chat];
        let user = global.db.data.users[m.sender];
        
        if (!user || typeof user !== "object") {
          console.log(chalk.red(`[HANDLER] Usuario ${m.sender} no existe en la DB, reinicializando...`));
          global.db.data.users[m.sender] = {
            exp: 0,
            monedas: 10,
            registered: false,
            followed: false,
            banned: false,
            bannedReason: ""
          };
          user = global.db.data.users[m.sender];
        }
        
        if (
          !["grupo-unbanchat.js", "owner-exec.js", "owner-exec2.js"].includes(name) &&
          chat?.isBanned &&
          !isROwner
        ) return;
        
        if (m.text && user.banned === true && !isROwner) {
          m.reply(
            `《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : "✰ *Motivo:* Sin Especificar"}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`
          );
          return;
        }

        let adminMode = global.db.data.chats[m.chat]?.modoadmin || false;
        let mini = `${plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || m.text.slice(0, 1) == usedPrefix || plugin.command}`;
        if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;
        
        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fail("owner", m, this);
          continue;
        }
        if (plugin.rowner && !isROwner) {
          fail("rowner", m, this);
          continue;
        }
        if (plugin.owner && !isOwner) {
          fail("owner", m, this);
          continue;
        }
        if (plugin.mods && !isMods) {
          fail("mods", m, this);
          continue;
        }
        if (plugin.premium && !isPrems) {
          fail("premium", m, this);
          continue;
        }
        if (plugin.group && !m.isGroup) {
          fail("group", m, this);
          continue;
        }
        if (plugin.botAdmin && !isBotAdmin) {
          fail("botAdmin", m, this);
          continue;
        }
        if (plugin.admin && !isAdmin) {
          fail("admin", m, this);
          continue;
        }
        if (plugin.private && m.isGroup) {
          fail("private", m, this);
          continue;
        }
        
        if (plugin.register === true || plugin.register) {
          if (!_user || typeof _user.registered !== 'boolean') {
            console.log(chalk.yellow(`[HANDLER] Campo registered inválido para ${m.sender}: ${_user?.registered}`));
            _user.registered = false;
          }
          
          if (_user.registered !== true) {
            console.log(chalk.yellow(`[HANDLER] Usuario ${m.sender} no registrado intentando usar ${command}`));
            fail("unreg", m, this);
            continue;
          }
        }

        m.isCommand = true;
        let xp = "exp" in plugin ? parseInt(plugin.exp) : 10;
        m.exp += xp;
        
        const monedasName = global.monedas || 'monedas';
        
        if (!isPrems && plugin.monedas && _user.monedas < plugin.monedas) {
          this.reply(m.chat, `❮✦❯ Se agotaron tus ${monedasName}`, m);
          continue;
        }
        if (plugin.level > _user.level) {
          this.reply(
            m.chat,
            `❮✦❯ Se requiere el nivel: *${plugin.level}*\n\n• Tu nivel actual es: *${_user.level}*\n\n• Usa este comando para subir de nivel:\n*${usedPrefix}levelup*`,
            m
          );
          continue;
        }

        let extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename,
        };
        
        try {
          await plugin.call(this, m, extra);
          if (!isPrems) m.monedas = m.monedas || plugin.monedas || false;
        } catch (e) {
          m.error = e;
          let text = format(e);
          if (global.APIKeys && typeof global.APIKeys === 'object') {
            for (let key of Object.values(global.APIKeys)) {
              if (key) text = text.replace(new RegExp(key, "g"), "Administrador");
            }
          }
          this.reply(m.chat, text, m);
          console.error(chalk.red(`[HANDLER] Error ejecutando plugin (${name}):`), e);
        } finally {
          if (typeof plugin.after === "function") {
            try {
              await plugin.after.call(this, m, extra);
            } catch (error) {
              console.error(chalk.red(`[HANDLER] Error en plugin.after (${name}):`), error);
            }
          }
          if (m.monedas) {
            const monedasName = global.monedas || 'monedas';
            this.reply(m.chat, `❮✦❯ Utilizaste ${+m.monedas} ${monedasName}`, m);
          }
        }
        break;
      }
    }
  } catch (e) {
    console.error(chalk.red('[HANDLER] Error general:'), e);
  } finally {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
    }

    if (m) {
      let utente = global.db.data.users[m.sender];
      
      if (!utente || typeof utente !== "object") {
        console.log(chalk.red(`[HANDLER] Usuario ${m.sender} perdido al final, reinicializando...`));
        global.db.data.users[m.sender] = {
          exp: m.exp || 0,
          monedas: 10,
          registered: false,
          followed: false
        };
        utente = global.db.data.users[m.sender];
      }
      
      if (utente.muto) {
        try {
          await this.sendMessage(m.chat, {
            delete: {
              remoteJid: m.chat,
              fromMe: false,
              id: m.key.id,
              participant: m.key.participant,
            },
          });
        } catch (error) {
          console.error(chalk.red('[HANDLER] Error borrando mensaje:'), error);
        }
      }
      
      utente.exp += m.exp;
      utente.monedas -= m.monedas;
      
      if (global.scheduleDbWrite) {
        global.scheduleDbWrite();
      }
    }

    let stats = global.db.data.stats;
    if (m.plugin) {
      let now = +new Date();
      let stat = stats[m.plugin] || {
        total: 0,
        success: 0,
        last: 0,
        lastSuccess: 0,
      };
      stat.total += 1;
      stat.last = now;
      if (!m.error) {
        stat.success += 1;
        stat.lastSuccess = now;
      }
      stats[m.plugin] = stat;
    }

    try {
      if (!opts["noprint"]) {
        await (await import("../lib/print.js")).default(m, this);
      }
    } catch (e) {
      console.error(chalk.red('[HANDLER] Error en print:'), e);
    }
    
    if (opts["autoread"]) {
      this.readMessages([m.key]).catch(() => {});
    }
  }
}

global.dfail = (type, m, usedPrefix, command, conn) => {
  const msg = {
    rowner: `🛑 *ACCESO RESTRINGIDO*\n\n> Solo el *Creador Supremo* puede ejecutar este protocolo.\n\n🧬 Usuario Autorizado: 𝘾𝘼𝙍𝙇𝙊𝙎\n🔗 Sistema: root@dolphin-bot://omega/core`,
    owner: `⚙️🔒 *MÓDULO DEV: ACCESO BLOQUEADO*\n\n> Esta función está anclada a permisos de *𝙳𝙴𝚂𝙰𝚁𝚁𝙊𝙇𝙇𝙰𝙳𝙊𝚁*.\n\n🧠 Consola de Seguridad: dev@dolphin.ai/core.sh`,
    premium: `*REQUIERE CUENTA PREMIUM*\n\n> 🚫 Módulo exclusivo para usuarios *𝙑𝙄𝙋 - 𝙋𝙍𝙀𝙈𝙄𝙐𝙈*.\n\n📡 Actualiza tu plan con: */vip*\n⚙️ Estado: denegado`,
    private: `🔒 *SOLO CHAT PRIVADO* 📲\n\n> Este comando no puede ejecutarse en grupos por razones de seguridad.\n\n🧬 Ejecuta este protocolo directamente en el chat privado.`,
    admin: `🛡️ *FUNCIÓN RESTRINGIDA*\n\n> Solo los administradores del *Grupo* tienen acceso.\n\n⚠️ Intento no autorizado.`,
    botAdmin: `⚙️ *REQUIERO PERMISOS DE ADMINISTRADOR*\n\n> Para ejecutar esta función necesito ser administrador del grupo.`,
    unreg: `🧾 *NO REGISTRADO EN EL SISTEMA*\n\n> 🚫 *Acceso denegado:* No puedes usar los comandos sin registrarte.\n\n🔐 Regístrate con: */reg nombre.edad*\n📍 Ejemplo: */reg Dolphin.20*\n\n> 🥷🏻 *Instagram oficial del creador del bot:*\nhttps://www.instagram.com/carlos.gxv\n\n📂 *Creador del bot:* Carlos G`,
    restrict: `🚷 *FUNCIÓN GLOBALMENTE BLOQUEADA*\n\n> Este comando fue deshabilitado por el *Operador Global* por motivos de seguridad cibernética.\n\n🔧 Módulo: /${command}`,
  }[type];
  
  if (msg) return m.reply(msg).then(() => m.react("✖️"));
};

const file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
  unwatchFile(file);
  console.log(chalk.magenta("Se actualizó 'handler.js'"));

  if (global.conns && global.conns.length > 0) {
    const users = [
      ...new Set([
        ...global.conns
          .filter(
            (conn) =>
              conn.user &&
              conn.ws.socket &&
              conn.ws.socket.readyState !== ws.CLOSED
          )
          .map((conn) => conn),
      ]),
    ];
    for (const userr of users) {
      userr.subreloadHandler(false);
    }
  }
});