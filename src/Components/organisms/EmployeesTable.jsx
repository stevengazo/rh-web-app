import { motion } from "framer-motion";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesTable = () => {
  const navigate = useNavigate();
  // Mock data (luego lo reemplazas por API)
  const employees = [
    { id: 1, firstName: "Juan", lastName: "Pérez", email: "juan@empresa.com" },
    { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@empresa.com" },
    { id: 3, firstName: "Carlos", lastName: "Rodríguez", email: "carlos@empresa.com" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200"
    >



      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-6 py-3 text-left font-medium">ID</th>
              <th className="px-6 py-3 text-left font-medium">Nombre</th>
              <th className="px-6 py-3 text-left font-medium">Apellido</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-6 py-3">{emp.id}</td>
                <td className="px-6 py-3 font-medium">{emp.firstName}</td>
                <td className="px-6 py-3">{emp.lastName}</td>
                <td className="px-6 py-3 text-slate-600">{emp.email}</td>
                <td className="px-6 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 rounded hover:bg-slate-200" onClick={()=> navigate(`/manager/employees/1`)}>
                      <Eye size={16} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-slate-200">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 rounded text-red-500 hover:bg-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
};

export default EmployeesTable;
