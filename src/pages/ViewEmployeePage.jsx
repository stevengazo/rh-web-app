import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Banknote,
  Briefcase,
  CalendarDays,
  Clock,
  FolderOpen,
  GraduationCap,
  HandCoins,
  History,
  Percent,
  Plane,
  ReceiptText,
  Users,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

import VacationsApi from '../api/vacationsApi';
import absencesApi from '../api/absencesApi';
import actionApi from '../api/actionApi';
import { mensajeDeError } from '../utils/apiError';
import AiAssistPanel from '../Components/organisms/AiAssistPanel';
import { USO } from '../data/modelosIa';
import { SISTEMA, promptResumenExpediente } from '../data/promptsIa';

/* HOOKS */
import useEmployeeView, { TABS } from '../hooks/useEmployeeView';
import useOffCanvas from '../hooks/useOffCanvas.js';

/* COMPONENTS */
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import OffCanvas from '../Components/OffCanvas';
import EmployeeProfileHeader from '../Components/organisms/EmployeeProfileHeader';
import Tabs from '../Components/molecules/Tabs';
import RecordView from '../Components/organisms/RecordView';
import RecordAttachments from '../Components/organisms/RecordAttachments';

import EmployeeEdit from '../Components/organisms/EmployeeEdit';

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

import AddAward from '../Components/organisms/AddAward';
import AwardTable from '../Components/organisms/AwardTable';

import ComissionTable from '../Components/organisms/ComissionTable';
import ComissionAdd from '../Components/organisms/ComissionAdd';

import ExtraAdd from '../Components/organisms/ExtraAdd';
import ExtraTable from '../Components/organisms/ExtraTable';
import ExtraView from '../Components/organisms/ExtraView';

import CertificationEdit from '../Components/organisms/CertificationEdit';
import CertificationExpiryAlert from '../Components/organisms/CertificationExpiryAlert';

import EmployeeTimeline from '../Components/organisms/EmployeeTimeline';
import EmployeeDocuments from '../Components/organisms/EmployeeDocuments';
import EmployeeLoansPanel from '../Components/organisms/EmployeeLoansPanel';
import EmployeePayrollHistory from '../Components/organisms/EmployeePayrollHistory';

import VacationsAdd from '../Components/organisms/VacationsAdd';
import VacationsTable from '../Components/organisms/VacationsTable';

import AbsenceAdd from '../Components/organisms/AbsenceAdd';
import AbsenceTable from '../Components/organisms/AbsenceTable';
import AbsenceView from '../Components/organisms/AbsenceView';


