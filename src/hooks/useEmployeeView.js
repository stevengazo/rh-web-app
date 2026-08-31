import { useEffect, useState } from 'react';

/* API */
import FileApi from '../api/FileApi';
import EmployeeApi from '../api/employeesApi';
import courseApi from '../api/courseApi';
import certificationApi from '../api/certificationApi';
import salaryApi from '../api/salaryApi';
import actionApi from '../api/actionApi';
import awardApi from '../api/awardsApi';
import extrasApi from '../api/extrasApi';
import comissionsApi from '../api/comissionsApi';
import ContactEmergencies from '../api/contactEmergenciesApi';
import VacationsApi from '../api/vacationsApi';
import absencesApi from '../api/absencesApi';
import loansApi from '../api/loansApi';
import psychometricAssignmentsApi from '../api/psychometricAssignmentsApi';
import Employee_PayrollApi from '../api/Employee_PayrollApi';
import { TABLA_DOCUMENTOS } from '../data/documentos';
import toast from 'react-hot-toast';

export const TABS = {
  TIMELINE: 'Historial',
  TRAINING: 'Formación',
  SALARY: 'Salarios',
  ACTIONS: 'Acciones',
  VACATIONS: 'Vacaciones',
  ABSENCES: 'Ausencias',
  EXTRAS: 'Extras',
  COMISSIONS: 'Comisiones',
  LOANS: 'Préstamos',
  PAYROLLS: 'Planillas',
  PSYCHOMETRICS: 'Psicometría',
  ORGCHART: 'Organigrama',
  AWARDS: 'Reconocimientos',
  CONTACTS: 'Contactos',
  FILES: 'Documentos',
};

/** Acepta la respuesta de Axios o el `.data` ya desenvuelto. */
const lista = (respuesta) => {
  const datos = respuesta?.data !== undefined ? respuesta.data : respuesta;
  return Array.isArray(datos) ? datos : [];
};

