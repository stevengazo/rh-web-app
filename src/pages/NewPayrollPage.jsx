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
                <th title="Salario Mensual / 30">Salario Por Hora</th>
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
              {employees.map((r,index) => (
                <PayrollRow key={index} data={r} />
                
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
          <SectionTitle >Resumen</SectionTitle>
          
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
