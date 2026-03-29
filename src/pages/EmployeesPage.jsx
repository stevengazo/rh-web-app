import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Table } from 'lucide-react';

import SearchEmployee from '../Components/molecules/SearchEmployee';
import EmployeesTable from '../Components/organisms/EmployeesTable';
import EmployeesCards from '../Components/organisms/EmployeesCards';
import OffCanvas from '../Components/OffCanvas';
import PrimaryButton from '../Components/PrimaryButton';
import EmployeesAdd from '../Components/organisms/EmployeesAdd';
import EmployeeApi from '../api/employeesApi';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);

  const [view, setView] = useState('cards'); // table | cards

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

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

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeApi.getAllEmployees();

      setEmployees(response.data);

      console.log('Employees response:', response.data);
    } catch (err) {
      console.error('Error loading employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [open]);

  return (
    <>
      {/* OffCanvas */}
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
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {canvasContent}
              </motion.div>
            </OffCanvas>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Empleados</h2>
            <p className="text-sm text-slate-500">
              Gestión y administración del personal
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* toggle vista */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setView('table')}
                className={`p-2 rounded-md transition ${
                  view === 'table' ? 'bg-white shadow' : 'text-slate-500'
                }`}
              >
                <Table size={18} />
              </button>

              <button
                onClick={() => setView('cards')}
                className={`p-2 rounded-md transition ${
                  view === 'cards' ? 'bg-white shadow' : 'text-slate-500'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* botón agregar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas(
                    'Agregar Empleado',
                    <EmployeesAdd OnClose={() => setOpen(false)} />
                  )
                }
              >
                Agregar Empleado
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* SEARCH */}
        <motion.div variants={itemVariants}>
          <SearchEmployee
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
          />
        </motion.div>

        {/* CONTENT */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            {view === 'table' ? (
              <motion.div
                key="table"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <EmployeesTable
                  employees={filteredEmployees}
                  HandleShowEdit={openCanvas}
                />
              </motion.div>
            ) : (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <EmployeesCards
                  employees={filteredEmployees}
                  HandleShowEdit={openCanvas}
                  HandleShow={openCanvas}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

export default EmployeesPage;
