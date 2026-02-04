import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';

/* =====================================================
   CONFIGURACIÓN GENERAL DE PORCENTAJES
===================================================== */
const CCSS_PERCENT = 0.1067;
const ISR_PERCENT = 0.10;
const ASSOCIATION_PERCENT = 0.05;

/* =====================================================
   HELPERS GENERALES
===================================================== */

/**
 * Formatea un número a moneda CRC
 */
const formatCRC = (value = 0) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
  }).format(value);

/**
 * Calcula todos los valores base del salario
 */
const calculateSalaryBase = (monthly = 0) => {
  const daily = monthly / 30;
  const hourly = monthly / 8;

  return {
    salarioMensual: monthly,
    salarioQuincenal: monthly / 2,
    montoPorDia: daily,
    horaOrdinaria: hourly,
    horaExtra: hourly * 1.5,
    feriadoDia: daily * 2,
    horaFeriado: (daily * 2) / 8,
  };
};

/**
 * Construye el nombre completo del empleado
 */
const buildFullName = (e) =>
  [e.firstName, e.middleName, e.lastName, e.secondLastName]
    .filter(Boolean)
    .join(' ');

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */
const NewPayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [timeData, setTimeData] = useState({});

  /* =====================================================
     CARGA INICIAL DE DATOS
  ===================================================== */
  useEffect(() => {
    const loadData = async () => {
      const emp = await EmployeeApi.getAllEmployees();
      const sal = await salaryApi.getLatests();
      setEmployees(emp.data);
      setSalaries(sal.data);
    };
    loadData();
  }, []);

  /* =====================================================
     MAPA SALARIO POR EMPLEADO
  ===================================================== */
  const salaryMap = useMemo(() => {
    const map = {};
    salaries.forEach((s) => (map[s.userId] = s.salaryAmount));
    return map;
  }, [salaries]);

  /* =====================================================
     CÁLCULO COMPLETO POR EMPLEADO
  ===================================================== */
  const rows = useMemo(() => {
    return employees.map((emp) => {
      const t = timeData[emp.id] || {};
      const base = calculateSalaryBase(salaryMap[emp.id] || 0);

      /* ===== Ingresos ===== */
      const montoHorasExtras = (t.cantExtras || 0) * base.horaExtra;
      const montoFeriado = (t.cantFeriado || 0) * base.feriadoDia;
      const montoExtraFeriado =
        (t.cantExtrasFeriado || 0) * base.horaFeriado;

      /* ===== Deducciones patronales ===== */
      const pagoCCSS = base.montoPorDia / 2;
      const pagoPatrono = pagoCCSS * (t.diasIncCCSS || 0);
      const pagoINS = base.montoPorDia * (t.diasIncINS || 0);

      /* ===== Rebajos ===== */
      const montoXHA = base.horaOrdinaria;
      const montoRebajar =
        montoXHA * (t.tiempoAusente || 0);

      /* ===== Salario Bruto ===== */
      const salarioBruto =
        base.salarioQuincenal +
        montoHorasExtras +
        montoFeriado +
        montoExtraFeriado +
        (t.retroactivo || 0) +
        (t.bono || 0) +
        (t.comisiones || 0) -
        pagoPatrono -
        (t.montoRebajable || 0) -
        montoRebajar;

      /* ===== Deducciones ===== */
      const ccss = salarioBruto * CCSS_PERCENT;
      const isr = salarioBruto * ISR_PERCENT;
      const aporteAsoc = salarioBruto * ASSOCIATION_PERCENT;

      const totalDeducciones =
        ccss +
        isr +
        (t.embargo || 0) +
        (t.pension || 0) +
        aporteAsoc +
        (t.prestamoAsoc || 0) +
        (t.ahorro || 0) +
        (t.otrosRebajos || 0);

      /* ===== Neto ===== */
      const neto = salarioBruto - totalDeducciones;

      return {
        emp,
        base,
        salarioBruto,
        totalDeducciones,
        neto,
      };
    });
  }, [employees, salaryMap, timeData]);

  /* =====================================================
     TOTAL GENERAL PLANILLA
  ===================================================== */
  const totalPlanilla = rows.reduce((s, r) => s + r.neto, 0);

  /* =====================================================
     ACTUALIZADOR DE INPUTS
  ===================================================== */
  const update = (id, field, value) =>
    setTimeData({
      ...timeData,
      [id]: { ...timeData[id], [field]: +value },
    });

  return (
    <motion.div className="space-y-10">
      <PageTitle>Generar Nueva Planilla</PageTitle>

      {/* =====================================================
         TABLA CON SCROLL
      ===================================================== */}
      <div className="bg-white rounded-xl shadow">
        <SectionTitle>Detalle Completo de Planilla</SectionTitle>

        {/* Scroll horizontal + vertical */}
        <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
          <table className="min-w-[2400px] text-xs border-collapse">
            <thead className="bg-slate-100 sticky top-0 z-10">
              <tr>
                <th title="Nombre completo del empleado">Empleado</th>
                <th title="Salario mensual obtenido del sistema">Salario Mensual</th>
                <th title="Salario Mensual / 2">Salario Quincenal</th>
                <th title="Cantidad de horas extra">Cant Extras</th>
                <th title="Monto horas extra">Monto Horas Extras</th>
                <th title="Cantidad de días feriado">Cant Feriado</th>
                <th title="Monto total feriados">Monto Feriado</th>
                <th title="Cantidad extras en feriado">Cant Extras Feriado</th>
                <th title="Monto extras feriado">Monto EX Feriado</th>
                <th title="Pago retroactivo">Retroactivo</th>
                <th title="Bono adicional">Bono</th>
                <th title="Comisiones">Comisiones</th>
                <th title="Días incapacidad CCSS">Días INC CCSS</th>
                <th title="Días incapacidad INS">Días INC INS</th>
                <th title="Tiempo ausente en horas">Tiempo Ausente</th>
                <th title="Salario bruto calculado">Salario Bruto</th>
                <th title="Total deducciones">Total Deducciones</th>
                <th title="Monto final a pagar">Monto X SE</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.emp.id} className="border-b">
                  <td className='p-1 align-middle'>{buildFullName(r.emp)}</td>
                  <td className="text-right">{formatCRC(r.base.salarioMensual)}</td>
                  <td className="text-right">{formatCRC(r.base.salarioQuincenal)}</td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'cantExtras', e.target.value)} />
                  </td>

                  <td className="text-right">
                    {formatCRC(r.base.horaExtra * (timeData[r.emp.id]?.cantExtras || 0))}
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'cantFeriado', e.target.value)} />
                  </td>

                  <td className="text-right">
                    {formatCRC(r.base.feriadoDia * (timeData[r.emp.id]?.cantFeriado || 0))}
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'cantExtrasFeriado', e.target.value)} />
                  </td>

                  <td className="text-right">
                    {formatCRC(r.base.horaFeriado * (timeData[r.emp.id]?.cantExtrasFeriado || 0))}
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-20 border border-gray-200 rounded m-1 p-1"
                      onChange={(e) => update(r.emp.id, 'retroactivo', e.target.value)} />
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-20 border border-gray-200 rounded m-1 p-1"
                      onChange={(e) => update(r.emp.id, 'bono', e.target.value)} />
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-20 border border-gray-200 rounded m-1 p-1"
                      onChange={(e) => update(r.emp.id, 'comisiones', e.target.value)} />
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'diasIncCCSS', e.target.value)} />
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'diasIncINS', e.target.value)} />
                  </td>

                  <td className='p-1 align-middle'>
                    <input type="number" className="w-16 p-1 border rounded border-gray-200 m-1"
                      onChange={(e) => update(r.emp.id, 'tiempoAusente', e.target.value)} />
                  </td>

                  <td className="text-right font-semibold">
                    {formatCRC(r.salarioBruto)}
                  </td>

                  <td className="text-right text-red-600">
                    {formatCRC(r.totalDeducciones)}
                  </td>

                  <td className="text-right font-bold text-emerald-700">
                    {formatCRC(r.neto)}
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-200 font-bold">
                <td colSpan={17} className="text-right">TOTAL PLANILLA</td>
                <td className="text-right">{formatCRC(totalPlanilla)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-4">
        <PrimaryButton>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  );
};

export default NewPayrollPage;
