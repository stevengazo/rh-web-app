import { useCallback, useEffect, useMemo, useState } from 'react';

import EmployeeApi from '../api/employeesApi';
import actionApi from '../api/actionApi';
import extrasApi from '../api/extrasApi';
import absencesApi from '../api/absencesApi';
import DepartamentApi from '../api/departamentApi';
import payrollApi from '../api/payrollApi';
import loansApi from '../api/loansApi';
import salaryApi from '../api/salaryApi';

const MESES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

/** Acepta tanto la respuesta de Axios como el `.data` ya desenvuelto. */
const lista = (respuesta) => {
  const datos = respuesta?.data !== undefined ? respuesta.data : respuesta;
  return Array.isArray(datos) ? datos : [];
};

/** Estado efectivo, tolerando registros previos al campo `status`. */
const estadoRevision = (r) =>
  r?.status || (r?.approvedBy ? 'Aprobada' : 'Pendiente');

const estadoPrestamo = (l) => {
  const validos = ['Pendiente', 'Aprobado', 'Rechazado', 'Pagado'];
  if (validos.includes(l?.state)) return l.state;
  return l?.approvedBy ? 'Aprobado' : 'Pendiente';
};

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

/** Días naturales que abarca un rango, ambos extremos incluidos. */
const dias = (desde, hasta) => {
  const a = fechaValida(desde);
  const b = fechaValida(hasta) ?? a;
  if (!a || !b) return 0;
  const d = Math.floor((b - a) / 86400000) + 1;
  return d > 0 ? d : 0;
};

/**
 * Datos del panel de administración.
 *
 * Reúne en una sola carga lo que antes estaba disperso (empleados, acciones,
 * extras y ausencias) y añade lo que faltaba para que el panel sirva de algo:
 * masa salarial, planillas del periodo, préstamos por cobrar y, sobre todo,
 * **qué está esperando aprobación**.
 */
