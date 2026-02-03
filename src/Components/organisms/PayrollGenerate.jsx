import { useEffect, useMemo, useState } from 'react'
import payrollApi from '../../api/payrollApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const PAYROLL_TYPES = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
}

const PayrollGenerate = ({ onGenerated }) => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payrollType: '',
    payrollDescription: '',
    initialDate: '',
    finalDate: '',
    Payrolls: []
  })

  // Calcula automáticamente la fecha final según el tipo
  useEffect(() => {
    if (!formData.initialDate || !formData.payrollType) return

    const start = new Date(formData.initialDate)
    const end = new Date(start)

    if (formData.payrollType === PAYROLL_TYPES.WEEKLY) {
      end.setDate(start.getDate() + 6)
    }

    if (formData.payrollType === PAYROLL_TYPES.BIWEEKLY) {
      end.setDate(start.getDate() + 14)
    }

    setFormData(prev => ({
      ...prev,
      finalDate: end.toISOString().split('T')[0],
    }))
  }, [formData.initialDate, formData.payrollType])

  // Días seleccionados (dinámico)
  const selectedDays = useMemo(() => {
    if (!formData.initialDate || !formData.finalDate) return 0

    const start = new Date(formData.initialDate)
    const end = new Date(formData.finalDate)

    if (end < start) return 0

    const diffTime = end.getTime() - start.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  }, [formData.initialDate, formData.finalDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.payrollType) {
      toast.error('Seleccione el tipo de planilla')
      return false
    }

    if (!formData.initialDate) {
      toast.error('Seleccione la fecha inicial')
      return false
    }

    if (selectedDays === 0) {
      toast.error('El rango de fechas no es válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
     const response = await payrollApi.createPayroll({
        ...formData,
        deleted: false,
      })

      toast.success('Planilla generada correctamente')
      onGenerated?.()
      navigate(`/payroll/new/${response.data.payrollId}`)

      setFormData({
        payrollType: '',
        payrollDescription: '',
        initialDate: '',
        finalDate: '',
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al generar la planilla')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4"
    >
      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de planilla
        </label>
        <select
          name="payrollType"
          value={formData.payrollType}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-slate-600 focus:outline-none"
        >
          <option value="">Seleccione...</option>
          <option value={PAYROLL_TYPES.WEEKLY}>Semanal</option>
          <option value={PAYROLL_TYPES.BIWEEKLY}>Quincenal</option>
        </select>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha inicio
          </label>
          <input
            type="date"
            name="initialDate"
            value={formData.initialDate}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-slate-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha final
          </label>
          <input
            type="date"
            name="finalDate"
            value={formData.finalDate}
            disabled
            className="mt-1 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Días calculados */}
      {formData.initialDate && formData.finalDate && (
        <div className="rounded-md bg-slate-50 border px-4 py-2 text-sm">
          <span className="font-medium text-slate-700">
            Días del período:
          </span>{' '}
          <span
            className={`font-semibold ${
              selectedDays > 0 ? 'text-slate-900' : 'text-red-600'
            }`}
          >
            {selectedDays}
          </span>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="payrollDescription"
          value={formData.payrollDescription}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-slate-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-slate-800 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
      >
        Generar planilla
      </button>
    </form>
  )
}

export default PayrollGenerate
