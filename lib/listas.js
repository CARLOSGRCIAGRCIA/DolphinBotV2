/**
 * Team list generator with auto-fill via reactions
 * @module listas-auto
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
  },
  scrim: {
    titulo: "SCRIM",
    escuadras: 1,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
  clk: {
    titulo: "CLK",
    escuadras: 1,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
  vv2: {
    titulo: "VV2 MATCH",
    escuadras: 1,
    jugadoresPorEscuadra: 6,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
  cuadrilatero: {
    titulo: "CUADRILÁTERO",
    escuadras: 3,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
  trilatero: {
    titulo: "TRILÁTERO",
    escuadras: 4,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
  hexagonal: {
    titulo: "HEXAGONAL",
    escuadras: 2,
    jugadoresPorEscuadra: 4,
    suplentes: 2,
    iconoLider: "👑",
    iconoJugador: "🥷🏻",
    mostrarSuplentes: true,
  },
};

/**
 * Check if emoji is valid for registration
 * Simplificado: acepta casi cualquier emoji excepto texto
 */
function esEmojiValido(emoji) {
  if (!emoji || emoji.trim() === "") return false;

  // Rechazar solo si es texto alfabético puro
  if (/^[a-zA-Z\s]+$/.test(emoji)) return false;

  // Aceptar cualquier emoji/símbolo
  return true;
}

/**
 * Parse time string to 24h format
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
 * Format time to 12h display
 */
function formatTime12h(hours, minutes) {
  const period = hours >= 12 ? "pm" : "am";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const paddedMinutes = String(minutes).padStart(2, "0");
  return `${displayHours}:${paddedMinutes} ${period}`;
}

/**
 * Add hours to time with timezone offset
 */
function addHours(hours, minutes, offset) {
  let newHours = hours + offset;
  if (newHours < 0) newHours += 24;
  if (newHours >= 24) newHours -= 24;
  return { hours: newHours, minutes };
}

/**
 * Generate schedule section
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
    text: `    𝐇𝐎𝐑𝐀𝐑𝐈𝐎
    🇲🇽 𝐌𝐄𝐗 : ${mxTime}
    🇨🇴 𝐂𝐎𝐋 : ${coTime}`,
    error: null,
  };
}

/**
 * Generate squad section
 */
function generarEscuadra(
  numero,
  jugadores = [],
  iconoLider = "👑",
  iconoJugador = "🥷🏻",
  totalJugadores = 4
) {
  const titulo =
    numero > 1 ? `          𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 ${numero}` : "          𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔";
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
 * Generate substitutes section
 */
function generarSuplentes(
  suplentes = [],
  iconoJugador = "🥷🏻",
  totalSuplentes = 2
) {
  let texto = `    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:\n`;
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
 * Generate complete team list
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
  } = opciones;

  const horarioResult = generarHorario(hora);
  if (horarioResult.error) {
    return { text: "", mentions: [], error: horarioResult.error };
  }

  let texto = `_*${tituloCustom || formato.titulo}*_\n            \n`;
  let allMentions = [];

  texto += horarioResult.text + "\n";
  texto += `    ¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒\n`;

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
 * AUTO-FILL SYSTEM: Process reaction and update list
 */
export function procesarReaccion(reaction, listaActual) {
  const { emoji, sender, isRemove = false } = reaction;

  // Si está quitando reacción, no validar emoji
  if (!isRemove && !esEmojiValido(emoji)) {
    return {
      actualizado: false,
      razon: "emoji_invalido",
      mensaje: null, // No enviar mensaje, solo ignorar
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

  // Clonar estado actual
  const nuevaLista = JSON.parse(JSON.stringify(listaActual));
  const { jugadores, suplentes } = nuevaLista;

  // Si está quitando reacción, remover de la lista
  if (isRemove) {
    let removido = false;

    // Buscar en escuadras
    for (let i = 0; i < jugadores.length; i++) {
      const index = jugadores[i].indexOf(sender);
      if (index !== -1) {
        jugadores[i].splice(index, 1);
        removido = true;
        break;
      }
    }

    // Buscar en suplentes
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
      mensaje: null, // Sin mensaje de confirmación
      listaActual: nuevaLista,
    };
  }

  // Si está agregando reacción, registrar en la lista
  // Verificar si ya está registrado
  for (const escuadra of jugadores) {
    if (escuadra.includes(sender)) {
      return {
        actualizado: false,
        razon: "ya_registrado",
        mensaje: null, // Sin mensaje, solo ignorar
        listaActual,
      };
    }
  }
  if (suplentes.includes(sender)) {
    return {
      actualizado: false,
      razon: "ya_registrado",
      mensaje: null, // Sin mensaje, solo ignorar
      listaActual,
    };
  }

  // Intentar agregar a escuadras
  for (let i = 0; i < formato.escuadras; i++) {
    if (!jugadores[i]) jugadores[i] = [];

    if (jugadores[i].length < formato.jugadoresPorEscuadra) {
      jugadores[i].push(sender);

      return {
        actualizado: true,
        razon: "agregado_escuadra",
        mensaje: null, // Sin mensaje de confirmación
        listaActual: nuevaLista,
      };
    }
  }

  // Si las escuadras están llenas, intentar suplentes
  if (formato.mostrarSuplentes && suplentes.length < formato.suplentes) {
    suplentes.push(sender);
    return {
      actualizado: true,
      razon: "agregado_suplente",
      mensaje: null, // Sin mensaje de confirmación
      listaActual: nuevaLista,
    };
  }

  // Lista llena - este sí notificar
  return {
    actualizado: false,
    razon: "lista_llena",
    mensaje: `⚠️ Lista llena. @${sender.split("@")[0]} no pudo ser agregado`,
    listaActual,
  };
}

/**
 * Initialize list state for auto-fill system
 */
export function inicializarLista(tipo, opciones = {}) {
  return {
    tipo,
    hora: opciones.hora || "12:00 pm",
    tituloCustom: opciones.tituloCustom,
    jugadores: opciones.jugadores || [],
    suplentes: opciones.suplentes || [],
  };
}

/**
 * Get format configuration
 */
export function obtenerFormato(tipo) {
  return FORMATOS[tipo] || null;
}

/**
 * List all available formats
 */
export function listarFormatos() {
  return Object.keys(FORMATOS);
}

/**
 * Extract mentions from WhatsApp message
 */
export function obtenerMenciones(m) {
  return (
    m.mentionedJid ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    []
  );
}

export default {
  generarLista,
  procesarReaccion,
  inicializarLista,
  obtenerFormato,
  listarFormatos,
  obtenerMenciones,
  esEmojiValido,
  FORMATOS,
};
