import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import EmployeeApi from '../api/employeesApi'
import salaryApi from '../api/salaryApi'

import PageTitle from '../Components/PageTitle'
import SectionTitle from '../Components/SectionTitle'
import PrimaryButton from '../Components/PrimaryButton'
import SecondaryButton from '../Components/SecondaryButton'

/* =======================
   Configuración
======================= */
const ASSOCIATION_PERCENT = 0.05
const CCSS_PERCENT = 0.1067

/* =======================
   Animaciones
======================= */
const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

/* =======================
   Helpers
======================= */
const formatCRC = (value = 0) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(value)

const calculateSalaryData = (monthly = 0) => {
  const daily = monthly / 30
  const hourly = daily / 8

  return {
    monthly,
    biweekly: monthly / 2,
    daily,
    hourly,
    extra: hourly * 1.5,
    double: hourly * 2,
  }
}

const buildFullName = (emp) =>
  [emp.firstName, emp.middleName, emp.lastName, emp.secondLastName]
    .filter(Boolean)
    .join(' ')

/* =======================
   Componente
======================= */
const NewPayrollPage = () => {
  const [employees, setEmployees] = useState([])
  const [salaries, setSalaries] = useState([])
  const [payrollType, setPayrollType] = useState('Quincenal')
  const [timeData, setTimeData] = useState({})

  useEffect(() => {
    const loadData = async () => {
      const empRes = await EmployeeApi.getAllEmployees()
      setEmployees(empRes.data)

      const salaryRes = await salaryApi.getLatests()
      setSalaries(salaryRes.data)
    }

    loadData()
  }, [])

  /* =======================
     Map salarios por usuario
  ======================= */
  const salaryMap = useMemo(() => {
    const map = {}
    salaries.forEach((s) => {
      map[s.userId] = s
    })
    return map
  }, [salaries])

  /* =======================
     Totales por empleado
  ======================= */
  const payrollRows = useMemo(() => {
    return employees.map((emp) => {
      const salaryRecord = salaryMap[emp.id]
      const periodSalary = salaryRecord?.salaryAmount ?? 0

      const monthlySalary =
        payrollType === 'Quincenal'
          ? periodSalary * 2
          : periodSalary * 4

      const salary = calculateSalaryData(monthlySalary)

      const t = timeData[emp.id] || {}
      const extraAmount = (t.extras || 0) * salary.extra
      const doubleAmount = (t.doubles || 0) * salary.double
      const bonuses =
        (t.retro || 0) + (t.bonus || 0) + (t.commission || 0)

      const total = salary.biweekly + extraAmount + doubleAmount + bonuses

      return {
        emp,
        salary,
        total,
      }
    })
  }, [employees, salaryMap, payrollType, timeData])

  /* =======================
     Totales generales
  ======================= */
  const totals = useMemo(() => {
    const gross = payrollRows.reduce((sum, r) => sum + r.total, 0)
    const association = gross * ASSOCIATION_PERCENT
    const ccss = gross * CCSS_PERCENT
    const net = gross - association - ccss

    return { gross, association, ccss, net }
  }, [payrollRows])

  return (
    <motion.div
      className="w-full space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageTitle>Generar Nueva Planilla</PageTitle>

      {/* Tipo planilla */}
      <div className="max-w-xs">
        <label className="text-sm font-medium">Tipo de planilla</label>
        <select
          value={payrollType}
          onChange={(e) => setPayrollType(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        >
          <option>Quincenal</option>
          <option>Semanal</option>
        </select>
      </div>

      {/* Tabla principal */}
      <div className="rounded-xl bg-white shadow-sm overflow-x-auto">
        <SectionTitle>Detalle de Planilla</SectionTitle>

        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-100 text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Empleado</th>
              <th className="px-4 py-3 text-right">Salario</th>
              <th className="px-4 py-3 text-center">Extras</th>
              <th className="px-4 py-3 text-center">Dobles</th>
              <th className="px-4 py-3 text-right">Bonos</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {payrollRows.map(({ emp, salary, total }) => (
              <tr key={emp.id} className="border-b">
                <td className="px-4 py-3">{buildFullName(emp)}</td>
                <td className="px-4 py-3 text-right">
                  {formatCRC(salary.biweekly)}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setTimeData({
                        ...timeData,
                        [emp.id]: {
                          ...timeData[emp.id],
                          extras: +e.target.value,
                        },
                      })
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setTimeData({
                        ...timeData,
                        [emp.id]: {
                          ...timeData[emp.id],
                          doubles: +e.target.value,
                        },
                      })
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    min={0}
                    onChange={(e) =>
                      setTimeData({
                        ...timeData,
                        [emp.id]: {
                          ...timeData[emp.id],
                          bonus: +e.target.value,
                        },
                      })
                    }
                    className="w-24 border rounded px-2 py-1 text-right"
                  />
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {formatCRC(total)}
                </td>
              </tr>
            ))}

            {/* FILA TOTALES */}
            <tr className="bg-slate-200 font-bold">
              <td colSpan={5} className="px-4 py-3 text-right">
                TOTAL PLANILLA
              </td>
              <td className="px-4 py-3 text-right">
                {formatCRC(totals.gross)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RESUMEN */}
      <div className="max-w-lg rounded-xl bg-white shadow-sm">
        <SectionTitle>Resumen de Planilla</SectionTitle>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="px-4 py-2">Monto bruto</td>
              <td className="px-4 py-2 text-right font-semibold">
                {formatCRC(totals.gross)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                Asociación ({ASSOCIATION_PERCENT * 100}%)
              </td>
              <td className="px-4 py-2 text-right text-red-600">
                - {formatCRC(totals.association)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">
                CCSS ({(CCSS_PERCENT * 100).toFixed(2)}%)
              </td>
              <td className="px-4 py-2 text-right text-red-600">
                - {formatCRC(totals.ccss)}
              </td>
            </tr>
            <tr className="border-t font-bold text-lg">
              <td className="px-4 py-3">Total neto</td>
              <td className="px-4 py-3 text-right text-emerald-700">
                {formatCRC(totals.net)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Acciones */}
      <div className="flex gap-4">
        <PrimaryButton>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  )
}

export default NewPayrollPage
