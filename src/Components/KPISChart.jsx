import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const KPISChart = ({ objetive, results }) => {
  // Normalizar y limpiar datos
  const data = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];

    return results
      .filter((r) => r && r.resultDate && r.evalution !== null)
      .map((r) => {
        const date = new Date(r.resultDate);

        // filtrar fechas inválidas (como año 0001 o 0007)
        if (date.getFullYear() < 2000) return null;

        return {
          date: date.toLocaleDateString(),
          value: r.evalution,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [results]);

  return (
    <div className="w-full h-[400px] p-4 rounded-2xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">
        {objetive?.objetive?.title || "KPI"}
      </h2>

      {data.length === 0 ? (
        <p className="text-sm opacity-70">No hay datos válidos</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default KPISChart;