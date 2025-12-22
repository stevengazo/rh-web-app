import SectionTitle from "../components/SectionTitle";
import Divider from "../components/Divider";
import PrimaryButton from "../components/PrimaryButton";
import PayrollListTable from "../Components/organisms/PayrollListTable";

const PayrollPage = () => {
  return (
    <>
      <SectionTitle>Planilla de Empleados</SectionTitle>
      <Divider />
      <PrimaryButton>Generar Nueva Planilla </PrimaryButton>
      <PayrollListTable />
    </>
  );
};

export default PayrollPage;
