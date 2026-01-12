import { motion } from 'framer-motion';

import SectionTitle from '../components/SectionTitle';
import PageTitle from '../components/PageTitle';
import Divider from '../components/Divider';
import PrimaryButton from '../components/PrimaryButton';
import ActionTable from '../Components/organisms/ActionTable';
import CertificationTable from '../Components/organisms/CertificationTable';
import CourseTable from '../Components/organisms/CertificationTable';
import SalaryTable from '../Components/organisms/SalaryTable';
import EmployeeTableInfo from '../Components/organisms/EmployeeTableInfo';

import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import actionApi from '../api/actionApi';
import courseApi from '../api/courseApi';
import certificationApi from '../api/certificationApi';
import salaryApi from '../api/salaryApi';

const TABS = {
  INFO: 'Informacion',
  ACTIONS: 'Acciones',
  VACATIONS: 'Vacaciones',
  SETTINGS: 'settings',
};

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
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const MyProfilePage = () => {
  const [myProfile, setMyProfile] = useState({});

  const [activeTab, setActiveTab] = useState(TABS.INFO);

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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          <TabButton
            active={activeTab === TABS.INFO}
            onClick={() => setActiveTab(TABS.INFO)}
          >
            Perfil
          </TabButton>
          <TabButton
            active={activeTab === TABS.ACTIONS}
            onClick={() => setActiveTab(TABS.ACTIONS)}
          >
            Acciones
          </TabButton>

          <TabButton
            active={activeTab === TABS.VACATIONS}
            onClick={() => setActiveTab(TABS.VACATIONS)}
          >
            Vacaciones
          </TabButton>

          <TabButton
            active={activeTab === TABS.SETTINGS}
            onClick={() => setActiveTab(TABS.SETTINGS)}
          >
            Configuración
          </TabButton>
        </nav>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* TAB 1 */}
        {activeTab === TABS.INFO && (
          <div className="space-y-6">
            {/* Cursos */}

            <SectionTitle>Cursos</SectionTitle>
            <PrimaryButton>Agregar</PrimaryButton>
            <CourseTable courses={courses} />
            <Divider />
            <SectionTitle>Certificaciones</SectionTitle>
            <PrimaryButton>Agregar</PrimaryButton>
            <CertificationTable certifications={certifications} />
            <Divider />
            <SectionTitle>Histórico de Salarios</SectionTitle>
            <PrimaryButton>Agregar</PrimaryButton>
            <SalaryTable salaries={salaries} />
          </div>
        )}

        {/* TAB 2 */}
        {activeTab === TABS.ACTIONS && (
          <div className="space-y-4">
            {/* Acciones de Personal */}
            <SectionTitle>Acciones de Personal</SectionTitle>
            <ActionTable actions={actions} />{' '}
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === TABS.VACATIONS && (
          <div className="space-y-4">
            {/* Vacaciones */}

            <div className="flex flex-row justify-between items-center">
              <SectionTitle>Vacaciones</SectionTitle>
            </div>
          </div>
        )}

        {/* TAB 4 */}
        {activeTab === TABS.SETTINGS && (
          <div className="space-y-4">
            <SectionTitle>Comprobantes de Pago</SectionTitle>
          </div>
        )}
      </div>

      {/* Comprobantes de Pago */}
    </motion.div>
  );
};

const TabButton = ({ active, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium transition-colors border-b-2
        ${
          active
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
};

export default MyProfilePage;
