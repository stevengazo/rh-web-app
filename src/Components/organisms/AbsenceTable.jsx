import { motion, AnimatePresence } from 'framer-motion';

const AbsenceTable = ({ items = [], OnSelectedView }) => {
  const calcDays = (startDate, endDate) => {
    if (!startDate || !endDate) return '-';

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) return 'Inválido';

    const diffMs = end - start;
    return (diffMs / (1000 * 60 * 60 * 24)).toFixed(2);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={items.length}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                'Empleado',
                'Título',
                'Inicio',
                'Fin',
                'Días',
                'Justificada',
              ].map((h) => (
                <th
                  key={h}
                  className={`
                    px-4 py-3 text-sm font-semibold text-gray-600
                    ${h === 'Días' ? 'text-center' : 'text-left'}
                  `}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  No hay ausencias registradas
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.absenceId}
                  onClick={() => OnSelectedView?.(item)}
                  className="
                    cursor-pointer transition
                    hover:bg-blue-50
                  "
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.user.firstName} {item.user.lastName}
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
                    {calcDays(item.startDate, item.endDate)}
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
