import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/* HOOKS */
import useEmployeeView, { TABS } from '../hooks/useEmployeeView';
import useOffCanvas from '../hooks/useOffCanvas.js';

/* COMPONENTS */
import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../Components/OffCanvas';
import ViewEmployeePhoto from '../Components/organisms/ViewEmployeePhoto';
import UploadImage from '../Components/organisms/UploadImage';

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

import CertificationEdit from '../Components/organisms/CertificationEdit';
import EmployeeInfoCard from '../Components/organisms/EmployeeInfoCard';
import ListFiles from '../Components/organisms/ListFiles';
import { KeyIcon, UserX } from 'lucide-react';
import UploadFile from '../Components/organisms/UploadFile';

const ViewEmployeePage = () => {
  const { id } = useParams();
  const { user } = useAppContext();

  const {
    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,
  } = useOffCanvas();

  const {
    activeTab,
    setActiveTab,
    employee,
    setEmployee,
    courses,
    certifications,
    salaries,
    actions,
    awards,
    comission,
    contacts,
    extras,
    employeePhoto,
    otherFiles,
  } = useEmployeeView(id, open);

  return (
    <>
      {/* OffCanvas */}
      <AnimatePresence>
        {open && (
          <OffCanvas isOpen={open} onClose={closeCanvas} title={canvasTitle}>
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Header title="Detalles del Empleado" />
          </div>

          <PrimaryButton
            className="self-start sm:self-auto"
            onClick={() =>
              openCanvas(
                'Editar Información',
                <EmployeeEdit
                  employee={employee}
                  setEmployee={setEmployee}
                  onClose={closeCanvas}
                />
              )
            }
          >
            Editar
          </PrimaryButton>
        </div>

        <div className="d-flex flex-row">
          <ViewEmployeePhoto
            img={employeePhoto?.filePath}
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border border-gray-200"
          />
          <EmployeeInfoCard employee={employee} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <SectionTitle>Acciones</SectionTitle>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] shadow-md hover:shadow-lg"
              onClick={() =>
                openCanvas(
                  'Agregar Imagen de Perfil',
                  <UploadImage userId={employee.id} />
                )
              }
            >
              Agregar Imagen
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] shadow-md hover:shadow-lg">
              <KeyIcon size={18} />
              Cambiar Contraseña
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] shadow-md hover:shadow-lg">
              <UserX size={18} />
              Desactivar
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="sm:hidden mt-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(TABS).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <nav className="hidden sm:flex gap-6 min-w-max px-1 mt-2">
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

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
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
                OnEdit={(e) =>
                  openCanvas(
                    'Editar',
                    <CourseEdit item={e} OnClose={closeCanvas} />
                  )
                }
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
                OnEdit={(e) =>
                  openCanvas(
                    'Editar Certificación',
                    <CertificationEdit
                      item={e}
                      OnUpdate={closeCanvas}
                    />
                  )
                }
              />
            </>
          )}

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
                OnEdit={(e) =>
                  openCanvas(
                    'Editar',
                    <ActionEdit action={e} OnEdited={closeCanvas} />
                  )
                }
                OnSelect={(e) =>
                  openCanvas('Acción de Personal', <ActionView action={e} />)
                }
              />
            </>
          )}

          {activeTab === TABS.EXTRAS && (
            <>
              <Header
                title="Horas Extras"
                action={() =>
                  openCanvas(
                    'Registrar',
                    <ExtraAdd userId={id} author={user} />
                  )
                }
              />
              <ExtraTable
                extras={extras}
                onSelect={(e) =>
                  openCanvas('Ver', <ExtraView extra={e} />)
                }
              />
            </>
          )}

          {activeTab === TABS.COMISSIONS && (
            <>
              <Header
                title="Comisiones"
                action={() =>
                  openCanvas(
                    'Agregar Comisión',
                    <ComissionAdd userId={id} author={user} />
                  )
                }
              />
              <ComissionTable comissions={comission} />
            </>
          )}

          {activeTab === TABS.AWARDS && (
            <>
              <Header
                title="Reconocimiento"
                action={() =>
                  openCanvas('Registrar', <AddAward userId={id} />)
                }
              />
              <AwardTable awards={awards} />
            </>
          )}

          {activeTab === TABS.CONTACTS && (
            <>
              <Header
                title="Contactos"
                action={() =>
                  openCanvas(
                    'Agregar',
                    <ContactsEmergenciesAdd userId={id} />
                  )
                }
              />
              <ContactsEmergencyTable items={contacts} />
            </>
          )}

          {activeTab === TABS.FILES && (
            <>
              <Header
                title="Archivos"
                action={() =>
                  openCanvas('Agregar', <UploadFile userId={id} />)
                }
              />
              <ListFiles files={otherFiles} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* Helpers */

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