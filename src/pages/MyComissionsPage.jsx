import SectionTitle from '../Components/SectionTitle';
import comissionsApi from '../api/comissionsApi';
import ComissionTable from '../Components/organisms/ComissionTable';

import { useAppContext } from '../context/AppContext';
import { useEffect, useMemo, useState } from 'react';

import Divider from '../Components/Divider';

const MyCommissionsPage = () => {
  const { user } = useAppContext();
  const [comissions, setComissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtro por mes
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;

        const res = await comissionsApi.getComissionsByUser(user.id);
        setComissions(res.data);
        console.log(res.data)
      } catch (err) {
        console.error('Error comissions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // filtrar por mes seleccionado
  const filteredComissions = useMemo(() => {
    return comissions.filter((c) => {
      const date = new Date(c.date);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      return month === selectedDate;
    });
  }, [comissions, selectedDate]);

  // estadísticas
  const stats = useMemo(() => {
    const total = filteredComissions.reduce((acc, c) => acc + c.amount, 0);
    const count = filteredComissions.length;
    const average = count > 0 ? total / count : 0;

    return { total, count, average };
  }, [filteredComissions]);

  return (
    <div className="p-6 space-y-6">
      <SectionTitle>Comisiones</SectionTitle>

      {/* FILTRO */}
      <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md flex items-center gap-4">
        <label className="text-sm text-slate-600 font-medium">
          Seleccionar mes:
        </label>

        <input
          type="month"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border-2 border-slate-300 rounded-lg px-3 py-1 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-800">
            ₡{stats.total.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md">
          <p className="text-sm text-slate-500">Cantidad</p>
          <p className="text-xl font-bold text-slate-800">
            {stats.count}
          </p>
        </div>

        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-md">
          <p className="text-sm text-slate-500">Promedio</p>
          <p className="text-xl font-bold text-slate-800">
            ₡{stats.average.toLocaleString()}
          </p>
        </div>
      </div>

      <Divider />

      {/* TABLA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ComissionTable comissions={filteredComissions} />
      )}
    </div>
  );
};

export default MyCommissionsPage;