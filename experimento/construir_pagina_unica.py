# -*- coding: utf-8 -*-
"""
Construye una versión de la web en un solo archivo HTML, sin recursos externos.

Toma index.html, incrusta la hoja de estilos, los cinco módulos de JavaScript,
las métricas de assets/resultados.json y el texto del artículo (que sustituye al
visor de PDF, porque un PDF incrustado no sobrevive a todos los entornos donde
se comparte un archivo suelto).

El resultado sirve tanto para abrirlo con doble clic como para publicarlo en un
entorno que solo admita un archivo.

Uso:
    python3 experimento/construir_pagina_unica.py

Salida:
    dist/pagina-unica.html
"""

import json
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, "dist", "pagina-unica.html")

MODULOS = ["equipo.js", "conocimiento.js", "chatbot.js", "aprendizaje.js", "app.js"]
REPO = "https://github.com/nicolasravem-design/seguimiento-ariticulo"

FUENTES = (
    '<link rel="stylesheet" '
    'href="https://fonts.googleapis.com/css2?'
    'family=Inter:wght@400;500;600;700;800&'
    'family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&'
    'display=swap">'
)

# Estilos de la vista de lectura del artículo. Reutilizan los mismos tokens de
# color que el resto del sitio, con una serif editorial para el cuerpo.
ESTILOS_LECTURA = """
/* ===================== Vista de lectura del artículo ===================== */

.credito {
  display: flex;
  flex-wrap: wrap;
  gap: .35rem 1.4rem;
  align-items: baseline;
  padding: 1rem 1.3rem;
  margin-bottom: 1.6rem;
  max-width: 68ch;
  border-left: 3px solid var(--acento);
  background: var(--superficie);
  border-radius: 0 var(--radio-s) var(--radio-s) 0;
}
.credito b { font-size: .95rem; }
.credito span { color: var(--texto-2); font-size: .87rem; }

.lectura {
  font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
  font-size: 1.06rem;
  line-height: 1.75;
  max-width: 68ch;
}
.lectura h1 { display: none; }
.lectura h2 {
  font-family: var(--fuente);
  scroll-margin-top: 5rem;
  font-size: 1.28rem;
  margin: 2.4rem 0 .7rem;
  padding-bottom: .4rem;
  border-bottom: 1px solid var(--borde);
}
.lectura h3 {
  font-family: var(--fuente);
  font-size: 1rem;
  color: var(--acento);
  margin: 1.8rem 0 .4rem;
}
.lectura p { margin: 0 0 1rem; }
.lectura .resumen {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radio);
  padding: 1.3rem 1.5rem;
  margin-bottom: 1.4rem;
}
.lectura .resumen h2 { margin-top: 0; border: 0; padding: 0; font-size: 1.05rem; }
.lectura .clave { font-size: .92rem; color: var(--texto-2); margin-bottom: 0; }

.lectura table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--fuente);
  font-size: .87rem;
  line-height: 1.45;
  font-variant-numeric: tabular-nums;
  margin: .4rem 0 .5rem;
}
.lectura table caption { text-align: left; margin-bottom: .5rem; }
.lectura caption .num {
  display: block;
  font-family: var(--fuente);
  font-size: .74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--acento);
}
.lectura caption .tit { display: block; font-style: italic; }
.lectura th, .lectura td { padding: .5rem .7rem; text-align: left; }
.lectura th.num, .lectura td.num { text-align: right; }
.lectura thead th {
  border-top: 1px solid var(--texto-2);
  border-bottom: 1px solid var(--borde);
  font-weight: 600;
}
.lectura tbody tr:last-child td { border-bottom: 1px solid var(--texto-2); }
.lectura .nota { font-size: .84rem; color: var(--texto-2); line-height: 1.5; }
.lectura .desplazable { overflow-x: auto; margin-bottom: 1rem; }

.lectura .referencias p {
  font-size: .95rem;
  text-indent: -1.6rem;
  padding-left: 1.6rem;
  margin-bottom: .7rem;
}
.lectura a { overflow-wrap: anywhere; }

@media (max-width: 640px) {
  .lectura { font-size: 1rem; }
}
"""


def leer(*partes):
    with open(os.path.join(RAIZ, *partes), encoding="utf-8") as fh:
        return fh.read()


