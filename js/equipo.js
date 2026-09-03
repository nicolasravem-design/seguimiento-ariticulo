/**
 * Perfiles del equipo mostrados en la pestaña "Currículum".
 * Edita este arreglo con los datos reales de cada integrante: las tarjetas
 * de la página se generan a partir de él.
 */
const EQUIPO = [
  {
    nombre: 'Nicolás Ravem',
    rol: 'Ingeniería y ciencia de datos · Autor principal',
    iniciales: 'NR',
    resumen:
      'Responsable de la revisión bibliográfica, del diseño del experimento en Python ' +
      'y del desarrollo de esta plataforma web. Interés en la aplicación de aprendizaje ' +
      'automático a problemas de confiabilidad y gestión de activos.',
    formacion: [
      { titulo: 'Corporación Universitaria Lasallista', detalle: 'Pregrado en curso · Facultad de Ingeniería' },
      { titulo: 'Herramientas de Inteligencia Artificial', detalle: 'Asignatura 2026 · Proyecto integrador' }
    ],
    experiencia: [
      { titulo: 'Experimento de mantenimiento predictivo', detalle: 'Diseño, entrenamiento y evaluación de tres clasificadores sobre 10 000 registros' },
      { titulo: 'Desarrollo web front-end', detalle: 'Interfaz accesible en HTML, CSS y JavaScript sin dependencias' }
    ],
    competencias: ['Python', 'scikit-learn', 'Análisis de datos', 'HTML5', 'CSS3', 'JavaScript', 'Git', 'Redacción APA'],
    contacto: { etiqueta: 'GitHub', url: 'https://github.com/nicolasravem-design' }
  },
  {
    nombre: '[Nombre del integrante 2]',
    rol: '[Rol en el proyecto]',
    iniciales: 'I2',
    resumen:
      'Plantilla de perfil. Sustituye este texto por un resumen profesional de tres o ' +
      'cuatro líneas: área de formación, foco de interés y aporte concreto al proyecto.',
    formacion: [
      { titulo: '[Institución]', detalle: '[Programa académico · años]' }
    ],
    experiencia: [
      { titulo: '[Cargo o proyecto]', detalle: '[Organización · logro medible]' }
    ],
    competencias: ['[Competencia 1]', '[Competencia 2]', '[Competencia 3]'],
    contacto: { etiqueta: 'Correo', url: 'mailto:correo@ejemplo.com' }
  },
  {
    nombre: '[Nombre del integrante 3]',
    rol: '[Rol en el proyecto]',
    iniciales: 'I3',
    resumen:
      'Plantilla de perfil. Sustituye este texto por un resumen profesional de tres o ' +
      'cuatro líneas: área de formación, foco de interés y aporte concreto al proyecto.',
    formacion: [
      { titulo: '[Institución]', detalle: '[Programa académico · años]' }
    ],
    experiencia: [
      { titulo: '[Cargo o proyecto]', detalle: '[Organización · logro medible]' }
    ],
    competencias: ['[Competencia 1]', '[Competencia 2]', '[Competencia 3]'],
    contacto: { etiqueta: 'Correo', url: 'mailto:correo@ejemplo.com' }
  }
];
