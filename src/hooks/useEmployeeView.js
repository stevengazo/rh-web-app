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
import toast from 'react-hot-toast';

export const TABS = {
  TRAINING: 'Certificaciones',
  SALARY: 'Salarios',
  ACTIONS: 'Acciones',
  EXTRAS: 'Extras',
  COMISSIONS: 'Comisiones',
  AWARDS: 'Reconocimientos',
  CONTACTS: 'Contactos',
  FILES: 'Archivos',
};

const useEmployeeView = (id, open) => {
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

  const [employeePhoto, setEmployeePhoto] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

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
      const files = await FileApi.getByReference('Documents', id);

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

      if (res?.data && typeof res.data === 'object') {
        setEmployee(res.data);
      } else {
        setEmployee({});
      }
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

      if (Array.isArray(res?.data)) {
        setSalaries(res.data);
      } else {
        setSalaries([]);
      }
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

      if (Array.isArray(res?.data)) {
        setActions(res.data);
      } else {
        setActions([]);
      }
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

      if (Array.isArray(res?.data)) {
        setAwards(res.data);
      } else {
        setAwards([]);
      }
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

      if (Array.isArray(res?.data)) {
        setCertifications(res.data);
      } else {
        setCertifications([]);
      }
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

      if (Array.isArray(res?.data)) {
        setCourses(res.data);
      } else {
        setCourses([]);
      }
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

      if (Array.isArray(res?.data)) {
        setExtras(res.data);
      } else {
        setExtras([]);
      }
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

      if (Array.isArray(res?.data)) {
        setComission(res.data);
      } else {
        setComission([]);
      }
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

      if (Array.isArray(res?.data)) {
        setContacts(res.data);
      } else {
        setContacts([]);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setContacts([]);
      } else {
        console.error('Error contacts', err);
        toast.error('Error al cargar los contactos de emergencia');
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchFiles();
    fetchData();
  }, [id, open]);

  return {
    activeTab,
    employee,
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

    setActiveTab,
    setEmployee,

    refetch: () => {
      fetchFiles();
      fetchData();
    },
  };
};

export default useEmployeeView;