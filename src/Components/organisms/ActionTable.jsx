import { motion } from 'framer-motion';
import { Briefcase, Eye, Pencil, Trash2 } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';
import ActionStatusBadge, {
  estadoDeAccion,
} from '../molecules/ActionStatusBadge';

const formatDate = (valor) => {
  if (!valor || String(valor).startsWith('0001-01-01')) return '—';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? '—'
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

/**
 * Tabla de acciones de personal.
 *
 * @param {Array} actions
 * @param {(a: object) => void} [OnSelect] Ver detalle.
 * @param {(a: object) => void} [OnEdit]
 * @param {(a: object) => void} [onDelete]
 */
const ActionTable = ({ actions = [], OnEdit, onDelete, OnSelect }) => {
  if (!actions.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl
                      border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted">
        <Briefcase size={26} />
        <p className="text-sm">No hay acciones registradas.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Registrada</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stroke-soft bg-surface text-sm">
          {actions.map((item, i) => (
            <motion.tr
              key={item.actionId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
              onClick={() => OnSelect?.(item)}
              /* El hover se hace con clases para que respete el modo oscuro:
                 antes era un color fijo (#f8fafc) y en oscuro quedaba blanco. */
              className="cursor-pointer transition-colors hover:bg-canvas"
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-ink">
                {formatDate(item.actionDate)}
              </td>

              <td className="px-4 py-3 text-ink-secondary">
                {item.actionType?.name || '—'}
              </td>

              <td className="max-w-xs px-4 py-3 text-ink-muted">
                <span className="line-clamp-1">{item.description || '—'}</span>
              </td>

              <td className="px-4 py-3">
                <ActionStatusBadge status={estadoDeAccion(item)} />
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                {formatDate(item.createdDate)}
                {item.createdBy && (
                  <span className="block text-xs">{item.createdBy}</span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <RowActionButton
                    icon={Eye}
                    label="Ver detalle"
                    tono="brand"
                    onClick={() => OnSelect?.(item)}
                  />

                  {OnEdit && (
                    <RowActionButton
                      icon={Pencil}
                      label="Editar"
                      onClick={() => OnEdit(item)}
                    />
                  )}

                  {onDelete && (
                    <RowActionButton
                      icon={Trash2}
                      label="Eliminar"
                      tono="danger"
                      onClick={() => onDelete(item)}
                    />
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActionTable;
