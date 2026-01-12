import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

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

global.listasActivas = global.listasActivas || {};

/**
 * Creates a new CLK list with automatic reaction-based player enrollment
 * @async
 * @function handler
 * @param {object} m - Message object containing initial mentions
 * @param {object} conn - Bot connection context
 * @param {string} text - Optional time parameter for the activity
 * @returns {Promise<void>}
 * @description Generates a CLK list that users can join via reactions, enabling
 * automatic roster management without manual updates
 * @example
 * // Command: .clk 14:30
 * // Creates list for 14:30 that users can join by reacting
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

  console.log(`📋 Lista CLK creada - ID: ${mensaje.key.id}`);
  console.log(`📋 Key guardada:`, JSON.stringify(mensaje.key));
};

/**
 * Command syntax help for users
 * @type {string[]}
 */
handler.help = ["clk <time>"];

/**
 * Command classification tags
 * @type {string[]}
 */
handler.tags = ["group"];

/**
 * Primary command trigger
 * @type {string[]}
 */
handler.command = ["clk"];

/**
 * Restricts usage to group chat environments
 * @type {boolean}
 */
handler.group = true;

export default handler;