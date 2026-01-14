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
  
  this.pushMessage(chatUpdate.messages).catch(console.error);

  let m = chatUpdate.messages[chatUpdate.messages.length - 1];
  if (!m) return;
  
  if (!global.db.data) await global.loadDatabase();

  try {
    m = smsg(this, m) || m;
    if (!m) return;
    
    if (m.isBaileys) return;
    
    global.mconn = m;
    m.exp = 0;
    m.monedas = false;

    try {
      let user = global.db.data.users[m.sender];
      if (!user || typeof user !== "object")
        global.db.data.users[m.sender] = user = {};

      if (!isNumber(user.exp)) user.exp = 0;
      if (!isNumber(user.monedas)) user.monedas = 10;
      if (!isNumber(user.joincount)) user.joincount = 1;
      if (!isNumber(user.diamond)) user.diamond = 3;
      if (!isNumber(user.lastadventure)) user.lastadventure = 0;
      if (!isNumber(user.lastclaim)) user.lastclaim = 0;
      if (!isNumber(user.health)) user.health = 100;
      if (!isNumber(user.crime)) user.crime = 0;
      if (!isNumber(user.lastcofre)) user.lastcofre = 0;
      if (!isNumber(user.lastdiamantes)) user.lastdiamantes = 0;
      if (!isNumber(user.lastpago)) user.lastpago = 0;
      if (!isNumber(user.lastcode)) user.lastcode = 0;
      if (!isNumber(user.lastcodereg)) user.lastcodereg = 0;
      if (!isNumber(user.lastduel)) user.lastduel = 0;
      if (!isNumber(user.lastmining)) user.lastmining = 0;
      if (!("muto" in user)) user.muto = false;
      if (!("premium" in user)) user.premium = false;
      if (user.premium && !user.premiumTime) user.premiumTime = 0;
      if (!("registered" in user)) user.registered = false;
      if (!user.genre) user.genre = "";
      if (!user.birth) user.birth = "";
      if (!user.marry) user.marry = "";
      if (!user.description) user.description = "";
      if (!user.packstickers) user.packstickers = null;
      if (!user.name) user.name = m.name;
      if (!isNumber(user.age)) user.age = -1;
      if (!isNumber(user.regTime)) user.regTime = -1;
      if (!isNumber(user.afk)) user.afk = -1;
      if (!user.afkReason) user.afkReason = "";
      if (!user.role) user.role = "Nuv";
      if (!("banned" in user)) user.banned = false;
      if (!("useDocument" in user)) user.useDocument = false;
      if (!isNumber(user.level)) user.level = 0;
      if (!isNumber(user.bank)) user.bank = 0;
      if (!isNumber(user.warn)) user.warn = 0;

      let chat = global.db.data.chats[m.chat];
      if (!chat || typeof chat !== "object")
        global.db.data.chats[m.chat] = chat = {};
      
      if (!("isBanned" in chat)) chat.isBanned = false;
      if (!chat.sAutoresponder) chat.sAutoresponder = "";
      if (!("welcome" in chat)) chat.welcome = true;
      if (!("autolevelup" in chat)) chat.autolevelup = false;
      if (!("autoAceptar" in chat)) chat.autoAceptar = true;
      if (!("autosticker" in chat)) chat.autosticker = false;
      if (!("autoRechazar" in chat)) chat.autoRechazar = true;
      if (!("autoresponder" in chat)) chat.autoresponder = false;
      if (!("detect" in chat)) chat.detect = true;
      if (!("antiBot" in chat)) chat.antiBot = true;
      if (!("antiBot2" in chat)) chat.antiBot2 = true;
      if (!("modoadmin" in chat)) chat.modoadmin = false;
      if (!("antiLink" in chat)) chat.antiLink = true;
      if (!("reaction" in chat)) chat.reaction = false;
      if (!("nsfw" in chat)) chat.nsfw = false;
      if (!("antifake" in chat)) chat.antifake = false;
      if (!("delete" in chat)) chat.delete = false;
      if (!isNumber(chat.expired)) chat.expired = 0;

      var settings = global.db.data.settings[this.user.jid] || {};
      if (!("self" in settings)) settings.self = false;
      if (!("restrict" in settings)) settings.restrict = true;
      if (!("jadibotmd" in settings)) settings.jadibotmd = true;
      if (!("antiPrivate" in settings)) settings.antiPrivate = false;
      if (!("autoread" in settings)) settings.autoread = false;
      if (!settings.status) settings.status = 0;
      global.db.data.settings[this.user.jid] = settings;
    } catch (e) {
      console.error(e);
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
      
      setInterval(async () => {
        if (!queque.includes(previousID)) clearInterval(this);
        await delay(5000);
      }, 5000);
    }
    
    m.exp += Math.ceil(Math.random() * 10);
    let usedPrefix;
    let _user = global.db.data.users[m.sender];

    async function getLidFromJid(id, conn) {
      if (id.endsWith("@lid")) return id;
      
      if (!conn.lidCache) conn.lidCache = new Map();
      
      if (conn.lidCache.has(id)) return conn.lidCache.get(id);
      
      const res = await conn.onWhatsApp(id).catch(() => []);
      const lid = res[0]?.lid || id;
      
      conn.lidCache.set(id, lid);
      
      if (conn.lidCache.size > 1000) {
        const firstKey = conn.lidCache.keys().next().value;
        conn.lidCache.delete(firstKey);
      }
      
      return lid;
    }

    const senderLid = await getLidFromJid(m.sender, conn);
    const botLid = await getLidFromJid(conn.user.jid, conn);
    const senderJid = m.sender;
    const botJid = conn.user.jid;

    const groupMetadata = m.isGroup
      ? (this.groupMetadataCache?.[m.chat] || 
         (this.groupMetadataCache = this.groupMetadataCache || {},
          this.groupMetadataCache[m.chat] = await this.groupMetadata(m.chat).catch(() => null),
          setTimeout(() => {
            if (this.groupMetadataCache?.[m.chat]) {
              delete this.groupMetadataCache[m.chat];
            }
          }, 5 * 60 * 1000),
          this.groupMetadataCache[m.chat]))
      : {};
    
    const participants = (() => {
      if (!m.isGroup || !groupMetadata) return [];
      if (
        !groupMetadata.participants ||
        !Array.isArray(groupMetadata.participants)
      ) {
        return [];
      }
      return groupMetadata.participants;
    })();

    const user =
      participants.find(
        (p) =>
          [p?.id, p?.jid].includes(senderLid) ||
          [p?.id, p?.jid].includes(senderJid)
      ) || {};
    const bot =
      participants.find(
        (p) =>
          [p?.id, p?.jid].includes(botLid) || [p?.id, p?.jid].includes(botJid)
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

      if (typeof plugin.all === "function")
        await plugin.all
          .call(this, m, { chatUpdate, __dirname: ___dirname, __filename })
          .catch(console.error);
      if (!opts["restrict"] && plugin.tags?.includes("admin")) continue;

      const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
      let _prefix = plugin.customPrefix || conn.prefix || global.prefix;
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

      if (
        typeof plugin.before === "function" &&
        (await plugin.before.call(this, m, {
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
        }))
      )
        continue;
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
        )
          return;
        if (!isAccept) continue;

        m.plugin = name;
        let chat = global.db.data.chats[m.chat];
        let user = global.db.data.users[m.sender];
        
        if (
          !["grupo-unbanchat.js", "owner-exec.js", "owner-exec2.js"].includes(
            name
          ) &&
          chat?.isBanned &&
          !isROwner
        )
          return;
          
        if (m.text && user.banned && !isROwner) {
          m.reply(
            `《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : "✰ *Motivo:* Sin Especificar"}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`
          );
          return;
        }

        let adminMode = global.db.data.chats[m.chat]?.modoadmin || false;
        let mini = `${plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || hl || m.text.slice(0, 1) == hl || plugin.command}`;
        if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini)
          return;
          
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
        if (plugin.register && !_user.registered) {
          fail("unreg", m, this);
          continue;
        }

        m.isCommand = true;
        let xp = "exp" in plugin ? parseInt(plugin.exp) : 10;
        m.exp += xp;
        
        const monedasName = global.monedas || 'monedas';
        
        if (!isPrems && plugin.monedas && _user.monedas < plugin.monedas) {
          conn.reply(m.chat, `❮✦❯ Se agotaron tus ${monedasName}`, m);
          continue;
        }
        if (plugin.level > _user.level) {
          conn.reply(
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
          m.reply(text);
        } finally {
          if (typeof plugin.after === "function")
            await plugin.after.call(this, m, extra).catch(console.error);
          if (m.monedas) {
            const monedasName = global.monedas || 'monedas';
            conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.monedas} ${monedasName}`, m);
          }
        }
        break;
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
    }

    if (m) {
      let utente = global.db.data.users[m.sender];
      if (utente.muto)
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
          },
        });
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
      if (!opts["noprint"])
        await (await import("../lib/print.js")).default(m, this);
    } catch (e) {
      console.log(m, m.quoted, e);
    }
    
    if (opts["autoread"]) {
      this.readMessages([m.key]).catch(() => {});
    }
  }
}

global.dfail = (type, m, usedPrefix, command, conn) => {
  const msg = {
    rowner: `🛑 *ACCESO RESTRINGIDOΩ*\n\n> Solo el *Creador Supremo* puede ejecutar este protocolo.\n\n🧬 Usuario Autorizado: 𝘾𝘼𝙍𝙇𝙊𝙎\n🔗 Sistema: root@asTa-bot://omega/core`,
    owner: `⚙️🔒 *MÓDULO DEV: ACCESO BLOQUEADO*\n\n> Esta función está anclada a permisos de *𝙳𝙴𝚂𝙰𝚁𝚁𝙾𝙻𝙻𝙰𝙳𝙾𝚁*.\n\n🧠 Consola de Seguridad: dev@asta.ai/core.sh`,
    premium: `*REQUIERE CUENTA PREMIUM*\n\n> 🚫 Módulo exclusivo para usuarios *𝙑𝙄𝙋 - 𝙋𝙍𝙀𝙈𝙄𝙐𝙈*.\n\n📡 Actualiza tu plan con: */vip*\n⚙️ Estado: denegado`,
    private: `🔒 *SOLO CHAT PRIVADO* 📲\n\n> Este comando no puede ejecutarse en grupos por razones de seguridad.\n\n🧬 Ejecuta este protocolo directamente en el chat privado.`,
    admin: `🛡️ *FUNCIÓN RESTRINGIDA*\n\n> Solo los administradores del *Grupo* tienen acceso.\n\n⚠️ Intento no autorizado.`,
    unreg: `🧾 *NO REGISTRADO EN EL SISTEMA*\n\n> 🚫 *Acceso denegado:* No puedes usar los comandos sin registrarte.\n\n🔐 Regístrate con: */reg nombre.edad*\n📍 Ejemplo: */reg Dolphin.20*\n\n> 🥷🏻 *Instagram oficial del creador del bot  :*\nhttps://www.instagram.com/carlos.gxv\n\n📂 *Creador del bot:* Carlos G`,
    restrict: `🚷 *FUNCIÓN GLOBALMENTE BLOQUEADA*\n\n> Este comando fue deshabilitado por el *Operador Global* por motivos de seguridad cibernética.\n\n🔧 Módulo: /xvideos`,
  }[type];
  if (msg) return m.reply(msg).then((_) => m.react("✖️"));
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
  unwatchFile(file);
  console.log(chalk.magenta("Se actualizo 'handler.js'"));

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