import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  const emoji = '⚠️';
  const rwait = '⏳';
  const done = '✅';
  const error = '❌';
  const dev = 'by Carlos G';

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `${emoji} Responde a un archivo válido (imagen, video, etc.).`, m);

  await m.react(rwait);

  try {
    let media = await q.download();
    if (!media || !Buffer.isBuffer(media)) {
      await m.react(error);
      return conn.reply(m.chat, `${emoji} No se pudo descargar el archivo.`, m);
    }

    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    let link = await catbox(media);

    let txt = `*乂 C A T B O X - U P L O A D E R 乂*\n\n`;
    txt += `*» Enlace* : ${link}\n`;
    txt += `*» Tamaño* : ${formatBytes(media.length)}\n`;
    txt += `*» Expiración* : ${isTele ? 'No expira' : 'Desconocido'}\n\n`;
    txt += `> *${dev}*`;

    // Enviar archivo con sendMessage
    await conn.sendMessage(m.chat, {
      document: media,
      mimetype: mime,
      fileName: `archivo.${mime.split('/')[1] || 'bin'}`,
      caption: txt
    }, { quoted: m });

    await m.react(done);
  } catch (err) {
    console.error('Error completo:', err);
    await m.react(error);
    conn.reply(m.chat, `${emoji} Error al subir el archivo:\n${err.message}`, m);
  }
};

handler.help = ['tourl2'];
handler.tags = ['transformador'];
handler.command = ['catbox', 'tourl2'];
export default handler;

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}

async function catbox(content) {
  const fileType = await fileTypeFromBuffer(content) || {};
  const ext = fileType.ext || 'bin';
  const mime = fileType.mime || 'application/octet-stream';

  const blob = new Blob([content], { type: mime });
  const formData = new FormData();
  const randomBytes = crypto.randomBytes(5).toString("hex");

  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", blob, randomBytes + "." + ext);

  const response = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: formData,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    },
  });

  if (!response.ok) throw new Error(`Error en Catbox: ${response.statusText}`);
  return await response.text();
}