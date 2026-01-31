/**
 * @fileoverview Handler for creating Scrim player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Scrim
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates Scrim player lists that support reaction-based 
 * player management. Part of the comprehensive list management ecosystem
 * with 8-hour cache duration.
 * 
 * @example
 * .scrim 9pm
 * .scrim 19:00
 * .scrim 17:15
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerScrim
 * @async
 * @param {Object} m - Message object containing initial participant mentions
 * @param {Object} conn - Bot connection context
 * @param {string} text - Command arguments (time)
 * @returns {Promise<void>}
 * @description Initializes a scrim list that allows players to join/leave 
 * via reactions, enabling dynamic roster management for scrim events
 * with automatic 8-hour expiration
 */
let handlerScrim = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const jugadores = [obtenerMenciones(m)];

  const resultado = generarLista("scrim", { hora, jugadores });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("scrim", {
    hora,
    jugadores,
    suplentes: [],
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Scrim creada - ID: ${estadoLista.id}`);
};

handlerScrim.help = ["scrim <time>"];
handlerScrim.tags = ["group"];
handlerScrim.command = ["scrim"];
handlerScrim.group = true;

export default handlerScrim;