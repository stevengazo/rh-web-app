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
      if (allFiles.length > 0) {
        setEmployeePhoto(allFiles[0]);
      }
    } catch (err) {
      console.error('Error cargando foto de usuario', err);
    }

    try {
      const files = await FileApi.getByReference('Documents', id);
      setOtherFiles(files);
    } catch (err) {
      console.error('Error cargando otros archivos', err);
    }
  };

  /* =========================
     FETCH DATA
  ========================= */
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

  /* =========================
     EFFECT
  ========================= */
  useEffect(() => {
    if (!id) return;

    fetchFiles();
    fetchData();
  }, [id, open]);

  return {
    // state
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

    // setters
    setActiveTab,
    setEmployee,

    // utils (por si quieres refrescar manualmente)
    refetch: () => {
      fetchFiles();
      fetchData();
    },
  };
};

export default useEmployeeView;