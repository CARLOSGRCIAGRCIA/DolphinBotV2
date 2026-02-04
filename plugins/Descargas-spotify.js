import fetch from 'node-fetch';
import chalk from 'chalk';

const handler = async (m, { args, conn, command, prefix }) => {
  if (!args[0]) {
    let ejemplos = ['Adele Hello', 'Sia Unstoppable', 'Maroon 5 Memories', 'Karol G Provenza', 'Natalia Jiménez Creo en mí'];
    let random = ejemplos[Math.floor(Math.random() * ejemplos.length)];
    
    const rcanal = global.rcanal || global.ch?.ch1 || null;
    return conn.reply(m.chat, `🎵 Ejemplo de uso: ${(prefix || '.') + command} ${random}`, m, rcanal);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });
  } catch (error) {
    console.error(chalk.red('[SPOTIFY] Error enviando reacción inicial:'), error);
  }

  const query = args.join(' ');
  const chatId = String(m.chat);

  try {
    const searchUrl = `https://api.delirius.store/search/spotify?q=${encodeURIComponent(query)}`;
    console.log(chalk.cyan('[SPOTIFY] Buscando:'), query);
    
    const searchRes = await fetch(searchUrl, { timeout: 15000 });
    
    if (!searchRes.ok) {
      throw new Error(`Error HTTP ${searchRes.status}`);
    }
    
    const searchJson = await searchRes.json();
    
    if (!searchJson.status || !searchJson.data || searchJson.data.length === 0) {
      await m.reply('❌ No encontré la canción que estás buscando.');
      return;
    }

    const track = searchJson.data[0];
    if (!track || !track.url) {
      await m.reply('⚠️ Resultado inválido de la API.');
      return;
    }

    console.log(chalk.cyan('[SPOTIFY] Track encontrado:'), track.title);

    const downloadUrl = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(track.url)}`;
    console.log(chalk.cyan('[SPOTIFY] Descargando...'));
    
    await conn.sendMessage(chatId, { react: { text: '📥', key: m.key } });
    
    const dlRes = await fetch(downloadUrl, { timeout: 30000 });
    
    if (!dlRes.ok) {
      throw new Error(`Error en descarga HTTP ${dlRes.status}`);
    }
    
    const dlJson = await dlRes.json();
    
    const audioUrl = 
      dlJson?.data?.url ||          
      dlJson?.data?.download ||     
      dlJson?.data?.link ||          
      dlJson?.download ||            
      dlJson?.url;                   
    
    console.log(chalk.cyan('[SPOTIFY] Estructura de descarga:'), JSON.stringify(dlJson, null, 2));
    console.log(chalk.cyan('[SPOTIFY] URL extraída:'), audioUrl);
    
    if (!audioUrl || audioUrl === 'undefined' || audioUrl.includes('undefined')) {
      console.error(chalk.red('[SPOTIFY] No se encontró URL de audio en la respuesta'));
      console.error(chalk.red('[SPOTIFY] Respuesta completa:'), JSON.stringify(dlJson));
      await m.reply('⚠️ La canción fue encontrada pero no está disponible para descarga en este momento. Intenta con otra canción.');
      return;
    }

    const caption = `
╔═══『 🎵 SPOTIFY 🎶 』
║ ✦  *Título:* ${track.title || dlJson.data?.title || 'N/A'}
║ ✦  *Artista:* ${track.artist || dlJson.data?.author || 'N/A'}
║ ✦  *Álbum:* ${track.album || 'N/A'}
║ ✦  *Duración:* ${track.duration || formatDuration(dlJson.data?.duration) || 'N/A'}
${track.popularity ? `║ ✦  *Popularidad:* ${track.popularity}` : ''}
${track.publish ? `║ ✦  *Publicado:* ${track.publish}` : ''}
║ ✦  *Link:* ${track.url || 'N/A'}
╚═════════════════╝

> 🐬 *DolphinBot-MD* by Carlos G`;

    try {
      const imageUrl = track.image || dlJson.data?.image;
      
      if (imageUrl) {
        await conn.sendMessage(chatId, {
          image: { url: imageUrl },
          caption: caption
        }, { quoted: m });
      } else {
        await conn.sendMessage(chatId, { text: caption }, { quoted: m });
      }
    } catch (error) {
      console.error(chalk.red('[SPOTIFY] Error enviando imagen:'), error);
      await conn.sendMessage(chatId, { text: caption }, { quoted: m });
    }

    try {
      const fileName = `${(track.title || 'audio').replace(/[^a-zA-Z0-9 ]/g, '')}.mp3`;
      
      await conn.sendMessage(chatId, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: fileName
      }, { quoted: m });

      await conn.sendMessage(chatId, { react: { text: '✅', key: m.key } });
      console.log(chalk.green('[SPOTIFY] Descarga exitosa!'));
      
    } catch (error) {
      console.error(chalk.red('[SPOTIFY] Error enviando audio:'), error);
      await m.reply(`⚠️ Error al enviar el audio.\n\n📎 Intenta descargarlo directamente: ${audioUrl}`);
    }

  } catch (e) {
    console.error(chalk.red('[SPOTIFY] Error general:'), e);
    
    try {
      await conn.sendMessage(chatId, { react: { text: '❌', key: m.key } });
      await m.reply('⚠️ Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.');
    } catch (replyError) {
      console.error(chalk.red('[SPOTIFY] Error enviando mensaje de error:'), replyError);
    }
  }
};

function formatDuration(ms) {
  if (!ms || isNaN(ms)) return null;
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

handler.help = ['spotify <canción>'];
handler.tags = ['busqueda', 'descargas'];
handler.command = ['spotify', 'sp', 'song'];
handler.register = true;

export default handler;