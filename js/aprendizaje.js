/**
 * Componentes de aprendizaje del "Proceso interactivo": test de comprensión
 * y tarjetas de repaso (flashcards).
 */

/* ======================= Test de comprensión ======================= */
const Test = (() => {
  const LETRAS = ['A', 'B', 'C', 'D'];
  let contenedor = null;
  let indice = 0;
  let aciertos = 0;
  let respondida = false;

  function iniciar(elemento) {
    contenedor = elemento;
    indice = 0;
    aciertos = 0;
    respondida = false;
    pintarPregunta();
  }

  function pintarPregunta() {
    const item = PREGUNTAS_TEST[indice];
    const progreso = (indice / PREGUNTAS_TEST.length) * 100;

    contenedor.innerHTML = `
      <div class="barra"><div class="barra__relleno" style="width:${progreso}%"></div></div>
      <p class="test__contador" id="contador">Pregunta ${indice + 1} de ${PREGUNTAS_TEST.length}
        · Aciertos: ${aciertos}</p>
      <p class="test__pregunta">${item.pregunta}</p>
      <div class="opciones" role="group" aria-label="Opciones de respuesta"></div>
      <div class="retro" id="retro" hidden></div>
      <button class="boton boton--principal" id="siguiente" type="button" hidden>Siguiente</button>
    `;

    const zona = contenedor.querySelector('.opciones');
    item.opciones.forEach((texto, i) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'opcion';
      boton.innerHTML = `<span class="opcion__letra" aria-hidden="true">${LETRAS[i]}</span><span>${texto}</span>`;
      boton.addEventListener('click', () => responder(i));
      zona.appendChild(boton);
    });

    contenedor.querySelector('#siguiente').addEventListener('click', avanzar);
  }

  function responder(elegida) {
    if (respondida) return;
    respondida = true;

    const item = PREGUNTAS_TEST[indice];
    const botones = [...contenedor.querySelectorAll('.opcion')];
    const acerto = elegida === item.correcta;
    if (acerto) aciertos += 1;
    contenedor.querySelector('#contador').textContent =
      `Pregunta ${indice + 1} de ${PREGUNTAS_TEST.length} · Aciertos: ${aciertos}`;

    botones.forEach((boton, i) => {
      boton.disabled = true;
      if (i === item.correcta) boton.classList.add('opcion--correcta');
      else if (i === elegida) boton.classList.add('opcion--incorrecta');
    });

    const retro = contenedor.querySelector('#retro');
    retro.innerHTML = `<b>${acerto ? '✅ Correcto.' : '❌ No es la respuesta.'}</b> ${item.retro}`;
    retro.hidden = false;

    const siguiente = contenedor.querySelector('#siguiente');
    siguiente.textContent = indice === PREGUNTAS_TEST.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
    siguiente.hidden = false;
    siguiente.focus();
  }

  function avanzar() {
    respondida = false;
    indice += 1;
    if (indice < PREGUNTAS_TEST.length) pintarPregunta();
    else pintarResultado();
  }

  function pintarResultado() {
    const total = PREGUNTAS_TEST.length;
    const porcentaje = Math.round((aciertos / total) * 100);
    let mensaje;
    if (porcentaje === 100) mensaje = 'Dominas el artículo completo. Impecable.';
    else if (porcentaje >= 80) mensaje = 'Muy buen nivel: tienes clara la tesis central del artículo.';
    else if (porcentaje >= 60) mensaje = 'Base sólida. Repasa las métricas y el ajuste del umbral en las flashcards.';
    else mensaje = 'Conviene una segunda lectura. El chatbot puede aclararte los puntos que fallaste.';

    contenedor.innerHTML = `
      <div class="resultado">
        <div class="barra"><div class="barra__relleno" style="width:100%"></div></div>
        <p class="resultado__marca">${aciertos}/${total}</p>
        <p style="font-weight:600;margin:.2rem 0 .4rem;">${porcentaje} % de aciertos</p>
        <p class="subtitulo" style="max-width:46ch;margin:0 auto 1.4rem;">${mensaje}</p>
        <button class="boton boton--principal" id="reiniciar" type="button">Repetir el test</button>
      </div>
    `;
    contenedor.querySelector('#reiniciar').addEventListener('click', () => iniciar(contenedor));
  }

  return { iniciar };
})();

/* ========================== Flashcards ========================== */
const Tarjetas = (() => {
  let contenedor = null;
  let indice = 0;
  let volteada = false;

  function iniciar(elemento) {
    contenedor = elemento;
    indice = 0;
    volteada = false;
    pintar();
  }

  function pintar() {
    const carta = FLASHCARDS[indice];

    contenedor.innerHTML = `
      <p class="test__contador">Tarjeta ${indice + 1} de ${FLASHCARDS.length}</p>
      <button class="flashcard" id="flashcard" type="button" aria-pressed="${volteada}"
              aria-label="Tarjeta de repaso. Pulsa para ver la respuesta.">
        <span class="flashcard__interior">
          <span class="flashcard__cara">
            <span class="flashcard__pista">Concepto</span>
            <p class="flashcard__texto">${carta.anverso}</p>
            <span class="flashcard__pista">Pulsa para revelar</span>
          </span>
          <span class="flashcard__cara flashcard__cara--reverso">
            <span class="flashcard__pista">Explicación</span>
            <p class="flashcard__texto">${carta.reverso}</p>
          </span>
        </span>
      </button>
      <div class="controles-tarjetas">
        <button class="boton" id="anterior" type="button" ${indice === 0 ? 'disabled' : ''}>← Anterior</button>
        <button class="boton" id="voltear" type="button">Voltear</button>
        <button class="boton boton--principal" id="siguiente" type="button">Siguiente →</button>
      </div>
    `;

    const tarjeta = contenedor.querySelector('#flashcard');
    tarjeta.addEventListener('click', voltear);
    contenedor.querySelector('#voltear').addEventListener('click', voltear);
    contenedor.querySelector('#anterior').addEventListener('click', () => mover(-1));
    contenedor.querySelector('#siguiente').addEventListener('click', () => mover(1));
  }

  function voltear() {
    volteada = !volteada;
    contenedor.querySelector('#flashcard').setAttribute('aria-pressed', String(volteada));
  }

  function mover(paso) {
    indice = (indice + paso + FLASHCARDS.length) % FLASHCARDS.length;
    volteada = false;
    pintar();
  }

  return { iniciar };
})();
