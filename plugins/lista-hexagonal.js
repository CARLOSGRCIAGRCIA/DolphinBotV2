/**
 * @fileoverview Handler for creating Hexagonal player lists with reaction and color support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Hexagonal
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates Hexagonal player lists that support reaction-based 
 * player management and color specification. Part of the comprehensive 
 * list management ecosystem with 8-hour cache duration.
 * 
 * @example
 * .hexagonal 9pm morado
 * .hexagonal 19:00 naranja
 * .hexagonal 16:45 rosa
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerHexa
 * @async
 * @param {Object} m - Message object from WhatsApp
 * @param {Object} conn - Connection context object
 * @param {string} text - Command arguments (time and optional color)
 * @returns {Promise<void>}
 * @description Initializes a hexagonal list with 2 teams of 4 players plus 2 substitutes,
 * organizes mentioned users into teams, supports color parameter, and enables 
 * reaction-based participation with automatic 8-hour expiration
 */
let handlerHexa = async (m, { conn, text }) => {
  const args = text?.trim().split(/\s+/) || [];
  const hora = args[0] || "12:00 pm";
  const color = args[1] || null;

  const mencionados = obtenerMenciones(m);
  const jugadores = [
    mencionados.slice(0, 4), 
    mencionados.slice(4, 8)
  ];
  const suplentes = mencionados.slice(8, 10);

  const resultado = generarLista("hexagonal", { 
    hora, 
    jugadores, 
    suplentes,
    color 
  });

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
    color,
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Hexagonal creada - ID: ${estadoLista.id} - Color: ${color || 'ninguno'}`);
};

handlerHexa.help = ["hexagonal <time> [color]"];
handlerHexa.tags = ["group"];
handlerHexa.command = ["hexagonal", "hexa"];
handlerHexa.group = true;

export default handlerHexa;