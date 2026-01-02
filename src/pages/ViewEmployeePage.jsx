import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Theater } from "lucide-react";


/* COMPONENTS */
import PageTitle from "../components/PageTitle";
import SectionTitle from "../components/SectionTitle";
import PrimaryButton from "../components/PrimaryButton";
import OffCanvas from "../components/OffCanvas";
import { useParams } from "react-router-dom";
import CourseAdd from "../Components/organisms/CourseAdd";
import CertificationAdd from "../Components/organisms/CertificationAdd";
import SalaryAdd from "../Components/organisms/SalaryAdd";

import EmployeeApi from "../api/employeesApi";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const ViewEmployeePage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState("");
  const [canvasContent, setCanvasContent] = useState(null);

  const { user } = useAppContext();
  console.log(user);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const FechData = async () => {
      try {
        const response = await EmployeeApi.getEmployeeById(id);
        setEmployee(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
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
          <motion.div>
            <table className="w-full border border-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-3 py-2">Campo</th>
                  <th className="text-left px-3 py-2">Valor</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="px-3 py-2 font-medium">Nombre</td>
                  <td className="px-3 py-2">
                    {employee.firstName} {employee.middleName}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Apellidos</td>
                  <td className="px-3 py-2">
                    {employee.lastName} {employee.secondLastName}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Correo</td>
                  <td className="px-3 py-2">{employee.email}</td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Cédula</td>
                  <td className="px-3 py-2">{employee.dni || "—"}</td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Departamento</td>
                  <td className="px-3 py-2">{employee.departament?.name}</td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Fecha Contratación</td>
                  <td className="px-3 py-2">
                    {new Date(employee.hiredDate).toLocaleDateString()}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-2 font-medium">Estado</td>
                  <td className="px-3 py-2">
                    {employee.isActive ? "Activo" : "Inactivo"}
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
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
                  openCanvas(
                    "Agregar Curso",
                    <CourseAdd userId={id} author={user} />
                  )
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
                    <div>
                      <p>Formulario para agregar certificación</p>
                      <CertificationAdd userId={id} author={user} />
                    </div>
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
                  openCanvas("Registrar Salario", 
                    <SalaryAdd userId={id} author={user} />
                  )
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
  );
};

export default ViewEmployeePage;
