/**
 * @fileoverview Reaction handler for dynamic list updates with cache management
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/ReactionLista
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Processes emoji reactions on list messages to dynamically add/remove players.
 * Implements automatic list refresh with debouncing, 8-hour cache expiration,
 * and support for multiple simultaneous lists with unique identifiers.
 */

import { 
  procesarReaccion, 
  generarLista, 
  obtenerListaActiva 
} from '../lib/listas.js';

global.listasActivas = global.listasActivas || {};
global.listaUpdateTimers = global.listaUpdateTimers || {};

/**
 * @function before
 * @async
 * @param {Object} m - The message object from WhatsApp
 * @param {Object} this - Bot context/reference
 * @returns {Promise<void>}
 * @description Handles emoji reactions to list messages, updates player counts,
 * implements debounced list refresh (3 seconds), and manages list expiration.
 * Supports multiple concurrent lists with unique IDs and automatic cleanup.
 */
export async function before(m) {
  if (m.mtype !== 'reactionMessage') return;
  
  try {
    const reaction = m.message?.reactionMessage;
    if (!reaction) return;
    
    const emoji = reaction.text;
    const targetMessageId = reaction.key?.id;
    const sender = m.sender;
    const isRemove = !emoji || emoji === '';
    
    const listaActual = obtenerListaActiva(targetMessageId);
    if (!listaActual) return;
    
    console.log(`📝 Reacción: ${emoji || 'removed'} de ${sender.split('@')[0]} en lista ${listaActual.id}`);
    
    const resultado = procesarReaccion(
      { emoji, sender, isRemove },
      listaActual
    );
    
    if (!resultado.actualizado) {
      if (resultado.razon === 'lista_llena') {
        await this.reply(m.chat, resultado.mensaje, null, { 
          mentions: [sender] 
        });
      }
      return;
    }
    
    global.listasActivas[targetMessageId] = resultado.listaActual;
    
    if (global.listaUpdateTimers[targetMessageId]) {
      clearTimeout(global.listaUpdateTimers[targetMessageId]);
    }
    
    global.listaUpdateTimers[targetMessageId] = setTimeout(async () => {
      try {
        const listaFinal = obtenerListaActiva(targetMessageId);
        if (!listaFinal) {
          delete global.listaUpdateTimers[targetMessageId];
          return;
        }
        
        const nuevaLista = generarLista(
          listaFinal.tipo,
          {
            hora: listaFinal.hora,
            jugadores: listaFinal.jugadores,
            suplentes: listaFinal.suplentes,
            tituloCustom: listaFinal.tituloCustom,
            color: listaFinal.color
          }
        );
        
        await this.sendMessage(m.chat, { 
          delete: reaction.key 
        });
        
        const nuevoMensaje = await this.sendMessage(m.chat, {
          text: nuevaLista.text,
          mentions: nuevaLista.mentions
        });
        
        delete global.listasActivas[targetMessageId];
        listaFinal.messageKey = nuevoMensaje.key;
        listaFinal.timestamp = Date.now();
        global.listasActivas[nuevoMensaje.key.id] = listaFinal;
        
        delete global.listaUpdateTimers[targetMessageId];
        
        const totalJugadores = listaFinal.jugadores.flat().length;
        console.log(`✅ Lista ${listaFinal.id} actualizada (${totalJugadores} jugadores)`);
        
      } catch (error) {
        console.error(`❌ Error actualizando lista: ${error.message}`);
      }
    }, 3000);
    
  } catch (error) {
    console.error(`❌ Error procesando reacción: ${error.message}`);
  }
}

export const disabled = false;