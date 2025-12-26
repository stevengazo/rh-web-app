import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"

import SearchEmployee from "../Components/molecules/SearchEmployee"
import EmployeesTable from "../Components/organisms/EmployeesTable"
import OffCanvas from "../components/OffCanvas"
import PrimaryButton from "../components/PrimaryButton"

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const EmployeesPage = () => {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [canvasTitle, setCanvasTitle] = useState("")
  const [canvasContent, setCanvasContent] = useState(null)

  const openCanvas = (title, content) => {
    setCanvasTitle(title)
    setCanvasContent(content)
    setOpen(true)
  }

  // Mock data (luego viene de la API)
  const employees = [
    { id: 1, firstName: "Juan", lastName: "Pérez", email: "juan@empresa.com" },
    { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@empresa.com" },
    {
      id: 3,
      firstName: "Carlos",
      lastName: "Rodríguez",
      email: "carlos@empresa.com",
    },
  ]

  // Filtrado
  const filteredEmployees = useMemo(() => {
    if (!search) return employees

    const term = search.toLowerCase()
    return employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(term) ||
        e.lastName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term)
    )
  }, [search, employees])

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
            <h2 className="text-2xl font-semibold text-slate-800">
              Empleados
            </h2>
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
  )
}

export default EmployeesPage
