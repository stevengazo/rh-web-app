import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import PayrollRow from '../Components/atoms/PayrollRow';
import PayrollResumeTable from '../Components/organisms/PayrollResumeTable';
import TablePayrollHeader from '../Components/molecules/tablePayrollHeader';

import usePayrollData from '../hooks/usePayrollData';
import { useEffect } from 'react';

const NewPayrollPage = () => {
  const { id } = useParams();

  const {
    employees,
    payrollByEmployee,
    handleRowChange,
    payroll,
    handleSave,
    payrollResume,
  } = usePayrollData(id);

  useEffect(() => {
    console.log(payroll);
  }, [payroll]);

  return (
    <motion.div className="space-y-10">
      <PageTitle>Generar Nueva Planilla</PageTitle>^
      {payroll && (
        <div className="bg-white rounded-xl shadow">
          <SectionTitle>Detalle Completo de Planilla</SectionTitle>

          <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
            <table className="min-w-[2400px] text-xs border-collapse">
              <TablePayrollHeader />
              <tbody>
                {Object.values(payrollByEmployee).map((payroll, index) => (
                  <PayrollRow
                    employee={employees.find((e) => e.id === payroll.userId)}
                    key={payroll.userId ?? index}
                    PayrollData={payroll}
                    onChanged={handleRowChange}
                    type={payroll.payrollType}
                    StartDate={payroll.initialDate}
                    finalDate={payroll.finalDate}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row my-2 gap-2">
            <div className="bg-white w-1/2 shadow-md rounded-xl p-6  border border-gray-300  space-y-3">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">
                Detalles de Nómina
              </h2>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Tipo:</span>
                <span>{payroll.payrollType}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Descripción:</span>
                <span>{payroll.payrollDescription}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Fecha Inicio:</span>
                <span>
                  {new Date(payroll.initialDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Fecha Final:</span>
                <span>{new Date(payroll.finalDate).toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Registros de Nómina:</span>
                <span>{payroll.payrolls?.length || 0}</span>
              </div>
            </div>

            <div className="bg-white w-1/2 shadow-md rounded-xl p-6  border border-gray-300  space-y-3">
              <SectionTitle>Resumen</SectionTitle>
              <PayrollResumeTable resume={payrollResume} />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4 border ">
        <PrimaryButton onClick={handleSave}>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  );
};

export default NewPayrollPage;
