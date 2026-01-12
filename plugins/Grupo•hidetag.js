import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
import * as fs from "fs";

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {
  const footer = "\n\n> 𝘿𝙤𝙡𝙥𝙝𝙞𝙣 𝘽𝙤𝙩 🐬";

  let finalText = "";
  if (text) {
    const hasFooter = text.includes("𝘿𝙤𝙡𝙥𝙝𝙞𝙣 𝘽𝙤𝙩 🐬");
    finalText = hasFooter ? text : text + footer;
  } else if (m.quoted) {
    finalText = m.quoted.text || "";
  }

  if (!finalText && !m.quoted) {
    return conn.reply(
      m.chat,
      `🚩 Ingrese un texto o responda a un mensaje`,
      m,
      rcanal
    );
  }

  try {
    let users = participants.map((u) => conn.decodeJid(u.id));
    let q = m.quoted ? m.quoted : m || m.text || m.sender;
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender;
    let msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(
        m.chat,
        {
          [m.quoted ? q.mtype : "extendedTextMessage"]: m.quoted
            ? c.message[q.mtype]
            : { text: "" || c },
        },
        { quoted: null, userJid: conn.user.id }
      ),
      finalText || q.text,
      conn.user.jid,
      { mentions: users }
    );
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch {
    /**
[ By @NeKosmic || https://github.com/NeKosmic/ ]
**/
    let users = participants.map((u) => conn.decodeJid(u.id));
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    let isMedia = /image|video|sticker|audio/.test(mime);
    let more = String.fromCharCode(8206);
    let masss = more.repeat(850);

    // Usar el texto del mensaje citado si no hay texto personalizado
    let htextos = finalText || quoted.text || "*Hola!!*" + footer;

    if (isMedia && quoted.mtype === "imageMessage") {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        { image: mediax, mentions: users, caption: htextos },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "videoMessage") {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        {
          video: mediax,
          mentions: users,
          mimetype: "video/mp4",
          caption: htextos,
        },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "audioMessage") {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        {
          audio: mediax,
          mentions: users,
          mimetype: "audio/mp4",
          fileName: `Hidetag.mp3`,
        },
        { quoted: null }
      );
    } else if (isMedia && quoted.mtype === "stickerMessage") {
      var mediax = await quoted.download?.();
      conn.sendMessage(
        m.chat,
        { sticker: mediax, mentions: users },
        { quoted: null }
      );
    } else {
      await conn.relayMessage(
        m.chat,
        {
          extendedTextMessage: {
            text: `${masss}\n${htextos}\n`,
            ...{
              contextInfo: {
                mentionedJid: users,
                externalAdReply: { thumbnail: icons, sourceUrl: redes },
              },
            },
          },
        },
        {}
      );
    }
  }
};

handler.help = ["hidetag"];
handler.tags = ["grupo"];
handler.command = ["n", "hidetag", "notificar", "tag", "t"];
handler.group = true;
handler.admin = true;
handler.register = true;

export default handler;
