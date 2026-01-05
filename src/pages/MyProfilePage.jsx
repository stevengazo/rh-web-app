import { motion } from "framer-motion";

import SectionTitle from "../components/SectionTitle";
import PageTitle from "../components/PageTitle";
import Divider from "../components/Divider";
import PrimaryButton from "../components/PrimaryButton";
import ActionTable from "../Components/organisms/ActionTable";
import CertificationTable from "../Components/organisms/CertificationTable";
import CourseTable from "../Components/organisms/CertificationTable";
import SalaryTable from "../Components/organisms/SalaryTable";
import EmployeeTableInfo from "../Components/organisms/EmployeeTableInfo";

import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";

import EmployeeApi from "../api/employeesApi";
import actionApi from "../api/actionApi";
import courseApi from "../api/courseApi";
import certificationApi from "../api/certificationApi";
import salaryApi from "../api/salaryApi";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const MyProfilePage = () => {
  const [myProfile, setMyProfile] = useState();

  const [certifications, setCertifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [actions, setActions] = useState([]);

  const { user } = useAppContext();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const respData = await EmployeeApi.getEmployeeById(user.id);
        setMyProfile(respData.data);
        // Get Courses
        setCourses(await courseApi.getCoursesByUser(user.id).data);
        // Certifications
        setCertifications(
          await certificationApi.getCertificationsByUser(user.id).data
        );
        // Salary
        setSalaries((await salaryApi.getSalariesByUser(user.id)).data);
        // Actions
        setActions((await actionApi.getActionsByUser(user.id)).data);
      } catch (error) {
        console.error(error);
        setMyProfile(undefined);
      }
    };

    getProfile();
  }, []);

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Title */}
      <motion.div variants={sectionVariants}>
        <PageTitle>Mi Perfil</PageTitle>
        <EmployeeTableInfo employee={myProfile} />
      </motion.div>

      {/* Cursos */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Cursos</SectionTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton>Agregar</PrimaryButton>
          </motion.div>
        </div>
        <CourseTable courses={courses} />
      </motion.div>

      {/* Certificaciones */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Certificaciones</SectionTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton>Agregar</PrimaryButton>
          </motion.div>
        </div>
        <CertificationTable certifications={certifications} />
      </motion.div>

      {/* Histórico de Salarios */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Histórico de Salarios</SectionTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PrimaryButton>Agregar</PrimaryButton>
          </motion.div>
        </div>
        <SalaryTable salaries={salaries} />
      </motion.div>

      {/* Acciones de Personal */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Acciones de Personal</SectionTitle>
        </div>
        <ActionTable actions={actions} />{" "}
      </motion.div>

      {/* Vacaciones */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Vacaciones</SectionTitle>
        </div>
      </motion.div>

      {/* Comprobantes de Pago */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Comprobantes de Pago</SectionTitle>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyProfilePage;
