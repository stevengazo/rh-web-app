import { useState, useMemo } from "react";
import SearchEmployee from "../Components/molecules/SearchEmployee";
import EmployeesTable from "../Components/organisms/EmployeesTable";

const EmployeesPage = () => {
  const [search, setSearch] = useState("");

  // Mock data (luego viene de la API)
  const employees = [
    { id: 1, firstName: "Juan", lastName: "Pérez", email: "juan@empresa.com" },
    { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@empresa.com" },
    { id: 3, firstName: "Carlos", lastName: "Rodríguez", email: "carlos@empresa.com" },
  ];

  // Filtrado
  const filteredEmployees = useMemo(() => {
    if (!search) return employees;

    const term = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term)
    );
  }, [search, employees]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Empleados
        </h2>
        <p className="text-sm text-slate-500">
          Gestión y administración del personal
        </p>
      </div>

      {/* Search */}
      <SearchEmployee
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />

      {/* Table */}
      <EmployeesTable employees={filteredEmployees} />

    </div>
  );
};

export default EmployeesPage;