def extender_selectores_de_tema(css):
    """El anfitrión puede fijar el tema con data-theme y el sistema con
    prefers-color-scheme; se replican los tokens oscuros para los tres casos."""
    patron = re.compile(r'html\[data-tema="oscuro"\]\s*\{(.*?)\n\}', re.S)
    coincidencia = patron.search(css)
    if not coincidencia:
        raise SystemExit("No se encontró el bloque de tokens del tema oscuro.")
    tokens = coincidencia.group(1)
    bloque = (
        ':root[data-tema="oscuro"],\n'
        ':root[data-theme="dark"] {' + tokens + "\n}\n\n"
        "@media (prefers-color-scheme: dark) {\n"
        '  :root:not([data-tema="claro"]):not([data-theme="light"]) {' + tokens + "\n  }\n}"
    )
    return patron.sub(lambda _: bloque, css, count=1)


def cuerpo_del_articulo():
    """Devuelve el artículo sin portada y con las tablas envueltas para que
    puedan desplazarse en horizontal dentro de la columna de lectura."""
    html = leer("articulo", "articulo.html")
    cuerpo = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    cuerpo = re.sub(r'<section class="portada">.*?</section>', "", cuerpo, flags=re.S)
    cuerpo = re.sub(r'\s*style="page-break-before: always;"', "", cuerpo)
    cuerpo = cuerpo.replace("<table>", '<div class="desplazable"><table>')
    cuerpo = cuerpo.replace("</table>", "</table></div>")
    return '<div class="lectura">' + cuerpo.strip() + "</div>"


def main():
    indice = leer("index.html")
    contenido = re.search(r"<body>(.*?)</body>", indice, re.S).group(1)

    # El enlace de salto y el pie repiten información en un archivo suelto.
    contenido = re.sub(r'<a class="salto-contenido".*?</a>\n\n', "", contenido, flags=re.S)
    contenido = re.sub(r"<script src=.*?</script>\n?", "", contenido, flags=re.S)

    # Las descargas directas no funcionan en todos los visores: se enlaza al repositorio.
    contenido = re.sub(
        r'<div class="acciones">.*?</div>',
        '<div class="acciones">'
        f'<a class="boton boton--principal" href="{REPO}/blob/main/assets/articulo.pdf" '
        'target="_blank" rel="noopener"><span aria-hidden="true">📄</span> PDF del artículo</a>'
        f'<a class="boton" href="{REPO}" target="_blank" rel="noopener">'
        '<span aria-hidden="true">↗</span> Repositorio</a></div>',
        contenido,
        count=1,
        flags=re.S,
    )

    # El visor de PDF se sustituye por el texto del artículo y su crédito.
    credito = (
        '<div class="credito">'
        "<b>Nicolás Ravem · Juan Pablo Sánchez · Samuel Valencia</b>"
        "<span>Corporación Universitaria Lasallista · Facultad de Ingeniería</span>"
        "<span>Docente: Feibert Guzmán · 2026</span>"
        "</div>"
    )
    contenido = re.sub(
        r'<div class="visor" id="visor-pdf">.*?\n    </div>',
        lambda _: credito + cuerpo_del_articulo(),
        contenido,
        count=1,
        flags=re.S,
    )

    css = extender_selectores_de_tema(leer("css", "estilos.css")) + ESTILOS_LECTURA
    js = "\n\n".join(leer("js", modulo) for modulo in MODULOS)
    resultados = json.loads(leer("assets", "resultados.json"))

    partes = [
        "<title>Mantenimiento Predictivo con ML</title>",
        FUENTES,
        "<style>\n" + css + "\n</style>",
        contenido.strip(),
        "<script>\nwindow.RESULTADOS_EMBEBIDOS = "
        + json.dumps(resultados, ensure_ascii=False)
        + ";\n</script>",
        "<script>\n" + js + "\n</script>",
    ]

    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    with open(SALIDA, "w", encoding="utf-8") as fh:
        fh.write("\n\n".join(partes) + "\n")

    print(f"Escrito {SALIDA} ({os.path.getsize(SALIDA) / 1024:.0f} kB)")


if __name__ == "__main__":
    main()
