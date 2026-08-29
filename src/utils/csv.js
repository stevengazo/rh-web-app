/**
 * Exportación a CSV.
 *
 * Se genera en el navegador y no en el servidor porque los datos ya están
 * cargados en pantalla: pedirlos otra vez solo para descargarlos sería un
 * viaje de más.
 */

/**
 * Escapa un valor para CSV.
 *
 * Excel en español separa por punto y coma, no por coma, y ese es el
 * separador que usa esta función. Un valor que contenga el separador, comillas
 * o saltos de línea se encierra entre comillas y las comillas se duplican.
 */
const escapar = (valor) => {
  if (valor === null || valor === undefined) return '';

  const texto =
    valor instanceof Date
      ? valor.toLocaleDateString('es-CR')
      : typeof valor === 'boolean'
        ? valor
          ? 'Sí'
          : 'No'
        : String(valor);

  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
};

/**
 * Convierte filas a texto CSV.
 *
 * @param {Array<object>} filas
 * @param {Array<{clave: string, titulo: string}>} columnas
 */
export const aCsv = (filas, columnas) => {
  const cabecera = columnas.map((c) => escapar(c.titulo)).join(';');

  const cuerpo = filas.map((fila) =>
    columnas.map((c) => escapar(fila[c.clave])).join(';')
  );

  return [cabecera, ...cuerpo].join('\r\n');
};

/**
 * Descarga las filas como CSV.
 *
 * Lleva BOM: sin él, Excel abre el archivo en la codificación del sistema y
 * los acentos salen rotos, que en español es todo el rato.
 */
export const descargarCsv = (nombre, filas, columnas) => {
  const contenido = '﻿' + aCsv(filas, columnas);
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = nombre.endsWith('.csv') ? nombre : `${nombre}.csv`;

  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
};

/** Sufijo con la fecha, para que dos descargas no se pisen. */
export const sufijoFecha = () => {
  const f = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${f.getFullYear()}-${p(f.getMonth() + 1)}-${p(f.getDate())}`;
};
