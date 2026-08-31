import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Banknote,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import loansApi from '../api/loansApi';
import { useAppContext } from '../context/AppContext';
import { formatMoney } from '../utils/formatMoney';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';

import LoansAdd from '../Components/organisms/LoansAdd';
import LoanEdit from '../Components/organisms/LoanEdit';
import OffCanvas from '../Components/OffCanvas';
import PageTitle from '../Components/PageTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import ReviewStatusBadge from '../Components/molecules/ReviewStatusBadge';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';

import { LOAN_STATUS, estadoDePrestamo } from '../utils/loanStatus';

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

const Indicador = ({ icon: Icon, label, valor, sublabel, accent, activo, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-3 rounded-xl border bg-surface p-4 text-left shadow-sm transition-all
      hover:-translate-y-0.5 hover:shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
      ${activo ? 'border-brand ring-1 ring-brand' : 'border-stroke-soft'}`}
  >
    <span className={`grid h-11 w-11 place-items-center rounded-lg ${accent}`}>
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="text-xl font-semibold leading-none text-ink">{valor}</p>
      <p className="mt-1 truncate text-sm text-ink-muted">{label}</p>
      {sublabel && (
        <p className="truncate text-xs text-ink-muted">{sublabel}</p>
      )}
    </div>
  </button>
);

const LoansPage = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? '';
  const { confirm, dialog } = useConfirm();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setIsCanvasOpen(true);
  };

  const closeCanvas = () => {
    setIsCanvasOpen(false);
    setCanvasContent(null);
  };

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loansApi.getAllsLoans();
      setLoans(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando préstamos', error);
      toast.error('No se pudieron cargar los préstamos');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const filteredLoans = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base =
      filtro === 'Todos'
        ? loans
        : loans.filter((l) => estadoDePrestamo(l) === filtro);

    if (!q) return base;

    return base.filter((loan) =>
      [
        String(loan.loanId ?? ''),
        loan.title,
        loan.description,
        loan.createdBy,
        nombreDe(loan.user),
        estadoDePrestamo(loan),
      ]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(q))
    );
  }, [loans, search, filtro]);

  /* Los contadores usaban `l.status === 'approved'`: el campo es `state` y sus
     valores están en español, así que siempre mostraban cero. */
  const stats = useMemo(() => {
    const contar = (estado) =>
      loans.filter((l) => estadoDePrestamo(l) === estado).length;

    const vigentes = loans.filter(
      (l) => estadoDePrestamo(l) === LOAN_STATUS.APPROVED
    );

    return {
      total: loans.length,
      pendientes: contar(LOAN_STATUS.PENDING),
      aprobados: contar(LOAN_STATUS.APPROVED),
      rechazados: contar(LOAN_STATUS.REJECTED),
      pagados: contar(LOAN_STATUS.PAID),
      saldoVigente: vigentes.reduce(
        (acc, l) => acc + (l.balance ?? l.amount ?? 0),
        0
      ),
      montoPendienteAprobar: loans
        .filter((l) => estadoDePrestamo(l) === LOAN_STATUS.PENDING)
        .reduce((acc, l) => acc + (l.amount ?? 0), 0),
    };
  }, [loans]);

  const ejecutar = async (fn, exito, errorPorDefecto) => {
    try {
      await fn();
      toast.success(exito);
      await fetchLoans();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, errorPorDefecto));
    }
  };

  const editar = (l) =>
    openCanvas(
      'Editar Préstamo',
      <LoanEdit
        loan={l}
        onSaved={() => {
          closeCanvas();
          fetchLoans();
        }}
        onCancel={closeCanvas}
      />
    );

  const aprobar = async (l) => {
    const ok = await confirm({
      title: `¿Aprobar el préstamo #${l.loanId}?`,
      message: 'Entrará en cobro y su saldo aparecerá en el listado.',
      confirmLabel: 'Aprobar',
    });
    if (ok === false) return;

    ejecutar(
      () => loansApi.approveLoan(l.loanId, quien),
      `Préstamo #${l.loanId} aprobado`,
      'No se pudo aprobar el préstamo'
    );
  };

  const rechazar = async (l) => {
    const motivo = await confirm({
      title: `Rechazar el préstamo #${l.loanId}`,
      message:
        'Se dejará constancia del motivo y se limpiará cualquier aprobación previa.',
      confirmLabel: 'Rechazar',
      tone: 'danger',
      requireReason: true,
      reasonLabel: 'Motivo del rechazo',
    });
    if (motivo === false) return;

    ejecutar(
      () => loansApi.rejectLoan(l.loanId, motivo, quien),
      `Préstamo #${l.loanId} rechazado`,
      'No se pudo rechazar el préstamo'
    );
  };

  const saldar = async (l) => {
    const ok = await confirm({
      title: `¿Marcar el préstamo #${l.loanId} como pagado?`,
      message: `Solo se permite si los abonos cubren ${formatMoney(l.amount)}.`,
      confirmLabel: 'Marcar como pagado',
    });
    if (ok === false) return;

    ejecutar(
      () => loansApi.settleLoan(l.loanId, quien),
      `Préstamo #${l.loanId} marcado como pagado`,
      'No se pudo marcar como pagado'
    );
  };

  const alternarFiltro = (estado) =>
    setFiltro((actual) => (actual === estado ? 'Todos' : estado));

  return (
    <>
      {dialog}

      <AnimatePresence>
        {isCanvasOpen && (
          <OffCanvas
            isOpen={isCanvasOpen}
            onClose={closeCanvas}
            title={canvasTitle}
          >
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PageTitle className="mb-0">Préstamos</PageTitle>
            <HelpButton area="prestamos" />
          </div>
          <p className="text-sm text-ink-muted">
            Solicitudes, aprobación y saldo pendiente por colaborador.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton onClick={fetchLoans} disabled={loading}>
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : undefined}
            />
            Actualizar
          </SecondaryButton>

          <PrimaryButton
            onClick={() =>
              openCanvas(
                'Agregar Préstamo',
                <LoansAdd
                  onCreated={() => {
                    closeCanvas();
                    fetchLoans();
                  }}
                />
              )
            }
          >
            <Plus size={16} />
            Agregar Préstamo
          </PrimaryButton>
        </div>
      </div>

      <Divider />

      {/* Indicadores · también filtran */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={Clock}
          label="Pendientes"
          valor={stats.pendientes}
          sublabel={`${formatMoney(stats.montoPendienteAprobar)} por aprobar`}
          accent="bg-amber-50 text-amber-700"
          activo={filtro === LOAN_STATUS.PENDING}
          onClick={() => alternarFiltro(LOAN_STATUS.PENDING)}
        />
        <Indicador
          icon={CheckCircle2}
          label="Aprobados"
          valor={stats.aprobados}
          sublabel={`${formatMoney(stats.saldoVigente)} por cobrar`}
          accent="bg-green-50 text-green-700"
          activo={filtro === LOAN_STATUS.APPROVED}
          onClick={() => alternarFiltro(LOAN_STATUS.APPROVED)}
        />
        <Indicador
          icon={Wallet}
          label="Pagados"
          valor={stats.pagados}
          accent="bg-brand-tint text-brand"
          activo={filtro === LOAN_STATUS.PAID}
          onClick={() => alternarFiltro(LOAN_STATUS.PAID)}
        />
        <Indicador
          icon={XCircle}
          label="Rechazados"
          valor={stats.rechazados}
          accent="bg-red-50 text-red-600"
          activo={filtro === LOAN_STATUS.REJECTED}
          onClick={() => alternarFiltro(LOAN_STATUS.REJECTED)}
        />
      </div>

      {/* Buscador */}
      <div className="relative mt-6 w-full md:max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          placeholder="Buscar por código, empleado, título o estado…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={fieldClasses({ className: 'h-10 pl-9' })}
        />
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-stroke-soft shadow-sm">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-surface-alt"
              />
            ))}
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 bg-surface py-16 text-ink-muted">
            <Banknote size={30} />
            <p className="text-sm font-medium">No hay préstamos que mostrar</p>
            {(search || filtro !== 'Todos') && (
              <p className="text-xs">Prueba quitando los filtros.</p>
            )}
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-surface-alt text-ink-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Colaborador
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Título
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Monto
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Abonado
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Saldo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stroke-soft bg-surface">
              {filteredLoans.map((loan) => {
                const estado = estadoDePrestamo(loan);
                const abonado = loan.paidAmount ?? 0;
                const saldo = loan.balance ?? (loan.amount ?? 0) - abonado;

                return (
                  <tr key={loan.loanId} className="transition hover:bg-canvas">
                    <td className="px-4 py-3 text-sm font-medium text-ink">
                      {loan.loanId}
                    </td>

                    <td className="px-4 py-3 text-sm text-ink-secondary">
                      {nombreDe(loan.user)}
                    </td>

                    <td className="px-4 py-3 text-sm text-ink-secondary">
                      {loan.title || '—'}
                      {loan.paymentMonths > 0 && (
                        <span className="block text-xs text-ink-muted">
                          {loan.paymentMonths} cuotas ·{' '}
                          {formatMoney(loan.monthlyFee ?? 0)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-ink">
                      {formatMoney(loan.amount)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-green-700">
                      {formatMoney(abonado)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm font-semibold text-ink">
                      {formatMoney(saldo)}
                    </td>

                    <td className="px-4 py-3">
                      <ReviewStatusBadge status={estado} />
                      {estado === LOAN_STATUS.REJECTED &&
                        loan.rejectionReason && (
                          <span className="mt-1 block max-w-40 truncate text-xs text-ink-muted">
                            {loan.rejectionReason}
                          </span>
                        )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/manager/loan/${loan.loanId}`)}
                          aria-label="Ver detalle"
                          title="Ver detalle y abonos"
                          className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-brand"
                        >
                          <Eye size={16} />
                        </button>

                        {estado === LOAN_STATUS.PENDING && (
                          <>
                            <button
                              type="button"
                              onClick={() => editar(loan)}
                              aria-label="Editar préstamo"
                              title="Editar"
                              className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-brand"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => aprobar(loan)}
                              aria-label="Aprobar préstamo"
                              title="Aprobar"
                              className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-green-50 hover:text-green-700"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => rechazar(loan)}
                              aria-label="Rechazar préstamo"
                              title="Rechazar"
                              className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {estado === LOAN_STATUS.APPROVED && (
                          <button
                            type="button"
                            onClick={() => saldar(loan)}
                            aria-label="Marcar como pagado"
                            title="Marcar como pagado"
                            className="grid h-8 w-8 place-items-center rounded-md text-ink-muted transition-colors hover:bg-brand-tint hover:text-brand"
                          >
                            <Wallet size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default LoansPage;
