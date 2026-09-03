# Machine Learning aplicado al mantenimiento predictivo en la Industria 4.0

<p align="center">
  <img alt="HTML5"      src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img alt="CSS3"       src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Python"     src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white">
  <img alt="scikit-learn" src="https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white">
  <img alt="pandas"     src="https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=white">
  <img alt="NumPy"      src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white">
</p>

<p align="center">
  <img alt="Netlify" src="https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white">
  <img alt="Claude"  src="https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white">
  <img alt="Perplexity" src="https://img.shields.io/badge/Perplexity-20808D?style=for-the-badge&logo=perplexity&logoColor=white">
  <img alt="Git"     src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img alt="GitHub"  src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
</p>

<p align="center">
  <img alt="Licencia MIT" src="https://img.shields.io/github/license/nicolasravem-design/seguimiento-ariticulo?style=flat-square&color=1f5fd8">
  <img alt="Último commit" src="https://img.shields.io/github/last-commit/nicolasravem-design/seguimiento-ariticulo?style=flat-square&color=1f5fd8">
  <img alt="Tamaño del repositorio" src="https://img.shields.io/github/repo-size/nicolasravem-design/seguimiento-ariticulo?style=flat-square&color=1f5fd8">
  <img alt="Lenguaje principal" src="https://img.shields.io/github/languages/top/nicolasravem-design/seguimiento-ariticulo?style=flat-square&color=1f5fd8">
  <img alt="Formato APA 7" src="https://img.shields.io/badge/Formato-APA%207-4B5563?style=flat-square">
  <img alt="Sin dependencias" src="https://img.shields.io/badge/Front--end-sin%20dependencias-0f9d78?style=flat-square">
</p>

> Proyecto integrador de la asignatura **Herramientas de Inteligencia Artificial** ·
> Corporación Universitaria Lasallista.
> Artículo académico, currículum del equipo y aula interactiva, desplegados como sitio estático.

---

## Índice

