import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/* COMPONENTS */
import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../Components/OffCanvas';

import EmployeeEdit from '../Components/organisms/EmployeeEdit';
import EmployeeTableInfo from '../Components/organisms/EmployeeTableInfo';

import CourseAdd from '../Components/organisms/CourseAdd';
import CourseTable from '../Components/organisms/CourseTable';
import CourseEdit from '../Components/organisms/CouseEdit';

import CertificationAdd from '../Components/organisms/CertificationAdd';
import CertificationTable from '../Components/organisms/CertificationTable';

import SalaryAdd from '../Components/organisms/SalaryAdd';
import SalaryTable from '../Components/organisms/SalaryTable';

import ActionAdd from '../Components/organisms/ActionAdd';
import ActionTable from '../Components/organisms/ActionTable';
import ActionView from '../Components/organisms/ActionView';
import ActionEdit from '../Components/organisms/ActionEdit';

import ContactsEmergenciesAdd from '../Components/organisms/ContactsEmergenciesAdd';
import ContactsEmergencyTable from '../Components/organisms/ContactsEmergencyTable';

import ExtrasTable from '../Components/organisms/ExtrasTable';

import AddAward from '../Components/organisms/AddAward';
import AwardTable from '../Components/organisms/AwardTable';

import ComissionTable from '../Components/organisms/ComissionTable';
import ComissionAdd from '../Components/organisms/ComissionAdd';

import ExtraAdd from '../Components/organisms/ExtraAdd';
import ExtraTable from '../Components/organisms/ExtraTable';
import ExtraView from '../Components/organisms/ExtraView';

/* API */
import EmployeeApi from '../api/employeesApi';
import courseApi from '../api/courseApi';
import certificationApi from '../api/certificationApi';
import salaryApi from '../api/salaryApi';
import actionApi from '../api/actionApi';
import awardApi from '../api/awardsApi';
import extrasApi from '../api/extrasApi';
import comissionsApi from '../api/comissionsApi';
import CertificationEdit from '../Components/organisms/CertificationEdit';
import ContactEmergencies from '../api/contactEmergenciesApi';
import EmployeeInfoCard from '../Components/organisms/EmployeeInfoCard';
import { KeyIcon, UserX } from 'lucide-react';

const TABS = {
  TRAINING: 'Certificaciones',
  SALARY: 'Salarios',
  ACTIONS: 'Acciones',
  EXTRAS: 'Extras',
  COMISSIONS: 'Comisiones',
  AWARDS: 'Reconocimientos',
  CONTACTS: 'Contactos',
};

