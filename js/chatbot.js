/**
 * Chatbot del "Proceso interactivo".
 *
 * Motor de recuperación por coincidencia léxica: normaliza la consulta,
 * expande sinónimos y puntúa cada intención de la base de conocimiento
 * combinando coincidencias de frase y de palabra, con penalización por
 * términos genéricos. Funciona por completo en el navegador.
 */
const Chatbot = (() => {

  const VACIAS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'y', 'o', 'u',
    'en', 'que', 'qué', 'es', 'son', 'para', 'por', 'con', 'sin', 'se', 'su', 'sus', 'lo', 'le',
    'me', 'mi', 'te', 'tu', 'como', 'cómo', 'cual', 'cuál', 'donde', 'dónde', 'cuando', 'cuándo',
    'porque', 'por qué', 'muy', 'mas', 'más', 'este', 'esta', 'esto', 'ese', 'esa', 'eso', 'hay',
    'ser', 'estar', 'tiene', 'tienen', 'puede', 'pueden', 'sobre', 'entre', 'desde', 'hasta',
    'me', 'nos', 'yo', 'tu', 'usted', 'dime', 'explica', 'explicame', 'cuentame', 'quiero', 'saber'
  ]);

  const UMBRAL_CONFIANZA = 1.6;

  /** Minúsculas, sin tildes ni signos, espacios colapsados. */
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Sustituye abreviaturas y sinónimos por su forma extendida. */
  function expandir(textoNormalizado) {
    return textoNormalizado
      .split(' ')
      .map((palabra) => SINONIMOS[palabra] || palabra)
      .join(' ');
  }

  function tokenizar(texto) {
    return texto.split(' ').filter((t) => t.length > 2 && !VACIAS.has(t));
  }

  /**
   * Puntúa una intención frente a la consulta.
   * - Coincidencia de una clave completa (frase): 3 puntos, escalados por longitud.
   * - Coincidencia de palabra suelta de la clave: 1 punto.
   * - Coincidencia por prefijo (raíz de 5 letras): 0,6 puntos.
   */
  function puntuar(intencion, consulta, tokens) {
    let puntos = 0;

    intencion.claves.forEach((clave) => {
      const claveNorm = normalizar(clave);
      if (consulta.includes(claveNorm)) {
        puntos += 3 + Math.min(claveNorm.split(' ').length, 4) * 0.5;
        return;
      }
      const palabrasClave = tokenizar(claveNorm);
      palabrasClave.forEach((pc) => {
        if (tokens.includes(pc)) {
          puntos += 1;
        } else if (
          pc.length >= 5 &&
          tokens.some((t) => t.startsWith(pc.slice(0, 5)) || pc.startsWith(t.slice(0, 5)))
        ) {
          puntos += 0.6;
        }
      });
    });

    return puntos;
  }

  /** Devuelve { intencion, puntos } de la mejor coincidencia, o null. */
  function buscar(entrada) {
    const consulta = expandir(normalizar(entrada));
    const tokens = tokenizar(consulta);
    if (!tokens.length && consulta.length < 3) return null;

    let mejor = null;
    INTENCIONES.forEach((intencion) => {
      const puntos = puntuar(intencion, consulta, tokens);
      if (!mejor || puntos > mejor.puntos) mejor = { intencion, puntos };
    });

    return mejor && mejor.puntos >= UMBRAL_CONFIANZA ? mejor : null;
  }

  /** Respuesta de reserva cuando ninguna intención supera el umbral. */
  function respuestaReserva() {
    const temas = [
      '¿Qué es el mantenimiento predictivo?',
      '¿Por qué la exactitud engaña?',
      '¿Qué algoritmos se usan?',
      '¿Cómo se ajusta el umbral de decisión?',
      '¿Qué barreras frenan la adopción?'
    ];
    return {
      html:
        '<p>No encontré esa idea en el artículo. Mi base de conocimiento cubre el mantenimiento ' +
        'predictivo con machine learning: conceptos, algoritmos, métricas, resultados del experimento ' +
        'y barreras de adopción.</p>' +
        '<p>Prueba con alguna de estas:</p><ul>' +
        temas.map((t) => `<li>${t}</li>`).join('') +
        '</ul>',
      fuente: null
    };
  }

  /** API pública: devuelve { html, fuente } para una entrada del usuario. */
  function responder(entrada) {
    const hallazgo = buscar(entrada);
    if (!hallazgo) return respuestaReserva();
    return {
      html: hallazgo.intencion.respuesta,
      fuente: hallazgo.intencion.fuente || null
    };
  }

  return { responder, normalizar, buscar };
})();
