import { useEffect, useState, useMemo } from 'react';
import SectionTitle from '../Components/SectionTitle';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import TablePayrollsData from '../Components/organisms/TablePayrollsData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const MyPayrollsPage = () => {
  const { user } = useAppContext();
  const [payrollsData, setPayrollsData] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const GetData = async () => {
      const Response = await Employee_PayrollApi.Search({ employeeId: user.id });
      setPayrollsData(Response.data);
      setFilteredPayrolls(Response.data);
    };
    GetData();
  }, [user.id]);

  useEffect(() => {
    if (filterType === 'Todos') {
      setFilteredPayrolls(payrollsData);
    } else {
      setFilteredPayrolls(
        payrollsData.filter((p) => p.payrollData?.payrollType === filterType)
      );
    }
  }, [filterType, payrollsData]);

  const chartData = useMemo(() => {
    return filteredPayrolls.map((p) => {
      const payrollRecords = (p.payrollData?.payrolls || []).filter(Boolean);
      const payroll = payrollRecords[0] || p;

      const extras = payrollRecords.reduce(
        (acc, rec) => acc + (rec.bonus || 0) + (rec.comissions || 0) + (rec.overtimeAmount || 0),
        0
      );
      const deductions = payrollRecords.reduce(
        (acc, rec) => acc + (rec.totalDeductions || 0),
        0
      );
      const netAmount = payrollRecords.reduce((acc, rec) => acc + (rec.netAmount || 0), payroll.netAmount || 0);
      const grossSalary = payrollRecords.reduce((acc, rec) => acc + (rec.grossSalary || 0), payroll.grossSalary || 0);

      return {
        description: p.payrollData?.payrollDescription || 'Sin descripción',
        date: p.payrollData?.finalDate || new Date().toISOString(),
        netAmount,
        grossSalary,
        extras,
        deductions,
      };
    });
  }, [filteredPayrolls]);

  const totals = useMemo(() => {
    return filteredPayrolls.reduce(
      (acc, p) => {
        const payrollRecords = (p.payrollData?.payrolls || []).filter(Boolean);

        acc.net += payrollRecords.reduce((a, rec) => a + (rec.netAmount || 0), 0);
        acc.gross += payrollRecords.reduce((a, rec) => a + (rec.grossSalary || 0), 0);
        acc.extras += payrollRecords.reduce(
          (a, rec) => a + (rec.bonus || 0) + (rec.comissions || 0) + (rec.overtimeAmount || 0),
          0
        );
        acc.deductions += payrollRecords.reduce((a, rec) => a + (rec.totalDeductions || 0), 0);

        return acc;
      },
      { net: 0, gross: 0, extras: 0, deductions: 0 }
    );
  }, [filteredPayrolls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05 },
  };

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvasLarge isOpen={open} onClose={() => setOpen(false)} title={canvasTitle}>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvasLarge>
        )}
      </AnimatePresence>

      <SectionTitle>Mis Comprobantes</SectionTitle>

      {/* Filtro Mejorado */}
      <motion.div
        className="mb-6 flex flex-wrap gap-4 items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="text-gray-700 font-medium">Filtrar por tipo:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Semanal">Semanal</option>
          <option value="Mensual">Mensual</option>
        </select>
      </motion.div>

      {/* Tarjetas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Neto', value: totals.net, color: 'text-green-600' },
          { label: 'Total Bruto', value: totals.gross, color: 'text-blue-600' },
          { label: 'Total Extras', value: totals.extras, color: 'text-yellow-600' },
          { label: 'Total Deducciones', value: totals.deductions, color: 'text-red-600' },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-white shadow-2xl rounded p-4 cursor-pointer"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="text-sm text-gray-500">{card.label}</div>
            <div className={`text-xl font-bold ${card.color}`}>
              {card.value.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Neto por Fecha - Barras Apiladas */}
        <motion.div
          className="bg-white shadow-2xl rounded p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-2">Neto por Fecha</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-CR')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString('es-CR')}
                formatter={(value) =>
                  value.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })
                }
              />
              <Legend />
              <Bar dataKey="netAmount" name='Monto' stackId="a" fill="#22c55e" />
              <Bar dataKey="extras" name='Extras' stackId="a" fill="#facc15" />
              <Bar dataKey="deductions" name='Deducciones' stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bruto por Fecha */}
        <motion.div
          className="bg-white shadow-2xl rounded p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold mb-2">Bruto por Fecha</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('es-CR')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString('es-CR')}
                formatter={(value) =>
                  value.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })
                }
              />
              <Legend />
              <Line type="monotone" dataKey="grossSalary" name='Salario' stroke="#3b82f6" />
              <Line type="monotone" dataKey="extras" name='Extras' stroke="#facc15" />
              <Line type="monotone" dataKey="deductions" name='Deducciones' stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla */}
      <TablePayrollsData items={filteredPayrolls} HandleShowEdit={openCanvas} />
    </>
  );
};

export default MyPayrollsPage;