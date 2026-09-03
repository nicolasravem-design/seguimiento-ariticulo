/**
 * Orquestación de la página: pestañas, tema, perfiles del equipo,
 * carga de resultados y conexión del chatbot con la interfaz.
 */
(() => {
  'use strict';

  /* ------------------------------ Tema ------------------------------ */
  const raiz = document.documentElement;
  const botonTema = document.getElementById('boton-tema');
  const iconoTema = document.getElementById('icono-tema');

  function aplicarTema(tema) {
    raiz.dataset.tema = tema;
    iconoTema.textContent = tema === 'oscuro' ? '☀️' : '🌙';
    try {
      localStorage.setItem('tema', tema);
    } catch (e) {
      /* almacenamiento no disponible: el tema simplemente no se recuerda */
    }
  }

  let temaInicial = null;
  try {
    temaInicial = localStorage.getItem('tema');
  } catch (e) { /* ignorado */ }
  if (!temaInicial) {
    temaInicial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }
  aplicarTema(temaInicial);

  botonTema.addEventListener('click', () => {
    aplicarTema(raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro');
  });

  /* ---------------------------- Pestañas ---------------------------- */
  const pestanas = [...document.querySelectorAll('.pestana')];
  const paneles = {
    articulo: document.getElementById('panel-articulo'),
    curriculum: document.getElementById('panel-curriculum'),
    interactivo: document.getElementById('panel-interactivo')
  };

  function activarPestana(nombre, moverFoco) {
    pestanas.forEach((pestana) => {
      const activa = pestana.dataset.panel === nombre;
      pestana.setAttribute('aria-selected', String(activa));
      pestana.tabIndex = activa ? 0 : -1;
      if (activa && moverFoco) pestana.focus();
    });
    Object.entries(paneles).forEach(([clave, panel]) => {
      panel.hidden = clave !== nombre;
    });
    if (location.hash.slice(1) !== nombre) {
      history.replaceState(null, '', '#' + nombre);
    }
  }

  pestanas.forEach((pestana) => {
    pestana.addEventListener('click', () => activarPestana(pestana.dataset.panel, false));
  });

  // Navegación con flechas dentro de la lista de pestañas (patrón ARIA).
  document.querySelector('.pestanas').addEventListener('keydown', (evento) => {
    const teclas = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(evento.key in teclas)) return;
    evento.preventDefault();
    const actual = pestanas.findIndex((p) => p.getAttribute('aria-selected') === 'true');
    const siguiente = (actual + teclas[evento.key] + pestanas.length) % pestanas.length;
    activarPestana(pestanas[siguiente].dataset.panel, true);
  });

  const inicial = location.hash.slice(1);
  activarPestana(Object.keys(paneles).includes(inicial) ? inicial : 'articulo', false);

  /* ------------------- Detección de soporte de PDF ------------------- */
  // Algunos navegadores móviles no incrustan PDF; se muestra el respaldo.
  const visor = document.getElementById('visor-pdf');
  const soportaPDF =
    navigator.pdfViewerEnabled === true ||
    (navigator.mimeTypes && navigator.mimeTypes['application/pdf'] !== undefined);
  if (!soportaPDF) visor.classList.add('visor--sin-soporte');

  /* --------------------- Perfiles del equipo ------------------------ */
  function pintarEquipo() {
    const zona = document.getElementById('equipo');
    zona.innerHTML = EQUIPO.map((persona) => `
      <article class="perfil tarjeta">
        <header class="perfil__encabezado">
          <span class="avatar" aria-hidden="true">${persona.iniciales}</span>
          <div>
            <h3 class="perfil__nombre">${persona.nombre}</h3>
            <p class="perfil__rol">${persona.rol}</p>
          </div>
        </header>
        <p class="perfil__resumen">${persona.resumen}</p>
        <div>
          <h4>Formación</h4>
          <ul class="linea-tiempo">
            ${persona.formacion.map((f) => `<li><b>${f.titulo}</b><span>${f.detalle}</span></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4>Experiencia y proyectos</h4>
          <ul class="linea-tiempo">
            ${persona.experiencia.map((e) => `<li><b>${e.titulo}</b><span>${e.detalle}</span></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4>Competencias</h4>
          <div class="chips">
            ${persona.competencias.map((c) => `<span class="chip">${c}</span>`).join('')}
          </div>
        </div>
        <a class="boton" href="${persona.contacto.url}" target="_blank" rel="noopener">
          ${persona.contacto.etiqueta}
        </a>
      </article>
    `).join('');
  }
  pintarEquipo();

  /* ------------------- Resultados del experimento ------------------- */
  const numero = (valor) => valor.toFixed(3).replace('.', ',');

  async function cargarResultados() {
    const cuerpo = document.getElementById('tabla-resultados');
    try {
      const respuesta = await fetch('assets/resultados.json');
      if (!respuesta.ok) throw new Error('respuesta ' + respuesta.status);
      const datos = await respuesta.json();

      document.getElementById('dato-registros').textContent =
        datos.metadatos.n_registros.toLocaleString('es-CO');
      document.getElementById('dato-prevalencia').textContent =
        String(datos.metadatos.tasa_falla_pct).replace('.', ',') + ' %';
      document.getElementById('dato-modelos').textContent = datos.modelos.length;

      cuerpo.innerHTML = datos.modelos.map((m) => `
        <tr class="${m.modelo === datos.mejor_modelo ? 'destacada' : ''}">
          <td>${m.modelo}</td>
          <td>${numero(m.exactitud)}</td>
          <td>${numero(m.precision)}</td>
          <td>${numero(m.sensibilidad)}</td>
          <td>${numero(m.f1)}</td>
          <td>${numero(m.roc_auc)}</td>
          <td>${numero(m.pr_auc)}</td>
        </tr>
      `).join('');

      const ajuste = datos.ajuste_umbral;
      document.getElementById('nota-resultados').innerHTML =
        `Fila resaltada: mejor modelo por F1. Ajustando su umbral de decisión de 0,50 a ` +
        `${String(ajuste.umbral).replace('.', ',')}, la sensibilidad sube de ` +
        `${numero(datos.modelos.find((m) => m.modelo === datos.mejor_modelo).sensibilidad)} a ` +
        `<b>${numero(ajuste.sensibilidad)}</b> y los falsos negativos bajan de ` +
        `${datos.modelos.find((m) => m.modelo === datos.mejor_modelo).matriz_confusion.fn} a ` +
        `<b>${ajuste.matriz_confusion.fn}</b>.`;
    } catch (error) {
      cuerpo.innerHTML =
        '<tr><td colspan="7">No se pudieron cargar los resultados. Consulta la Tabla 2 del PDF.</td></tr>';
    }
  }
  cargarResultados();

  /* --------------------- Modos del panel interactivo ---------------- */
  const modos = [...document.querySelectorAll('.modo')];
  const panelesModo = {
    chat: document.getElementById('modo-chat'),
    test: document.getElementById('modo-test'),
    tarjetas: document.getElementById('modo-tarjetas')
  };
  let testIniciado = false;
  let tarjetasIniciadas = false;

  modos.forEach((boton) => {
    boton.addEventListener('click', () => {
      const modo = boton.dataset.modo;
      modos.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      Object.entries(panelesModo).forEach(([clave, panel]) => {
        panel.hidden = clave !== modo;
      });
      if (modo === 'test' && !testIniciado) {
        Test.iniciar(document.getElementById('test'));
        testIniciado = true;
      }
      if (modo === 'tarjetas' && !tarjetasIniciadas) {
        Tarjetas.iniciar(document.getElementById('tarjetas-zona'));
        tarjetasIniciadas = true;
      }
    });
  });

  /* ---------------------------- Chatbot ----------------------------- */
  const zonaMensajes = document.getElementById('chat-mensajes');
  const formulario = document.getElementById('chat-formulario');
  const entrada = document.getElementById('chat-entrada');
  const zonaSugerencias = document.getElementById('sugerencias');
  let ocupado = false;

  function crearMensaje(quien, html, fuente) {
    const articulo = document.createElement('div');
    articulo.className = `mensaje mensaje--${quien}`;
    articulo.innerHTML = `
      <span class="mensaje__avatar" aria-hidden="true">${quien === 'bot' ? '⚙' : 'Tú'}</span>
      <div class="mensaje__burbuja">${html}${
        fuente ? `<span class="mensaje__fuente">Fuente: ${fuente}</span>` : ''
      }</div>
    `;
    zonaMensajes.appendChild(articulo);
    zonaMensajes.scrollTop = zonaMensajes.scrollHeight;
    return articulo;
  }

  function escapar(texto) {
    const nodo = document.createElement('div');
    nodo.textContent = texto;
    return nodo.innerHTML;
  }

  function mostrarEscribiendo() {
    const nodo = crearMensaje(
      'bot',
      '<div class="escribiendo" aria-label="El asistente está escribiendo"><span></span><span></span><span></span></div>',
      null
    );
    nodo.dataset.temporal = 'true';
    return nodo;
  }

  function preguntar(texto) {
    if (ocupado || !texto.trim()) return;
    ocupado = true;
    crearMensaje('usuario', `<p>${escapar(texto)}</p>`, null);

    const marcador = mostrarEscribiendo();
    const respuesta = Chatbot.responder(texto);
    const espera = 380 + Math.min(respuesta.html.length, 900) * 0.35;

    window.setTimeout(() => {
      marcador.remove();
      crearMensaje('bot', respuesta.html, respuesta.fuente);
      ocupado = false;
    }, espera);
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const texto = entrada.value;
    entrada.value = '';
    preguntar(texto);
  });

  SUGERENCIAS.forEach((texto) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'sugerencia';
    boton.textContent = texto;
    boton.addEventListener('click', () => preguntar(texto));
    zonaSugerencias.appendChild(boton);
  });

  crearMensaje(
    'bot',
    '<p>¡Hola! Soy el asistente de este artículo sobre <b>mantenimiento predictivo con machine ' +
    'learning</b>. Funciono en tu navegador, sin enviar nada a ningún servidor.</p>' +
    '<p>Pregúntame lo que quieras sobre el tema —conceptos, algoritmos, métricas, los resultados del ' +
    'experimento o las barreras de adopción— o toca una de las sugerencias de abajo.</p>',
    null
  );
})();
