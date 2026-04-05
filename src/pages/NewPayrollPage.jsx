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

const NewPayrollPage = () => {
  const { id } = useParams();
  const {
    employees,
    payrollByEmployee,
    handleRowChange,
    handleSave,
    payrollResume,
  } = usePayrollData(id);

  return (
    <motion.div className="space-y-10">
      <PageTitle>Generar Nueva Planilla</PageTitle>

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
                />
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle>Resumen</SectionTitle>
        <PayrollResumeTable resume={payrollResume} />
      </div>

      <div className="flex gap-4">
        <PrimaryButton onClick={handleSave}>Guardar Planilla</PrimaryButton>
        <SecondaryButton>Cancelar</SecondaryButton>
      </div>
    </motion.div>
  );
};

export default NewPayrollPage;