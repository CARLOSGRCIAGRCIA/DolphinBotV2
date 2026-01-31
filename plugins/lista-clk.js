/**
 * @fileoverview Handler for creating CLK player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/CLK
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates CLK player lists that support reaction-based 
 * player management. Part of the comprehensive list management ecosystem
 * with 8-hour cache duration.
 * 
 * @example
 * .clk 9pm
 * .clk 14:30
 * .clk 20:00
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handler
 * @async
 * @param {Object} m - Message object containing initial mentions
 * @param {Object} conn - Bot connection context
 * @param {string} text - Command arguments (time)
 * @returns {Promise<void>}
 * @description Generates a CLK list that users can join via reactions, enabling
 * automatic roster management without manual updates with automatic 8-hour expiration
 */
let handler = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const jugadores = [obtenerMenciones(m)];

  const resultado = generarLista("clk", { hora, jugadores });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("clk", {
    hora,
    jugadores,
    suplentes: [],
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista CLK creada - ID: ${estadoLista.id}`);
};

handler.help = ["clk <time>"];
handler.tags = ["group"];
handler.command = ["clk"];
handler.group = true;

export default handler;