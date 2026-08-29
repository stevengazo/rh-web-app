import Divider from '../Divider';
import { formatMoney } from '../../utils/formatMoney';

/* ------------------------------------------------------------------
   Formateo
   ------------------------------------------------------------------ */

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

/** Aplica el formato según el tipo declarado en el campo. */
const formatear = (valor, tipo) => {
  if (valor === null || valor === undefined || valor === '') return null;

  switch (tipo) {
    case 'fecha': {
      const f = fechaValida(valor);
      return f
        ? f.toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : null;
    }
    case 'dinero':
      return formatMoney(valor);
    case 'booleano':
      return valor ? 'Sí' : 'No';
    default:
      return String(valor);
  }
};

/* ------------------------------------------------------------------
   Componente
   ------------------------------------------------------------------ */

/**
 * Panel de detalle de un registro cualquiera.
 *
 * En lugar de escribir una vista a medida por cada tabla (cursos, salarios,
 * comisiones, reconocimientos…), se le pasa la lista de campos a mostrar y él
 * se encarga del formato, de ocultar los vacíos y del texto largo.
 *
 * @param {string} [titulo]
 * @param {string} [subtitulo]
 * @param {import('react').ReactNode} [badge]  Estado, si el registro tiene.
 * @param {Array<{label: string, valor: any, tipo?: 'texto'|'fecha'|'dinero'|'booleano', ancho?: 'completo'}>} campos
 * @param {import('react').ReactNode} [extra]    Bloque adicional (por ejemplo, adjuntos).
 * @param {import('react').ReactNode} [acciones] Botonera al pie.
 */
const RecordView = ({ titulo, subtitulo, badge, campos = [], extra, acciones }) => {
  const visibles = campos
    .map((c) => ({ ...c, texto: formatear(c.valor, c.tipo) }))
    .filter((c) => c.texto !== null);

  const ocultos = campos.length - visibles.length;

  return (
    <div className="space-y-5 text-ink">
      {(titulo || badge) && (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {titulo && (
              <h2 className="truncate text-lg font-semibold text-ink">
                {titulo}
              </h2>
            )}
            {subtitulo && (
              <p className="mt-0.5 truncate text-sm text-ink-muted">
                {subtitulo}
              </p>
            )}
          </div>

          {badge}
        </div>
      )}

      {(titulo || badge) && <Divider />}

      {visibles.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">
          Este registro no tiene datos que mostrar.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-stroke-soft bg-surface-alt p-4 sm:grid-cols-2">
          {visibles.map((c) => (
            <div
              key={c.label}
              className={c.ancho === 'completo' ? 'sm:col-span-2' : undefined}
            >
              <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
                {c.label}
              </p>
              <p className="wrap-break-word text-sm font-medium text-ink">
                {c.texto}
              </p>
            </div>
          ))}
        </div>
      )}

      {ocultos > 0 && (
        <p className="text-xs text-ink-muted">
          {ocultos} campo{ocultos === 1 ? '' : 's'} sin completar.
        </p>
      )}

      {extra}

      {acciones && (
        <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
          {acciones}
        </div>
      )}
    </div>
  );
};

export default RecordView;