export const useManagerDashboard = (user) => {
  const [datos, setDatos] = useState({
    employees: [],
    actions: [],
    extras: [],
    absences: [],
    departaments: [],
    payrolls: [],
    loans: [],
    salaries: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);

    const fuentes = {
      employees: EmployeeApi.getAllEmployees(),
      actions: actionApi.getAllActions(),
      extras: extrasApi.getAllExtras(),
      absences: absencesApi.getAllAbsences(),
      departaments: DepartamentApi.getOrgChart(),
      payrolls: payrollApi.getAllPayrolls(),
      loans: loansApi.getAllsLoans(),
      salaries: salaryApi.getLatests(),
    };

    /* Cada fuente es independiente: si una falla, el resto del panel se
       muestra igual en vez de quedarse en blanco. */
    const resultados = await Promise.allSettled(Object.values(fuentes));
    const claves = Object.keys(fuentes);

    const siguiente = {};
    let fallos = 0;

    resultados.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        siguiente[claves[i]] = lista(r.value);
      } else {
        siguiente[claves[i]] = [];
        fallos++;
        console.error(`Dashboard: falló ${claves[i]}`, r.reason);
      }
    });

    setDatos(siguiente);
    if (fallos > 0) {
      setError(`No se pudieron cargar ${fallos} de ${claves.length} secciones.`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) cargar();
  }, [user, cargar]);

  /* ------------------------------------------------------------------
     Indicadores
     ------------------------------------------------------------------ */
  const resumen = useMemo(() => {
    const { employees, salaries, payrolls, loans, absences, actions, extras } = datos;

    const activos = employees.filter((e) => e.isActive && !e.deleted);
    const hoy = new Date();

    // Salario vigente por persona (el más reciente de cada una)
    const salarioPorUsuario = new Map();
    salaries.forEach((s) => {
      if (!s.userId) return;
      const actual = salarioPorUsuario.get(s.userId);
      if (!actual || new Date(s.effectiveDate) > new Date(actual.effectiveDate)) {
        salarioPorUsuario.set(s.userId, s);
      }
    });

    const masaSalarial = activos.reduce(
      (acc, e) => acc + (salarioPorUsuario.get(e.id)?.salaryAmount ?? 0),
      0
    );

    const sinSalario = activos.filter((e) => !salarioPorUsuario.has(e.id)).length;

    // Planillas
    const vivas = payrolls.filter((p) => (p.status ?? 'Borrador') !== 'Anulada');
    const ultimaPlanilla = vivas[0] ?? null; // el listado viene por id descendente
    const planillasBorrador = vivas.filter(
      (p) => (p.status ?? 'Borrador') === 'Borrador'
    ).length;

    // Préstamos
    const prestamosVigentes = loans.filter(
      (l) => estadoPrestamo(l) === 'Aprobado'
    );
    const saldoPrestamos = prestamosVigentes.reduce(
      (acc, l) => acc + (l.balance ?? 0),
      0
    );

    // Ausencias del mes en curso
    const ausenciasMes = absences.filter((a) => {
      const f = fechaValida(a.startDate);
      return (
        f && f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear()
      );
    });

    const diasAusenciaMes = ausenciasMes
      .filter((a) => estadoRevision(a) === 'Aprobada')
      .reduce((acc, a) => acc + dias(a.startDate, a.endDate), 0);

    // Lo que espera aprobación — el dato accionable del panel
    const pendientes = {
      acciones: actions.filter((a) => estadoRevision(a) === 'Pendiente').length,
      ausencias: absences.filter((a) => estadoRevision(a) === 'Pendiente').length,
      prestamos: loans.filter((l) => estadoPrestamo(l) === 'Pendiente').length,
      planillas: planillasBorrador,
    };
    pendientes.total =
      pendientes.acciones + pendientes.ausencias + pendientes.prestamos;

    return {
      activos: activos.length,
      inactivos: employees.length - activos.length,
      masaSalarial,
      salarioPromedio: activos.length ? masaSalarial / activos.length : 0,
      sinSalario,
      ultimaPlanilla,
      planillasBorrador,
      saldoPrestamos,
      prestamosVigentes: prestamosVigentes.length,
      ausenciasMes: ausenciasMes.length,
      diasAusenciaMes,
      pendientes,
      totalExtras: extras.length,
    };
  }, [datos]);

  /* ------------------------------------------------------------------
     Series para los gráficos
     ------------------------------------------------------------------ */

  /** Movimientos por mes: acciones, ausencias y extras. */
  const actividadMensual = useMemo(() => {
    const base = MESES.map((name) => ({
      name,
      acciones: 0,
      ausencias: 0,
      extras: 0,
    }));

    const sumar = (coleccion, campo, clave) => {
      coleccion.forEach((r) => {
        const f = fechaValida(r[campo]);
        if (f && f.getFullYear() === new Date().getFullYear()) {
          base[f.getMonth()][clave]++;
        }
      });
    };

    sumar(datos.actions, 'actionDate', 'acciones');
    sumar(datos.absences, 'startDate', 'ausencias');
    sumar(datos.extras, 'start', 'extras');

    return base;
  }, [datos]);

  /** Costo de las últimas planillas, de la más antigua a la más reciente. */
  const costoPlanillas = useMemo(() => {
    return datos.payrolls
      .filter((p) => (p.status ?? 'Borrador') !== 'Anulada')
      .slice(0, 8)
      .reverse()
      .map((p) => ({
        name: p.payrollDescription?.slice(0, 18) || `#${p.payrollId}`,
        neto: p.totalAmount ?? 0,
        bruto: p.totalGross ?? 0,
        deducciones: p.totalDeductions ?? 0,
        empleados: p.employeeCount ?? 0,
        estado: p.status ?? 'Borrador',
      }));
  }, [datos]);

  /** Personal por departamento, con su masa salarial. */
  const porDepartamento = useMemo(() => {
    return datos.departaments
      .filter((d) => (d.employeeCount ?? 0) > 0)
      .map((d) => ({ name: d.name, value: d.employeeCount }))
      .sort((a, b) => b.value - a.value);
  }, [datos]);

  /** Reparto por jornada. */
  const porJornada = useMemo(() => {
    const mapa = new Map();
    datos.employees
      .filter((e) => e.isActive && !e.deleted)
      .forEach((e) => {
        const j = e.journey || 'Sin definir';
        mapa.set(j, (mapa.get(j) ?? 0) + 1);
      });
    return [...mapa.entries()].map(([name, value]) => ({ name, value }));
  }, [datos]);

  /** Cumpleaños del mes en curso, ordenados por día. */
  const cumpleanosDelMes = useMemo(() => {
    const mes = new Date().getMonth();

    return datos.employees
      .filter((e) => e.isActive && !e.deleted)
      .map((e) => ({ empleado: e, fecha: fechaValida(e.birthDate) }))
      .filter(({ fecha }) => fecha && fecha.getMonth() === mes)
      .sort((a, b) => a.fecha.getDate() - b.fecha.getDate())
      .map(({ empleado, fecha }) => ({
        id: empleado.id,
        nombre:
          [empleado.firstName, empleado.lastName].filter(Boolean).join(' ') ||
          empleado.userName,
        dia: fecha.getDate(),
        departamento: empleado.departament?.name,
      }));
  }, [datos]);

  /** Quiénes cumplen años de empresa este mes. */
  const aniversarios = useMemo(() => {
    const mes = new Date().getMonth();
    const anioActual = new Date().getFullYear();

    return datos.employees
      .filter((e) => e.isActive && !e.deleted)
      .map((e) => ({ empleado: e, fecha: fechaValida(e.hiredDate) }))
      .filter(({ fecha }) => fecha && fecha.getMonth() === mes)
      .map(({ empleado, fecha }) => ({
        id: empleado.id,
        nombre:
          [empleado.firstName, empleado.lastName].filter(Boolean).join(' ') ||
          empleado.userName,
        dia: fecha.getDate(),
        anios: anioActual - fecha.getFullYear(),
      }))
      .filter((a) => a.anios > 0)
      .sort((a, b) => a.dia - b.dia);
  }, [datos]);

  return {
    loading,
    error,
    recargar: cargar,

    resumen,
    actividadMensual,
    costoPlanillas,
    porDepartamento,
    porJornada,
    cumpleanosDelMes,
    aniversarios,

    // datos crudos por si una vista los necesita
    datos,
  };
};

export default useManagerDashboard;
