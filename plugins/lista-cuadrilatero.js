import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @fileoverview Handler for creating Cuadrilatero player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/cuadrilatero
 * @version 1.0.0
 * 
 * This module creates Cuadrilatero player lists that support reaction-based 
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
 * Creates a new cuadrilatero (four-team) player list with reaction functionality
 * @async
 * @function handlerCuadri
 * @param {object} m - Message object containing user mentions
 * @param {object} conn - Bot connection context
 * @param {string} text - Optional time parameter for the match
 * @returns {Promise<void>}
 * @description Initializes a cuadrilatero list with 3 teams of 4 players and 2 substitutes,
 * organizes mentioned users into teams, and enables reaction-based player management
 * @example
 * // Command: .cuadrilatero 20:00
 * // With 12 mentioned users - creates 3 teams of 4 players each
 */
let handlerCuadri = async (m, { conn, text }) => {
  const hora = text || "12:00 pm";
  const mencionados = obtenerMenciones(m);

  const jugadores = [
    mencionados.slice(0, 4),
    mencionados.slice(4, 8),
    mencionados.slice(8, 12),
  ];

  const suplentes = mencionados.slice(12, 14);

  const resultado = generarLista("cuadrilatero", {
    hora,
    jugadores,
    suplentes,
  });

  if (resultado.error) {
    return m.reply(resultado.error);
  }

  const mensaje = await conn.reply(m.chat, resultado.text, m, {
    mentions: resultado.mentions,
  });

  const estadoLista = inicializarLista("cuadrilatero", {
    hora,
    jugadores,
    suplentes,
  });
  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Cuadrilátero creada - ID: ${mensaje.key.id}`);
};

/**
 * Command usage information for help system
 * @type {string[]}
 */
handlerCuadri.help = ["cuadrilatero <time>"];

/**
 * Organizational tags for command categorization
 * @type {string[]}
 */
handlerCuadri.tags = ["group"];

/**
 * Command triggers and aliases
 * @type {string[]}
 */
handlerCuadri.command = ["cuadrilatero", "cuadri"];

/**
 * Group-only execution restriction
 * @type {boolean}
 */
handlerCuadri.group = true;

export default handlerCuadri;