- [Qué es este proyecto](#qué-es-este-proyecto)
- [Estructura del sitio](#estructura-del-sitio)
- [El artículo](#el-artículo)
- [El experimento reproducible](#el-experimento-reproducible)
- [El chatbot](#el-chatbot)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Ejecutar en local](#ejecutar-en-local)
- [Regenerar los resultados y el PDF](#regenerar-los-resultados-y-el-pdf)
- [Despliegue continuo en Netlify](#despliegue-continuo-en-netlify)
- [Personalizar el contenido](#personalizar-el-contenido)
- [Herramientas de IA utilizadas](#herramientas-de-ia-utilizadas)
- [Licencia](#licencia)

---

## Qué es este proyecto

Una plataforma web de una sola página que reúne tres entregables sobre un mismo tema:
**la aplicación de aprendizaje automático al mantenimiento predictivo industrial**.

No es un sitio con contenido de relleno. El artículo se apoya en un experimento propio,
ejecutable, cuyas cifras alimentan tanto el PDF como la tabla de la web y las respuestas del
chatbot: si vuelves a correr el script, todo el sitio queda actualizado con los mismos números.

**Hallazgo central del trabajo:** con una prevalencia de falla del 4,36 %, los modelos de
ensamble alcanzan una exactitud de 0,971 y una sensibilidad de apenas 0,466. Ajustar el umbral
de decisión de 0,50 a 0,33 sube la sensibilidad a 0,641 y evita 23 fallas no detectadas —una
ganancia que ningún cambio de algoritmo consiguió.

## Estructura del sitio

| Pestaña | Contenido |
|---|---|
| **1 · Artículo** | Visor con el PDF incrustado del escrito académico (11 páginas, formato APA 7.ª ed.), botones de descarga y tabla de resultados generada desde `assets/resultados.json`. |
| **2 · Currículum** | Perfil profesional de cada integrante: formación, experiencia, competencias y contacto. Las tarjetas se generan desde `js/equipo.js`. |
| **3 · Proceso interactivo** | Tres componentes de enseñanza en JavaScript: un **chatbot** que responde sobre el artículo, un **test** de 10 preguntas con retroalimentación razonada y **13 flashcards** de repaso. |

Además: tema claro/oscuro persistente, navegación por teclado según el patrón ARIA de pestañas,
enlaces profundos (`#articulo`, `#curriculum`, `#interactivo`) y diseño adaptable a móvil.

## El artículo

**«Machine Learning aplicado al mantenimiento predictivo en la Industria 4.0: algoritmos,
métricas y barreras de adopción»**

Combina una revisión narrativa de literatura (12 referencias en APA 7.ª edición, buscadas en
Google Académico, SciELO y Redalyc) con un experimento computacional propio. Su tesis: el valor
operativo de un sistema de mantenimiento predictivo no depende del algoritmo elegido, sino de la
métrica de evaluación, de la calibración del umbral frente a costos asimétricos y de la
interpretabilidad que exige el personal de mantenimiento.

📄 [`assets/articulo.pdf`](assets/articulo.pdf) · fuente en [`articulo/articulo.html`](articulo/articulo.html)

## El experimento reproducible

| | |
|---|---|
| **Datos** | 10 000 registros sintéticos, generados con el procedimiento documentado por Matzka (2020) para el *AI4I 2020 Predictive Maintenance Dataset*. No es el archivo original de UCI: es una reimplementación del generador publicado, calibrada para aproximar la prevalencia documentada. |
| **Variables** | Calidad del producto, temperatura del aire, temperatura de proceso, velocidad de rotación, par y desgaste de herramienta. |
| **Modos de falla** | TWF (desgaste), HDF (disipación de calor), PWF (potencia), OSF (sobreesfuerzo) y RNF (aleatoria). |
| **Modelos** | Regresión logística ponderada, Random Forest (400 árboles) y Gradient Boosting. |
| **Validación** | Hold-out 70/30 estratificado + validación cruzada estratificada de 5 particiones. Semilla fija en 42. |

### Resultados sobre la partición de prueba

| Modelo | Exactitud | Precisión | Sensibilidad | F1 | ROC-AUC | PR-AUC |
|---|---|---|---|---|---|---|
| Regresión logística | 0,753 | 0,130 | 0,817 | 0,224 | 0,849 | 0,326 |
| **Random Forest** | **0,971** | **0,772** | **0,466** | **0,581** | **0,960** | **0,694** |
| Gradient Boosting | 0,971 | 0,797 | 0,450 | 0,576 | 0,935 | 0,724 |

### Efecto del ajuste del umbral (Random Forest)

| Configuración | Precisión | Sensibilidad | F1 | Falsos negativos |
|---|---|---|---|---|
| Umbral 0,50 (por defecto) | 0,772 | 0,466 | 0,581 | 70 |
| Umbral 0,33 (calibrado) | 0,672 | **0,641** | **0,656** | **47** |

El umbral se selecciona sobre predicciones *out-of-fold* del conjunto de entrenamiento, nunca
sobre la partición de prueba.

## El chatbot

Funciona **íntegramente en el navegador**: no hay backend, no hay clave de API y ningún dato del
visitante sale de su equipo.

Es un motor de recuperación por coincidencia léxica sobre una base de 28 intenciones construida
con el contenido del artículo ([`js/conocimiento.js`](js/conocimiento.js)). Para cada consulta:

1. **Normaliza** el texto (minúsculas, sin tildes ni signos de puntuación).
2. **Expande sinónimos** y abreviaturas (`ml` → *machine learning*, `pdm` → *mantenimiento predictivo*, `recall` → *sensibilidad*…).
3. **Elimina palabras vacías** y tokeniza.
4. **Puntúa** cada intención: 3 puntos y medio o más por coincidencia de frase completa, 1 punto por palabra exacta, 0,6 por coincidencia de raíz.
5. Si la mejor puntuación no supera el **umbral de confianza**, responde con una reserva honesta que ofrece los temas que sí cubre, en lugar de inventar.

Cada respuesta cita la sección del artículo o la referencia de la que procede.

## Estructura del repositorio

```
.
├── index.html                    Página principal con las tres pestañas
├── netlify.toml                  Configuración de despliegue continuo
├── requirements.txt              Dependencias del experimento
├── css/
│   └── estilos.css               Hoja de estilos (tema claro/oscuro, responsive)
├── js/
│   ├── equipo.js                 Datos de los integrantes  ← edítalo
│   ├── conocimiento.js           Base de conocimiento: intenciones, test, flashcards
│   ├── chatbot.js                Motor de recuperación del asistente
│   ├── aprendizaje.js            Test de comprensión y flashcards
│   └── app.js                    Pestañas, tema, carga de datos y enlace del chat
├── articulo/
│   └── articulo.html             Fuente del artículo, con estilos de impresión APA
├── experimento/
│   ├── experimento_pdm.py        Genera los datos, entrena y evalúa los modelos
│   ├── generar_pdf.js            Convierte el artículo a PDF con Chromium
│   └── resultados.md             Tabla de resultados en Markdown
└── assets/
    ├── articulo.pdf              Artículo final exportado
    └── resultados.json           Métricas que consume la página
```

## Ejecutar en local

El sitio es estático; basta con servirlo por HTTP (abrirlo con `file://` impide que el navegador
cargue `resultados.json`).

```bash
git clone https://github.com/nicolasravem-design/seguimiento-ariticulo.git
cd seguimiento-ariticulo
python3 -m http.server 8000
```

Abre <http://localhost:8000>.

## Regenerar los resultados y el PDF

```bash
# 1. Experimento → assets/resultados.json y experimento/resultados.md
pip install -r requirements.txt
python3 experimento/experimento_pdm.py

# 2. Artículo → assets/articulo.pdf
npm install playwright
node experimento/generar_pdf.js
```

La semilla aleatoria está fija en 42: las cifras se repiten ejecución tras ejecución.

## Despliegue continuo en Netlify

1. En Netlify: **Add new site → Import an existing project → GitHub**.
2. Autoriza el acceso y elige este repositorio.
3. Netlify lee [`netlify.toml`](netlify.toml) y aplica la configuración:
   - **Build command:** *(vacío, no hay compilación)*
   - **Publish directory:** `.`
4. **Deploy site.**

A partir de ahí, cada `git push` a la rama publicada dispara un despliegue automático. Netlify
sirve el sitio por HTTPS con certificado gestionado.

> Para mostrar aquí el estado real del despliegue, sustituye el badge estático de Netlify por el
> que Netlify genera en *Site configuration → Status badges*.

## Personalizar el contenido

| Qué quieres cambiar | Archivo |
|---|---|
| Datos de los integrantes del equipo | `js/equipo.js` (arreglo `EQUIPO`) |
| Respuestas del chatbot | `js/conocimiento.js` (arreglo `INTENCIONES`) |
| Preguntas del test | `js/conocimiento.js` (arreglo `PREGUNTAS_TEST`) |
| Flashcards | `js/conocimiento.js` (arreglo `FLASHCARDS`) |
| Texto del artículo | `articulo/articulo.html`, y luego regenera el PDF |
| Colores y tipografía | `css/estilos.css` (variables en `:root`) |

## Herramientas de IA utilizadas

| Herramienta | Uso en el proyecto |
|---|---|
| **Perplexity / Google Académico** | Búsqueda bibliográfica y verificación de metadatos de las 12 referencias. |
| **Claude (Anthropic)** | Asistencia en la redacción del artículo mediante prompts estructurados por sección, en el diseño del experimento y en la generación del código de la interfaz. |
| **scikit-learn** | Entrenamiento y evaluación de los modelos del experimento. |

Todo el contenido fue revisado y verificado por el equipo. Las cifras del artículo provienen del
script incluido en el repositorio y son reproducibles.

## Licencia

Distribuido bajo licencia MIT. Consulta [`LICENSE`](LICENSE).
