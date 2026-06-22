import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import user_objetiveApi from '../../api/user_objetiveApi';
import EmployeeApi from '../../api/employeesApi';
import kpiApi from '../../api/kpiApi';
import PrimaryButton from '../PrimaryButton';

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
    <div className="max-w-2xl mx-auto shadow-xl rounded-xl p-6 bg-surface-alt border border-stroke-soft">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-ink">
          Asignar Objetivo a Usuario
        </h3>

        {error && (
          <p className="rounded-md bg-red-50 border border-transparent px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Empleado */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-ink-secondary">Empleado</label>
          <select
            name="userId"
            value={newUser_Objetive.userId}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-stroke bg-surface text-ink px-3 py-2 text-sm
              disabled:opacity-50
              focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="" className="bg-surface">
              Seleccione un empleado
            </option>
            {employees.map((e) => (
              <option key={e.id} value={e.id} className="bg-surface">
                {e.userName}
              </option>
            ))}
          </select>
        </div>

        {/* Objetivo */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-ink-secondary">Objetivo</label>
          <select
            name="objetiveId"
            value={newUser_Objetive.objetiveId}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-stroke bg-surface text-ink px-3 py-2 text-sm
              disabled:opacity-50
              focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value={0} className="bg-surface">
              Seleccione un objetivo
            </option>
            {kpis.map((kpi) => (
              <option
                key={kpi.objetiveId}
                value={kpi.objetiveId}
                className="bg-surface"
              >
                {kpi.title}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Asignar Objetivo'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default Add_User_Objetive;
