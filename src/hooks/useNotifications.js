import { useCallback, useEffect, useMemo, useState } from 'react';

import actionApi from '../api/actionApi';
import absencesApi from '../api/absencesApi';
import VacationsApi from '../api/vacationsApi';
import loansApi from '../api/loansApi';
import certificationApi from '../api/certificationApi';
import payrollApi from '../api/payrollApi';

import { ABSENCE_STATUS, estadoDeAusencia } from './useAbsences';
import { ACTION_STATUS, estadoDeAccion } from '../Components/molecules/ActionStatusBadge';
import { PAYROLL_STATUS } from '../Components/molecules/PayrollStatusBadge';
import { LOAN_STATUS, estadoDePrestamo } from '../utils/loanStatus';
import { VACATION_STATUS, estadoDeVacacion } from '../utils/vacationStatus';
import { certificacionesPorAtender, textoVigencia } from '../utils/certificaciones';

/**
 * Notificaciones del panel administrativo.
 *
 * No hay tabla de notificaciones en la base: se **derivan** del estado actual
 * de los módulos —lo que está pendiente de aprobar, lo que está por vencer—.
 * La ventaja es que nunca quedan desincronizadas con la realidad; el precio
 * es que son avisos de "algo requiere atención", no un historial de sucesos.
 *
 * Lo leído se guarda en `localStorage` por usuario, así que marcar una
 * notificación como vista no la resucita al recargar.
 */

/** Cada 5 minutos: suficiente para un panel de gestión, sin martillear la API. */
const INTERVALO_MS = 5 * 60 * 1000;

const claveAlmacen = (usuario) => `rh:notificaciones-leidas:${usuario || 'anon'}`;

/** Notificaciones ya vistas por este usuario, o vacío si no se puede leer. */
const leerLeidas = (usuario) => {
  try {
    const guardado = localStorage.getItem(claveAlmacen(usuario));
    return new Set(guardado ? JSON.parse(guardado) : []);
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue sin persistir.
    return new Set();
  }
};

