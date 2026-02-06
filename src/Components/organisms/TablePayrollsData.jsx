import Employee_PayrollApi from '../../api/Employee_PayrollApi';
import Employee_PayrollDetails from './Employee_PayrollDetails';

const TablePayrollsData = ({ items = [], HandleShowEdit }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
    }).format(value || 0);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('es-CR') : '-';

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
      <table className="min-w-full text-sm text-slate-200">
        <thead className="bg-slate-900 text-slate-300 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Tipo planilla</th>
            <th className="px-4 py-3 text-left">Periodo</th>
            <th className="px-4 py-3 text-right">Días trabajados</th>
            <th className="px-4 py-3 text-right">Salario mensual</th>
            <th className="px-4 py-3 text-right">Horas extra</th>
            <th className="px-4 py-3 text-right">Feriados</th>
            <th className="px-4 py-3 text-right">Bonos</th>
            <th className="px-4 py-3 text-right">Comisiones</th>
            <th className="px-4 py-3 text-right">Salario bruto</th>
            <th className="px-4 py-3 text-right">Deducciones</th>
            <th className="px-4 py-3 text-right">Salario neto</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700">
          {items.map((item) => (
            <tr
              key={item.employee_PayrollId}
              onClick={() =>
                HandleShowEdit(
                  'Datos del empleado',
                  <Employee_PayrollDetails data={item} />
                )
              }
              className="hover:bg-slate-700 cursor-pointer transition"
            >
              <td className="px-4 py-2">{item.payrollData?.payrollType}</td>

              <td className="px-4 py-2">
                {formatDate(item.payrollData?.initialDate)} —{' '}
                {formatDate(item.payrollData?.finalDate)}
              </td>

              <td className="px-4 py-2 text-right">{item.daysWorked}</td>

              <td className="px-4 py-2 text-right">
                {formatCurrency(item.monthlySalary)}
              </td>

              <td className="px-4 py-2 text-right">
                {formatCurrency(item.overtimeAmount)}
              </td>

              <td className="px-4 py-2 text-right">
                {formatCurrency(item.holidayAmount)}
              </td>

              <td className="px-4 py-2 text-right">
                {formatCurrency(item.bonus)}
              </td>

              <td className="px-4 py-2 text-right">
                {formatCurrency(item.comissions)}
              </td>

              <td className="px-4 py-2 text-right font-medium text-sky-400">
                {formatCurrency(item.grossSalary)}
              </td>

              <td className="px-4 py-2 text-right text-red-400">
                {formatCurrency(item.totalDeductions)}
              </td>

              <td className="px-4 py-2 text-right font-semibold text-emerald-400">
                {formatCurrency(item.netAmount)}
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td colSpan={11} className="px-4 py-6 text-center text-slate-400">
                No hay datos de planilla para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablePayrollsData;
