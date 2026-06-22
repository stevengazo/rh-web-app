import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Table,
  Plus,
  Users,
  UserCheck,
  UserX,
  Building2,
} from 'lucide-react';

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

const StatPill = ({ icon: Icon, label, value, chip, fg }) => (
  <div className="flex items-center gap-3 rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${chip}`}>
      <Icon size={18} className={fg} />
    </div>
    <div>
      <p className="text-xl font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
    </div>
  </div>
);

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

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.isActive).length;
    const departments = new Set(
      employees.map((e) => e.departament?.name).filter(Boolean)
    ).size;
    return {
      total: employees.length,
      active,
      inactive: employees.length - active,
      departments,
    };
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeApi.getAllEmployees();
      setEmployees(response.data);
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
            <h2 className="text-2xl font-semibold text-ink">Empleados</h2>
            <p className="text-sm text-ink-muted">
              Gestión y administración del personal
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* toggle vista */}
            <div className="flex gap-1 rounded-lg border border-stroke-soft bg-surface-alt p-1">
              <button
                onClick={() => setView('cards')}
                title="Vista de tarjetas"
                className={`rounded-md p-2 transition-colors ${
                  view === 'cards'
                    ? 'bg-surface text-brand shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <LayoutGrid size={18} />
              </button>

              <button
                onClick={() => setView('table')}
                title="Vista de tabla"
                className={`rounded-md p-2 transition-colors ${
                  view === 'table'
                    ? 'bg-surface text-brand shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Table size={18} />
              </button>
            </div>

            {/* botón agregar */}
            <PrimaryButton
              onClick={() =>
                openCanvas(
                  'Agregar Empleado',
                  <EmployeesAdd OnClose={() => setOpen(false)} />
                )
              }
            >
              <Plus size={16} />
              Agregar Empleado
            </PrimaryButton>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatPill
            icon={Users}
            label="Total"
            value={stats.total}
            chip="bg-brand-tint"
            fg="text-brand"
          />
          <StatPill
            icon={UserCheck}
            label="Activos"
            value={stats.active}
            chip="bg-green-50"
            fg="text-green-600"
          />
          <StatPill
            icon={UserX}
            label="Inactivos"
            value={stats.inactive}
            chip="bg-red-50"
            fg="text-red-600"
          />
          <StatPill
            icon={Building2}
            label="Departamentos"
            value={stats.departments}
            chip="bg-violet-50"
            fg="text-violet-600"
          />
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