const ViewEmployeePage = () => {
  const { id } = useParams();
  const { user } = useAppContext();

  const [activeTab, setActiveTab] = useState(TABS.TRAINING);
  const [employee, setEmployee] = useState({});
  const [courses, setCourses] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [actions, setActions] = useState([]);
  const [awards, setAwards] = useState([]);
  const [comission, setComission] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [extras, setExtras] = useState([]);

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await EmployeeApi.getEmployeeById(id);
        setEmployee(res.data);
      } catch (err) {
        console.error('Error employee', err);
      }

      try {
        const res = await salaryApi.getSalariesByUser(id);
        setSalaries(res.data);
      } catch (err) {
        console.error('Error salaries', err);
      }

      try {
        const res = await actionApi.getActionsByUser(id);
        setActions(res.data);
      } catch (err) {
        console.error('Error actions', err);
      }

      try {
        const res = await awardApi.getAwardsByUser(id);
        setAwards(res.data);
      } catch (err) {
        console.error('Error awards', err);
      }

      try {
        const res = await certificationApi.getCertificationsByUser(id);
        setCertifications(res.data);
      } catch (err) {
        console.error('Error certifications', err);
      }

      try {
        const res = await courseApi.getCoursesByUser(id);
        setCourses(res.data);
      } catch (err) {
        console.error('Error courses', err);
      }

      try {
        const res = await extrasApi.getExtrasByUser(id);
        setExtras(res.data);
      } catch (err) {
        console.error('Error extras', err);
      }

      try {
        const res = await comissionsApi.getComissionsByUser(id);
        setComission(res.data);
      } catch (err) {
        console.error('Error comissions', err);
      }
      try {
        const res = await ContactEmergencies.getContactEmergenciesByUser(id);
        setContacts(res.data);
      } catch (err) {
        console.error('Error contacts', err);
      }
    };

    fetchData();
  }, [open]);

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvas
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
          </OffCanvas>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <PageTitle>Información del Empleado</PageTitle>

        <>
          <div className="flex flex-row justify-between items-center">
            <Header title="Detalles del Empleado" />

            <PrimaryButton
              onClick={() =>
                openCanvas(
                  'Editar Información',
                  <EmployeeEdit
                    employee={employee}
                    setEmployee={setEmployee}
                    onClose={() => setOpen(false)}
                  />
                )
              }
            >
              Editar
            </PrimaryButton>
          </div>
          <EmployeeInfoCard employee={employee} />
        </>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <SectionTitle>Acciones</SectionTitle>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {/* Cambiar contraseña */}
            <button
              className="
        w-full sm:w-auto
        flex items-center justify-center gap-2
        bg-purple-600 hover:bg-purple-700
        text-white
        px-4 py-2.5
        rounded-xl
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.97]
        shadow-md hover:shadow-lg
      "
            >
              <KeyIcon size={18} />
              Cambiar Contraseña
            </button>

            {/* Desactivar */}
            <button
              className="
        w-full sm:w-auto
        flex items-center justify-center gap-2
        bg-red-600 hover:bg-red-700
        text-white
        px-4 py-2.5
        rounded-xl
        text-sm font-medium
        transition-all duration-200
        active:scale-[0.97]
        shadow-md hover:shadow-lg
      "
            >
              <UserX size={18} />
              Desactivar
            </button>
          </div>
        </div>

        {/* TABS RESPONSIVE */}
        <div className="border-b border-gray-200">
          {/* MOBILE DROPDOWN */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="
        w-full
        mt-2
        px-4 py-2.5
        rounded-xl
        border border-gray-300
        bg-white
        text-sm font-medium
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-indigo-500
      "
            >
              {Object.entries(TABS).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* DESKTOP TABS */}
          <nav className="hidden sm:flex gap-6 min-w-max px-1">
            {Object.entries(TABS).map(([key, value]) => (
              <TabButton
                key={key}
                active={activeTab === value}
                onClick={() => setActiveTab(value)}
              >
                {value}
              </TabButton>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          {/* TRAINING */}
          {activeTab === TABS.TRAINING && (
            <>
              <Header
                title="Cursos"
                action={() =>
                  openCanvas(
                    'Agregar Curso',
                    <CourseAdd userId={id} author={user} />
                  )
                }
              />
              <CourseTable
                courses={courses}
                OnEdit={(element) => {
                  openCanvas(
                    `Editar`,
                    <CourseEdit item={element} OnClose={setOpen(false)} />
                  );
                }}
              />

              <Divider />

              <Header
                title="Certificaciones"
                action={() =>
                  openCanvas(
                    'Agregar Certificación',
                    <CertificationAdd userId={id} author={user} />
                  )
                }
              />
              <CertificationTable
                certifications={certifications}
                OnEdit={(element) => {
                  openCanvas(
                    'Editar Certificacion',
                    <CertificationEdit
                      item={element}
                      OnUpdate={setOpen(false)}
                    />
                  );
                }}
              />
            </>
          )}

          {/* SALARY */}
          {activeTab === TABS.SALARY && (
            <>
              <Header
                title="Salarios"
                action={() =>
                  openCanvas(
                    'Registrar Salario',
                    <SalaryAdd userId={id} author={user} />
                  )
                }
              />
              <SalaryTable salaries={salaries} />
            </>
          )}

          {/* ACTIONS */}
          {activeTab === TABS.ACTIONS && (
            <>
              <Header
                title="Acciones de Personal"
                action={() =>
                  openCanvas(
                    'Agregar Acción',
                    <ActionAdd userId={id} author={user} />
                  )
                }
              />
              <ActionTable
                actions={actions}
                OnEdit={(element) =>
                  openCanvas(
                    'Editar',
                    <ActionEdit action={element} OnEdited={setOpen(false)} />
                  )
                }
                OnSelect={(element) =>
                  openCanvas(
                    'Acción de Personal',
                    <ActionView action={element} />
                  )
                }
              />
            </>
          )}

          {/* EXTRAS */}
          {activeTab === TABS.EXTRAS && (
            <>
              <Header
                title="Horas Extras"
                action={() =>
                  openCanvas(
                    'Registrar ',
                    <ExtraAdd userId={id} author={user} />
                  )
                }
              />
              <ExtraTable
                extras={extras}
                onSelect={(element) =>
                  openCanvas('Ver', <ExtraView extra={element} />)
                }
              />
            </>
          )}

          {/* comissions */}
          {activeTab === TABS.COMISSIONS && (
            <>
              <Header
                title="Comisiones"
                action={() =>
                  openCanvas(
                    'Agregar Comision',
                    <ComissionAdd userId={id} author={user} />
                  )
                }
              />

              <ComissionTable comissions={comission} />
            </>
          )}

          {/* Awards */}
          {activeTab === TABS.AWARDS && (
            <>
              <Header
                title="Reconocimiento"
                action={() =>
                  openCanvas('Registrar ', <AddAward userId={id} />)
                }
              />
              <AwardTable awards={awards} />
            </>
          )}

          {/* Contactos */}
          {activeTab === TABS.CONTACTS && (
            <>
              <Header
                title="Contactos"
                action={() =>
                  openCanvas('Agregar', <ContactsEmergenciesAdd userId={id} />)
                }
              />
              <ContactsEmergencyTable items={contacts} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-3 text-sm font-medium border-b-2 transition
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

const Header = ({ title, action }) => (
  <div className="flex justify-between items-center mb-4">
    <SectionTitle>{title}</SectionTitle>
    {action && <PrimaryButton onClick={action}>Agregar</PrimaryButton>}
  </div>
);

const Divider = () => <hr className="my-6 border-gray-200" />;

export default ViewEmployeePage;