const useEmployeeView = (id, open) => {
  const [activeTab, setActiveTab] = useState(TABS.TIMELINE);

  const [employee, setEmployee] = useState({});
  const [courses, setCourses] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [actions, setActions] = useState([]);
  const [awards, setAwards] = useState([]);
  const [comission, setComission] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [extras, setExtras] = useState([]);

  const [employeePhoto, setEmployeePhoto] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

  // Añadidos para completar el expediente
  const [vacations, setVacations] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [loans, setLoans] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [psychometrics, setPsychometrics] = useState([]);

  /* =========================
     DELETE FILE
  ========================= */
  const handleDeleteFile = async (id) => {
    const confirm = window.confirm('¿Desea eliminar este archivo?');
    if (!confirm) return;

    try {
      await FileApi.delete(id);

      // Si es la foto principal
      if (employeePhoto && id === employeePhoto.fileModelId) {
        setEmployeePhoto(null);
      }

      /* La API devuelve `fileModelId`, no `id`: filtrar por `id` dejaba el
         archivo en pantalla hasta recargar la página. */
      setOtherFiles((prev) => prev.filter((f) => f.fileModelId !== id));

      toast.success('Archivo eliminado correctamente');
    } catch (err) {
      console.error('Error eliminando archivo', err);
      toast.error('No se pudo eliminar el archivo');
    }
  };

  /* =========================
     FETCH FILES
  ========================= */
  const fetchFiles = async () => {
    try {
      const allFiles = await FileApi.getByReference('Users', id);

      if (Array.isArray(allFiles) && allFiles.length > 0) {
        setEmployeePhoto(allFiles[0]);
      } else {
        setEmployeePhoto(null);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setEmployeePhoto(null);
      } else {
        console.error('Error cargando foto de usuario', err);
        toast.error('No se pudo cargar la foto del empleado');
      }
    }

    try {
      const files = await FileApi.getByReference(TABLA_DOCUMENTOS, id);

      if (Array.isArray(files)) {
        setOtherFiles(files);
      } else {
        setOtherFiles([]);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setOtherFiles([]);
      } else {
        console.error('Error cargando otros archivos', err);
        toast.error('No se pudieron cargar los archivos del empleado');
      }
    }
  };

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {
    try {
      const res = await EmployeeApi.getEmployeeById(id);
      setEmployee(res?.data && typeof res.data === 'object' ? res.data : {});
    } catch (err) {
      if (err?.response?.status === 404) {
        setEmployee({});
      } else {
        console.error('Error employee', err);
        toast.error('Error al cargar la información del empleado');
      }
    }

    try {
      const res = await salaryApi.getSalariesByUser(id);
      setSalaries(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setSalaries([]);
      } else {
        console.error('Error salaries', err);
        toast.error('Error al cargar los salarios');
      }
    }

    try {
      const res = await actionApi.getActionsByUser(id);
      setActions(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setActions([]);
      } else {
        console.error('Error actions', err);
        toast.error('Error al cargar las acciones');
      }
    }

    try {
      const res = await awardApi.getAwardsByUser(id);
      setAwards(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setAwards([]);
      } else {
        console.error('Error awards', err);
        toast.error('Error al cargar los reconocimientos');
      }
    }

    try {
      
      const res = await certificationApi.getCertificationsByUser(id);
      console.log("CERT;",res)
      setCertifications(Array.isArray(res) ? res : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setCertifications([]);
      } else {
        console.error('Error certifications', err);
        toast.error('Error al cargar las certificaciones');
      }
    }

    try {
      const res = await courseApi.getCoursesByUser(id);

      setCourses(Array.isArray(res) ? res : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setCourses([]);
      } else {
        console.error('Error courses', err);
        toast.error('Error al cargar los cursos');
      }
    }

    try {
      const res = await extrasApi.getExtrasByUser(id);
      setExtras(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setExtras([]);
      } else {
        console.error('Error extras', err);
        toast.error('Error al cargar los extras');
      }
    }

    try {
      const res = await comissionsApi.getComissionsByUser(id);
      setComission(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setComission([]);
      } else {
        console.error('Error comissions', err);
        toast.error('Error al cargar las comisiones');
      }
    }

    try {
      const res = await ContactEmergencies.getContactEmergenciesByUser(id);
    // console.log(res)
      setContacts(Array.isArray(res) ? res : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setContacts([]);
      } else {
        console.error('Error contacts', err);
        toast.error('Error al cargar los contactos de emergencia');
      }
    }
  };


  /* =========================
     FETCH EXPEDIENTE AMPLIADO
     Cada fuente es independiente: si una falla, las demás se muestran igual.
  ========================= */
  const fetchExpediente = async () => {
    const fuentes = [
      [VacationsApi.getVacationsByUser(id), setVacations],
      [absencesApi.getAbsencesByUser(id), setAbsences],
      [loansApi.getLoansByUser(id), setLoans],
      [Employee_PayrollApi.Search({ employeeId: id }), setPayrolls],
      [psychometricAssignmentsApi.getByUser(id), setPsychometrics],
    ];

    await Promise.all(
      fuentes.map(async ([promesa, asignar]) => {
        try {
          asignar(lista(await promesa));
        } catch (err) {
          // Un 404 sólo significa "sin registros"; no es un error que mostrar.
          if (err?.response?.status !== 404) {
            console.error('Error cargando sección del expediente', err);
          }
          asignar([]);
        }
      })
    );
  };

  useEffect(() => {
    if (!id) return;

    fetchFiles();
    fetchData();
    fetchExpediente();
  }, [id, open]);


  function DeleteUser(userId) {
    try {
      console.log('borrar', userId);
    } catch (error) {
      console.error(error);
    }
  }


  return {
    activeTab,
    employee,
    courses,
    certifications,
    salaries,
    actions,
    awards,
    handleDeleteFile,
    comission,
    contacts,
    extras,
    employeePhoto,
    otherFiles,
    vacations,
    absences,
    loans,
    payrolls,
    psychometrics,
    setActiveTab,
    setEmployee,

    /* Recarga sólo las secciones del expediente. Se usa tras aprobar o
       rechazar, donde volver a pedir todo el perfil sería un desperdicio. */
    refetchExpediente: fetchExpediente,

    refetch: () => {
      fetchFiles();
      fetchData();
      fetchExpediente();
    },
  };
};

export default useEmployeeView;
