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
    return employee ? employee.userName : 'Empleado no encontrado';
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Objetivos por Empleado</SectionTitle>

      {Object.entries(groupedByUser).map(([userId, objectives]) => (
        <div
          key={userId}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          {/* Usuario */}
          <h4
            className="mb-3 text-sm font-semibold hover:text-lg hover:text-blue-600 duration-200  text-gray-700"
            onClick={() => navigate(`/manager/perfornance/${userId}`)}
          >
            {getEmployeeName(userId)}
            <span className="ml-2 font-mono text-xs text-gray-400">
              ({userId})
            </span>
          </h4>

          {/* Objetivos */}
          <ul className="space-y-2">
            {objectives.map((o) => (
              <li
                key={o.user_ObjetiveId}
                className="rounded-lg bg-gray-50 p-3 text-sm"
              >
                <p className="font-medium text-gray-800">{o.objetive?.title}</p>
                <p className="text-xs text-gray-500">
                  {o.objetive?.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ObjetivesByUser;
