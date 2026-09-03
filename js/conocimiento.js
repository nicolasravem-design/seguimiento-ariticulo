/**
 * Base de conocimiento del asistente, del test y de las flashcards.
 * Todo el contenido proviene del artículo "Machine Learning aplicado al
 * mantenimiento predictivo en la Industria 4.0".
 */

/* --------------------------------------------------------------------------
 * Intenciones del chatbot.
 * Cada intención declara: claves (términos que la activan, con peso implícito
 * por especificidad), una respuesta en HTML y la fuente dentro del artículo.
 * ----------------------------------------------------------------------- */
const INTENCIONES = [
  {
    id: 'saludo',
    claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'que tal'],
    respuesta:
      '<p>¡Hola! Soy el asistente del artículo sobre <b>mantenimiento predictivo con machine learning</b>.</p>' +
      '<p>Puedo explicarte qué es el PdM, qué algoritmos se usan, por qué la exactitud engaña en estos problemas, ' +
      'qué resultados obtuvimos y qué barreras frenan la adopción en planta. ¿Por dónde empezamos?</p>'
  },
  {
    id: 'ayuda',
    claves: ['ayuda', 'que puedes hacer', 'que sabes', 'opciones', 'temas', 'de que hablas', 'menu'],
    respuesta:
      '<p>Puedo responder sobre estos bloques del artículo:</p>' +
      '<ul>' +
      '<li><b>Conceptos:</b> mantenimiento predictivo, correctivo, preventivo, basado en condición, Industria 4.0.</li>' +
      '<li><b>Método:</b> flujo de un proyecto de PdM, fuga de información, partición temporal.</li>' +
      '<li><b>Algoritmos:</b> Random Forest, Gradient Boosting, regresión logística, redes neuronales, detección de anomalías.</li>' +
      '<li><b>Métricas:</b> exactitud, precisión, sensibilidad, F1, ROC-AUC, PR-AUC, matriz de confusión.</li>' +
      '<li><b>Resultados:</b> las cifras de nuestro experimento y el ajuste del umbral.</li>' +
      '<li><b>Práctica:</b> desbalance de clases, deriva de datos, interpretabilidad, barreras de adopción.</li>' +
      '</ul>' +
      '<p>Escribe tu pregunta con tus palabras: entiendo variantes y sinónimos.</p>'
  },
  {
    id: 'definicion_pdm',
    claves: ['que es mantenimiento predictivo', 'definicion mantenimiento predictivo', 'que es pdm',
             'mantenimiento predictivo', 'predictive maintenance', 'que significa pdm'],
    respuesta:
      '<p>El <b>mantenimiento predictivo (PdM)</b> estima el estado de salud de un activo a partir de sus datos ' +
      'de operación para programar la intervención <i>justo antes</i> de que ocurra la falla.</p>' +
      '<p>La diferencia clave frente al mantenimiento basado en condición está en la pregunta que responde:</p>' +
      '<ul>' +
      '<li>Basado en condición → «¿está el activo fuera de rango <b>ahora</b>?» (basta una regla y un umbral).</li>' +
      '<li>Predictivo → «¿<b>cuánto falta</b> para que el activo salga de rango?» (requiere aprender un modelo).</li>' +
      '</ul>' +
      '<p>Es en esa segunda pregunta donde el aprendizaje automático aporta valor diferencial.</p>',
    fuente: 'Artículo, sección «Del mantenimiento correctivo al predictivo»'
  },
  {
    id: 'estrategias',
    claves: ['correctivo', 'preventivo', 'basado en condicion', 'tipos de mantenimiento', 'estrategias de mantenimiento',
             'diferencia entre preventivo y predictivo', 'niveles de mantenimiento'],
    respuesta:
      '<p>Las cuatro estrategias se ordenan según la información que usan para decidir la intervención:</p>' +
      '<ul>' +
      '<li><b>Correctivo:</b> actúa después de la falla. No usa información anticipada; asume el costo de la parada.</li>' +
      '<li><b>Preventivo:</b> sustituye por calendario fijo, con información estadística de la población. Desperdicia vida útil.</li>' +
      '<li><b>Basado en condición:</b> mide el activo individual e interviene al superar un umbral.</li>' +
      '<li><b>Predictivo:</b> usa el historial completo del activo para estimar <i>cuándo</i> fallará.</li>' +
      '</ul>' +
      '<p>El salto del tercero al cuarto nivel es de naturaleza distinta a los anteriores: exige un modelo del ' +
      'comportamiento del activo, no solo un umbral.</p>',
    fuente: 'Zonta et al. (2020); Hector y Panjanathan (2024)'
  },
  {
    id: 'industria40',
    claves: ['industria 4.0', 'industria 40', 'cuarta revolucion', 'iot industrial', 'internet de las cosas',
             'que es industria 4.0'],
    respuesta:
      '<p>La <b>Industria 4.0</b> agrupa la convergencia de sensórica de bajo costo, conectividad industrial y ' +
      'capacidad de cómputo. Es lo que hizo viable el mantenimiento predictivo: sin datos de operación capturados ' +
      'de forma continua y barata, no hay nada que aprender.</p>' +
      '<p>Zonta et al. (2020), tras revisar 187 estudios, describen el PdM como uno de los pilares operativos de la ' +
      'Industria 4.0 y documentan un crecimiento sostenido de publicaciones a partir de 2015.</p>',
    fuente: 'Zonta et al. (2020)'
  },
  {
    id: 'flujo',
    claves: ['flujo de trabajo', 'etapas', 'fases de un proyecto', 'metodologia', 'como se hace un proyecto',
             'pasos', 'ciclo de vida', 'proceso'],
    respuesta:
      '<p>Un proyecto de PdM recorre cinco etapas, cada una con su riesgo dominante:</p>' +
      '<ul>' +
      '<li><b>Adquisición y limpieza</b> → riesgo: etiquetas de falla incompletas o registradas con retraso.</li>' +
      '<li><b>Ingeniería de características</b> → riesgo: fuga de información desde el futuro hacia el pasado.</li>' +
      '<li><b>Partición y validación</b> → riesgo: partición aleatoria sobre series temporales.</li>' +
      '<li><b>Modelado</b> → riesgo: optimizar una métrica que no refleja el costo real.</li>' +
      '<li><b>Despliegue y monitoreo</b> → riesgo: deriva de los datos y pérdida de confianza del usuario.</li>' +
      '</ul>',
    fuente: 'Artículo, Tabla 1'
  },
  {
    id: 'fuga',
    claves: ['fuga de informacion', 'data leakage', 'particion temporal', 'particion aleatoria', 'series temporales',
             'validacion cruzada temporal', 'como particionar'],
    respuesta:
      '<p>Es el error más frecuente y el menos visible. Los datos de mantenimiento son <b>series temporales</b>: ' +
      'una partición aleatoria mezcla registros anteriores y posteriores a un mismo evento de falla, de modo que el ' +
      'modelo termina evaluado sobre información que en operación real no habría estado disponible.</p>' +
      '<p>El desempeño reportado bajo ese esquema es sistemáticamente optimista. La contramedida es <b>particionar ' +
      'por bloques temporales o por unidad de equipo</b>, según cuál sea la unidad de generalización que interesa.</p>',
    fuente: 'Artículo, sección «Flujo de trabajo de un proyecto de PdM»'
  },
  {
    id: 'algoritmos',
    claves: ['que algoritmos', 'algoritmos', 'modelos', 'random forest', 'bosque aleatorio', 'gradient boosting',
             'xgboost', 'arboles de decision', 'svm', 'maquinas de vectores', 'que modelo usar', 'ensamble'],
    respuesta:
      '<p>Carvalho et al. (2019) encuentran que los <b>bosques aleatorios</b> son el método más reportado, seguidos ' +
      'por redes neuronales, máquinas de vectores de soporte y métodos de <i>boosting</i>.</p>' +
      '<p>La preferencia no es arbitraria. Los datos de mantenimiento son tabulares, heterogéneos, con relaciones no ' +
      'lineales y umbrales de interacción. Los ensambles de árboles capturan justamente eso sin ingeniería de ' +
      'características costosa y toleran variables en escalas dispares.</p>' +
      '<p>La regla práctica: <b>la elección no es cuestión de sofisticación, sino de correspondencia entre la ' +
      'naturaleza del dato y la capacidad del modelo</b>.</p>',
    fuente: 'Carvalho et al. (2019); Breiman (2001); Chen y Guestrin (2016)'
  },
  {
    id: 'redes_neuronales',
    claves: ['redes neuronales', 'deep learning', 'aprendizaje profundo', 'cuando usar redes', 'lstm', 'red profunda'],
    respuesta:
      '<p>Las redes profundas aportan valor cuando <b>la entrada es una señal cruda de alta frecuencia</b> ' +
      '—vibración, corriente, acústica— y la representación relevante debe aprenderse. Lei et al. (2018) documentan ' +
      'ese uso en el pronóstico de vida útil remanente a partir de señales de vibración de rodamientos.</p>' +
      '<p>Sobre datos tabulares de proceso, en cambio, no superan a un ensamble de árboles y cuestan mucho más en ' +
      'datos, cómputo e interpretabilidad.</p>',
    fuente: 'Lei et al. (2018)'
  },
  {
    id: 'anomalias',
    claves: ['deteccion de anomalias', 'no supervisado', 'sin etiquetas', 'semisupervisado', 'aprendizaje no supervisado',
             'no tengo etiquetas', 'anomalias'],
    respuesta:
      '<p>Es la familia más ignorada y la más útil al arrancar. Cuando <b>no existen etiquetas de falla confiables</b> ' +
      '—la situación más común en una planta real— los modelos no supervisados y semisupervisados permiten empezar.</p>' +
      '<p>Susto et al. (2015) proponen además un enfoque de clasificadores múltiples que hace explícito el compromiso ' +
      'entre intervenciones innecesarias y fallas no detectadas.</p>',
    fuente: 'Susto et al. (2015); Hector y Panjanathan (2024)'
  },
  {
    id: 'exactitud',
    claves: ['exactitud', 'accuracy', 'por que la exactitud enga', 'metrica enga', 'exactitud alta', 'accuracy alta',
             'por que no usar exactitud'],
    respuesta:
      '<p>Porque en PdM la falla es un <b>evento raro</b>. Con una prevalencia del 4,36 %, un clasificador trivial que ' +
      'prediga siempre «sin falla» obtiene <b>95,6 % de exactitud</b> y no sirve para nada.</p>' +
      '<p>El margen que separa un modelo útil de uno inútil, medido en exactitud, es de apenas 1,5 puntos ' +
      'porcentuales: un rango en el que la métrica carece de poder discriminante.</p>' +
      '<p>En nuestro experimento el Random Forest alcanzó 0,971 de exactitud <b>y solo 0,466 de sensibilidad</b>: ' +
      'más de la mitad de las fallas pasaba desapercibida.</p>',
    fuente: 'Artículo, sección «El problema de la métrica»'
  },
  {
    id: 'metricas',
    claves: ['metricas', 'precision', 'sensibilidad', 'recall', 'f1', 'que metrica usar', 'como evaluar',
             'matriz de confusion', 'falsos positivos', 'falsos negativos'],
    respuesta:
      '<p>Las métricas apropiadas para PdM, que deben reportarse <b>en conjunto</b>:</p>' +
      '<ul>' +
      '<li><b>Sensibilidad (recall):</b> de todas las fallas reales, ¿cuántas detecté? Penaliza los falsos negativos.</li>' +
      '<li><b>Precisión:</b> de todas mis alertas, ¿cuántas eran fallas reales? Penaliza los falsos positivos.</li>' +
      '<li><b>F1:</b> media armónica de ambas; resume el equilibrio en un número.</li>' +
      '<li><b>PR-AUC:</b> área bajo la curva precisión-sensibilidad, la métrica agregada informativa aquí.</li>' +
      '</ul>' +
      '<p>Ninguna aislada describe el modelo. Nuestra regresión logística logró la sensibilidad más alta (0,817) con ' +
      'una precisión de 0,130: de cada ocho alertas, siete eran falsas.</p>',
    fuente: 'Artículo, Tabla 2'
  },
  {
    id: 'roc_pr',
    claves: ['roc', 'roc-auc', 'pr-auc', 'curva roc', 'curva precision sensibilidad', 'diferencia roc pr', 'auc'],
    respuesta:
      '<p>El <b>ROC-AUC</b> incorpora los verdaderos negativos, que en un problema desbalanceado son abundantes por ' +
      'construcción; por eso tiende a verse optimista. El <b>PR-AUC</b> se concentra en la clase minoritaria, que es ' +
      'la que interesa.</p>' +
      '<p>En el experimento el mismo Random Forest obtuvo <b>ROC-AUC de 0,960</b> —que se leería como desempeño casi ' +
      'perfecto— y <b>PR-AUC de 0,694</b>. Esa brecha es exactamente el efecto del desbalance.</p>',
    fuente: 'Artículo, sección «El problema de la métrica»'
  },
  {
    id: 'desbalance',
    claves: ['desbalance', 'clases desbalanceadas', 'clase minoritaria', 'pocos ejemplos de falla', 'smote',
             'remuestreo', 'class weight', 'ponderacion de clases'],
    respuesta:
      '<p>El desbalance es la condición estructural del problema: la falla es rara. Las contramedidas disponibles son:</p>' +
      '<ul>' +
      '<li>Ponderación de clases en la función de pérdida.</li>' +
      '<li>Remuestreo del conjunto de entrenamiento.</li>' +
      '<li>Selección de métricas sensibles a la clase minoritaria.</li>' +
      '<li>Calibración del umbral de decisión.</li>' +
      '</ul>' +
      '<p><b>Advertencia empírica:</b> la ponderación aplicada sin control produjo, en nuestra regresión logística, ' +
      'un modelo inservible por exceso de falsos positivos. La contramedida requiere verificación, no aplicación ' +
      'automática.</p>',
    fuente: 'Artículo, sección «Barreras de adopción»'
  },
  {
    id: 'umbral',
    claves: ['umbral', 'threshold', 'ajuste del umbral', 'calibracion', 'punto de corte', 'umbral de decision',
             'costos asimetricos', 'costo asimetrico'],
    respuesta:
      '<p>Es el hallazgo más accionable del artículo. El umbral por defecto de 0,5 asume que un falso positivo y un ' +
      'falso negativo cuestan lo mismo, y en mantenimiento eso es <b>falso casi siempre</b>: una inspección ' +
      'innecesaria cuesta horas de técnico; una parada no planificada incluye lucro cesante, daño colateral y riesgo ' +
      'para las personas.</p>' +
      '<p>Al mover el umbral de <b>0,50 a 0,33</b> (elegido sobre predicciones <i>out-of-fold</i>, nunca sobre la ' +
      'partición de prueba):</p>' +
      '<ul>' +
      '<li>Sensibilidad: 0,466 → <b>0,641</b></li>' +
      '<li>Precisión: 0,772 → 0,672</li>' +
      '<li>Falsos negativos: 70 → <b>47</b> (23 fallas más detectadas)</li>' +
      '</ul>' +
      '<p>Ningún cambio de algoritmo aportó más de medio punto de F1; mover el umbral aportó 7,5 puntos.</p>',
    fuente: 'Artículo, Tabla 3; Susto et al. (2015)'
  },
  {
    id: 'resultados',
    claves: ['resultados', 'que obtuvieron', 'cifras', 'experimento', 'conclusiones del experimento',
             'que modelo gano', 'mejor modelo', 'comparacion de modelos'],
    respuesta:
      '<p>Sobre la partición de prueba (3 000 registros, prevalencia 4,36 %):</p>' +
      '<ul>' +
      '<li><b>Regresión logística:</b> exactitud 0,753 · sensibilidad 0,817 · precisión 0,130 · F1 0,224</li>' +
      '<li><b>Random Forest:</b> exactitud 0,971 · sensibilidad 0,466 · precisión 0,772 · F1 <b>0,581</b></li>' +
      '<li><b>Gradient Boosting:</b> exactitud 0,971 · sensibilidad 0,450 · precisión 0,797 · F1 0,576</li>' +
      '</ul>' +
      '<p>La diferencia de F1 entre los dos ensambles fue de 0,005, <b>inferior a la desviación estándar de la ' +
      'validación cruzada</b>: estadísticamente indistinguibles.</p>',
    fuente: 'Artículo, Tabla 2'
  },
  {
    id: 'datos',
    claves: ['datos', 'dataset', 'conjunto de datos', 'ai4i', 'de donde salieron los datos', 'datos sinteticos',
             'que datos usaron', 'uci'],
    respuesta:
      '<p>Se reimplementó el <b>generador sintético documentado por Matzka (2020)</b> para el AI4I 2020 Predictive ' +
      'Maintenance Dataset: 10 000 registros con seis variables predictoras (calidad del producto, temperatura del ' +
      'aire, temperatura de proceso, velocidad de rotación, par y desgaste de herramienta) y cinco modos de falla ' +
      '(TWF, HDF, PWF, OSF y RNF).</p>' +
      '<p><b>Precisión importante:</b> no es el archivo original del repositorio UCI, sino una reimplementación del ' +
      'procedimiento publicado. Dos parámetros que la publicación no cuantifica se calibraron para aproximar la ' +
      'prevalencia documentada; el resultado fue 4,36 % frente al 3,39 % del conjunto original.</p>',
    fuente: 'Matzka (2020); artículo, sección «Metodología»'
  },
  {
    id: 'interpretabilidad',
    claves: ['interpretabilidad', 'explicabilidad', 'xai', 'shap', 'caja negra', 'importancia de variables',
             'permutacion', 'por que predice', 'explicar el modelo'],
    respuesta:
      '<p>Un planificador de mantenimiento no ejecuta una orden de trabajo porque un modelo emita una probabilidad: ' +
      'la ejecuta cuando <b>entiende qué la motivó</b>.</p>' +
      '<p>La importancia por permutación de nuestro Random Forest ordenó las variables así: temperatura de proceso ' +
      '(0,401), velocidad de rotación (0,314), temperatura del aire (0,182), par (0,112), desgaste (0,087) y ' +
      'calidad (0,006).</p>' +
      '<p>Ese orden es coherente con los modos de falla del generador: la falla por disipación de calor depende de la ' +
      'diferencia de temperaturas y de la velocidad; la falla por potencia, del producto par × velocidad. ' +
      '<b>Que el modelo recupere esa estructura sin conocerla es una validación de sentido físico</b>, y es el tipo ' +
      'de evidencia que genera confianza en planta.</p>',
    fuente: 'Matzka (2020); Lundberg y Lee (2017)'
  },
  {
    id: 'deriva',
    claves: ['deriva', 'drift', 'data drift', 'reentrenamiento', 'el modelo se degrada', 'monitoreo',
             'mantenimiento del modelo', 'produccion'],
    respuesta:
      '<p>Un modelo entrenado con datos de una configuración de proceso <b>pierde validez</b> cuando cambia la ' +
      'materia prima, el turno, el lote o el propio equipo tras una intervención mayor.</p>' +
      '<p>La contramedida es instrumentar, <b>desde el primer día de operación</b>, el monitoreo de la distribución ' +
      'de las variables de entrada y del desempeño del modelo, y definir de antemano el criterio de reentrenamiento. ' +
      'Hector y Panjanathan (2024) incluyen este monitoreo entre los desafíos abiertos del campo.</p>',
    fuente: 'Hector y Panjanathan (2024)'
  },
  {
    id: 'barreras',
    claves: ['barreras', 'obstaculos', 'por que fracasan', 'dificultades', 'retos', 'desafios', 'limitaciones de adopcion',
             'por que no se implementa'],
    respuesta:
      '<p>El artículo sistematiza cuatro barreras recurrentes:</p>' +
      '<ul>' +
      '<li><b>Calidad y etiquetado de datos:</b> el historial de fallas vive en órdenes de trabajo en texto libre, con ' +
      'fechas posteriores al evento real. Invierte en trazabilidad antes que en el modelo.</li>' +
      '<li><b>Desbalance de clases:</b> exige métricas y umbrales adecuados, verificados y no automáticos.</li>' +
      '<li><b>Deriva de los datos:</b> requiere monitoreo y criterio de reentrenamiento definidos de antemano.</li>' +
      '<li><b>Integración organizacional:</b> el sistema redistribuye autoridad sobre decisiones que antes tomaba el ' +
      'jefe de mantenimiento; el valor aparece al integrarse a la planificación existente.</li>' +
      '</ul>',
    fuente: 'Artículo, sección «Barreras de adopción»'
  },
  {
    id: 'conclusiones',
    claves: ['conclusiones', 'que concluyen', 'resumen del articulo', 'ideas principales', 'aportes',
             'que aprendo', 'tesis'],
    respuesta:
      '<p>Cuatro conclusiones:</p>' +
      '<ul>' +
      '<li><b>El algoritmo es lo menos determinante:</b> la diferencia entre los dos ensambles fue de 0,005 de F1, ' +
      'estadísticamente indistinguible.</li>' +
      '<li><b>La métrica sí es determinante:</b> 0,971 de exactitud ocultaba 0,466 de sensibilidad.</li>' +
      '<li><b>La calibración del umbral produjo la mayor ganancia operativa:</b> +17,5 puntos de sensibilidad y ' +
      '23 fallas más detectadas.</li>' +
      '<li><b>La interpretabilidad es condición de adopción</b>, no un requisito accesorio.</li>' +
      '</ul>',
    fuente: 'Artículo, sección «Conclusiones»'
  },
  {
    id: 'limitaciones',
    claves: ['limitaciones', 'que falta', 'trabajo futuro', 'criticas', 'debilidades', 'sesgos del estudio'],
    respuesta:
      '<p>Dos limitaciones explícitas:</p>' +
      '<ul>' +
      '<li>Los <b>datos son sintéticos</b>, generados con reglas deterministas conocidas. Las magnitudes absolutas de ' +
      'las métricas no son extrapolables a una planta real; sí lo es la estructura del argumento, que depende solo de ' +
      'la baja prevalencia y de la asimetría de costos.</li>' +
      '<li>El problema se formuló como <b>clasificación binaria</b> y no como estimación de vida útil remanente, que ' +
      'exigiría datos de degradación continua.</li>' +
      '</ul>' +
      '<p>Como trabajo futuro se propone replicar sobre datos reales de una planta local y sustituir el F1 por una ' +
      '<b>función de costo en unidades monetarias</b>.</p>',
    fuente: 'Artículo, sección «Conclusiones»'
  },
  {
    id: 'rul',
    claves: ['vida util remanente', 'rul', 'remaining useful life', 'cuanto le queda', 'pronostico de vida',
             'prognosis'],
    respuesta:
      '<p>La <b>vida útil remanente (RUL)</b> es la formulación alternativa del problema: en lugar de clasificar ' +
      '«¿fallará?», estima «¿cuánto tiempo de operación le queda al activo?».</p>' +
      '<p>Lei et al. (2018) desarrollan la secuencia completa: adquisición de datos, construcción de indicadores de ' +
      'salud, división en etapas de degradación y predicción de vida remanente. Exige datos de degradación continua, ' +
      'no disponibles en el conjunto que empleamos.</p>',
    fuente: 'Lei et al. (2018)'
  },
  {
    id: 'referencias',
    claves: ['referencias', 'bibliografia', 'fuentes', 'citas', 'autores', 'apa', 'quien lo dice'],
    respuesta:
      '<p>El artículo cita 12 fuentes en formato APA 7.ª edición. Las principales:</p>' +
      '<ul>' +
      '<li><b>Zonta et al. (2020)</b> — revisión sistemática de 187 estudios de PdM en Industria 4.0.</li>' +
      '<li><b>Carvalho et al. (2019)</b> — revisión sistemática de métodos de ML aplicados a PdM.</li>' +
      '<li><b>Hector y Panjanathan (2024)</b> — modelos de planificación y técnicas de ML.</li>' +
      '<li><b>Matzka (2020)</b> — conjunto de datos AI4I 2020 e IA explicable.</li>' +
      '<li><b>Lei et al. (2018)</b> — pronóstico de vida útil remanente.</li>' +
      '<li><b>Susto et al. (2015)</b> — enfoque de clasificadores múltiples.</li>' +
      '<li><b>Alvarez Quiñones et al. (2022)</b> — caso colombiano en transformadores de distribución.</li>' +
      '</ul>' +
      '<p>La lista completa está en la última página del PDF, en la pestaña «Artículo».</p>',
    fuente: 'Artículo, sección «Referencias»'
  },
  {
    id: 'caso_colombia',
    claves: ['colombia', 'caso real', 'aplicacion practica', 'transformadores', 'cauca', 'caso de estudio',
             'en la practica', 'ejemplo real'],
    respuesta:
      '<p>Dos casos hispanoamericanos citados en el artículo:</p>' +
      '<ul>' +
      '<li><b>Alvarez Quiñones et al. (2022)</b> implementaron un modelo de clasificación para programar el ' +
      'mantenimiento predictivo de transformadores de distribución en el <b>departamento del Cauca</b>. Su aporte: el ' +
      'valor del modelo está en priorizar el conjunto mínimo de activos propensos a fallar.</li>' +
      '<li><b>Romero Magdaleno et al. (2025)</b> aplicaron Random Forest y Naive Bayes a la clasificación de fallas ' +
      'de maquinaria industrial, con la misma lección: el beneficio se materializa en reorganizar la operación de ' +
      'mantenimiento, no en la métrica del modelo.</li>' +
      '</ul>',
    fuente: 'Alvarez Quiñones et al. (2022); Romero Magdaleno et al. (2025)'
  },
  {
    id: 'reproducir',
    claves: ['reproducir', 'reproduzco', 'reproducir el experimento', 'replicar el experimento',
             'como replicar', 'codigo', 'script', 'python', 'semilla', 'ejecutar el experimento',
             'correr el experimento', 'repositorio', 'codigo fuente'],
    respuesta:
      '<p>Todo el experimento es reproducible. En el repositorio del proyecto:</p>' +
      '<ul>' +
      '<li><code>experimento/experimento_pdm.py</code> genera los datos, entrena los tres modelos y escribe las métricas.</li>' +
      '<li><code>assets/resultados.json</code> guarda las cifras que consume esta página.</li>' +
      '<li><code>experimento/generar_pdf.js</code> produce el PDF del artículo.</li>' +
      '</ul>' +
      '<p>La semilla aleatoria está fija en 42, de modo que las cifras se repiten ejecución tras ejecución.</p>',
    fuente: 'Repositorio del proyecto'
  },
  {
    id: 'agradecimiento',
    claves: ['gracias', 'muchas gracias', 'genial', 'excelente', 'perfecto', 'entendido', 'ok gracias'],
    respuesta:
      '<p>¡Con gusto! Si quieres afianzar lo visto, prueba el <b>Test</b> o las <b>Flashcards</b> en los botones de ' +
      'arriba. Y si te queda alguna duda del artículo, aquí sigo.</p>'
  },
  {
    id: 'despedida',
    claves: ['adios', 'hasta luego', 'chao', 'nos vemos', 'bye'],
    respuesta:
      '<p>¡Hasta pronto! Recuerda la idea que resume el artículo: <b>en mantenimiento predictivo, la métrica y el ' +
      'umbral importan más que el algoritmo</b>.</p>'
  }
];

