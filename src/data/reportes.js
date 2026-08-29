import EmployeeApi from '../api/employeesApi';
import payrollApi from '../api/payrollApi';
import absencesApi from '../api/absencesApi';
import VacationsApi from '../api/vacationsApi';
import extrasApi from '../api/extrasApi';
import loansApi from '../api/loansApi';
import actionApi from '../api/actionApi';
import certificationApi from '../api/certificationApi';

import { diasDeAusencia, estadoDeAusencia } from '../hooks/useAbsences';
import { estadoDePrestamo, saldoDePrestamo } from '../utils/loanStatus';
import { diasDeVacacion, estadoDeVacacion } from '../utils/vacationStatus';
import { textoVigencia, vigenciaCertificacion } from '../utils/certificaciones';

/**
 * Catálogo de reportes.
 *
 * Cada uno declara de dónde saca los datos, qué columnas tiene y cómo
 * transforma la respuesta del API en filas planas. Se declaran como datos y no
 * como componentes para que agregar un reporte sea añadir una entrada aquí, no
 * escribir otra pantalla.
 */

/** Acepta la respuesta de Axios o el `.data` ya desenvuelto. */
const lista = (r) => {
  const d = r?.data !== undefined ? r.data : r;
  return Array.isArray(d) ? d : [];
};

const nombreDe = (u) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim() ||
  u?.userName ||
  u?.email ||
  'Sin nombre';

const fecha = (v) => {
  if (!v || String(v).startsWith('0001-01-01')) return '';
  const f = new Date(v);
  return Number.isNaN(f.getTime()) ? '' : f.toLocaleDateString('es-CR');
};

