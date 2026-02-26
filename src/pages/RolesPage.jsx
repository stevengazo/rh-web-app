import EmployeeApi from "../api/employeesApi";
import RolesApi from "../api/roles";
import { useEffect, useState } from "react";
import { Plus, Shield, User, Trash2 } from "lucide-react";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================
  // Cargar datos iniciales
  // ==========================
  useEffect(() => {
    loadRoles();
    loadEmployees();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await RolesApi.getAll();
      setRoles(data.data);
    } catch (error) {
      console.error("Error cargando roles", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await EmployeeApi.getAllEmployees();
      setEmployees(data.data);
    } catch (error) {
      console.error("Error cargando empleados", error);
    }
  };

  // ==========================
  // Cargar roles de usuario
  // ==========================
  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);

    try {
      const roles = await RolesApi.getByUser(user.id);
      console.log("Roles del usuario:", roles);
      setUserRoles(roles.data);
    } catch (error) {
      console.error("Error cargando roles del usuario", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Asignar rol
  // ==========================
  const assignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await RolesApi.assignToUser(selectedUser.id, selectedRole);
      const updatedRoles = await RolesApi.getByUser(selectedUser.id);
      setUserRoles(updatedRoles);
      setSelectedRole("");
    } catch (error) {
      console.error("Error asignando rol", error);
    }
  };

  // ==========================
  // Quitar rol
  // ==========================
  const removeRole = async (roleName) => {
    if (!selectedUser) return;

    try {
      await RolesApi.removeFromUser(selectedUser.id, roleName);
      const updatedRoles = await RolesApi.getByUser(selectedUser.id);
      setUserRoles(updatedRoles);
    } catch (error) {
      console.error("Error removiendo rol", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Gestión de Roles</h1>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ============================= */}
        {/* Lista de Empleados */}
        {/* ============================= */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={18} /> Empleados
          </h2>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectUser(emp)}
                className={`p-3 rounded-xl cursor-pointer border transition ${
                  selectedUser?.id === emp.id
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-medium">{emp.userName}</p>
                <p className="text-sm text-gray-500">{emp.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================= */}
        {/* Roles del Usuario */}
        {/* ============================= */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">
            Roles del Usuario
          </h2>

          {!selectedUser && (
            <p className="text-gray-500">
              Selecciona un empleado para gestionar sus roles.
            </p>
          )}

          {selectedUser && (
            <>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <>
                  {/* Roles actuales */}
                  <div className="space-y-2 mb-4">
                    {userRoles.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No tiene roles asignados.
                      </p>
                    )}

                    {userRoles.map((role) => (
                      <div
                        key={role}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-xl"
                      >
                        <span>{role}</span>
                        <button
                          onClick={() => removeRole(role)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Asignar nuevo rol */}
                  <div className="flex gap-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="flex-1 border rounded-xl px-3 py-2"
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={assignRole}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      <Plus size={16} />
                      Asignar
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;