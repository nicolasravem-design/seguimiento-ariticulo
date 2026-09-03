// Convierte articulo/articulo.html en assets/articulo.pdf con Chromium headless.
// Uso: node experimento/generar_pdf.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// El entorno puede traer Chromium preinstalado en una ruta fija; se usa si existe.
function rutaChromium() {
  const candidatos = [
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    '/opt/pw-browsers/chromium/chrome-linux/chrome',
  ];
  return candidatos.find((c) => fs.existsSync(c));
}

(async () => {
  const raiz = path.resolve(__dirname, '..');
  const ejecutable = rutaChromium();
  const navegador = await chromium.launch(
    ejecutable ? { executablePath: ejecutable } : {}
  );
  const pagina = await navegador.newPage();
  await pagina.goto('file://' + path.join(raiz, 'articulo', 'articulo.html'), {
    waitUntil: 'networkidle',
  });
  await pagina.pdf({
    path: path.join(raiz, 'assets', 'articulo.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: '2.54cm', bottom: '2.54cm', left: '2.54cm', right: '2.54cm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-family:Times New Roman,serif;font-size:9pt;' +
      'padding:0 2.54cm;text-align:right;"><span class="pageNumber"></span></div>',
  });
  await navegador.close();
  console.log('PDF generado en assets/articulo.pdf');
})();
