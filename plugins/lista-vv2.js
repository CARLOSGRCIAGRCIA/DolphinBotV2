/**
 * @fileoverview Handler for creating standard VV2 player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/VV2
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates standard VV2 player lists that support reaction-based 
 * player management. Part of the comprehensive list management ecosystem
 * with 8-hour cache duration.
 * 
 * @example
 * .vv2 9pm
 * .vv2 21:00
 * .vv2 14:30
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerVv2
 * @async
 * @param {Object} m - Message object from WhatsApp
 * @param {Object} conn - Connection/context object
 * @param {string} text - Command arguments (time)
 * @returns {Promise<void>}
 * @description Initializes a VV2 list with time, registers it for reaction tracking,
 * and sends an interactive message to the group with automatic 8-hour expiration
 */
let handlerVv2 = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const jugadores = [obtenerMenciones(m)];

  const resultado = generarLista("vv2", { hora, jugadores });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("vv2", {
    hora,
    jugadores,
    suplentes: [],
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista VV2 creada - ID: ${estadoLista.id}`);
};

handlerVv2.help = ["vv2 <time>"];
handlerVv2.tags = ["group"];
handlerVv2.command = ["vv2"];
handlerVv2.group = true;

export default handlerVv2;