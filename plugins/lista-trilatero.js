/**
 * @fileoverview Handler for creating Trilatero player lists with reaction and color support
 * @author Carlos G
 * @license MIT
 * @copyright 2026 Carlos G. All rights reserved.
 * @requires ../lib/listas.js
 * @module handlers/Trilatero
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA | GitHub Repository}
 * 
 * @description Creates Trilatero player lists that support reaction-based 
 * player management and color specification. Part of the comprehensive 
 * list management ecosystem with 8-hour cache duration.
 * 
 * @example
 * .trilatero 9pm negro
 * .trilatero 21:00 rojo
 * .trilatero 15:30 azul
 */

import {
  generarLista,
  obtenerMenciones,
  inicializarLista,
} from "../lib/listas.js";

/**
 * @function handlerTri
 * @async
 * @param {Object} m - Message object from WhatsApp containing mentions
 * @param {Object} conn - Connection context object
 * @param {string} text - Command arguments (time and optional color)
 * @returns {Promise<void>}
 * @description Initializes a trilatero list with 4 teams of 4 players each plus substitutes,
 * organizes mentioned users into teams, supports color parameter, and registers list 
 * for reaction tracking with automatic 8-hour expiration
 */
let handlerTri = async (m, { conn, text }) => {
  const args = text?.trim().split(/\s+/) || [];
  const hora = args[0] || "12:00 pm";
  const color = args[1] || null;

  const mencionados = obtenerMenciones(m);
  const jugadores = [
    mencionados.slice(0, 4),
    mencionados.slice(4, 8),
    mencionados.slice(8, 12),
    mencionados.slice(12, 16),
  ];
  const suplentes = mencionados.slice(16, 18);

  const resultado = generarLista("trilatero", { 
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

  const estadoLista = inicializarLista("trilatero", {
    hora,
    jugadores,
    suplentes,
    color,
  });

  estadoLista.messageKey = mensaje.key;
  global.listasActivas[mensaje.key.id] = estadoLista;

  console.log(`Lista Trilátero creada - ID: ${estadoLista.id} - Color: ${color || 'ninguno'}`);
};

handlerTri.help = ["trilatero <time> [color]"];
handlerTri.tags = ["group"];
handlerTri.command = ["trilatero", "tri"];
handlerTri.group = true;

export default handlerTri;