/**
 * Vigencia de las certificaciones.
 *
 * `expirationDate` existía en el modelo pero nadie avisaba: una certificación
 * podía vencer sin que nadie se enterara.
 */

/** Días de antelación con los que se considera "por vencer". */
export const DIAS_AVISO = 60;

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

/**
 * Clasifica una certificación por su vigencia.
 *
 * @param {object} certificacion
 * @returns {{estado: 'vencida'|'por-vencer'|'vigente'|'sin-fecha', dias: number|null}}
 */
export const vigenciaCertificacion = (certificacion) => {
  const vence = fechaValida(certificacion?.expirationDate);
  if (!vence) return { estado: 'sin-fecha', dias: null };

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const dias = Math.ceil((vence - hoy) / 86400000);

  if (dias < 0) return { estado: 'vencida', dias };
  if (dias <= DIAS_AVISO) return { estado: 'por-vencer', dias };
  return { estado: 'vigente', dias };
};

/** Texto corto para mostrar junto a la certificación. */
export const textoVigencia = ({ estado, dias }) => {
  switch (estado) {
    case 'vencida':
      return `Vencida hace ${Math.abs(dias)} ${Math.abs(dias) === 1 ? 'día' : 'días'}`;
    case 'por-vencer':
      return dias === 0
        ? 'Vence hoy'
        : `Vence en ${dias} ${dias === 1 ? 'día' : 'días'}`;
    case 'vigente':
      return 'Vigente';
    default:
      return 'Sin fecha de vencimiento';
  }
};

/** Clases del sistema de diseño para cada estado de vigencia. */
export const colorVigencia = (estado) => {
  switch (estado) {
    case 'vencida':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'por-vencer':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'vigente':
      return 'border-green-200 bg-green-50 text-green-700';
    default:
      return 'border-stroke bg-surface-alt text-ink-muted';
  }
};

/** Certificaciones que requieren atención, de la más urgente a la menos. */
export const certificacionesPorAtender = (certificaciones = []) =>
  certificaciones
    .map((c) => ({ certificacion: c, ...vigenciaCertificacion(c) }))
    .filter((c) => c.estado === 'vencida' || c.estado === 'por-vencer')
    .sort((a, b) => a.dias - b.dias);

export default vigenciaCertificacion;
