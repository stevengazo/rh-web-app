import { motion, AnimatePresence } from 'framer-motion';

import SectionTitle from '../Components/SectionTitle';
import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import ActionTable from '../Components/organisms/ActionTable';
import CertificationTable from '../Components/organisms/CertificationTable';
import CourseTable from '../Components/organisms/CertificationTable';
import SalaryTable from '../Components/organisms/SalaryTable';
import EmployeeTableInfo from '../Components/organisms/EmployeeTableInfo';
import VacationsTable from '../Components/organisms/VacationsTable';
import VacationsAdd from '../Components/organisms/VacationsAdd';

import { useAppContext } from '../context/AppContext';

import { useEffect, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import actionApi from '../api/actionApi';
import courseApi from '../api/courseApi';
import certificationApi from '../api/certificationApi';
import salaryApi from '../api/salaryApi';
import VacationsApi from '../api/vacationsApi';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import CourseAdd from '../Components/organisms/CourseAdd';
import CertificationAdd from '../Components/organisms/CertificationAdd';

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
  const [vacations, setVacations] = useState([]);
  const [actions, setActions] = useState([]);

  const { user } = useAppContext();

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const getProfile = async () => {
      // PERFIL
      try {
        const respData = await EmployeeApi.getEmployeeById(user.id);
        setMyProfile(respData.data);
      } catch (error) {
        console.error('Error perfil:', error);
      }

      // CURSOS
      try {
        const resp = await courseApi.getCoursesByUser(user.id);
        setCourses(resp.data);
      } catch (error) {
        console.error('Error cursos:', error);
      }

      // CERTIFICACIONES
      try {
        const resp = await certificationApi.getCertificationsByUser(user.id);
        setCertifications(resp.data);
      } catch (error) {
        console.error('Error certificaciones:', error);
      }

      // SALARIOS
      try {
        const resp = await salaryApi.getSalariesByUser(user.id);
        setSalaries(resp.data);
      } catch (error) {
        console.error('Error salarios:', error);
      }

      // ACCIONES
      try {
        const resp = await actionApi.getActionsByUser(user.id);
        setActions(resp.data);
      } catch (error) {
        console.error('Error acciones:', error);
      }

      // VACACIONES
      try {
        const resp = await VacationsApi.getVacationsByUser(user.id);
        setVacations(resp.data);
        console.log('Vacaciones:', resp.data);
      } catch (error) {
        console.error('Error vacaciones:', error);
      }
    };

    getProfile();
  }, []);

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvasLarge
            isOpen={open}
            onClose={() => setOpen(false)}
            title={canvasTitle}
          >
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvasLarge>
        )}
      </AnimatePresence>
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

              <div className="flex flex-row justify-between">
                <SectionTitle>Cursos</SectionTitle>
                <PrimaryButton
                  onClick={() => {
                    openCanvas(
                      'Agregar Curso',
                      <CourseAdd userId={user.id} author={user.id} />
                    );
                  }}
                >
                  Agregar
                </PrimaryButton>
              </div>
              <CourseTable courses={courses} />
              <Divider />
              <div className="flex flex-row justify-between">
                <SectionTitle>Certificaciones</SectionTitle>
                <PrimaryButton
                  onClick={() => {
                    openCanvas(
                      'Agregar Certificación',
                      <CertificationAdd userId={user.id} />
                    );
                  }}
                >
                  Agregar
                </PrimaryButton>
              </div>
              <CertificationTable certifications={certifications} />
              <Divider />
              <SectionTitle>Histórico de Salarios</SectionTitle>
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

              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                  <SectionTitle>Vacaciones</SectionTitle>
                  <PrimaryButton
                    onClick={() => {
                      openCanvas(
                        'Solicitar Vacaciones',
                        <VacationsAdd id={user.id} />
                      );
                    }}
                  >
                    Solicitar Vacaciones
                  </PrimaryButton>
                </div>

                <VacationsTable vacationsList={vacations} showUser={false} />
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
    </>
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
