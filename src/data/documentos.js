/**
 * Catálogo de categorías de documentos del expediente.
 *
 * Vive en el frontend a propósito: la columna `Category` de `Files` es texto
 * libre, así que agregar una categoría nueva es editar esta lista, sin migrar
 * la base.
 */

/**
 * Tabla bajo la que se guardan los documentos del expediente.
 *
 * La usan tanto quien sube (`EmployeeDocuments`) como quien lee
 * (`useEmployeeView`): si difieren, el archivo se sube y no se ve.
 */
export const TABLA_DOCUMENTOS = 'EmployeeDocs';

export const CATEGORIAS_DOCUMENTO = [
  { id: 'Contrato', label: 'Contrato', descripcion: 'Contrato laboral y adendas' },
  { id: 'Identificacion', label: 'Identificación', descripcion: 'Cédula, pasaporte, permiso de trabajo' },
  { id: 'Certificado', label: 'Certificado', descripcion: 'Títulos, cursos y certificaciones' },
  { id: 'Medico', label: 'Médico', descripcion: 'Incapacidades y dictámenes' },
  { id: 'Bancario', label: 'Bancario', descripcion: 'Cuenta para el pago de planilla' },
  { id: 'Accion', label: 'Acción de personal', descripcion: 'Respaldos de movimientos' },
  { id: 'Otro', label: 'Otro', descripcion: 'Cualquier otro documento' },
];

/** Devuelve la etiqueta de una categoría, con respaldo si no está en la lista. */
export const etiquetaCategoria = (id) =>
  CATEGORIAS_DOCUMENTO.find((c) => c.id === id)?.label ?? id ?? 'Sin clasificar';

export default CATEGORIAS_DOCUMENTO;
