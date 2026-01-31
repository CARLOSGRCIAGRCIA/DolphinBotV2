/**
 * @fileoverview Team list generator with auto-fill via reactions, cache management, and multi-list support
 * @module listas-auto
 * @author Carlos G
 * @license MIT
 * @version 2.0.0
 * @see {@link https://github.com/CARLOSGRCIAGRCIA | GitHub Repository}
 */

const FORMATOS = {
  estandar: {
    titulo: "ASCENSO FFWS",
    escuadras: 1,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: false,
  },
  scrim: {
    titulo: "SCRIM",
    escuadras: 1,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: false,
  },
  clk: {
    titulo: "CLK",
    escuadras: 1,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: false,
  },
  vv2: {
    titulo: "VV2 MATCH",
    escuadras: 1,
    jugadoresPorEscuadra: 6,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: false,
  },
  cuadrilatero: {
    titulo: "CUADRILÁTERO",
    escuadras: 3,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: true,
  },
  trilatero: {
    titulo: "TRILÁTERO",
    escuadras: 4,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: true,
  },
  hexagonal: {
    titulo: "HEXAGONAL",
    escuadras: 2,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
    soportaColor: true,
  },
};

const CACHE_DURATION = 8 * 60 * 60 * 1000;

global.listasActivas = global.listasActivas || {};
global.listaCacheCleanupInterval = global.listaCacheCleanupInterval || null;

/**
 * @function iniciarLimpiezaAutomatica
 * @returns {void}
 * @description Starts automatic cleanup of expired lists every 30 minutes
 */
function iniciarLimpiezaAutomatica() {
  if (global.listaCacheCleanupInterval) return;

  global.listaCacheCleanupInterval = setInterval(() => {
    limpiarListasExpiradas();
  }, 30 * 60 * 1000);
}

/**
 * @function limpiarListasExpiradas
 * @returns {number} Number of expired lists removed
 * @description Removes lists that have exceeded the 8-hour cache duration
 */
export function limpiarListasExpiradas() {
  const now = Date.now();
  let removidas = 0;

  for (const [messageId, lista] of Object.entries(global.listasActivas)) {
    if (now - lista.timestamp > CACHE_DURATION) {
      delete global.listasActivas[messageId];
      removidas++;
    }
  }

  if (removidas > 0) {
    console.log(`🗑️ Listas expiradas eliminadas: ${removidas}`);
  }

  return removidas;
}

/**
 * @function generarIdUnico
 * @returns {string} Unique identifier for list tracking
 * @description Generates a unique ID combining timestamp and random string
 */
function generarIdUnico() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * @function esEmojiValido
 * @param {string} emoji - Emoji string to validate
 * @returns {boolean} True if emoji is valid for registration
 * @description Validates that reaction emoji is appropriate for list registration
 */
function esEmojiValido(emoji) {
  if (!emoji || emoji.trim() === "") return false;
  if (/^[a-zA-Z\s]+$/.test(emoji)) return false;
  return true;
}

/**
 * @function parseTime
 * @param {string} timeStr - Time string in various formats
 * @returns {Object} Parsed time object with hours, minutes, and potential error
 * @description Parses time string supporting 12h (9pm, 9:00 pm) and 24h (21:00) formats
 */
function parseTime(timeStr) {
  if (!timeStr) return { hours: 12, minutes: 0, error: null };
  const str = timeStr.toLowerCase().trim();
  const match12h = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (match12h) {
    let hours = parseInt(match12h[1]);
    const minutes = parseInt(match12h[2] || "0");
    const period = match12h[3].toLowerCase();
    if (hours < 1 || hours > 12) {
      return {
        hours: 0,
        minutes: 0,
        error: "Invalid hour for 12h format (must be 1-12)",
      };
    }
    if (minutes < 0 || minutes > 59) {
      return { hours: 0, minutes: 0, error: "Invalid minutes (must be 0-59)" };
    }
    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return { hours, minutes, error: null };
  }
  const match24h = str.match(/^(\d{1,2}):(\d{2})$/);
  if (match24h) {
    const hours = parseInt(match24h[1]);
    const minutes = parseInt(match24h[2]);
    if (hours < 0 || hours > 23) {
      return {
        hours: 0,
        minutes: 0,
        error: "Invalid hour for 24h format (must be 0-23)",
      };
    }
    if (minutes < 0 || minutes > 59) {
      return { hours: 0, minutes: 0, error: "Invalid minutes (must be 0-59)" };
    }
    if (hours < 12) {
      return {
        hours: 0,
        minutes: 0,
        error: "Use 12h format with am/pm or 24h >= 12:00",
      };
    }
    return { hours, minutes, error: null };
  }
  return {
    hours: 0,
    minutes: 0,
    error: "Invalid time format. Use: 9:00 pm, 21:00, or 9pm",
  };
}

