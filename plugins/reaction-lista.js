import { procesarReaccion, generarLista } from '../lib/listas.js'

/**
 * @fileoverview Handler for creating standard Ascenso player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/ascenso
 * @version 1.0.0
 * 
 * This module creates standard Ascenso player lists that support reaction-based 
 * player management. Part of the comprehensive list management ecosystem.
 * 
 * CREDITS & USAGE TERMS:
 * - Developed by: Carlos G
 * - GitHub: https://github.com/CARLOSGRCIAGRCIA
 * - WhatsApp Contact: wa.me/529516526675
 * - Attribution required in any usage scenario
 * - Derivative works must maintain original authorship credit
 * - Commercial use permitted with proper credit
 */

global.listasActivas = global.listasActivas || {}
global.listaUpdateTimers = global.listaUpdateTimers || {}

/**
 * Processes reaction messages to update active lists
 * @async
 * @function before
 * @param {object} m - The message object from WhatsApp
 * @param {object} this - Bot context/reference
 * @returns {Promise<void>}
 * @description Handles emoji reactions to list messages, updates player counts,
 * and refreshes the list display after a short delay
 */
export async function before(m) {
  if (m.mtype !== 'reactionMessage') return
  
  try {
    const reaction = m.message?.reactionMessage
    if (!reaction) return
    
    const emoji = reaction.text
    const targetMessageId = reaction.key?.id
    const sender = m.sender
    const isRemove = !emoji || emoji === ''
    
    const listaActual = global.listasActivas[targetMessageId]
    if (!listaActual) return
    
    console.log(`📝 Reacción: ${emoji || 'removed'} de ${sender.split('@')[0]}`)
    
    const resultado = procesarReaccion(
      { emoji, sender, isRemove },
      listaActual
    )
    
    if (!resultado.actualizado) {
      if (resultado.razon === 'lista_llena') {
        await this.reply(m.chat, resultado.mensaje, null, { 
          mentions: [sender] 
        })
      }
      return
    }
    
    global.listasActivas[targetMessageId] = resultado.listaActual
    
    if (global.listaUpdateTimers[targetMessageId]) {
      clearTimeout(global.listaUpdateTimers[targetMessageId])
    }
    
    global.listaUpdateTimers[targetMessageId] = setTimeout(async () => {
      try {
        const listaFinal = global.listasActivas[targetMessageId]
        if (!listaFinal) return
        
        const nuevaLista = generarLista(
          listaFinal.tipo,
          {
            hora: listaFinal.hora,
            jugadores: listaFinal.jugadores,
            suplentes: listaFinal.suplentes,
            tituloCustom: listaFinal.tituloCustom
          }
        )
        
        await this.sendMessage(m.chat, { 
          delete: reaction.key 
        })
        
        const nuevoMensaje = await this.sendMessage(m.chat, {
          text: nuevaLista.text,
          mentions: nuevaLista.mentions
        })
        
        delete global.listasActivas[targetMessageId]
        listaFinal.messageKey = nuevoMensaje.key
        global.listasActivas[nuevoMensaje.key.id] = listaFinal
        
        delete global.listaUpdateTimers[targetMessageId]
        
        console.log(`Lista actualizada (${Object.keys(listaFinal.jugadores.flat()).length} jugadores)`)
        
      } catch (error) {
        console.error('Error actualizando lista:', error.message)
      }
    }, 3000)
    
  } catch (error) {
    console.error('Error procesando reacción:', error)
  }
}

/**
 * Module activation status
 * @type {boolean}
 */
export const disabled = false