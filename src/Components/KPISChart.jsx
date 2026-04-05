import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-[400px] p-2 border rounded border-blue-200 shadow-sm"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold mb-4 text-gray-800"
      >
        {objetive?.objetive?.title || 'KPI'}
      </motion.h2>

      <AnimatePresence mode="wait">
        {data.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500"
          >
            No hay datos válidos
          </motion.p>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full m-2 py-5"
          >
            <ResponsiveContainer  width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />

                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#d1d5db' }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    color: '#111827',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KPISChart;