/* Sinónimos que se expanden antes de puntuar la consulta. */
const SINONIMOS = {
  'ml': 'machine learning aprendizaje automatico',
  'ia': 'inteligencia artificial',
  'pdm': 'mantenimiento predictivo',
  'rf': 'random forest bosque aleatorio',
  'gb': 'gradient boosting',
  'auc': 'area bajo la curva',
  'recall': 'sensibilidad',
  'accuracy': 'exactitud',
  'threshold': 'umbral',
  'dataset': 'conjunto de datos',
  'drift': 'deriva',
  'features': 'caracteristicas variables',
  'overfitting': 'sobreajuste',
  'maquina': 'equipo activo',
  'averia': 'falla',
  'averias': 'fallas',
  'fallo': 'falla',
  'fallos': 'fallas',
  'romper': 'falla',
  'danio': 'falla'
};

/* Preguntas sugeridas que se ofrecen bajo el chat. */
const SUGERENCIAS = [
  '¿Qué es el mantenimiento predictivo?',
  '¿Por qué la exactitud engaña?',
  '¿Qué algoritmos se usan?',
  '¿Qué resultados obtuvieron?',
  '¿Cómo se ajusta el umbral?',
  '¿Qué barreras hay para adoptarlo?',
  '¿Qué datos usaron?',
  '¿Por qué importa la interpretabilidad?'
];

