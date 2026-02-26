import EmployeeApi from "../api/employeesApi";

import { useEffect, useState } from "react";
import { Plus, Shield } from "lucide-react";

const RolesPage = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: "Administrador", description: "Acceso total al sistema" },
    { id: 2, name: "Supervisor", description: "Gestión operativa" },
    { id: 3, name: "Usuario", description: "Acceso limitado" },
  ]);

  const [employees, setEmployees] = useState([]);   


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Gestión de Roles</h1>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          <Plus size={18} />
          Nuevo Rol
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nombre</th>
                <th className="p-4">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">{role.id}</td>
                  <td className="p-4 font-medium">{role.name}</td>
                  <td className="p-4 text-gray-600">{role.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;