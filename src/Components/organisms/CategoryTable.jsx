import { FolderTree, Pencil, Trash2 } from 'lucide-react';

import RowActionButton from '../molecules/RowActionButton';

/**
 * Tabla de categorías (objetivos o preguntas). Genérica sobre el nombre de la
 * llave primaria.
 *
 * @param {Array} categories
 * @param {string} idKey          'objetiveCategoryId' | 'questionCategoryId'
 * @param {(c:object)=>void} [onEdit]
 * @param {(c:object)=>void} [onDelete]
 */
const CategoryTable = ({ categories = [], idKey, onEdit, onDelete }) => {
  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-14 text-ink-muted">
        <FolderTree size={28} />
        <p className="text-sm font-medium">Aún no hay categorías</p>
      </div>
    );
  }

  const conAcciones = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
      <table className="min-w-full">
        <thead className="bg-surface-alt text-ink-secondary">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Categoría</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Estado</th>
            {conAcciones && (
              <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke-soft bg-surface">
          {categories.map((c) => (
            <tr key={c[idKey]} className="transition-colors hover:bg-canvas">
              <td className="px-4 py-3 text-sm font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    c.isActive
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-stroke bg-surface-alt text-ink-secondary'
                  }`}
                >
                  {c.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              {conAcciones && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {onEdit && (
                      <RowActionButton
                        icon={Pencil}
                        label="Editar"
                        tono="brand"
                        onClick={() => onEdit(c)}
                      />
                    )}
                    {onDelete && (
                      <RowActionButton
                        icon={Trash2}
                        label="Eliminar"
                        tono="danger"
                        onClick={() => onDelete(c)}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