/* --------------------------------------------------------------------------
 * Test de comprensión
 * ----------------------------------------------------------------------- */
const PREGUNTAS_TEST = [
  {
    pregunta: 'Un modelo alcanza 96 % de exactitud en un proceso donde solo el 4 % de los registros son fallas. ¿Qué se puede concluir?',
    opciones: [
      'Que el modelo es excelente y está listo para producción',
      'Nada: un clasificador que siempre prediga «sin falla» obtendría lo mismo',
      'Que el conjunto de datos está mal etiquetado',
      'Que hay que aumentar el número de árboles del modelo'
    ],
    correcta: 1,
    retro: 'Con 4 % de prevalencia, predecir siempre «sin falla» ya da 96 % de exactitud. La métrica no discrimina: hay que mirar sensibilidad, precisión, F1 y PR-AUC.'
  },
  {
    pregunta: '¿Cuál es la diferencia esencial entre mantenimiento basado en condición y mantenimiento predictivo?',
    opciones: [
      'El predictivo usa sensores y el basado en condición no',
      'El basado en condición es más caro de implementar',
      'El basado en condición pregunta si el activo está fuera de rango ahora; el predictivo, cuánto falta para que lo esté',
      'No hay diferencia: son sinónimos en la literatura'
    ],
    correcta: 2,
    retro: 'La primera pregunta admite una regla fija con umbral; la segunda exige aprender la relación entre el patrón de operación y el tiempo hasta la falla. Ahí aporta el machine learning.'
  },
  {
    pregunta: 'En el experimento del artículo, ¿qué produjo la mayor ganancia operativa?',
    opciones: [
      'Cambiar de Random Forest a Gradient Boosting',
      'Aumentar el número de registros de entrenamiento',
      'Ajustar el umbral de decisión de 0,50 a 0,33',
      'Añadir variables nuevas al modelo'
    ],
    correcta: 2,
    retro: 'Mover el umbral aportó 7,5 puntos de F1 y evitó 23 falsos negativos. El cambio de algoritmo aportó apenas medio punto: 0,005 de diferencia, dentro del ruido de la validación cruzada.'
  },
  {
    pregunta: '¿Por qué el PR-AUC es preferible al ROC-AUC en mantenimiento predictivo?',
    opciones: [
      'Porque es más fácil de calcular',
      'Porque se concentra en la clase minoritaria y no se infla con los verdaderos negativos abundantes',
      'Porque siempre da valores más altos',
      'Porque no requiere probabilidades, solo predicciones binarias'
    ],
    correcta: 1,
    retro: 'La curva ROC incorpora los verdaderos negativos, que en un problema desbalanceado sobran. En el experimento, el mismo modelo dio ROC-AUC 0,960 y PR-AUC 0,694.'
  },
  {
    pregunta: 'Un compañero divide aleatoriamente una serie temporal de sensores en 70 % entrenamiento y 30 % prueba. ¿Cuál es el riesgo?',
    opciones: [
      'Ninguno: la partición aleatoria es siempre la práctica correcta',
      'Que el modelo tarde más en entrenar',
      'Fuga de información: el modelo se evalúa con datos que en operación real no habría tenido, y el desempeño resulta optimista',
      'Que se pierdan variables categóricas'
    ],
    correcta: 2,
    retro: 'La contramedida es particionar por bloques temporales o por unidad de equipo, según cuál sea la unidad de generalización que interesa.'
  },
  {
    pregunta: 'La regresión logística del experimento obtuvo sensibilidad 0,817 y precisión 0,130. ¿Qué significa en planta?',
    opciones: [
      'Que es el mejor modelo, porque detecta más fallas',
      'Que detecta casi todas las fallas pero de cada ocho alertas siete son falsas, y saturaría al equipo de mantenimiento',
      'Que el modelo no aprendió nada',
      'Que hay que reducir el umbral aún más'
    ],
    correcta: 1,
    retro: 'Ninguna métrica aislada describe el modelo. Un sistema con esa tasa de falsas alarmas sería desconectado en semanas.'
  },
  {
    pregunta: '¿Por qué los ensambles de árboles dominan la literatura de PdM sobre datos tabulares?',
    opciones: [
      'Porque son los modelos más recientes',
      'Porque capturan interacciones y umbrales sin ingeniería de características costosa y toleran escalas dispares',
      'Porque requieren menos datos que cualquier otro método',
      'Porque son los únicos que dan probabilidades'
    ],
    correcta: 1,
    retro: 'Los datos de mantenimiento son tabulares, heterogéneos y con umbrales de interacción: los ensambles de árboles son el estimador que corresponde a ese perfil.'
  },
  {
    pregunta: '¿Por qué el umbral de decisión debería derivarse de las cifras de la planta y no del F1?',
    opciones: [
      'Porque el F1 es difícil de calcular',
      'Porque el F1 pondera igual precisión y sensibilidad, mientras que en mantenimiento un falso negativo cuesta mucho más que un falso positivo',
      'Porque el F1 solo funciona con datos balanceados',
      'Porque el F1 no admite umbrales distintos de 0,5'
    ],
    correcta: 1,
    retro: 'Una inspección innecesaria cuesta horas de técnico; una parada no planificada incluye lucro cesante, daño colateral y riesgo para las personas.'
  },
  {
    pregunta: 'La importancia por permutación colocó al frente la temperatura de proceso y la velocidad de rotación. ¿Por qué es relevante?',
    opciones: [
      'Porque permite eliminar el resto de variables sin costo',
      'Porque coincide con los modos de falla físicos del proceso, lo que valida el modelo y genera confianza en el usuario',
      'Porque demuestra que el modelo memorizó los datos',
      'Porque indica que el modelo está sobreajustado'
    ],
    correcta: 1,
    retro: 'Que el modelo recupere la estructura física sin conocerla es una validación de sentido físico, y es el tipo de evidencia que convierte una probabilidad en una orden de trabajo ejecutada.'
  },
  {
    pregunta: 'Al iniciar un proyecto en una planta sin historial confiable de fallas, ¿cuál es el enfoque razonable?',
    opciones: [
      'Entrenar una red neuronal profunda con los datos disponibles',
      'Esperar tres años a tener etiquetas suficientes',
      'Usar detección de anomalías o modelos semisupervisados mientras se invierte en la trazabilidad del registro de fallas',
      'Etiquetar manualmente los datos a partir de la intuición del operador'
    ],
    correcta: 2,
    retro: 'Sin etiquetas confiables no hay aprendizaje supervisado útil. Invierte primero en trazabilidad, y mientras tanto empieza con enfoques no supervisados.'
  }
];

