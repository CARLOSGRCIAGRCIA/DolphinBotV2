/**
 * @fileoverview Handler for creating Cuadrilatero player lists with reaction and color support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Cuadrilatero
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA|GitHub Repository}
 * 
 * @description Creates Cuadrilatero player lists that support reaction-based 
 * player management and color specification. Part of the comprehensive 
 * list management ecosystem with 8-hour cache duration.
 * 
 * @example
 * .cuadrilatero 9pm blanco
 * .cuadrilatero 20:00 verde
 * .cuadrilatero 18:30 amarillo
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerCuadri
 * @async
 * @param {Object} m - Message object containing user mentions
 * @param {Object} conn - Bot connection context
 * @param {string} text - Command arguments (time and optional color)
 * @returns {Promise<void>}
 * @description Initializes a cuadrilatero list with 3 teams of 4 players and 2 substitutes,
 * organizes mentioned users into teams, supports color parameter, and enables 
 * reaction-based player management with automatic 8-hour expiration
 */
let handlerCuadri = async (m, { conn, text }) => {
  const args = text?.trim().split(/\s+/) || [];
  const hora = args[0] || "12:00 pm";
  const color = args[1] || null;

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
    color,
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
    color,
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`📋 Lista Cuadrilátero creada - ID: ${estadoLista.id} - Color: ${color || 'ninguno'}`);
};

handlerCuadri.help = ["cuadrilatero <time> [color]"];
handlerCuadri.tags = ["group"];
handlerCuadri.command = ["cuadrilatero", "cuadri"];
handlerCuadri.group = true;

export default handlerCuadri;