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
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
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
      >
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th
                onClick={() => requestSort('employee')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-left cursor-pointer select-none"
              >
                Empleado{sortIcon('employee')}
              </th>

              <th
                onClick={() => requestSort('title')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-left cursor-pointer select-none"
              >
                Título{sortIcon('title')}
              </th>

              <th
                onClick={() => requestSort('startDate')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-left cursor-pointer select-none"
              >
                Inicio{sortIcon('startDate')}
              </th>

              <th
                onClick={() => requestSort('endDate')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-left cursor-pointer select-none"
              >
                Fin{sortIcon('endDate')}
              </th>

              <th
                onClick={() => requestSort('days')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-center cursor-pointer select-none"
              >
                Días{sortIcon('days')}
              </th>

              <th
                onClick={() => requestSort('justified')}
                className="px-4 py-3 text-sm font-semibold text-gray-600 text-left cursor-pointer select-none"
              >
                Justificada{sortIcon('justified')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No hay ausencias registradas
                </td>
              </tr>
            ) : (
              sortedItems.map((item) => (
                <tr
                  key={item.absenceId}
                  onClick={() => OnSelectedView?.(item)}
                  className="cursor-pointer transition hover:bg-blue-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.user?.firstName} {item.user?.lastName}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.title}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(item.startDate).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(item.endDate).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-center font-medium text-gray-800">
                    {calcDays(item.startDate, item.endDate).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`
                        inline-flex items-center
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                          item.justified
                            ? 'bg-green-100 text-green-700'
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