/**
 * @function formatTime12h
 * @param {number} hours - Hour in 24h format
 * @param {number} minutes - Minutes
 * @returns {string} Formatted time in 12h format with am/pm
 * @description Converts 24h time to 12h display format
 */
function formatTime12h(hours, minutes) {
  const period = hours >= 12 ? "pm" : "am";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const paddedMinutes = String(minutes).padStart(2, "0");
  return `${displayHours}:${paddedMinutes} ${period}`;
}

/**
 * @function addHours
 * @param {number} hours - Base hour
 * @param {number} minutes - Base minutes
 * @param {number} offset - Hours to add (can be negative)
 * @returns {Object} New time object with hours and minutes
 * @description Adds hours to a time with proper 24h wraparound
 */
function addHours(hours, minutes, offset) {
  let newHours = hours + offset;
  if (newHours < 0) newHours += 24;
  if (newHours >= 24) newHours -= 24;
  return { hours: newHours, minutes };
}

/**
 * @function generarHorario
 * @param {string} [timeStr="12:00 pm"] - Time string to parse and format
 * @returns {Object} Object with formatted schedule text and potential error
 * @description Generates schedule section with Mexico and Colombia timezones
 */
function generarHorario(timeStr = "12:00 pm") {
  const parsed = parseTime(timeStr);
  if (parsed.error) {
    return {
      text: "",
      error: `⚠️ ${parsed.error}\n\n📝 Examples:\n• 9:00 pm\n• 09:00 pm\n• 9pm\n• 21:00`,
    };
  }
  const { hours, minutes } = parsed;
  const mxTime = formatTime12h(hours, minutes);
  const coTime24h = addHours(hours, minutes, 1);
  const coTime = formatTime12h(coTime24h.hours, coTime24h.minutes);
  return {
    text: `    HORARIO\n    🇲🇽 MEX : ${mxTime}\n    🇨🇴 COL : ${coTime}`,
    error: null,
  };
}

/**
 * @function generarSeccionColor
 * @param {string} color - Color name for the match
 * @returns {string} Formatted color section
 * @description Generates color section display for supported list types
 */
function generarSeccionColor(color) {
  if (!color) return "";
  return `    *COLOR:* ${color.toUpperCase()}\n\n`;
}

/**
 * @function generarEscuadra
 * @param {number} numero - Squad number
 * @param {Array<string>} [jugadores=[]] - Array of player JIDs
 * @param {string} [iconoLider="👑"] - Leader icon
 * @param {string} [iconoJugador="🥷🏻"] - Player icon
 * @param {number} [totalJugadores=4] - Total player slots
 * @returns {Object} Object with squad text and mentions array
 * @description Generates formatted squad section with player slots
 */
function generarEscuadra(
  numero,
  jugadores = [],
  iconoLider = "👑",
  iconoJugador = "🥷🏻",
  totalJugadores = 4
) {
  const titulo =
    numero > 1 ? `          ESCUADRA ${numero}` : "          ESCUADRA";
  let texto = `${titulo}\n`;
  const mentions = [];
  for (let i = 0; i < totalJugadores; i++) {
    const icono = i === 0 ? iconoLider : iconoJugador;
    if (jugadores[i]) {
      const jid = jugadores[i];
      mentions.push(jid);
      texto += `    ${icono} ┇ @${jid.split("@")[0]}\n`;
    } else {
      texto += `    ${icono} ┇ \n`;
    }
  }
  return { text: texto, mentions };
}

/**
 * @function generarSuplentes
 * @param {Array<string>} [suplentes=[]] - Array of substitute player JIDs
 * @param {string} [iconoJugador="🥷🏻"] - Player icon
 * @param {number} [totalSuplentes=2] - Total substitute slots
 * @returns {Object} Object with substitutes text and mentions array
 * @description Generates formatted substitutes section
 */
