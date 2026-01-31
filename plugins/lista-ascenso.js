/**
 * @fileoverview Handler for creating standard Ascenso player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Ascenso
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates standard Ascenso player lists that support reaction-based 
 * player management. Part of the comprehensive list management ecosystem
 * with 8-hour cache duration.
 * 
 * @example
 * .ascenso 9pm
 * .ascenso 19:00
 * .asc 15:30
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerAscenso
 * @async
 * @param {Object} m - Message object containing initial participant mentions
 * @param {Object} conn - Bot connection context
 * @param {string} text - Command arguments (time)
 * @returns {Promise<void>}
 * @description Initializes a standard ascenso list that allows players to join/leave 
 * via reactions, enabling dynamic roster management for ascenso events
 * with automatic 8-hour expiration
 */
let handlerAscenso = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const jugadores = [obtenerMenciones(m)];

  const resultado = generarLista("estandar", { hora, jugadores });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("estandar", {
    hora,
    jugadores,
    suplentes: [],
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Ascenso creada - ID: ${estadoLista.id}`);
};

handlerAscenso.help = ["ascenso <time>"];
handlerAscenso.tags = ["group"];
handlerAscenso.command = ["ascenso", "asc"];
handlerAscenso.group = true;

export default handlerAscenso;