/** Acepta la respuesta de Axios o el `.data` ya desenvuelto. */
const lista = (respuesta) => {
  const datos = respuesta?.data !== undefined ? respuesta.data : respuesta;
  return Array.isArray(datos) ? datos : [];
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'un colaborador';

const formatFecha = (valor) => {
  if (!valor) return '';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? ''
    : f.toLocaleDateString('es-CR', { day: '2-digit', month: 'short' });
};

/** Lo más urgente primero: vencido, luego por vencer, luego por aprobar. */
const PESO = { alta: 0, media: 1, baja: 2 };

const useNotifications = ({ usuario = '', activo = true } = {}) => {
  const [datos, setDatos] = useState({
    acciones: [],
    ausencias: [],
    vacaciones: [],
    prestamos: [],
    certificaciones: [],
    planillas: [],
  });

  const [cargando, setCargando] = useState(true);

  /* El usuario viaja junto al conjunto para poder recargarlo al vuelo cuando
     cambia, sin un efecto que dispare un render extra. */
  const [almacen, setAlmacen] = useState(() => ({
    usuario,
    leidas: leerLeidas(usuario),
  }));

  if (almacen.usuario !== usuario) {
    setAlmacen({ usuario, leidas: leerLeidas(usuario) });
  }

  const leidas = almacen.leidas;

  /* ------------------------------------------------------------------
     Carga. Cada fuente es independiente: si una falla, el resto avisa igual.
     ------------------------------------------------------------------ */
  const cargar = useCallback(async () => {
    const fuentes = [
      ['acciones', actionApi.getAllActions()],
      ['ausencias', absencesApi.getAllAbsences()],
      ['vacaciones', VacationsApi.getAllVacations()],
      ['prestamos', loansApi.getAllsLoans()],
      ['certificaciones', certificationApi.getAllCertifications()],
      ['planillas', payrollApi.getAllPayrolls()],
    ];

    const resultados = await Promise.all(
      fuentes.map(async ([clave, promesa]) => {
        try {
          return [clave, lista(await promesa)];
        } catch (error) {
          // Un 404 solo significa "sin registros"; no es un fallo que reportar.
          if (error?.response?.status !== 404) {
            console.error(`No se pudo cargar ${clave} para notificaciones`, error);
          }
          return [clave, []];
        }
      })
    );

    setDatos(Object.fromEntries(resultados));
    setCargando(false);
  }, []);

  useEffect(() => {
    if (!activo) return undefined;

    cargar();

    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [activo, cargar]);

  /* ------------------------------------------------------------------
     Estado de lectura, persistido por usuario.
     ------------------------------------------------------------------ */
  const guardarLeidas = useCallback(
    (conjunto) => {
      setAlmacen({ usuario, leidas: conjunto });

      try {
        localStorage.setItem(
          claveAlmacen(usuario),
          JSON.stringify([...conjunto])
        );
      } catch {
        /* Sin almacenamiento la marca dura lo que dure la sesión. */
      }
    },
    [usuario]
  );

  /* ------------------------------------------------------------------
     Derivación de los avisos.
     ------------------------------------------------------------------ */
  const notificaciones = useMemo(() => {
    const avisos = [];

    const agregar = (aviso) => avisos.push(aviso);

    /* --- Aprobaciones pendientes ------------------------------------ */
    datos.acciones
      .filter((a) => estadoDeAccion(a) === ACTION_STATUS.PENDING)
      .forEach((a) =>
        agregar({
          id: `accion-${a.actionId}`,
          tipo: 'aprobacion',
          urgencia: 'baja',
          titulo: `${a.actionType?.name || 'Acción de personal'} por aprobar`,
          detalle: `${nombreDe(a.user)}${formatFecha(a.actionDate) ? ` · ${formatFecha(a.actionDate)}` : ''}`,
          fecha: a.actionDate ?? a.createdDate,
          ruta: '/manager/actions',
        })
      );

    datos.ausencias
      .filter((a) => estadoDeAusencia(a) === ABSENCE_STATUS.PENDING)
      .forEach((a) =>
        agregar({
          id: `ausencia-${a.absenceId}`,
          tipo: 'aprobacion',
          urgencia: 'baja',
          titulo: `${a.title || 'Ausencia'} por aprobar`,
          detalle: `${nombreDe(a.user)}${formatFecha(a.startDate) ? ` · desde ${formatFecha(a.startDate)}` : ''}`,
          fecha: a.startDate ?? a.createdAt,
          ruta: '/manager/absences',
        })
      );

    datos.vacaciones
      .filter((v) => estadoDeVacacion(v) === VACATION_STATUS.PENDING)
      .forEach((v) =>
        agregar({
          id: `vacacion-${v.vacationId}`,
          tipo: 'aprobacion',
          urgencia: 'baja',
          titulo: 'Vacaciones por aprobar',
          detalle: `${nombreDe(v.user)}${formatFecha(v.startDate) ? ` · desde ${formatFecha(v.startDate)}` : ''}`,
          fecha: v.startDate ?? v.createdAt,
          ruta: '/manager/absences',
        })
      );

    datos.prestamos
      .filter((l) => estadoDePrestamo(l) === LOAN_STATUS.PENDING)
      .forEach((l) =>
        agregar({
          id: `prestamo-${l.loanId}`,
          tipo: 'aprobacion',
          urgencia: 'baja',
          titulo: `${l.title || 'Préstamo'} por aprobar`,
          detalle: nombreDe(l.user),
          fecha: l.createdAt ?? l.date,
          ruta: '/manager/loans',
        })
      );

    /* --- Certificaciones vencidas o por vencer ---------------------- */
    certificacionesPorAtender(datos.certificaciones).forEach(
      ({ certificacion, estado, dias }) =>
        agregar({
          id: `certificacion-${certificacion.certificationId}`,
          tipo: 'vencimiento',
          urgencia: estado === 'vencida' ? 'alta' : 'media',
          titulo: certificacion.name || 'Certificación',
          detalle: `${nombreDe(certificacion.user)} · ${textoVigencia({ estado, dias })}`,
          fecha: certificacion.expirationDate,
          ruta: certificacion.userId
            ? `/manager/employees/${certificacion.userId}`
            : '/manager/employees',
        })
    );

    /* --- Planillas a medio camino ------------------------------------ */
    datos.planillas.forEach((p) => {
      const estado = p.status || PAYROLL_STATUS.DRAFT;

      if (estado === PAYROLL_STATUS.DRAFT) {
        agregar({
          id: `planilla-borrador-${p.payrollId}`,
          tipo: 'planilla',
          urgencia: 'media',
          titulo: 'Planilla en borrador',
          detalle: `${p.payrollDescription || `Planilla #${p.payrollId}`} · ${p.employeeCount ?? 0} personas`,
          fecha: p.finalDate ?? p.createdAt,
          ruta: `/manager/payroll/${p.payrollId}`,
        });
      }

      if (estado === PAYROLL_STATUS.APPROVED) {
        agregar({
          id: `planilla-aprobada-${p.payrollId}`,
          tipo: 'planilla',
          urgencia: 'media',
          titulo: 'Planilla aprobada sin pagar',
          detalle: p.payrollDescription || `Planilla #${p.payrollId}`,
          fecha: p.approvedAt ?? p.finalDate,
          ruta: `/manager/payroll/${p.payrollId}`,
        });
      }
    });

    return avisos.sort((a, b) => {
      const peso = PESO[a.urgencia] - PESO[b.urgencia];
      if (peso !== 0) return peso;
      return new Date(b.fecha ?? 0) - new Date(a.fecha ?? 0);
    });
  }, [datos]);

  const sinLeer = useMemo(
    () => notificaciones.filter((n) => !leidas.has(n.id)),
    [notificaciones, leidas]
  );

  const marcarLeida = useCallback(
    (id) => guardarLeidas(new Set([...leidas, id])),
    [leidas, guardarLeidas]
  );

  const marcarTodasLeidas = useCallback(
    () => guardarLeidas(new Set(notificaciones.map((n) => n.id))),
    [notificaciones, guardarLeidas]
  );

  const restablecer = useCallback(() => guardarLeidas(new Set()), [guardarLeidas]);

  return {
    notificaciones,
    sinLeer,
    cargando,
    leidas,
    marcarLeida,
    marcarTodasLeidas,
    restablecer,
    recargar: cargar,
  };
};

export default useNotifications;
