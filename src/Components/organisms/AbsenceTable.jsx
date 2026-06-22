import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';

const AbsenceTable = ({ items = [], OnSelectedView }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });

  const calcDays = (startDate, endDate) => {
    if (!startDate || !endDate) return -1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return Number.NEGATIVE_INFINITY;

    return (end - start) / (1000 * 60 * 60 * 24);
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      let aVal;
      let bVal;

      switch (sortConfig.key) {
        case 'employee':
          aVal = `${a.user?.firstName ?? ''} ${a.user?.lastName ?? ''}`;
          bVal = `${b.user?.firstName ?? ''} ${b.user?.lastName ?? ''}`;
          break;

        case 'startDate':
        case 'endDate':
          aVal = new Date(a[sortConfig.key]).getTime();
          bVal = new Date(b[sortConfig.key]).getTime();
          break;

        case 'days':
          aVal = calcDays(a.startDate, a.endDate);
          bVal = calcDays(b.startDate, b.endDate);
          break;

        case 'justified':
          aVal = a.justified ? 1 : 0;
          bVal = b.justified ? 1 : 0;
          break;

        default:
          aVal = a[sortConfig.key] ?? '';
          bVal = b[sortConfig.key] ?? '';
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${items.length}-${sortConfig.key}-${sortConfig.direction}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full overflow-x-auto"
      >
        <table className="min-w-full border border-stroke-soft rounded-xl overflow-hidden shadow-sm bg-surface">
          {/* =========================
          HEADER
      ========================= */}
          <thead className="bg-surface-alt text-ink-secondary">
            <tr>
              <th
                onClick={() => requestSort('employee')}
                className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Empleado {sortIcon('employee')}
                </div>
              </th>

              <th
                onClick={() => requestSort('title')}
                className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Título {sortIcon('title')}
                </div>
              </th>

              <th
                onClick={() => requestSort('startDate')}
                className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Inicio {sortIcon('startDate')}
                </div>
              </th>

              <th
                onClick={() => requestSort('endDate')}
                className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Fin {sortIcon('endDate')}
                </div>
              </th>

              <th
                onClick={() => requestSort('days')}
                className="px-4 py-3 text-center text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center justify-center gap-2">
                  Días {sortIcon('days')}
                </div>
              </th>

              <th
                onClick={() => requestSort('justified')}
                className="px-4 py-3 text-left text-sm font-semibold text-ink-secondary cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  Justificada {sortIcon('justified')}
                </div>
              </th>
            </tr>
          </thead>

          {/* =========================
          BODY
      ========================= */}
          <tbody className="divide-y divide-stroke-soft">
            {sortedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-ink-muted"
                >
                  No hay ausencias registradas
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr
                  key={item.absenceId}
                  onClick={() => OnSelectedView?.(item)}
                  className="cursor-pointer transition hover:bg-canvas"
                >
                  {/* EMPLEADO */}
                  <td className="px-4 py-3 text-sm text-ink-secondary">
                    {item.user?.firstName} {item.user?.lastName}
                  </td>

                  {/* TITULO */}
                  <td className="px-4 py-3 text-sm text-ink-secondary">
                    {item.title}
                  </td>

                  {/* INICIO */}
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {new Date(item.startDate).toLocaleDateString()}
                  </td>

                  {/* FIN */}
                  <td className="px-4 py-3 text-sm text-ink-muted">
                    {new Date(item.endDate).toLocaleDateString()}
                  </td>

                  {/* DIAS */}
                  <td className="px-4 py-3 text-sm text-center font-medium text-ink">
                    {calcDays(item.startDate, item.endDate).toFixed(2)}
                  </td>

                  {/* JUSTIFICADA */}
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`
                    inline-flex items-center
                    px-3 py-1 rounded-full text-xs font-medium
                    ${
                      item.justified
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                    >
                      {item.justified ? 'Sí' : 'No'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </AnimatePresence>
  );
};

export default AbsenceTable;
