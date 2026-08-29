/**
 * Descripción de los roles del sistema.
 *
 * Identity solo guarda el nombre del rol, así que qué significa cada uno
 * vive aquí. Es la única referencia escrita de a qué da acceso cada rol:
 * sin esto, asignar «HR» es asignar una palabra.
 *
 * ⚠️ Hoy la aplicación **solo distingue `Admin`**: `ManagerLayout` es lo único
 * que comprueba un rol. Los demás quedan asignados pero todavía no cambian lo
 * que la persona puede hacer. Lo que sigue describe la intención de cada uno,
 * y así está señalado en pantalla para no prometer un control que no existe.
 */

export const ROLES = {
  Admin: {
    etiqueta: 'Administrador',
    resumen: 'Acceso completo: planilla, personal y configuración.',
    detalle:
      'Entra al panel de gestión, aprueba y paga planillas, administra ' +
      'colaboradores y cambia la configuración del sistema.',
    aplicado: true,
    tono: 'admin',
  },

  Manager: {
    etiqueta: 'Jefatura',
    resumen: 'Aprueba las solicitudes de su equipo.',
    detalle:
      'Pensado para quien dirige un departamento: revisar ausencias, ' +
      'vacaciones y acciones de su gente, y consultar sus expedientes. ' +
      'No toca planilla ni configuración.',
    aplicado: false,
    tono: 'brand',
  },

  HR: {
    etiqueta: 'Recursos Humanos',
    resumen: 'Gestiona expedientes y compensación, sin tocar la configuración.',
    detalle:
      'Pensado para el área de RR.HH.: alta y edición de colaboradores, ' +
      'expedientes, acciones de personal, ausencias y armado de planillas. ' +
      'No cambia la configuración del sistema ni los roles.',
    aplicado: false,
    tono: 'brand',
  },

  Employee: {
    etiqueta: 'Colaborador',
    resumen: 'Solo su propia información.',
    detalle:
      'El rol base: ve su perfil, sus comprobantes de pago, sus préstamos y ' +
      'sus KPIs, y solicita vacaciones. No ve datos de nadie más.',
    aplicado: false,
    tono: 'neutro',
  },
};

/** Descripción de un rol, con respaldo para los que se creen a mano. */
export const describirRol = (nombre) =>
  ROLES[nombre] ?? {
    etiqueta: nombre,
    resumen: 'Rol creado a la medida.',
    detalle: 'No tiene una descripción definida en el sistema.',
    aplicado: false,
    tono: 'neutro',
  };

/** Clases del distintivo según la importancia del rol. */
export const COLOR_ROL = {
  admin: 'border-amber-300 bg-amber-50 text-amber-900',
  brand: 'border-brand-200 bg-brand-tint text-brand-700',
  neutro: 'border-stroke bg-surface-alt text-ink-secondary',
};

export default ROLES;
