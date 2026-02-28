import { useParams } from "react-router-dom";
import SectionTitle from "../Components/SectionTitle";
import payrollApi from "../api/payrollApi";
import { useEffect, useMemo, useState } from "react";
import EmployeeApi from "../api/employeesApi";

const GetEmployeeName = ({ id }) => {
  const [name, setName] = useState("Cargando...");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await EmployeeApi.getEmployeeById(id);
        setName(response.data.firstName);
      } catch (error) {
        console.error(error);
        setName("No encontrado");
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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CR");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(amount || 0);

  const totals = useMemo(() => {
    if (!payroll?.payrolls) return null;

    return payroll.payrolls.reduce(
      (acc, item) => {
        acc.gross += item.grossSalary;
        acc.deductions += item.totalDeductions;
        acc.net += item.netAmount;
        return acc;
      },
      { gross: 0, deductions: 0, net: 0 }
    );
  }, [payroll]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!payroll) return <p className="p-6">No se encontró la nómina.</p>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <SectionTitle>
        Detalle de Nómina - ID: {payroll.payrollId}
      </SectionTitle>

      {/* Información General */}
      <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoItem label="Tipo" value={payroll.payrollType} />
        <InfoItem
          label="Fecha Inicial"
          value={formatDate(payroll.initialDate)}
        />
        <InfoItem
          label="Fecha Final"
          value={formatDate(payroll.finalDate)}
        />
        <InfoItem
          label="Empleados"
          value={payroll.payrolls.length}
        />
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block bg-white shadow-sm rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Empleado</th>
              <th className="p-4 text-right">Salario Bruto</th>
              <th className="p-4 text-right">Deducciones</th>
              <th className="p-4 text-right">Salario Neto</th>
            </tr>
          </thead>
          <tbody>
            {payroll.payrolls.map((item) => (
              <tr
                key={item.employee_PayrollId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <GetEmployeeName id={item.userId} />
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(item.grossSalary)}
                </td>
                <td className="p-4 text-right text-red-500">
                  {formatCurrency(item.totalDeductions)}
                </td>
                <td className="p-4 text-right text-green-600 font-semibold">
                  {formatCurrency(item.netAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile tipo Cards */}
      <div className="md:hidden space-y-4">
        {payroll.payrolls.map((item) => (
          <div
            key={item.employee_PayrollId}
            className="bg-white shadow-sm rounded-2xl p-4 space-y-3"
          >
            <div className="text-base font-semibold">
              <GetEmployeeName id={item.userId} />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bruto</span>
              <span className="font-medium">
                {formatCurrency(item.grossSalary)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deducciones</span>
              <span className="text-red-500">
                {formatCurrency(item.totalDeductions)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Neto</span>
              <span className="text-green-600 font-semibold">
                {formatCurrency(item.netAmount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      {totals && (
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <TotalItem label="Total Bruto" value={formatCurrency(totals.gross)} />
          <TotalItem
            label="Total Deducciones"
            value={formatCurrency(totals.deductions)}
          />
          <TotalItem label="Total Neto" value={formatCurrency(totals.net)} />
        </div>
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