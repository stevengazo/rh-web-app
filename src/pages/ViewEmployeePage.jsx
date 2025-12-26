import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* COMPONENTS */
import PageTitle from "../components/PageTitle"
import SectionTitle from "../components/SectionTitle"
import PrimaryButton from "../components/PrimaryButton"
import OffCanvas from "../components/OffCanvas"

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const ViewEmployeePage = () => {
  const [open, setOpen] = useState(false)
  const [canvasTitle, setCanvasTitle] = useState("")
  const [canvasContent, setCanvasContent] = useState(null)

  const openCanvas = (title, content) => {
    setCanvasTitle(title)
    setCanvasContent(content)
    setOpen(true)
  }

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

      {/* Page */}
      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.div variants={itemVariants}>
          <PageTitle>Información del Empleado</PageTitle>
        </motion.div>

        {/* Detalles */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Detalles del Empleado</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas(
                    "Editar Información del Empleado",
                    <p>Formulario de edición del empleado</p>
                  )
                }
              >
                Editar Información
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Cursos */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Cursos</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas("Agregar Curso", <p>Formulario para agregar curso</p>)
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Certificaciones */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Certificaciones</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas(
                    "Agregar Certificación",
                    <p>Formulario para agregar certificación</p>
                  )
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Salarios */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Salarios Registrados</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas("Registrar Salario", <p>Formulario de salario</p>)
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Acciones */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Acciones de Personal</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas(
                    "Agregar Acción de Personal",
                    <p>Formulario de acción</p>
                  )
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Horas Extras */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex justify-between items-center">
            <SectionTitle>Horas Extras</SectionTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PrimaryButton
                onClick={() =>
                  openCanvas(
                    "Registrar Horas Extras",
                    <p>Formulario de horas extras</p>
                  )
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

export default ViewEmployeePage
