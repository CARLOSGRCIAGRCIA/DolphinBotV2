import { WAMessageStubType } from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const who = m.messageStubParameters[0];
  const taguser = `@${who.split("@")[0]}`;
  const chat = global.db.data.chats[m.chat] || {};
  const groupName = groupMetadata.subject || "el grupo";

  // Mensajes más cortos y optimizados para móvil (menos líneas, menos caracteres por línea)
  const welcomeMessages = [
    `▸▸ ¡BIENVENID@! ◂◂
│➺ ${taguser}
│➺ Ya estás dentro
│➺ Puro desmadre y memes
│➺ Aguanta las bromas 😏
╰──────────────`,

    `▸▸ NUEVO MIEMBRO ◂◂
│➺ ${taguser}
│➺ Llegó el caos
│➺ Sin filtro, sin piedad
│➺ Suerte 😈
╰──────────────`,

    `▸▸ ¡ENTRASTE! ◂◂
│➺ ${taguser}
│➺ Bienvenid@ al relajo
│➺ Memes pesados incoming
│➺ No te achiques 🔥
╰──────────────`,

    `▸▸ WELCOME ${taguser.toUpperCase()} ◂◂
│➺ Ya estás aquí
│➺ Disfruta… o aguanta
│➺ Sin drama 😏
╰──────────────`,
  ];

  const leaveMessages = [
    `▸▸ ¡ADIÓS! ${taguser.toUpperCase()} ◂◂
│➺ Se fue
│➺ Se rajó el pendejo
│➺ No te extrañamos
│➺ Que te jodan 😈
╰──────────────`,

    `▸▸ SE FUE ${taguser.toUpperCase()} ◂◂
│➺ Abandonó el grupo
│➺ Muy débil
│➺ Adiós idiota
│➺ Mejor sin ti 🔥
╰──────────────`,

    `▸▸ BYE ${taguser.toUpperCase()} ◂◂
│➺ Huyó
│➺ Cobarde
│➺ No vuelvas
│➺ Basura fuera 😏
╰──────────────`,

    `▸▸ CHAU ${taguser.toUpperCase()} ◂◂
│➺ Se peló
│➺ Aguado
│➺ Que te vaya mal
│➺ No regreses 🔥
╰──────────────`,
  ];

  const kickMessages = [
    `▸▸ ¡FUERA! ${taguser.toUpperCase()} ◂◂
│➺ Expulsado
│➺ Se pasó de verga
│➺ Patada dada
│➺ No regreses 😈
╰──────────────`,

    `▸▸ EXPULSADO ${taguser.toUpperCase()} ◂◂
│➺ Sacado a patadas
│➺ No respetó nada
│➺ Limpieza hecha
│➺ Que te jodan 🔥
╰──────────────`,

    `▸▸ PA' FUERA ${taguser.toUpperCase()} ◂◂
│➺ Voló
│➺ Imbécil
│➺ Adiós perdedor
│➺ Limpio 😂
╰──────────────`,

    `▸▸ CORRIDO ${taguser.toUpperCase()} ◂◂
│➺ Expulsión lista
│➺ Aguado
│➺ No te toleramos
│➺ Fuera 🔥
╰──────────────`,
  ];

  // Fuentes de imágenes — ajustamos tamaño a 600×600 o 640×640 para móvil
  const randomFunnySources = [
    "https://meme-api.com/gimme/memes",
    "https://meme-api.com/gimme/dankmemes",
    "https://meme-api.com/gimme/funny",

    // Tamaños más amigables para WhatsApp móvil
    "https://picsum.photos/600/600?random=" + Date.now(),
    "https://picsum.photos/seed/weird/600/600",
    "https://picsum.photos/seed/funny/600/600",
    "https://picsum.photos/seed/meme/600/600",

    "https://loremflickr.com/600/600/weird,funny",
    "https://loremflickr.com/600/600/celebrity,funny",
  ];

  async function getRandomFunnyImage() {
    const url = randomFunnySources[Math.floor(Math.random() * randomFunnySources.length)];

    try {
      const res = await fetch(url, { timeout: 12000 });
      const contentType = res.headers.get("content-type") || "";

      if (contentType.startsWith("image/")) {
        return Buffer.from(await res.arrayBuffer());
      }

      if (contentType.includes("application/json")) {
        const data = await res.json();
        let imgUrl = data.url || data.link || data.message;

        if (imgUrl && imgUrl.startsWith("http")) {
          const imgRes = await fetch(imgUrl);
          if (imgRes.ok) {
            return Buffer.from(await imgRes.arrayBuffer());
          }
        }
      }

      throw new Error("Imagen no válida");
    } catch (err) {
      console.error("[Image Error]", err.message, url);

      // Fallback con tamaño optimizado
      try {
        const fb = await fetch("https://picsum.photos/600/600?random=" + Date.now());
        return Buffer.from(await fb.arrayBuffer());
      } catch {
        // Placeholder cuadrado
        return await fetch("https://via.placeholder.com/600x600/111111/FFFFFF?text=Random+😂")
          .then(r => r.arrayBuffer())
          .then(Buffer.from);
      }
    }
  }

  if (!chat.welcome) return true;

  const img = await getRandomFunnyImage();

  let text = "";
  let mentions = [who];

  switch (m.messageStubType) {
    case WAMessageStubType.GROUP_PARTICIPANT_ADD:
      text = chat.customWelcome || welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      break;

    case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
      text = chat.customLeave || leaveMessages[Math.floor(Math.random() * leaveMessages.length)];
      break;

    case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
      text = chat.customKick || kickMessages[Math.floor(Math.random() * kickMessages.length)];
      break;

    default:
      return true;
  }

  text = text
    .replace(/@user/g, taguser)
    .replace(/{group}/g, groupName);

  await conn.sendMessage(m.chat, {
    image: img,
    caption: text,
    mentions,
    jpegThumbnail: img.subarray(0, 2000)
  });

  return true;
}