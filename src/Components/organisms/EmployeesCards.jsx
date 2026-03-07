import { Mail, Phone, Building2 } from "lucide-react";
import EmployeeView from "./EmployeeView";

const EmployeesCards = ({ employees, HandleShowEdit }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {employees.map((emp) => {

        const initials = `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`;

        return (
          <div
            key={emp.id}
            className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition cursor-pointer"
            onClick={() =>
              HandleShowEdit(
                "Ver Empleado",
                <EmployeeView employee={emp} />
              )
            }
          >

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">

              {/* Avatar */}
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                {initials}
              </div>

              {/* Nombre */}
              <div>
                <h3 className="text-sm font-semibold text-slate-800 leading-none">
                  {emp.firstName} {emp.lastName}
                </h3>

                {emp?.departament?.name && (
                  <p className="text-xs text-slate-500 mt-1">
                    {emp.departament.name}
                  </p>
                )}
              </div>

            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={16} />
              <span className="truncate">{emp.email}</span>
            </div>

            {/* Teléfono */}
            {emp.phoneNumber && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <Phone size={16} />
                {emp.phoneNumber}
              </div>
            )}

            {/* Departamento */}
            {emp?.departament?.name && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <Building2 size={16} />
                {emp.departament.name}
              </div>
            )}

            {/* Estado */}
            <div className="mt-4">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  emp.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {emp.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>

          </div>
        );
      })}

    </div>
  );
};

export default EmployeesCards;