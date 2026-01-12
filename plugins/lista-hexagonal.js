import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @fileoverview Handler for creating Hexagonal player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Hexagonal
 * @version 1.0.0
 * 
 * This module creates Hexagonal player lists that support reaction-based 
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
 * Creates a new hexagonal (6v6) player list with reaction functionality
 * @async
 * @function handlerHexa
 * @param {object} m - Message object from WhatsApp
 * @param {object} conn - Connection context object
 * @param {string} text - Command arguments (match time)
 * @returns {Promise<void>}
 * @description Initializes a hexagonal list with 2 teams of 4 players plus 2 substitutes,
 * organizes mentioned users into teams, and enables reaction-based participation
 * @example
 * // Command: .hexagonal 18:30
 * // With 8 mentioned users - creates 2 teams of 4 players
 */
let handlerHexa = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const mencionados = obtenerMenciones(m);

  const jugadores = [mencionados.slice(0, 4), mencionados.slice(4, 8)];

  const suplentes = mencionados.slice(8, 10);

  const resultado = generarLista("hexagonal", { hora, jugadores, suplentes });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("hexagonal", {
    hora,
    jugadores,
    suplentes,
  });
  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Hexagonal creada - ID: ${mensaje.key.id}`);
};

/**
 * Command help information for user guidance
 * @type {string[]}
 */
handlerHexa.help = ["hexagonal <time>"];

/**
 * Command category tags for organization
 * @type {string[]}
 */
handlerHexa.tags = ["group"];

/**
 * Command aliases that trigger this handler
 * @type {string[]}
 */
handlerHexa.command = ["hexagonal", "hexa"];

/**
 * Restricts command to group chat environments
 * @type {boolean}
 */
handlerHexa.group = true;

export default handlerHexa;