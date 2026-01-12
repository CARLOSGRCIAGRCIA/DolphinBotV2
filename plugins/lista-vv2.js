import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @fileoverview Handler for creating standard VV2 player lists with reaction support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/VV2
 * @version 1.0.0
 * 
 * This module creates standard VV2 player lists that support reaction-based 
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
 * Creates a new VV2 player list with reaction functionality
 * @async
 * @function handlerVv2
 * @param {object} m - Message object from WhatsApp
 * @param {object} conn - Connection/context object
 * @param {string} text - Command arguments (time)
 * @returns {Promise<void>}
 * @description Initializes a VV2 list with time, registers it for reaction tracking,
 * and sends an interactive message to the group
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

  console.log(`📋 Lista VV2 creada - ID: ${mensaje.key.id}`);
};

/**
 * Command help information
 * @type {string[]}
 */
handlerVv2.help = ["vv2 <time>"];

/**
 * Command categorization tags
 * @type {string[]}
 */
handlerVv2.tags = ["group"];

/**
 * Command triggers
 * @type {string[]}
 */
handlerVv2.command = ["vv2"];

/**
 * Group-only command restriction
 * @type {boolean}
 */
handlerVv2.group = true;

export default handlerVv2;