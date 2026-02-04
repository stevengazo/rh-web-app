import { motion } from 'framer-motion';
import { useEffect, useId, useMemo, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import salaryApi from '../api/salaryApi';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';

import PayrollRow from '../Components/atoms/PayrollRow';
import PayrollResumeTable from '../Components/organisms/PayrollResumeTable';

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */
const NewPayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [timeData, setTimeData] = useState({});

  const salaryMap = useMemo(() => {
    const map = {};

    salaries.forEach((s) => {
      const userId = s.userId;

      if (!map[userId]) {
        map[userId] = s;
      } else {
        // nos quedamos con el salario más reciente
        const current = map[userId];
        if (new Date(s.effectiveDate) > new Date(current.effectiveDate)) {
          map[userId] = s;
        }
      }
    });

    return map;
  }, [salaries]);

  /* =====================================================
     CARGA INICIAL DE DATOS
  ===================================================== */
  useEffect(() => {
    const loadData = async () => {
      const emp = await EmployeeApi.getAllEmployees();
      const sal = await salaryApi.getLatests();
      console.log(emp.data);
      console.log(sal.data);
      setEmployees(emp.data);
      setSalaries(sal.data);
    };
    loadData();
  }, []);

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
                <th
                  className="p-2 text-md"
                  title="Nombre completo del empleado"
                >
                  Empleado
                </th>
                <th
                  className="p-2 text-md"
                  title="Salario mensual obtenido del sistema"
                >
                  Salario Mensual
                </th>
                <th className="p-2 text-md" title="Salario Mensual / 2">
                  Salario Quincenal
                </th>

                <th className="p-2 text-md" title="Salario Mensual / 30 / 8">
                  Salario Por Hora
                </th>

                <th
                  className="p-2 text-md"
                  title="Cantidad de horas extra trabajadas"
                >
                  Cant Extras
                </th>

                <th
                  className="p-2 text-md"
                  title="Cant Extras × Salario Hora × 1.5"
                >
                  Monto Horas Extras
                </th>

                <th
                  className="p-2 text-md"
                  title="Cantidad de días feriado laborados"
                >
                  Cant Feriado
                </th>

                <th
                  className="p-2 text-md"
                  title="Cant Feriado × Salario Hora × 8 × 2"
                >
                  Monto Feriado
                </th>

                <th
                  className="p-2 text-md"
                  title="Cantidad de horas extra en feriado"
                >
                  Cant Extras Feriado
                </th>

                <th
                  className="p-2 text-md"
                  title="Cant Extras Feriado × Salario Hora × 2.5"
                >
                  Monto EX Feriado
                </th>

                <th className="p-2 text-md" title="Monto ingresado manualmente">
                  Retroactivo
                </th>

                <th className="p-2 text-md" title="Monto ingresado manualmente">
                  Bono
                </th>

                <th className="p-2 text-md" title="Monto ingresado manualmente">
                  Comisiones
                </th>

                <th
                  className="p-2 text-md"
                  title="Días INC CCSS × (Salario Mensual / 30)"
                >
                  Días INC CCSS
                </th>

                <th
                  className="p-2 text-md"
                  title="Días INC INS × (Salario Mensual / 30)"
                >
                  Días INC INS
                </th>

                <th
                  className="p-2 text-md"
                  title="Horas Ausentes × Salario Hora"
                >
                  Tiempo Ausente
                </th>

                <th
                  className="p-2 text-md"
                  title="Salario Mensual + Extras + Feriados + Bonos + Comisiones + Retroactivo"
                >
                  Salario Bruto
                </th>

                <th
                  className="p-2 text-md"
                  title="INC CCSS + INC INS + Tiempo Ausente"
                >
                  Total Deducciones
                </th>

                <th
                  className="p-2 text-md"
                  title="Salario Bruto − Total Deducciones"
                >
                  Monto X SE
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <PayrollRow
                  key={emp.id}
                  data={emp}
                  salary={salaryMap[emp.id]}
                />
              ))}

              <tr className="bg-slate-200 font-bold">
                <td colSpan={17} className="text-right">
                  TOTAL PLANILLA
                </td>
                <td className="text-right"> TOTAL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <SectionTitle>Resumen</SectionTitle>
          <PayrollResumeTable />
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
