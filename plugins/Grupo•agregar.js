var handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let who;
  if (m.isGroup)
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
        ? m.quoted.sender
        : text;
  else who = m.chat;

  let name = await conn.getName(m.sender);
  let nom = conn.getName(m.sender);

  if (!global.db.data.settings[conn.user.jid].restrict)
    return conn.reply(
      m.chat,
      `🚩 *Este comando está deshabilitado por mi creador*`,
      m
    );

  if (!text)
    return m.reply(
      `🍟 Ingrese el número de la persona que quieres añadir a este grupo.\n\n🚩 Ejemplo:\n*${usedPrefix + command}* 5219514639799`
    );

  if (text.includes("+"))
    return m.reply(`🍟 Ingrese el número todo junto sin el *(+)*`);

  if (isNaN(text.replace(/\D/g, "")))
    return m.reply(`🍟 El número debe ser solo en dígitos`);

  let group = m.chat;
  let jid = text.replace(/\D/g, "") + "@s.whatsapp.net";

  try {
    let [exists] = await conn.onWhatsApp(jid);
    if (!exists || !exists.exists) {
      return m.reply(`❌ El número *${text}* no existe en WhatsApp`);
    }

    let groupMetadata = await conn.groupMetadata(group);
    let participants = groupMetadata.participants.map((p) => p.id);
    if (participants.includes(jid)) {
      return m.reply(`⚠️ El número *${text}* ya está en el grupo`);
    }

    let botJid = conn.user.jid;
    let isBotAdmin = groupMetadata.participants.find(
      (p) => p.id === botJid
    )?.admin;

    let fecha = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    let tiempo = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (isBotAdmin) {
      try {
        await conn.groupParticipantsUpdate(group, [jid], "add");

        return m.reply(
          `✅ *Usuario añadido exitosamente*

📱 *Número:* ${text}
👤 *Añadido por:* ${nom}
📅 *Fecha:* ${fecha}
⏰ *Hora:* ${tiempo}

_El usuario ha sido agregado directamente al grupo_ 🐬✨`
        );
      } catch (addError) {
        console.log(
          "⚠️ No se pudo añadir directamente, enviando link...",
          addError.message
        );

        let errorMsg = "";
        if (addError.message.includes("403")) {
          errorMsg =
            "🔒 El usuario tiene su privacidad configurada para no ser añadido";
        } else if (addError.message.includes("408")) {
          errorMsg = "⏱️ El usuario no respondió a tiempo";
        } else if (addError.message.includes("409")) {
          errorMsg = "🚫 El usuario ya está en el grupo";
        } else {
          errorMsg = "⚠️ No se pudo añadir directamente";
        }

        let link =
          "https://chat.whatsapp.com/" + (await conn.groupInviteCode(group));

        try {
          await conn.reply(
            jid,
            `*🐬 ¡Hola! Soy DolphinBot*

Una persona te ha invitado a unirte a su grupo de WhatsApp.

*📱 Link de invitación:*
${link}

*👤 Invitado por:* @${m.sender.split("@")[0]}

_Haz clic en el link para unirte al grupo_ ✨`,
            m,
            { mentions: [m.sender] }
          );

          return m.reply(
            `⚠️ *${errorMsg}*

✅ *Invitación enviada como alternativa*

📱 *Número:* ${text}
👤 *Invitado por:* ${nom}
📅 *Fecha:* ${fecha}
⏰ *Hora:* ${tiempo}

_La invitación fue enviada al privado del usuario_ 📨`
          );
        } catch (linkError) {
          return m.reply(
            `❌ *No se pudo añadir ni enviar invitación*

*Razón:* ${errorMsg}
*Error adicional:* ${linkError.message}

_El usuario puede tener bloqueados los mensajes de desconocidos_ 🚫`
          );
        }
      }
    } else {
      let link =
        "https://chat.whatsapp.com/" + (await conn.groupInviteCode(group));

      await conn.reply(
        jid,
        `*🐬 ¡Hola! Soy DolphinBot*

Una persona te ha invitado a unirte a su grupo de WhatsApp.

*📱 Link de invitación:*
${link}

*👤 Invitado por:* @${m.sender.split("@")[0]}

_Haz clic en el link para unirte al grupo_ ✨`,
        m,
        { mentions: [m.sender] }
      );

      return m.reply(
        `ℹ️ *Invitación enviada al privado*

📱 *Número:* ${text}
👤 *Invitado por:* ${nom}
📅 *Fecha:* ${fecha}
⏰ *Hora:* ${tiempo}

⚠️ _Nota: Necesito ser administrador del grupo para poder añadir usuarios directamente_ 👑`
      );
    }
  } catch (error) {
    console.error("❌ Error en comando add:", error);

    if (error.message.includes("not-authorized")) {
      return m.reply(`❌ No tengo permisos para obtener el link del grupo`);
    }
    if (error.message.includes("forbidden")) {
      return m.reply(
        `❌ El usuario tiene bloqueados los mensajes de desconocidos`
      );
    }

    return m.reply(`❌ Error inesperado: ${error.message}`);
  }
};

handler.help = ["add <número>"];
handler.tags = ["grupo"];
handler.command = ["add", "agregar", "añadir", "invite"];
handler.group = true;
handler.admin = true;
handler.botAdmin = false;
handler.fail = null;

export default handler;
