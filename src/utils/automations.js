/** Etiquetas legibles del motor de automatizaciones. */

export const OPERADORES = [
  { id: 'eq', label: 'es igual a' },
  { id: 'neq', label: 'es distinto de' },
  { id: 'gt', label: 'es mayor que' },
  { id: 'gte', label: 'es mayor o igual que' },
  { id: 'lt', label: 'es menor que' },
  { id: 'lte', label: 'es menor o igual que' },
  { id: 'contains', label: 'contiene' },
  { id: 'startsWith', label: 'empieza con' },
  { id: 'exists', label: 'tiene valor' },
  { id: 'notExists', label: 'está vacío' },
];

export const OP_SIN_VALOR = new Set(['exists', 'notExists']);

export const ACCIONES = {
  email: {
    label: 'Enviar correo',
    icon: 'Mail',
    campos: [
      { name: 'to', label: 'Para', help: 'Correo, "employee" (el del colaborador) o field:clave' },
      { name: 'subject', label: 'Asunto', help: 'Admite {{clave}}' },
      { name: 'body', label: 'Cuerpo', textarea: true, help: 'Admite {{clave}}' },
    ],
  },
  message: {
    label: 'Mensaje interno',
    icon: 'MessagesSquare',
    campos: [
      { name: 'toUserId', label: 'Para (colaborador)', help: 'field:userId o el id de un colaborador' },
      { name: 'body', label: 'Mensaje', textarea: true, help: 'Admite {{clave}}' },
    ],
  },
  reminder: {
    label: 'Crear recordatorio',
    icon: 'BellRing',
    campos: [
      { name: 'toUserId', label: 'Para (colaborador)', help: 'field:userId o el id de un colaborador' },
      { name: 'title', label: 'Título', help: 'Admite {{clave}}' },
      { name: 'message', label: 'Detalle', textarea: true, help: 'Admite {{clave}}' },
      { name: 'inDays', label: 'En cuántos días', tipo: 'number' },
    ],
  },
  webhook: {
    label: 'Llamar un webhook',
    icon: 'Webhook',
    campos: [
      { name: 'url', label: 'URL' },
      { name: 'method', label: 'Método', help: 'POST por defecto' },
    ],
  },
  assignPsychometric: {
    label: 'Asignar prueba psicométrica',
    icon: 'Brain',
    campos: [
      { name: 'testId', label: 'Prueba', tipo: 'select-prueba' },
      { name: 'toUserId', label: 'Para (colaborador)', help: 'field:userId o el id de un colaborador' },
    ],
  },
};

export const etiquetaAccion = (tipo) => ACCIONES[tipo]?.label ?? tipo;

export const RUN_STATUS_STYLE = {
  OK: 'bg-green-50 text-green-700 border-green-200',
  Parcial: 'bg-amber-50 text-amber-700 border-amber-200',
  Error: 'bg-red-50 text-red-600 border-red-200',
  Omitida: 'bg-surface-alt text-ink-secondary border-stroke',
};
