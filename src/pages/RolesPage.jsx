import EmployeeApi from '../api/employeesApi';
import RolesApi from '../api/roles';
import { useEffect, useState, useMemo } from 'react';
import { Plus, Shield, User, Trash2, Search, Loader2 } from 'lucide-react';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadRoles();
    loadEmployees();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await RolesApi.getAll();
      setRoles(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await EmployeeApi.getAllEmployees();
      setEmployees(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const response = await RolesApi.getByUser(user.id);
      setUserRoles(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setAssigning(true);
    try {
      await RolesApi.assignToUser(selectedUser.id, selectedRole);
      const updated = await RolesApi.getByUser(selectedUser.id);
      setUserRoles(updated.data);
      setSelectedRole('');
    } catch (error) {
      console.error(error);
    } finally {
      setAssigning(false);
    }
  };

  const removeRole = async (roleName) => {
    if (!selectedUser) return;
    try {
      await RolesApi.removeFromUser(selectedUser.id, roleName);
      const updated = await RolesApi.getByUser(selectedUser.id);
      setUserRoles(updated.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Filtro dinámico
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.userName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, employees]);

  return (
    <div className="p-6 space-y-8 bg-canvas min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-brand-tint p-3 rounded-xl">
          <Shield className="w-6 h-6 text-brand" />
        </div>
        <h1 className="text-3xl font-semibold text-ink">Gestión de Roles</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= EMPLEADOS ================= */}
        <div className="bg-surface rounded-xl shadow-lg p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={18} />
            Empleados
          </h2>

          {/* Buscador */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-3 text-ink-muted" />
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-stroke-soft focus:ring-2 focus:ring-brand outline-none transition"
            />
          </div>

          {/* Lista */}
          <div className="space-y-3 overflow-y-auto max-h-[450px] pr-2">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectUser(emp)}
                className={`p-4 rounded-xl cursor-pointer border border-stroke transition-all duration-200 transform hover:scale-[1.02] ${
                  selectedUser?.id === emp.id
                    ? 'bg-brand-tint border-brand shadow-md'
                    : 'hover:bg-canvas'
                }`}
              >
                <p className="font-semibold text-ink">{emp.userName}</p>
                <p className="text-sm text-ink-muted">{emp.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ROLES ================= */}
        <div className="bg-surface rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Roles del Usuario</h2>

          {!selectedUser && (
            <div className="text-center text-ink-muted py-20">
              Selecciona un empleado para comenzar
            </div>
          )}

          {selectedUser && (
            <>
              {/* Info Usuario */}
              <div className="mb-6 p-4 bg-brand-tint rounded-xl">
                <p className="font-semibold text-brand">
                  {selectedUser.userName}
                </p>
                <p className="text-sm text-brand">{selectedUser.email}</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-brand" />
                </div>
              ) : (
                <>
                  {/* Roles actuales */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {userRoles.length === 0 && (
                      <p className="text-sm text-ink-muted">
                        No tiene roles asignados.
                      </p>
                    )}

                    {userRoles.map((role) => (
                      <div
                        key={role}
                        className="flex items-center gap-2 bg-canvas px-4 py-2 rounded-full text-sm shadow-sm hover:bg-surface-alt transition"
                      >
                        <span>{role}</span>
                        <button
                          onClick={() => removeRole(role)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Asignar rol */}
                  <div className="flex gap-3">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="flex-1 border border-stroke rounded-md px-3 py-2 focus:ring-2 focus:ring-brand outline-none transition"
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
                      disabled={assigning}
                      className="flex items-center gap-2 bg-brand text-white px-5 py-2 rounded-md hover:bg-brand-hover active:bg-brand-pressed transition disabled:opacity-50"
                    >
                      {assigning ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Plus size={16} />
                      )}
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