/* Campos que muestra el visor de detalle según el tipo de registro. */
const FICHAS = {
  curso: (c) => ({
    titulo: c.name,
    subtitulo: c.institution,
    campos: [
      { label: 'Institución', valor: c.institution },
      { label: 'Modalidad', valor: c.modality },
      { label: 'Estado', valor: c.state },
      { label: 'Inicio', valor: c.start, tipo: 'fecha' },
      { label: 'Fin', valor: c.end, tipo: 'fecha' },
      { label: 'Duración', valor: c.durationInHours ? `${c.durationInHours} horas` : null },
      { label: 'Registrado por', valor: c.author },
      { label: 'Descripción', valor: c.description, ancho: 'completo' },
    ],
    extra: (
      <RecordAttachments
        tabla="Course"
        referenciaId={c.courseId}
        titulo="Certificado del curso"
      />
    ),
  }),

  certificacion: (c) => ({
    titulo: c.name,
    subtitulo: c.institution,
    campos: [
      { label: 'Institución', valor: c.institution },
      { label: 'Credencial', valor: c.credentialId },
      { label: 'Estado', valor: c.status },
      { label: 'Emisión', valor: c.emissionDate, tipo: 'fecha' },
      { label: 'Vence', valor: c.expirationDate, tipo: 'fecha' },
      { label: 'Registrado por', valor: c.createdBy },
      { label: 'Descripción', valor: c.description, ancho: 'completo' },
    ],
    extra: (
      <RecordAttachments
        tabla="Certification"
        referenciaId={c.certificationId}
        titulo="Documento de la certificación"
      />
    ),
  }),

  salario: (s) => ({
    titulo: 'Salario registrado',
    campos: [
      { label: 'Monto', valor: s.salaryAmount, tipo: 'dinero' },
      { label: 'Tipo', valor: s.type },
      { label: 'Moneda', valor: s.currency },
      { label: 'Vigente desde', valor: s.effectiveDate, tipo: 'fecha' },
      { label: 'Registrado por', valor: s.createdBy },
      { label: 'Registrado el', valor: s.createdAt, tipo: 'fecha' },
    ],
  }),

  comision: (c) => ({
    titulo: 'Comisión',
    campos: [
      { label: 'Monto', valor: c.amount, tipo: 'dinero' },
      { label: 'Fecha', valor: c.date, tipo: 'fecha' },
      { label: 'Borrador', valor: c.isDraft, tipo: 'booleano' },
      { label: 'Aprobada por', valor: c.approvedBy },
      { label: 'Registrada por', valor: c.createdBy },
      { label: 'Última edición', valor: c.lastEditedAt, tipo: 'fecha' },
      { label: 'Descripción', valor: c.description, ancho: 'completo' },
    ],
  }),

  reconocimiento: (a) => ({
    titulo: a.title,
    campos: [
      { label: 'Fecha', valor: a.createdAt, tipo: 'fecha' },
      { label: 'Otorgado por', valor: a.createdBy },
      { label: 'Descripción', valor: a.description, ancho: 'completo' },
    ],
  }),

  vacacion: (v) => ({
    titulo: 'Solicitud de vacaciones',
    subtitulo: v.status || (v.approvedBy ? 'Aprobada' : 'Pendiente'),
    campos: [
      { label: 'Desde', valor: v.startDate, tipo: 'fecha' },
      { label: 'Hasta', valor: v.endDate, tipo: 'fecha' },
      { label: 'Solicitada el', valor: v.createdAt, tipo: 'fecha' },
      { label: 'Aprobada por', valor: v.approvedBy },
      { label: 'Aprobada el', valor: v.approvedAt, tipo: 'fecha' },
      { label: 'Rechazada por', valor: v.rejectedBy },
      { label: 'Motivo del rechazo', valor: v.rejectionReason, ancho: 'completo' },
      { label: 'Motivo', valor: v.reason, ancho: 'completo' },
    ],
  }),

  contacto: (c) => ({
    titulo: c.name,
    subtitulo: c.relationship,
    campos: [
      { label: 'Teléfono', valor: c.phone },
      { label: 'Parentesco', valor: c.relationship },
    ],
  }),
};

