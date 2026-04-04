import { useEffect, useMemo, useState } from 'react';
import absencesApi from '../api/absencesApi';

const useAbsences = () => {
  const [absences, setAbsences] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  /* =========================
   * CANVAS
   * ========================= */
  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  const closeCanvas = () => setOpen(false);

  /* =========================
   * DATA
   * ========================= */
  const loadAbsences = async () => {
    try {
      const resp = await absencesApi.getAllAbsences();
      setAbsences(resp.data ?? []);
    } catch (err) {
      console.error('Error loading absences', err);
    }
  };

  useEffect(() => {
    loadAbsences();
  }, []);

  /* =========================
   * FILTER
   * ========================= */
  const filteredAbsences = useMemo(() => {
    if (!search.trim()) return absences;

    const q = search.toLowerCase();

    return absences.filter((a) =>
      [a.title, a.reason, a.createdBy, a.user?.firstName, a.user?.lastName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [absences, search]);

  /* =========================
   * STATS
   * ========================= */
  const stats = useMemo(() => {
    const total = absences.length;
    const approved = absences.filter((a) => a.status === 'approved').length;
    const pending = absences.filter((a) => a.status === 'pending').length;

    return { total, approved, pending };
  }, [absences]);

  /* =========================
   * ACTIONS
   * ========================= */
  const handleSelectAbsence = (absence, onOpenDetail) => {
    setSelectedAbsence(absence);

    if (onOpenDetail) {
      onOpenDetail(absence);
    }
  };

  return {
    // state
    absences,
    search,
    setSearch,
    view,
    setView,
    selectedAbsence,

    // canvas
    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,

    // computed
    filteredAbsences,
    stats,

    // actions
    handleSelectAbsence,
    reload: loadAbsences,
  };
};

export default useAbsences;
