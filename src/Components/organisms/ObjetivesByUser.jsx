import SectionTitle from '../SectionTitle';
import { useNavigate } from 'react-router-dom';

const ObjetivesByUser = ({ ObjetivesByUser = [], Employees = [] }) => {
  const navigate = useNavigate();
  // Agrupar objetivos por usuario
  const groupedByUser = ObjetivesByUser.reduce((acc, item) => {
    if (!acc[item.userId]) {
      acc[item.userId] = [];
    }
    acc[item.userId].push(item);
    return acc;
  }, {});

  const getEmployeeName = (userId) => {
    const employee = Employees.find((e) => e.id === userId);

    return employee
      ? `${employee.firstName} ${employee.lastName} `
      : 'Empleado no encontrado';
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedByUser).map(([userId, objectives]) => (
        <div
          key={userId}
          onClick={() => navigate(`/manager/perfornance/${userId}`)}
          className="rounded-xl hover:shadow-2xl hover:border-gray-200 px-2 transition duration-150 border border-gray-200  shadow-sm"
        >
          {/* Usuario */}
          <h4 className=" font-semibold text-2xl  p-2 text-gray-700">
            {getEmployeeName(userId)}
          </h4>

          <div className="overflow-x-auto my-2">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3 font-medium">Objetivo</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {objectives.map((o) => (
                  <tr
                    key={o.user_ObjetiveId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {o.objetive?.title || 'Sin título'}
                    </td>

                    <td className="px-4 py-3 text-gray-500 max-w-md">
                      <p className="truncate">
                        {o.objetive?.description || '-'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObjetivesByUser;