const ViewEmployeePage = () => {
  const { id } = useParams();
  const { user } = useAppContext();

  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } =
    useOffCanvas();

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
    handleDeleteFile,
    DeleteUser,
    otherFiles,
    vacations,
    absences,
    loans,
    payrolls,
    refetch,
    refetchExpediente,
  } = useEmployeeView(id, open);

  const handleAdded = () => {
    refetch();
    closeCanvas();
  };

  /**
   * Ejecuta una revisión (aprobar/rechazar/reabrir) y refresca el expediente.
   * Vacaciones y ausencias comparten exactamente el mismo flujo, así que
   * comparten también el manejo de errores y avisos.
   */
  const revisar = async (operacion, exito, recargar = refetchExpediente) => {
    try {
      await operacion();
      toast.success(exito);
      await recargar();
      closeCanvas();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo completar la operación.'));
    }
  };

  /** Pide el motivo del rechazo, que el backend exige. */
  const pedirMotivo = () => {
    const motivo = window.prompt('Motivo del rechazo:');
    if (motivo === null) return null; // canceló
    if (!motivo.trim()) {
      toast.error('Debe indicar el motivo del rechazo.');
      return null;
    }
    return motivo.trim();
  };

  const vacacion = {
    aprobar: (v) =>
      revisar(
        () => VacationsApi.approveVacation(v.vacationId, user?.userName),
        'Vacaciones aprobadas'
      ),
    rechazar: (v) => {
      const motivo = pedirMotivo();
      if (!motivo) return;
      revisar(
        () => VacationsApi.rejectVacation(v.vacationId, motivo, user?.userName),
        'Solicitud rechazada'
      );
    },
    reabrir: (v) =>
      revisar(
        () => VacationsApi.reopenVacation(v.vacationId, user?.userName),
        'Solicitud devuelta a pendiente'
      ),
  };

  const accion = {
    aprobar: (a) =>
      revisar(
        () => actionApi.approveAction(a.actionId, user?.userName),
        'Acción aprobada',
        refetch
      ),
    rechazar: (a) => {
      const motivo = pedirMotivo();
      if (!motivo) return;
      revisar(
        () => actionApi.rejectAction(a.actionId, motivo, user?.userName),
        'Acción rechazada',
        refetch
      );
    },
    reabrir: (a) =>
      revisar(
        () => actionApi.reopenAction(a.actionId, user?.userName),
        'Acción devuelta a pendiente',
        refetch
      ),
  };

  const ausencia = {
    aprobar: (a) =>
      revisar(
        () => absencesApi.approveAbsence(a.absenceId, user?.userName),
        'Ausencia aprobada'
      ),
    rechazar: (a) => {
      const motivo = pedirMotivo();
      if (!motivo) return;
      revisar(
        () => absencesApi.rejectAbsence(a.absenceId, motivo, user?.userName),
        'Ausencia rechazada'
      );
    },
    reabrir: (a) =>
      revisar(
        () => absencesApi.reopenAbsence(a.absenceId, user?.userName),
        'Ausencia devuelta a pendiente'
      ),
  };

  /** Abre el panel de detalle con la ficha del tipo indicado. */
  const verDetalle = (tipo, registro) =>
    openCanvas('Detalle', <RecordView {...FICHAS[tipo](registro)} />);

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
        <EmployeeProfileHeader
          employee={employee}
          salaries={salaries}
          conteos={{
            cursos: courses.length,
            certificaciones: certifications.length,
            acciones: actions.length,
          }}
          onEstadoCambiado={refetch}
          onEdit={() =>
            openCanvas(
              'Editar Información',
              <EmployeeEdit
                employee={employee}
                setEmployee={setEmployee}
                onClose={closeCanvas}
              />
            )
          }
        />

        <Tabs
          idGrupo="expediente"
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { id: TABS.TIMELINE, label: 'Historial', icon: History },
            { id: TABS.TRAINING, label: 'Formación', icon: GraduationCap, count: courses.length + certifications.length },
            { id: TABS.SALARY, label: 'Salarios', icon: Banknote, count: salaries.length },
            { id: TABS.ACTIONS, label: 'Acciones', icon: Briefcase, count: actions.length },
            { id: TABS.VACATIONS, label: 'Vacaciones', icon: Plane, count: vacations.length },
            { id: TABS.ABSENCES, label: 'Ausencias', icon: CalendarDays, count: absences.length },
            { id: TABS.EXTRAS, label: 'Extras', icon: Clock, count: extras.length },
            { id: TABS.COMISSIONS, label: 'Comisiones', icon: Percent, count: comission.length },
            { id: TABS.LOANS, label: 'Préstamos', icon: HandCoins, count: loans.length },
            { id: TABS.PAYROLLS, label: 'Planillas', icon: ReceiptText, count: payrolls.length },
            { id: TABS.AWARDS, label: 'Reconocimientos', icon: Award, count: awards.length },
            { id: TABS.CONTACTS, label: 'Contactos', icon: Users, count: contacts.length },
            { id: TABS.FILES, label: 'Documentos', icon: FolderOpen, count: otherFiles.length },
          ]}
        />

        <div className="bg-surface rounded-xl border border-stroke-soft p-6 shadow-sm">
          {activeTab === TABS.TIMELINE && (
            <>
              <Header title="Historial del colaborador" />

              <div className="mb-5">
                <AiAssistPanel
                  uso={USO.RESUMEN_EXPEDIENTE}
                  titulo="Resumen del expediente"
                  descripcion="Pone al día sobre este colaborador en unas cuantas líneas."
                  sistema={SISTEMA.resumenExpediente}
                  construirPrompt={() =>
                    promptResumenExpediente({
                      empleado: employee,
                      acciones: actions,
                      salarios: salaries,
                      vacaciones: vacations,
                      ausencias: absences,
                      cursos: courses,
                      certificaciones: certifications,
                      reconocimientos: awards,
                    })
                  }
                />
              </div>

              <EmployeeTimeline
                employee={employee}
                actions={actions}
                salaries={salaries}
                vacations={vacations}
                absences={absences}
                extras={extras}
                comissions={comission}
                courses={courses}
                certifications={certifications}
                awards={awards}
              />
            </>
          )}

          {activeTab === TABS.TRAINING && (
            <>
              <Header
                title="Cursos"
                action={() =>
                  openCanvas(
                    'Agregar Curso',
                    <CourseAdd
                      userId={id}
                      author={user}
                      onAdded={handleAdded}
                    />
                  )
                }
              />
              <CourseTable
                courses={courses}
                onView={(e) => verDetalle('curso', e)}
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
                    <CertificationAdd
                      userId={id}
                      author={user}
                      onAdded={handleAdded}
                    />
                  )
                }
              />
              <CertificationExpiryAlert
                certifications={certifications}
                onVer={(c) => verDetalle('certificacion', c)}
              />

              <div className="mt-4">
                <CertificationTable
                  certifications={certifications}
                  onView={(e) => verDetalle('certificacion', e)}
                  OnEdit={(e) =>
                    openCanvas(
                      'Editar Certificación',
                      <CertificationEdit item={e} OnUpdate={closeCanvas} />
                    )
                  }
                />
              </div>
            </>
          )}

          {activeTab === TABS.SALARY && (
            <>
              <Header
                title="Salarios"
                action={() =>
                  openCanvas(
                    'Registrar Salario',
                    <SalaryAdd
                      userId={id}
                      author={user}
                      onAdded={handleAdded}
                    />
                  )
                }
              />
              <SalaryTable
                salaries={salaries}
                onView={(e) => verDetalle('salario', e)}
              />
            </>
          )}

          {activeTab === TABS.ACTIONS && (
            <>
              <Header
                title="Acciones de Personal"
                action={() =>
                  openCanvas(
                    'Agregar Acción',
                    <ActionAdd
                      userId={id}
                      author={user}
                      onAdded={handleAdded}
                    />
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
                  openCanvas(
                    'Acción de Personal',
                    <ActionView
                      action={e}
                      onApprove={accion.aprobar}
                      onReject={accion.rechazar}
                      onReopen={accion.reabrir}
                    />
                  )
                }
              />
            </>
          )}

          {activeTab === TABS.VACATIONS && (
            <>
              <Header
                title="Vacaciones"
                action={() =>
                  openCanvas(
                    'Solicitar Vacaciones',
                    <VacationsAdd userId={id} onAdded={handleAdded} />
                  )
                }
              />
              <VacationsTable
                vacations={vacations}
                onView={(v) => verDetalle('vacacion', v)}
                onApprove={vacacion.aprobar}
                onReject={vacacion.rechazar}
                onReopen={vacacion.reabrir}
              />
            </>
          )}

          {activeTab === TABS.ABSENCES && (
            <>
              <Header
                title="Ausencias"
                action={() =>
                  openCanvas(
                    'Registrar Ausencia',
                    <AbsenceAdd userId={id} onAdded={handleAdded} />
                  )
                }
              />
              <AbsenceTable
                items={absences}
                onSelect={(a) =>
                  openCanvas(
                    'Ausencia',
                    <AbsenceView
                      absence={a}
                      onApprove={ausencia.aprobar}
                      onReject={ausencia.rechazar}
                      onReopen={ausencia.reabrir}
                    />
                  )
                }
                onApprove={ausencia.aprobar}
                onReject={ausencia.rechazar}
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
                    <ExtraAdd userId={id} author={user} onAdded={handleAdded} />
                  )
                }
              />
              <ExtraTable
                extras={extras}
                onSelect={(e) => openCanvas('Ver', <ExtraView extra={e} />)}
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
                    <ComissionAdd
                      userId={id}
                      author={user}
                      onAdded={handleAdded}
                    />
                  )
                }
              />
              <ComissionTable
                comissions={comission}
                onView={(e) => verDetalle('comision', e)}
              />
            </>
          )}

          {activeTab === TABS.LOANS && (
            <>
              <Header title="Préstamos" />
              <EmployeeLoansPanel loans={loans} />
            </>
          )}

          {activeTab === TABS.PAYROLLS && (
            <>
              <Header title="Historial de planillas" />
              <EmployeePayrollHistory payrolls={payrolls} />
            </>
          )}

          {activeTab === TABS.AWARDS && (
            <>
              <Header
                title="Reconocimiento"
                action={() =>
                  openCanvas(
                    'Registrar',
                    <AddAward userId={id} onAdded={handleAdded} />
                  )
                }
              />
              <AwardTable
                awards={awards}
                onView={(e) => verDetalle('reconocimiento', e)}
              />
            </>
          )}

          {activeTab === TABS.CONTACTS && (
            <>
              <Header
                title="Contactos"
                action={() =>
                  openCanvas(
                    'Agregar',
                    <ContactsEmergenciesAdd userId={id} onAdded={handleAdded} />
                  )
                }
              />
              <ContactsEmergencyTable
                items={contacts}
                onView={(e) => verDetalle('contacto', e)}
              />
            </>
          )}

          {activeTab === TABS.FILES && (
            <>
              <Header title="Documentos del expediente" />

              <EmployeeDocuments
                userId={id}
                files={otherFiles}
                onChanged={refetch}
                onDelete={handleDeleteFile}
              />
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
          ? 'border-brand text-brand'
          : 'border-transparent text-ink-muted hover:text-ink hover:border-stroke'
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

const Divider = () => <hr className="my-6 border-stroke-soft" />;

export default ViewEmployeePage;
