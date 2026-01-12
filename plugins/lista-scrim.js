import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @fileoverview Handler for creating Scrim player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/scrim
 * @version 1.0.0
 * 
 * This module creates Scrim player lists that support reaction-based 
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
 * Creates a new Scrim player list with reaction functionality
 * @async
 * @function handlerScrim
 * @param {object} m - Message object containing initial participant mentions
 * @param {object} conn - Bot connection context
 * @param {string} text - Optional time parameter for the scrim event
 * @returns {Promise<void>}
 * @description Initializes a scrim list that allows players to join/leave 
 * via reactions, enabling dynamic roster management for scrim events
 * @example
 * // Command: .scrim 19:00
 * // Creates scrim list for 19:00 with reaction-based enrollment
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

  console.log(`📋 Lista Scrim creada - ID: ${mensaje.key.id}`);
};

/**
 * Command help information for user reference
 * @type {string[]}
 */
handlerScrim.help = ["scrim <time>"];

/**
 * Command category for organizational purposes
 * @type {string[]}
 */
handlerScrim.tags = ["group"];

/**
 * Command triggers and aliases
 * @type {string[]}
 */
handlerScrim.command = ["scrim"];

/**
 * Group chat restriction flag
 * @type {boolean}
 */
handlerScrim.group = true;

export default handlerScrim;