function generarSuplentes(
  suplentes = [],
  iconoJugador = "🥷🏻",
  totalSuplentes = 2
) {
  let texto = `    ᅠʚ SUPLENTE:\n`;
  const mentions = [];
  for (let i = 0; i < totalSuplentes; i++) {
    if (suplentes[i]) {
      const jid = suplentes[i];
      mentions.push(jid);
      texto += `    ${iconoJugador} ┇ @${jid.split("@")[0]}\n`;
    } else {
      texto += `    ${iconoJugador} ┇ \n`;
    }
  }
  return { text: texto, mentions };
}

/**
 * @function generarLista
 * @param {string} [tipo="estandar"] - List format type
 * @param {Object} [opciones={}] - Configuration options
 * @param {string} [opciones.hora] - Match time
 * @param {Array<Array<string>>} [opciones.jugadores] - Players organized by squad
 * @param {Array<string>} [opciones.suplentes] - Substitute players
 * @param {string} [opciones.tituloCustom] - Custom title override
 * @param {string} [opciones.color] - Color for color-supported formats
 * @returns {Object} Generated list with text, mentions, and potential error
 * @description Main function to generate complete team list with all sections
 */
export function generarLista(tipo = "estandar", opciones = {}) {
  const formato = FORMATOS[tipo];
  if (!formato) {
    return {
      text: "",
      mentions: [],
      error: `❌ Unknown format: ${tipo}\n\nAvailable: ${Object.keys(FORMATOS).join(", ")}`,
    };
  }
  const {
    hora = "12:00 pm",
    jugadores = [],
    suplentes = [],
    tituloCustom,
    color,
  } = opciones;
  const horarioResult = generarHorario(hora);
  if (horarioResult.error) {
    return { text: "", mentions: [], error: horarioResult.error };
  }
  let texto = `_*${tituloCustom || formato.titulo}*_\n            \n`;
  let allMentions = [];
  texto += horarioResult.text + "\n";

  if (formato.soportaColor && color) {
    texto += generarSeccionColor(color);
  }

  texto += `    ¬ JUGADORES PRESENTES\n`;
  for (let i = 0; i < formato.escuadras; i++) {
    const numeroEscuadra = formato.escuadras > 1 ? i + 1 : 0;
    const jugadoresEscuadra = jugadores[i] || [];
    const { text, mentions } = generarEscuadra(
      numeroEscuadra,
      jugadoresEscuadra,
      formato.iconoLider,
      formato.iconoJugador,
      formato.jugadoresPorEscuadra
    );
    texto += text;
    allMentions.push(...mentions);
    if (i < formato.escuadras - 1) texto += "\n";
  }
  if (formato.mostrarSuplentes) {
    const { text, mentions } = generarSuplentes(
      suplentes,
      formato.iconoJugador,
      formato.suplentes
    );
    texto += "\n" + text;
    allMentions.push(...mentions);
  }
  return {
    text: texto,
    mentions: [...new Set(allMentions)],
    error: null,
  };
}

/**
 * @function procesarReaccion
 * @param {Object} reaction - Reaction event data
 * @param {string} reaction.emoji - Emoji used in reaction
 * @param {string} reaction.sender - JID of user who reacted
 * @param {boolean} [reaction.isRemove=false] - Whether reaction was removed
 * @param {Object} listaActual - Current list state
 * @returns {Object} Processing result with update status and new list state
 * @description Processes emoji reactions to add/remove players from active lists
 */
