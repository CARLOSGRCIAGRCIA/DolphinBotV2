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
 * Creates a new standard Ascenso player list with reaction functionality
 * @async
 * @function handlerAscenso
 * @param {object} m - Message object containing initial participant mentions
 * @param {object} conn - Bot connection context
 * @param {string} text - Optional time parameter for the ascenso event
 * @returns {Promise<void>}
 * @description Initializes a standard ascenso list that allows players to join/leave 
 * via reactions, enabling dynamic roster management for ascenso events
 * @example
 * // Command: .ascenso 19:00
 * // Creates ascenso list for 19:00 with reaction-based enrollment
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

  console.log(`📋 Lista Ascenso creada - ID: ${mensaje.key.id}`);
};

/**
 * Command help information for user reference
 * @type {string[]}
 */
handlerAscenso.help = ["ascenso <time>"];

/**
 * Command category for organizational purposes
 * @type {string[]}
 */
handlerAscenso.tags = ["group"];

/**
 * Command triggers and aliases
 * @type {string[]}
 */
handlerAscenso.command = ["ascenso", "asc"];

/**
 * Group chat restriction flag
 * @type {boolean}
 */
handlerAscenso.group = true;

export default handlerAscenso;