import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import user_objetiveApi from '../../api/user_objetiveApi';
import EmployeeApi from '../../api/employeesApi';
import kpiApi from '../../api/kpiApi';

const Add_User_Objetive = () => {
  const [employees, setEmployees] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const notify = () => toast.success('Agregado');

  const [newUser_Objetive, setNewUser_Objetive] = useState({
    user_ObjetiveId: 0,
    userId: '',
    appUser: null,
    objetiveId: 0,
    objetive: null,
    results: [],
  });

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);

        const [employeesRes, kpisRes] = await Promise.all([
          EmployeeApi.getAllEmployees(),
          kpiApi.getAllKPIs(),
        ]);

        setEmployees(employeesRes.data);
        setKpis(kpisRes.data);

      } catch (err) {
        console.error(err);
        setError('Error cargando datos');
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewUser_Objetive((prev) => ({
      ...prev,
      [name]: name === 'objetiveId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUser_Objetive.userId || !newUser_Objetive.objetiveId) {
      setError('Debe seleccionar un empleado y un objetivo');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(newUser_Objetive);

      await user_objetiveApi.createUser_Objetive(newUser_Objetive);

      setNewUser_Objetive({
        user_ObjetiveId: 0,
        userId: '',
        appUser: null,
        objetiveId: 0,
        objetive: null,
        results: [],
      });
      notify();
    } catch (err) {
      console.error(err);
      setError('No se pudo asignar el objetivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="py-2 flex flex-col gap-2"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        Asignar Objetivo a Usuario
      </h3>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Empleado */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Empleado</label>
        <select
          name="userId"
          value={newUser_Objetive.userId}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Seleccione un empleado</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.userName}
            </option>
          ))}
        </select>
      </div>

      {/* Objetivo */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Objetivo</label>
        <select
          name="objetiveId"
          value={newUser_Objetive.objetiveId}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={0}>Seleccione un objetivo</option>
          {kpis.map((kpi) => (
            <option key={kpi.objetiveId} value={kpi.objetiveId}>
              {kpi.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                     transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Asignar Objetivo'}
        </button>
      </div>
    </form>
  );
};

export default Add_User_Objetive;
