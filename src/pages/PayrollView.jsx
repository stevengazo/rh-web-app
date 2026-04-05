import { useParams } from 'react-router-dom';
import SectionTitle from '../Components/SectionTitle';
import payrollApi from '../api/payrollApi';
import { useEffect, useMemo, useState } from 'react';
import EmployeeApi from '../api/employeesApi';

const GetEmployeeName = ({ id }) => {
  const [name, setName] = useState('Cargando...');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await EmployeeApi.getEmployeeById(id);
        setName(response.data.firstName);
      } catch (error) {
        console.error(error);
        setName('No encontrado');
      }
    };

    fetchEmployee();
  }, [id]);

  return <span className="font-medium">{name}</span>;
};

const PayrollView = () => {
  const { id } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await payrollApi.getPayrollById(id);
        setPayroll(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  const formatDate = (date) => new Date(date).toLocaleDateString('es-CR');
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(amount || 0);

  // Totales generales con horas extras y deducciones CCSS/Asociación
  const totals = useMemo(() => {
    if (!payroll?.payrolls) return null;

    let gross = 0,
      deductions = 0,
      net = 0,
      totalExtras = 0,
      totalCCSS = 0,
      totalAssociation = 0;

    payroll.payrolls.forEach((item) => {
      const extrasAmount =
        (item.overtimeAmount || 0) +
        (item.holidayAmount || 0) +
        (item.holidayOvertimeAmount || 0);

      const ccssDeduction = item.cCSSDeductionAmount || item.grossSalary * 0.1067;
      const associationDeduction = item.associationContribution || item.grossSalary * 0.03;

      const totalDeductionsForItem =
        (item.totalDeductions || 0) + ccssDeduction + associationDeduction;

      gross += item.grossSalary + extrasAmount;
      totalExtras += extrasAmount;
      totalCCSS += ccssDeduction;
      totalAssociation += associationDeduction;
      deductions += totalDeductionsForItem;
      net += item.netAmount;
    });

    const totalCost = net + totalCCSS + totalAssociation;

    return { gross, deductions, net, totalExtras, totalCCSS, totalAssociation, totalCost };
  }, [payroll]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!payroll) return <p className="p-6">No se encontró la nómina.</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <SectionTitle>Detalle de Nómina - ID: {payroll.payrollId}</SectionTitle>

      {/* Información general */}
      <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoItem label="Tipo" value={payroll.payrollType} />
        <InfoItem label="Fecha Inicial" value={formatDate(payroll.initialDate)} />
        <InfoItem label="Fecha Final" value={formatDate(payroll.finalDate)} />
        <InfoItem label="Empleados" value={payroll.payrolls.length} />
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Empleado</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Salario Bruto</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Deducciones</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-white">Salario Neto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payroll.payrolls.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                  No hay registros de planilla
                </td>
              </tr>
            ) : (
              payroll.payrolls.map((item) => (
                <tr key={item.employee_PayrollId} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-sm text-slate-700"><GetEmployeeName id={item.userId} /></td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-slate-700">{formatCurrency(item.grossSalary)}</td>
                  <td className="px-4 py-3 text-sm text-right text-red-500 font-medium">{formatCurrency(item.totalDeductions + (item.cCSSDeductionAmount || item.grossSalary*0.1067) + (item.associationContribution || item.grossSalary*0.03))}</td>
                  <td className="px-4 py-3 text-sm text-right text-emerald-600 font-semibold">{formatCurrency(item.netAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      {totals && (
        <>
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <TotalItem label="Total Bruto" value={formatCurrency(totals.gross)} />
            <TotalItem label="Horas Extras / Feriados" value={formatCurrency(totals.totalExtras)} />
            <TotalItem label="Total Deducciones" value={formatCurrency(totals.deductions)} />
            <TotalItem label="Total Neto" value={formatCurrency(totals.net)} />
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            <TotalItem label="Costo Total CCSS (10.67%)" value={formatCurrency(totals.totalCCSS)} />
            <TotalItem label="Costo Total Asociación (3%)" value={formatCurrency(totals.totalAssociation)} />
            <TotalItem label="Costo Total Planilla (Neto + CCSS + Asociación)" value={formatCurrency(totals.totalCost)} />
          </div>
        </>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-base">{value}</p>
  </div>
);

const TotalItem = ({ label, value }) => (
  <div>
    <p className="text-sm opacity-80">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default PayrollView;