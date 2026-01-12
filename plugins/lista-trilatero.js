import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @fileoverview Handler for creating Trilatero player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Trilatero
 * @version 1.0.0
 * 
 * This module creates Trilatero player lists that support reaction-based 
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
 * Creates a new trilatero (three-team) player list with reaction functionality
 * @async
 * @function handlerTri
 * @param {object} m - Message object from WhatsApp containing mentions
 * @param {object} conn - Connection context object
 * @param {string} text - Command arguments (time for the match)
 * @returns {Promise<void>}
 * @description Initializes a trilatero list with 3 teams of 4 players each plus substitutes,
 * organizes mentioned users into teams, and registers list for reaction tracking
 * @example
 * // Command: .trilatero 15:00
 * // With 16 mentioned users - creates 3 teams of 4 players each
 */
let handlerTri = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const mencionados = obtenerMenciones(m);

  const jugadores = [
    mencionados.slice(0, 4),
    mencionados.slice(4, 8),
    mencionados.slice(8, 12),
    mencionados.slice(12, 16),
  ];

  const suplentes = mencionados.slice(16, 18);

  const resultado = generarLista("trilatero", { hora, jugadores, suplentes });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("trilatero", {
    hora,
    jugadores,
    suplentes,
  });
  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Trilátero creada - ID: ${mensaje.key.id}`);
};

/**
 * Command help information displayed in bot help menu
 * @type {string[]}
 */
handlerTri.help = ["trilatero <time>"];

/**
 * Command categorization for organizational purposes
 * @type {string[]}
 */
handlerTri.tags = ["group"];

/**
 * Command triggers that users can type to activate this handler
 * @type {string[]}
 */
handlerTri.command = ["trilatero", "tri"];

/**
 * Restricts command usage to group chats only
 * @type {boolean}
 */
handlerTri.group = true;

export default handlerTri;