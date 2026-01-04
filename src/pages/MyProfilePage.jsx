import { motion } from "framer-motion"

import SectionTitle from "../components/SectionTitle"
import PageTitle from "../components/PageTitle"
import Divider from "../components/Divider"
import PrimaryButton from "../components/PrimaryButton"

import ActionTable from '../Components/organisms/ActionTable'
import CertificationTable from   '../Components/organisms/CertificationTable'
import CourseTable from  '../Components/organisms/CertificationTable'
import SalaryTable from  '../Components/organisms/SalaryTable'
import EmployeeTableInfo from "../Components/organisms/EmployeeTableInfo"

import { useAppContext } from "../context/AppContext"

import EmployeeApi from "../api/employeesApi";
import { useEffect, useState } from "react"

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const MyProfilePage = () => {
  
  const [myProfile, setMyProfile] = useState()

    const { user } = useAppContext();

    
  useEffect(()=>{
    const getProfile = async()=>{
      try {
        const respData = await EmployeeApi.getEmployeeById(user.id)
        setMyProfile(respData.data)
      } catch (error) {
        console.error(error)
        setMyProfile(undefined)
      }
    }

    getProfile();
  },[])



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
        <CourseTable />
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
        <CertificationTable />
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
      </motion.div>

      {/* Acciones de Personal */}
      <motion.div variants={sectionVariants}>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Acciones de Personal</SectionTitle>
        </div>
        <ActionTable />
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
  )
}

export default MyProfilePage
