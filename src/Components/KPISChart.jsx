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
  const data = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];

    return results
      .filter((r) => r && r.resultDate && r.evalution !== null)
      .map((r) => {
        const date = new Date(r.resultDate);

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
    <div className="w-full h-[400px] p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {objetive?.objetive?.title || "KPI"}
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No hay datos válidos</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#d1d5db" }}
            />

            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#d1d5db" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                color: "#111827",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default KPISChart;