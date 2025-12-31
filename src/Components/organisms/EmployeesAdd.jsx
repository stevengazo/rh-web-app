import EmployeeApi from "../../api/employeesApi";
import DepartamentApi from "../../api/departamentApi";
import { useEffect, useState } from "react";
import TextInput from "../TextInput";
import DateInput from "../DateInput";
import Label from "../Label";
import PrimaryButton from "../PrimaryButton";

const EmployeesAdd = () => {
  const [departaments, setDepartaments] = useState([]);

  useEffect(() => {
    const fetchDepartaments = async () => {
      try {
        const response = await DepartamentApi.getAllDepartaments();
        setDepartaments(response.data);
      } catch (error) {
        console.error("Error fetching departaments:", error);
      }
    };
    fetchDepartaments();
  }, []);

  return (
    <form className="space-y-8">
      {/* ================= IDENTIFICACIÓN ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Identificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DNI */}
          <div className="flex flex-col gap-1">
            <Label>Cédula</Label>
            <TextInput placeholder="1-520-151" />
          </div>

          {/* Fecha Nacimiento */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de Nacimiento</Label>
            <DateInput />
          </div>
        </div>
      </section>

      {/* ================= INFORMACIÓN PERSONAL ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Información personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <TextInput placeholder="Juan" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Segundo Nombre</Label>
            <TextInput placeholder="Carlos" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Apellido</Label>
            <TextInput placeholder="Pérez" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Segundo Apellido</Label>
            <TextInput placeholder="Gómez" />
          </div>
        </div>
      </section>

      {/* ================= CONTACTO ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Correo electrónico</Label>
            <TextInput type="email" placeholder="demo@mail.com" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Teléfono</Label>
            <TextInput type="tel" placeholder="8888-8888" />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Dirección</Label>
            <TextInput placeholder="San José, Costa Rica" />
          </div>
        </div>
      </section>

      {/* ================= INFORMACIÓN LABORAL ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Información laboral
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fecha contratación */}
          <div className="flex flex-col gap-1">
            <Label>Fecha de contratación</Label>
            <DateInput />
          </div>

          {/* Jornada */}
          <div className="flex flex-col gap-1">
            <Label>Jornada</Label>
            <select className="bg-white border text-gray-600 border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400">
              <option value="">Seleccione una jornada</option>
              <option className="text-black">Diurna</option>
              <option className="text-black">Mixta</option>
              <option className="text-black">Nocturna</option>
            </select>
          </div>

          {/* Departamento */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Departamento</Label>
            <select className="bg-white border text-gray-600 border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400">
              <option value="">Seleccione un departamento</option>
              {departaments.map((dept) => (
                <option key={dept.id} value={dept.id} className="text-black">
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <PrimaryButton>
          Agregar Empleado
        </PrimaryButton>
      </div>
    </form>
  );
};

export default EmployeesAdd;