/* --------------------------------------------------------------------------
 * Flashcards
 * ----------------------------------------------------------------------- */
const FLASHCARDS = [
  { anverso: 'Mantenimiento predictivo (PdM)',
    reverso: 'Estrategia que estima el estado de salud del activo con sus datos de operación para intervenir justo antes de la falla. Responde «¿cuánto falta?», no «¿está fuera de rango ahora?».' },
  { anverso: '¿Por qué la exactitud engaña en PdM?',
    reverso: 'Porque la falla es un evento raro. Con 4,36 % de prevalencia, predecir siempre «sin falla» da 95,6 % de exactitud sin ninguna utilidad operativa.' },
  { anverso: 'Sensibilidad (recall)',
    reverso: 'De todas las fallas reales, la proporción que el modelo detectó. Penaliza los falsos negativos, que en mantenimiento son los caros.' },
  { anverso: 'Precisión',
    reverso: 'De todas las alertas emitidas, la proporción que correspondía a fallas reales. Penaliza los falsos positivos, que saturan al equipo de mantenimiento.' },
  { anverso: 'PR-AUC frente a ROC-AUC',
    reverso: 'El ROC-AUC se infla con los verdaderos negativos abundantes del problema desbalanceado; el PR-AUC se concentra en la clase minoritaria. En el experimento: 0,960 vs. 0,694 con el mismo modelo.' },
  { anverso: 'Fuga de información temporal',
    reverso: 'Particionar aleatoriamente una serie temporal mezcla registros anteriores y posteriores a la misma falla. El desempeño resultante es sistemáticamente optimista. Se corrige particionando por bloques temporales o por equipo.' },
  { anverso: 'Ajuste del umbral de decisión',
    reverso: 'Mover el umbral de 0,50 a 0,33 subió la sensibilidad de 0,466 a 0,641 y redujo los falsos negativos de 70 a 47. Ganancia mayor que cualquier cambio de algoritmo.' },
  { anverso: 'Costos asimétricos',
    reverso: 'Un falso positivo cuesta horas de técnico; un falso negativo incluye lucro cesante, daño colateral y riesgo para las personas. Por eso el umbral debe derivarse de cifras de planta, no del F1.' },
  { anverso: '¿Cuándo usar redes neuronales profundas?',
    reverso: 'Cuando la entrada es señal cruda de alta frecuencia (vibración, corriente, acústica) y la representación debe aprenderse. Sobre datos tabulares no superan a un ensamble de árboles.' },
  { anverso: 'Vida útil remanente (RUL)',
    reverso: 'Formulación alternativa al problema de clasificación: estima cuánto tiempo de operación le queda al activo. Requiere datos de degradación continua.' },
  { anverso: 'Deriva de los datos',
    reverso: 'Pérdida de validez del modelo cuando cambia la materia prima, el turno, el lote o el equipo. Se contrarresta monitoreando la distribución de entradas desde el día uno y fijando de antemano el criterio de reentrenamiento.' },
  { anverso: 'Las cuatro barreras de adopción',
    reverso: 'Calidad y etiquetado de los datos; desbalance de clases; deriva de los datos; integración organizacional del sistema en la planificación existente.' },
  { anverso: 'Conclusión central del artículo',
    reverso: 'El valor operativo no depende del algoritmo, sino de tres decisiones: la métrica de evaluación, la calibración del umbral frente a costos asimétricos y la interpretabilidad exigida por el personal de mantenimiento.' }
];