export function procesarReaccion(reaction, listaActual) {
  const { emoji, sender, isRemove = false } = reaction;
  if (!isRemove && !esEmojiValido(emoji)) {
    return {
      actualizado: false,
      razon: "emoji_invalido",
      mensaje: null,
      listaActual,
    };
  }
  const formato = FORMATOS[listaActual.tipo];
  if (!formato) {
    return {
      actualizado: false,
      razon: "formato_invalido",
      listaActual,
    };
  }
  const nuevaLista = JSON.parse(JSON.stringify(listaActual));
  const { jugadores, suplentes } = nuevaLista;
  if (isRemove) {
    let removido = false;
    for (let i = 0; i < jugadores.length; i++) {
      const index = jugadores[i].indexOf(sender);
      if (index !== -1) {
        jugadores[i].splice(index, 1);
        removido = true;
        break;
      }
    }
    if (!removido) {
      const index = suplentes.indexOf(sender);
      if (index !== -1) {
        suplentes.splice(index, 1);
        removido = true;
      }
    }
    return {
      actualizado: removido,
      razon: removido ? "removido" : "no_encontrado",
      mensaje: null,
      listaActual: nuevaLista,
    };
  }
  for (const escuadra of jugadores) {
    if (escuadra.includes(sender)) {
      return {
        actualizado: false,
        razon: "ya_registrado",
        mensaje: null,
        listaActual,
      };
    }
  }
  if (suplentes.includes(sender)) {
    return {
      actualizado: false,
      razon: "ya_registrado",
      mensaje: null,
      listaActual,
    };
  }
  for (let i = 0; i < formato.escuadras; i++) {
    if (!jugadores[i]) jugadores[i] = [];
    if (jugadores[i].length < formato.jugadoresPorEscuadra) {
      jugadores[i].push(sender);
      return {
        actualizado: true,
        razon: "agregado_escuadra",
        mensaje: null,
        listaActual: nuevaLista,
      };
    }
  }
  if (formato.mostrarSuplentes && suplentes.length < formato.suplentes) {
    suplentes.push(sender);
    return {
      actualizado: true,
      razon: "agregado_suplente",
      mensaje: null,
      listaActual: nuevaLista,
    };
  }
  return {
    actualizado: false,
    razon: "lista_llena",
    mensaje: `⚠️ Lista llena. @${sender.split("@")[0]} no pudo ser agregado`,
    listaActual,
  };
}

/**
 * @function inicializarLista
 * @param {string} tipo - List format type
 * @param {Object} [opciones={}] - Initialization options
 * @returns {Object} Initialized list state with metadata
 * @description Creates new list state object with unique ID and timestamp
 */
export function inicializarLista(tipo, opciones = {}) {
  iniciarLimpiezaAutomatica();

  return {
    id: generarIdUnico(),
    tipo,
    hora: opciones.hora || "12:00 pm",
    color: opciones.color || null,
    tituloCustom: opciones.tituloCustom,
    jugadores: opciones.jugadores || [],
    suplentes: opciones.suplentes || [],
    timestamp: Date.now(),
  };
}

/**
 * @function obtenerFormato
 * @param {string} tipo - Format type to retrieve
 * @returns {Object|null} Format configuration or null if not found
 * @description Retrieves format configuration for specified list type
 */
export function obtenerFormato(tipo) {
  return FORMATOS[tipo] || null;
}

/**
 * @function listarFormatos
 * @returns {Array<string>} Array of available format names
 * @description Returns list of all available format types
 */
export function listarFormatos() {
  return Object.keys(FORMATOS);
}

/**
 * @function obtenerMenciones
 * @param {Object} m - WhatsApp message object
 * @returns {Array<string>} Array of mentioned user JIDs
 * @description Extracts user mentions from WhatsApp message
 */
export function obtenerMenciones(m) {
  return (
    m.mentionedJid ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []
  );
}

/**
 * @function obtenerListaActiva
 * @param {string} messageId - Message ID to lookup
 * @returns {Object|null} Active list or null if not found/expired
 * @description Retrieves active list by message ID, checking expiration
 */
export function obtenerListaActiva(messageId) {
  const lista = global.listasActivas[messageId];
  if (!lista) return null;

  if (Date.now() - lista.timestamp > CACHE_DURATION) {
    delete global.listasActivas[messageId];
    return null;
  }

  return lista;
}

/**
 * @function contarListasActivas
 * @returns {number} Number of currently active lists
 * @description Returns count of active lists in cache
 */
export function contarListasActivas() {
  return Object.keys(global.listasActivas).length;
}

export default {
  generarLista,
  procesarReaccion,
  inicializarLista,
  obtenerFormato,
  listarFormatos,
  obtenerMenciones,
  obtenerListaActiva,
  contarListasActivas,
  limpiarListasExpiradas,
  esEmojiValido,
  FORMATOS,
  CACHE_DURATION,
};