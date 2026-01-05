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
import ActionAdd from "../Components/organisms/ActionAdd";
import EmployeeEdit from "../Components/organisms/EmployeeEdit";
import CourseTable from "../Components/organisms/CourseTable";
import CertificationTable from "../Components/organisms/CertificationTable";
import SalaryTable from "../Components/organisms/SalaryTable";
import EmployeeTableInfo from "../Components/organisms/EmployeeTableInfo";
import ExtrasTable from "../Components/organisms/ExtrasTable";

import EmployeeApi from "../api/employeesApi";
import courseApi from "../api/courseApi";
import certificationApi from "../api/certificationApi";
import ActionTable from "../Components/organisms/ActionTable";
import salaryApi from "../api/salaryApi";

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
  const [certifications, setCertifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [salaries, setSalaries] = useState([])
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
        // Get Employee
        const response = await EmployeeApi.getEmployeeById(id);
        setEmployee(response.data);
        // Get Courses
        const RespCourses = await courseApi.getCoursesByUser(id);
        setCourses(RespCourses.data);
        console.log(RespCourses.data);
        // Certifications
        const respCertifications =await certificationApi.getCertificationsByUser(id);
        setCertifications(respCertifications.data);
        // Salary 
        setSalaries((await salaryApi.getSalariesByUser(id)).data)
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
                    <EmployeeEdit
                      employee={employee}
                      setEmployee={setEmployee}
                    />
                  )
                }
              >
                Editar Información
              </PrimaryButton>
            </motion.div>
          </div>
          <EmployeeTableInfo employee={employee} />
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
          <CourseTable courses={courses} />
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
          <CertificationTable certifications={certifications} />
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
                  openCanvas(
                    "Registrar Salario",
                    <SalaryAdd userId={id} author={user} />
                  )
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
          <SalaryTable salaries={salaries} />
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
                    <ActionAdd userId={id} author={user} />
                  )
                }
              >
                Agregar
              </PrimaryButton>
            </motion.div>
          </div>
          <ActionTable />
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
          <ExtrasTable />
        </motion.div>
      </motion.div>
    </>
  );
};

export default ViewEmployeePage;
