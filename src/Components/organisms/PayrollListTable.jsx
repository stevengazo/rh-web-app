import { PencilIcon, CheckIcon, EyeIcon } from 'lucide-react';
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
  const nav = useNavigate();
  if (!payrolls.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        No hay planillas registradas
      </div>
    );
  }
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* =========================
          HEADER
      ========================= */}
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">ID</div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              <div className="flex items-center gap-2">Periodo</div>
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              Estado
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold text-white">
              Tipo
            </th>

            <th className="px-4 py-3 text-right text-sm font-semibold text-white">
              Monto
            </th>

            <th className="px-4 py-3 text-center text-sm font-semibold text-white">
              Acciones
            </th>
          </tr>
        </thead>

        {/* =========================
          BODY
      ========================= */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {payrolls.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                No hay planillas registradas
              </td>
            </tr>
          ) : (
            payrolls.map((p) => (
              <tr key={p.payrollId} className="hover:bg-slate-50 transition">
                {/* ID */}
                <td className="px-4 py-3 text-sm text-slate-700">
                  #{p.payrollId}
                </td>

                {/* PERIODO */}
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(p.initialDate)} – {formatDate(p.finalDate)}
                </td>

                {/* ESTADO */}
                <td className="px-4 py-3 text-sm text-slate-600">{p.Status}</td>

                {/* TIPO */}
                <td className="px-4 py-3 text-sm text-slate-600">
                  {p.payrollType}
                </td>

                {/* MONTO */}
                <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                  {formatMoney(p.totalAmount)}
                </td>

                {/* ACCIONES */}
                <td className="px-4 py-3">
                  <div className="flex justify-center items-center gap-4">
                    {/* VER */}
                    <div className="relative group flex items-center">
                      <EyeIcon
                        onClick={() => nav(`/manager/payroll/${p.payrollId}`)}
                        size={18}
                        className="cursor-pointer hover:text-blue-400 transition"
                      />

                      <span
                        className="
                        absolute -top-9 left-1/2 -translate-x-1/2 
                        whitespace-nowrap rounded-md 
                        bg-gray-800 border border-gray-600 
                        px-2 py-1 text-xs text-gray-200 
                        opacity-0 group-hover:opacity-100 
                        transition pointer-events-none
                      "
                      >
                        Ver
                      </span>
                    </div>

                    {/* EDITAR */}
                    <div className="relative group flex items-center">
                      <PencilIcon
                        size={18}
                        className="cursor-pointer hover:text-blue-400 transition"
                        onClick={() => nav(`/payroll/new/${p.payrollId}`)}
                      />

                      <span
                        className="
                        absolute -top-9 left-1/2 -translate-x-1/2 
                        whitespace-nowrap rounded-md 
                        bg-gray-800 border border-gray-600 
                        px-2 py-1 text-xs text-gray-200 
                        opacity-0 group-hover:opacity-100 
                        transition pointer-events-none
                      "
                      >
                        Editar planilla
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollListTable;
