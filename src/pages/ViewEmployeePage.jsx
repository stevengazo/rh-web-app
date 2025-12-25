import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import PrimaryButton from "../components/PrimaryButton";

const ViewEmployeePage = () => {
  return (
    <div>
      <PageTitle>Información del Empleado</PageTitle>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Detalles del Empleado</SectionTitle>
          <PrimaryButton className="mt-4">Editar Información</PrimaryButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Cursos</SectionTitle>
          <PrimaryButton className="mt-4">Agregar</PrimaryButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Certificaciones</SectionTitle>
          <PrimaryButton className="mt-4">Agregar</PrimaryButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Salarios Registrados</SectionTitle>
          <PrimaryButton className="mt-4">Agregar</PrimaryButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Acciones de Personal</SectionTitle>
          <PrimaryButton className="mt-4">Agregar</PrimaryButton>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Horas Extras</SectionTitle>
          <PrimaryButton className="mt-4">Agregar</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeePage;