export const REPORTES = [
  {
    id: 'planilla',
    nombre: 'Planillas emitidas',
    descripcion:
      'Periodos con su estado, cantidad de personas y totales. Para cerrar el mes y para contabilidad.',
    grupo: 'Compensación',
    columnas: [
      { clave: 'id', titulo: 'N.º' },
      { clave: 'descripcion', titulo: 'Descripción' },
      { clave: 'tipo', titulo: 'Tipo' },
      { clave: 'desde', titulo: 'Desde' },
      { clave: 'hasta', titulo: 'Hasta' },
      { clave: 'empleados', titulo: 'Empleados', numerico: true },
      { clave: 'bruto', titulo: 'Bruto', dinero: true },
      { clave: 'deducciones', titulo: 'Deducciones', dinero: true },
      { clave: 'neto', titulo: 'Neto', dinero: true },
      { clave: 'estado', titulo: 'Estado' },
    ],
    cargar: async () => {
      const filas = lista(await payrollApi.getAllPayrolls());

      return filas.map((p) => ({
        id: p.payrollId,
        descripcion: p.payrollDescription || `Planilla #${p.payrollId}`,
        tipo: p.payrollType ?? '',
        desde: fecha(p.initialDate),
        hasta: fecha(p.finalDate),
        empleados: p.employeeCount ?? 0,
        bruto: p.totalGross ?? 0,
        deducciones: p.totalDeductions ?? 0,
        neto: p.totalAmount ?? 0,
        estado: p.status || 'Borrador',
      }));
    },
  },

  {
    id: 'ausentismo',
    nombre: 'Ausencias',
    descripcion:
      'Todas las ausencias con sus días, si están justificadas y cuánto se rebajó.',
    grupo: 'Personal',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'titulo', titulo: 'Concepto' },
      { clave: 'desde', titulo: 'Desde' },
      { clave: 'hasta', titulo: 'Hasta' },
      { clave: 'dias', titulo: 'Días', numerico: true },
      { clave: 'justificada', titulo: 'Justificada' },
      { clave: 'monto', titulo: 'Rebajo', dinero: true },
      { clave: 'estado', titulo: 'Estado' },
    ],
    cargar: async () => {
      const filas = lista(await absencesApi.getAllAbsences());

      return filas.map((a) => ({
        colaborador: nombreDe(a.user),
        titulo: a.title || 'Ausencia',
        desde: fecha(a.startDate),
        hasta: fecha(a.endDate),
        dias: diasDeAusencia(a),
        justificada: a.justified ? 'Sí' : 'No',
        monto: a.amount ?? 0,
        estado: estadoDeAusencia(a),
      }));
    },
  },

  {
    id: 'vacaciones',
    nombre: 'Vacaciones',
    descripcion: 'Solicitudes con sus días y en qué punto de la aprobación van.',
    grupo: 'Personal',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'desde', titulo: 'Desde' },
      { clave: 'hasta', titulo: 'Hasta' },
      { clave: 'dias', titulo: 'Días', numerico: true },
      { clave: 'motivo', titulo: 'Motivo' },
      { clave: 'estado', titulo: 'Estado' },
      { clave: 'aprobadaPor', titulo: 'Aprobada por' },
    ],
    cargar: async () => {
      const filas = lista(await VacationsApi.getAllVacations());

      return filas.map((v) => ({
        colaborador: nombreDe(v.user),
        desde: fecha(v.startDate),
        hasta: fecha(v.endDate),
        dias: diasDeVacacion(v),
        motivo: v.reason ?? '',
        estado: estadoDeVacacion(v),
        aprobadaPor: v.approvedBy ?? '',
      }));
    },
  },

  {
    id: 'extras',
    nombre: 'Horas extra',
    descripcion:
      'Horas registradas, su recargo y si ya se liquidaron en alguna planilla.',
    grupo: 'Compensación',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'tipo', titulo: 'Tipo' },
      { clave: 'inicio', titulo: 'Inicio' },
      { clave: 'horas', titulo: 'Horas', numerico: true },
      { clave: 'monto', titulo: 'Monto', dinero: true },
      { clave: 'aprobada', titulo: 'Aprobada' },
      { clave: 'planilla', titulo: 'Liquidada en' },
    ],
    cargar: async () => {
      const filas = lista(await extrasApi.getAllExtras());

      return filas.map((e) => {
        const i = new Date(e.start);
        const f = new Date(e.end);
        const horas =
          Number.isNaN(i.getTime()) || Number.isNaN(f.getTime())
            ? 0
            : Math.max((f - i) / 3_600_000, 0);

        return {
          colaborador: nombreDe(e.user),
          tipo: e.extraType?.name ?? '',
          inicio: fecha(e.start),
          horas: Number(horas.toFixed(2)),
          monto: e.amount ?? 0,
          aprobada: e.isApproved ? 'Sí' : 'No',
          planilla: e.payrollId ? `#${e.payrollId}` : 'Pendiente',
        };
      });
    },
  },

  {
    id: 'prestamos',
    nombre: 'Préstamos',
    descripcion: 'Saldo pendiente y cuota mensual de cada préstamo.',
    grupo: 'Compensación',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'concepto', titulo: 'Concepto' },
      { clave: 'monto', titulo: 'Monto', dinero: true },
      { clave: 'abonado', titulo: 'Abonado', dinero: true },
      { clave: 'saldo', titulo: 'Saldo', dinero: true },
      { clave: 'cuota', titulo: 'Cuota', dinero: true },
      { clave: 'estado', titulo: 'Estado' },
    ],
    cargar: async () => {
      const filas = lista(await loansApi.getAllsLoans());

      return filas.map((l) => ({
        colaborador: nombreDe(l.user),
        concepto: l.title || `Préstamo #${l.loanId}`,
        monto: l.amount ?? 0,
        abonado: l.paidAmount ?? 0,
        saldo: saldoDePrestamo(l),
        cuota: l.monthlyFee ?? 0,
        estado: estadoDePrestamo(l),
      }));
    },
  },

  {
    id: 'acciones',
    nombre: 'Acciones de personal',
    descripcion: 'Ascensos, traslados y demás movimientos, con su aprobación.',
    grupo: 'Personal',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'tipo', titulo: 'Tipo' },
      { clave: 'fecha', titulo: 'Fecha' },
      { clave: 'descripcion', titulo: 'Descripción' },
      { clave: 'estado', titulo: 'Estado' },
      { clave: 'aprobadaPor', titulo: 'Aprobada por' },
    ],
    cargar: async () => {
      const filas = lista(await actionApi.getAllActions());

      return filas.map((a) => ({
        colaborador: nombreDe(a.user),
        tipo: a.actionType?.name ?? '',
        fecha: fecha(a.actionDate),
        descripcion: a.description ?? '',
        estado: a.status || 'Pendiente',
        aprobadaPor: a.approvedBy ?? '',
      }));
    },
  },

  {
    id: 'plantilla',
    nombre: 'Plantilla de personal',
    descripcion:
      'Todo el personal con su departamento, jornada y antigüedad. El punto de partida de casi cualquier análisis.',
    grupo: 'Personal',
    columnas: [
      { clave: 'nombre', titulo: 'Nombre' },
      { clave: 'cedula', titulo: 'Cédula' },
      { clave: 'correo', titulo: 'Correo' },
      { clave: 'departamento', titulo: 'Departamento' },
      { clave: 'jornada', titulo: 'Jornada' },
      { clave: 'ingreso', titulo: 'Ingreso' },
      { clave: 'antiguedad', titulo: 'Años', numerico: true },
      { clave: 'estado', titulo: 'Estado' },
    ],
    cargar: async () => {
      const filas = lista(await EmployeeApi.getAllEmployees()).filter(
        (e) => !e.deleted
      );

      return filas.map((e) => {
        const ingreso = e.hiredDate ? new Date(e.hiredDate) : null;
        const anios =
          ingreso && !Number.isNaN(ingreso.getTime())
            ? Number(
                ((Date.now() - ingreso.getTime()) / 31_536_000_000).toFixed(1)
              )
            : 0;

        return {
          nombre: nombreDe(e),
          cedula: e.dni ?? '',
          correo: e.email ?? '',
          departamento: e.departament?.name ?? '',
          jornada: e.journey ?? '',
          ingreso: fecha(e.hiredDate),
          antiguedad: anios,
          estado: e.isActive ? 'Activo' : 'Inactivo',
        };
      });
    },
  },

  {
    id: 'certificaciones',
    nombre: 'Vigencia de certificaciones',
    descripcion:
      'Certificaciones con su fecha de vencimiento y cuáles requieren atención.',
    grupo: 'Personal',
    columnas: [
      { clave: 'colaborador', titulo: 'Colaborador' },
      { clave: 'nombre', titulo: 'Certificación' },
      { clave: 'institucion', titulo: 'Institución' },
      { clave: 'emision', titulo: 'Emisión' },
      { clave: 'vence', titulo: 'Vence' },
      { clave: 'vigencia', titulo: 'Vigencia' },
    ],
    cargar: async () => {
      const filas = lista(await certificationApi.getAllCertifications());

      return filas.map((c) => ({
        colaborador: nombreDe(c.user),
        nombre: c.name ?? '',
        institucion: c.institution ?? '',
        emision: fecha(c.emissionDate),
        vence: fecha(c.expirationDate),
        vigencia: textoVigencia(vigenciaCertificacion(c)),
      }));
    },
  },
];

export const buscarReporte = (id) => REPORTES.find((r) => r.id === id) ?? null;

export default REPORTES;
