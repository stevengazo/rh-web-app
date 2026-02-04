import { PencilIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"


const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CR')
}

const formatMoney = (amount) => {
  if (amount == null) return '-'
  return amount.toLocaleString('es-CR', {
    style: 'currency',
    currency: 'CRC',
  })
}

const PayrollListTable = ({ payrolls = [] }) => {

  const nav = useNavigate()
  if (!payrolls.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-slate-500">
        No hay planillas registradas
      </div>
    )
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
            <tr
              key={p.payrollId}
              className="hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3 text-sm text-slate-700">
                #{p.payrollId}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {formatDate(p.initialDate)} – {formatDate(p.finalDate)}
              </td>

              <td className="px-4 py-3 text-sm text-slate-600">
                {p.payrollType}
              </td>

              <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600">
                {formatMoney(p.totalAmount)}
              </td>
                <td className="px-4 py-3 text-sm flex flex-row justify-end font-semibold text-emerald-600">
                <PencilIcon size={18} 
                onClick={()=>nav(`/payroll/new/${p.payrollId}`) }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PayrollListTable
