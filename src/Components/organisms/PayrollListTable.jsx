import { PencilIcon, CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CR');
};

const formatMoney = (amount) => {
  if (amount == null) return '-';
  return amount.toLocaleString('es-CR', {
    style: 'currency',
    currency: 'CRC',
  });
};

const PayrollListTable = ({ payrolls = [] }) => {
  console.log(payrolls);
  const nav = useNavigate();
  if (!payrolls.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        No hay planillas registradas
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Periodo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
              Tipo
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
              Monto
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {payrolls.map((p) => (
            <tr key={p.payrollId} className="hover:bg-slate-50 transition">
              <td className="px-4 py-3 text-sm text-slate-700">
                #{p.payrollId}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {formatDate(p.initialDate)} – {formatDate(p.finalDate)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">{p.Status}</td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {p.payrollType}
              </td>

              <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                {formatMoney(p.totalAmount)}
              </td>
              <td className="px-4 py-3 text-sm flex flex-row justify-end items-center gap-3 font-semibold text-emerald-600">
                {/* Ver / Confirmado */}
                <div className="relative group flex items-center">
                  <CheckIcon size={18} className="cursor-default" />

                  <span
                    className="absolute -top-9 left-1/2 -translate-x-1/2 
                     whitespace-nowrap rounded-md 
                     bg-gray-800 border border-gray-600 
                     px-2 py-1 text-xs text-gray-200 
                     opacity-0 group-hover:opacity-100 
                     transition pointer-events-none"
                  >
                    Aprobar planilla
                  </span>
                </div>

                {/* Editar */}
                <div className="relative group flex items-center">
                  <PencilIcon
                    size={18}
                    className="cursor-pointer hover:text-blue-400 transition"
                    onClick={() => nav(`/payroll/new/${p.payrollId}`)}
                  />

                  <span
                    className="absolute -top-9 left-1/2 -translate-x-1/2 
                     whitespace-nowrap rounded-md 
                     bg-gray-800 border border-gray-600 
                     px-2 py-1 text-xs text-gray-200 
                     opacity-0 group-hover:opacity-100 
                     transition pointer-events-none"
                  >
                    Editar planilla
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollListTable;
