import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import absencesApi from '../api/absencesApi';

/** Estados de una solicitud de ausencia. */
export const ABSENCE_STATUS = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
};

/**
 * Estado efectivo de una ausencia.
 *
 * Las creadas antes de que existiera `status` no lo traen; en ese caso se
 * deduce de `approvedBy`, igual que hace el backend.
 */
export const estadoDeAusencia = (a) => {
  if (a?.status) return a.status;
  return a?.approvedBy ? ABSENCE_STATUS.APPROVED : ABSENCE_STATUS.PENDING;
};

/** Días naturales que abarca la ausencia (ambos extremos incluidos). */
export const diasDeAusencia = (a) => {
  const inicio = new Date(a?.startDate);
  const fin = new Date(a?.endDate ?? a?.startDate);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return 0;

  const dias = Math.floor((fin - inicio) / 86400000) + 1;
  return dias > 0 ? dias : 0;
};

const mensajeError = (error, porDefecto) => {
  const data = error?.response?.data;
  return typeof data === 'string' && data ? data : porDefecto;
};

const useAbsences = ({ userName = '' } = {}) => {
  const [absences, setAbsences] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  const closeCanvas = () => setOpen(false);

  const loadAbsences = useCallback(async () => {
    setCargando(true);
    try {
      const resp = await absencesApi.getAllAbsences();
      const datos = Array.isArray(resp?.data) ? resp.data : [];
      setAbsences(datos.filter((a) => !a.deleted));
    } catch (err) {
      console.error('Error cargando ausencias', err);
      toast.error('No se pudieron cargar las ausencias');
      setAbsences([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    loadAbsences();
  }, [loadAbsences]);

  const filteredAbsences = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base =
      filtroEstado === 'Todas'
        ? absences
        : absences.filter((a) => estadoDeAusencia(a) === filtroEstado);

    if (!q) return base;

    return base.filter((a) =>
      [
        a.title,
        a.reason,
        a.createdBy,
        a.user?.firstName,
        a.user?.lastName,
        a.user?.userName,
      ]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(q))
    );
  }, [absences, search, filtroEstado]);

  /* Los contadores se calculaban con `a.status === 'approved'`, un valor en
     inglés y minúsculas que la API nunca devolvió: siempre daban cero. */
  const stats = useMemo(() => {
    const contar = (estado) =>
      absences.filter((a) => estadoDeAusencia(a) === estado).length;

    const aprobadas = absences.filter(
      (a) => estadoDeAusencia(a) === ABSENCE_STATUS.APPROVED
    );

    return {
      total: absences.length,
      approved: contar(ABSENCE_STATUS.APPROVED),
      pending: contar(ABSENCE_STATUS.PENDING),
      rejected: contar(ABSENCE_STATUS.REJECTED),
      diasAprobados: aprobadas.reduce((acc, a) => acc + diasDeAusencia(a), 0),
    };
  }, [absences]);

  const handleSelectAbsence = (absence, onOpenDetail) => {
    setSelectedAbsence(absence);
    onOpenDetail?.(absence);
  };

  /* ------------------------------------------------------------------
     Aprobación
     ------------------------------------------------------------------ */
  const ejecutar = async (fn, exito, errorPorDefecto) => {
    try {
      await fn();
      toast.success(exito);
      setOpen(false);
      await loadAbsences();
      return true;
    } catch (error) {
      console.error(error);
      toast.error(mensajeError(error, errorPorDefecto));
      return false;
    }
  };

  const approveAbsence = (a) =>
    ejecutar(
      () => absencesApi.approveAbsence(a.absenceId, userName),
      'Ausencia aprobada',
      'No se pudo aprobar la ausencia'
    );

  const rejectAbsence = (a) => {
    const motivo = window.prompt('Motivo del rechazo:');
    if (motivo === null) return Promise.resolve(false);

    if (!motivo.trim()) {
      toast.error('El motivo es obligatorio para rechazar.');
      return Promise.resolve(false);
    }

    return ejecutar(
      () => absencesApi.rejectAbsence(a.absenceId, motivo.trim(), userName),
      'Ausencia rechazada',
      'No se pudo rechazar la ausencia'
    );
  };

  const reopenAbsence = (a) =>
    ejecutar(
      () => absencesApi.reopenAbsence(a.absenceId, userName),
      'Ausencia devuelta a pendiente',
      'No se pudo reabrir la ausencia'
    );

  return {
    // estado
    absences,
    cargando,
    search,
    setSearch,
    view,
    setView,
    filtroEstado,
    setFiltroEstado,
    selectedAbsence,

    // drawer
    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,

    // derivados
    filteredAbsences,
    stats,

    // acciones
    handleSelectAbsence,
    approveAbsence,
    rejectAbsence,
    reopenAbsence,
    reload: loadAbsences,
  };
};

export default useAbsences;
