import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SearchEmployee from "../Components/molecules/SearchEmployee";
import EmployeesTable from "../Components/organisms/EmployeesTable";
import OffCanvas from "../components/OffCanvas";
import PrimaryButton from "../components/PrimaryButton";
import EmployeesAdd from "../Components/organisms/EmployeesAdd";

import EmployeeApi from "../api/employeesApi";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState("");
  const [canvasContent, setCanvasContent] = useState(null);

  const [employees, setEmployees] = useState([]);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(<EmployeesAdd />);
    setOpen(true);
  };

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

  useEffect(() => {
    const FechData = async () => {
      try {
        const response = await EmployeeApi.getAllEmployees();
        setEmployees(response.data);
        console.log(response);
        console.table(employees);
      } catch (err) {
        console.error(err);
      }
    };
    FechData();
  }, []);

  return (
    <>
      {/* OffCanvas animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OffCanvas
              isOpen={open}
              onClose={() => setOpen(false)}
              title={canvasTitle}
            >
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {canvasContent}
              </motion.div>
            </OffCanvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Página */}
      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-row justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Empleados</h2>
            <p className="text-sm text-slate-500">
              Gestión y administración del personal
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton
              onClick={() =>
                openCanvas(
                  "Agregar Empleado",
                  "Contenido del canvas para agregar empleado"
                )
              }
            >
              Agregar Empleado
            </PrimaryButton>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <SearchEmployee
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <EmployeesTable employees={filteredEmployees} />
        </motion.div>
      </motion.div>
    </>
  );
};

export default EmployeesPage;
