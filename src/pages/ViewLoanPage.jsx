import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Banknote,
  Check,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  Wallet,
} from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvas from '../Components/OffCanvas';
import PaymentAdd from '../Components/organisms/PaymentAdd';
import PaymentTable from '../Components/organisms/PaymentTable';
import LoanEdit from '../Components/organisms/LoanEdit';
import ReviewStatusBadge from '../Components/molecules/ReviewStatusBadge';
import HelpButton from '../Components/molecules/HelpButton';

import loansApi from '../api/loansApi';
import paymentApi from '../api/paymentsApi';
import { useAppContext } from '../context/AppContext';
import { formatMoney } from '../utils/formatMoney';
import { mensajeDeError } from '../utils/apiError';
import { useConfirm } from '../hooks/useConfirm';

import {
  LOAN_STATUS,
  estadoDePrestamo,
  saldoDePrestamo,
  progresoDePrestamo,
} from '../utils/loanStatus';

const formatDate = (fecha) => {
  if (!fecha || String(fecha).startsWith('0001-01-01')) return '—';
  const f = new Date(fecha);
  return Number.isNaN(f.getTime()) ? '—' : f.toLocaleDateString('es-CR');
};

const nombreDe = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() ||
  user?.userName ||
  user?.email ||
  'Sin nombre';

const Dato = ({ label, children }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    <p className="mt-0.5 text-sm font-medium text-ink">{children}</p>
  </div>
);

const ViewLoanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? '';
  const { confirm, dialog } = useConfirm();

  const [loan, setLoan] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [trabajando, setTrabajando] = useState(false);

  /* Un solo drawer para: registrar abono, editar abono y editar préstamo. */
  const [drawer, setDrawer] = useState(null); // 'abono' | 'prestamo' | null
  const [abonoSel, setAbonoSel] = useState(null);

  const cerrarDrawer = () => {
    setDrawer(null);
    setAbonoSel(null);
  };

  /* El detalle ya trae los abonos y el saldo calculados, así que una sola
     petición mantiene todo sincronizado. Antes se pedían por separado y la
     tabla se ocultaba tras el primer pago porque `loan.payments` no se
     refrescaba. */
  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const response = await loansApi.getLoansById(id);
      setLoan(response?.data ?? null);
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.status === 404
          ? 'El préstamo no existe o fue eliminado.'
          : 'No se pudo cargar el préstamo.'
      );
      setLoan(null);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejecutar = async (fn, exito, errorPorDefecto) => {
    setTrabajando(true);
    try {
      await fn();
      toast.success(exito);
      await cargar();
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, errorPorDefecto));
    } finally {
      setTrabajando(false);
    }
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-4">
        <div className="h-8 w-64 animate-pulse rounded bg-stroke-soft" />
        <div className="h-40 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-64 animate-pulse rounded-xl bg-surface-alt" />
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <AlertTriangle size={30} className="text-amber-600" />
          <p className="text-sm font-medium">{error ?? 'Préstamo no encontrado'}</p>
          <SecondaryButton onClick={() => navigate('/manager/loans')}>
            <ArrowLeft size={15} />
            Volver a préstamos
          </SecondaryButton>
        </div>
      </div>
    );
  }

  const estado = estadoDePrestamo(loan);
  const abonado = loan.paidAmount ?? 0;
  const saldo = saldoDePrestamo(loan);
  const progreso = progresoDePrestamo(loan);

  const puedeAbonar = estado === LOAN_STATUS.APPROVED;
  const pendiente = estado === LOAN_STATUS.PENDING;
  const puedeEditarAbonos =
    estado === LOAN_STATUS.APPROVED || estado === LOAN_STATUS.PAID;

  const aprobar = async () => {
    const ok = await confirm({
      title: `¿Aprobar el préstamo #${loan.loanId}?`,
      message: 'Entrará en cobro y admitirá abonos.',
      confirmLabel: 'Aprobar',
    });
    if (ok === false) return;

    ejecutar(
      () => loansApi.approveLoan(loan.loanId, quien),
      'Préstamo aprobado',
      'No se pudo aprobar el préstamo'
    );
  };

  const rechazar = async () => {
    const motivo = await confirm({
      title: `Rechazar el préstamo #${loan.loanId}`,
      message:
        'Se dejará constancia del motivo y se limpiará cualquier aprobación previa.',
      confirmLabel: 'Rechazar',
      tone: 'danger',
      requireReason: true,
      reasonLabel: 'Motivo del rechazo',
    });
    if (motivo === false) return;

    ejecutar(
      () => loansApi.rejectLoan(loan.loanId, motivo, quien),
      'Préstamo rechazado',
      'No se pudo rechazar el préstamo'
    );
  };

  const reabrir = async () => {
    const ok = await confirm({
      title: '¿Volver el préstamo a pendiente?',
      message: 'Se limpiarán los datos de aprobación o rechazo.',
      confirmLabel: 'Volver a pendiente',
    });
    if (ok === false) return;

    ejecutar(
      () => loansApi.reopenLoan(loan.loanId, quien),
      'Préstamo devuelto a pendiente',
      'No se pudo reabrir el préstamo'
    );
  };

  const saldar = async () => {
    const ok = await confirm({
      title: '¿Marcar el préstamo como pagado?',
      message: `Solo se permite si los abonos cubren ${formatMoney(loan.amount)}.`,
      confirmLabel: 'Marcar como pagado',
    });
    if (ok === false) return;

    ejecutar(
      () => loansApi.settleLoan(loan.loanId, quien),
      'Préstamo marcado como pagado',
      'No se pudo marcar como pagado'
    );
  };

  const eliminar = async () => {
    const ok = await confirm({
      title: `¿Eliminar el préstamo #${loan.loanId}?`,
      message: 'Se eliminarán también sus abonos registrados.',
      confirmLabel: 'Eliminar',
      tone: 'danger',
    });
    if (ok === false) return;

    ejecutar(
      async () => {
        await loansApi.deleteLoan(loan.loanId);
        navigate('/manager/loans');
      },
      'Préstamo eliminado',
      'No se pudo eliminar el préstamo'
    );
  };

  const eliminarAbono = async (abono) => {
    const ok = await confirm({
      title: '¿Eliminar este abono?',
      message: `Se quitará ${formatMoney(abono.amount)} del ${formatDate(
        abono.createdDate
      )}. Si el préstamo estaba saldado, volverá a Aprobado.`,
      confirmLabel: 'Eliminar',
      tone: 'danger',
    });
    if (ok === false) return;

    ejecutar(
      () => paymentApi.deletePayment(abono.paymentId, quien),
      'Abono eliminado',
      'No se pudo eliminar el abono'
    );
  };

  return (
    <>
      {dialog}

      <AnimatePresence>
        {drawer && (
          <OffCanvas
            isOpen={Boolean(drawer)}
            onClose={cerrarDrawer}
            title={
              drawer === 'prestamo'
                ? 'Editar préstamo'
                : abonoSel
                  ? 'Editar abono'
                  : 'Registrar abono'
            }
          >
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {drawer === 'prestamo' ? (
                <LoanEdit
                  loan={loan}
                  onSaved={() => {
                    cerrarDrawer();
                    cargar();
                  }}
                  onCancel={cerrarDrawer}
                />
              ) : (
                <PaymentAdd
                  loanId={loan.loanId}
                  saldo={saldo}
                  cuota={loan.monthlyFee}
                  payment={abonoSel ?? undefined}
                  onAdded={() => {
                    cerrarDrawer();
                    cargar();
                  }}
                  onCancel={cerrarDrawer}
                />
              )}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl space-y-6 p-4">
        {/* Encabezado */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/manager/loans')}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} />
            Volver a préstamos
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <PageTitle className="mb-0">
                Préstamo #{loan.loanId}
              </PageTitle>
              <ReviewStatusBadge status={estado} />
              <HelpButton area="prestamos" />
            </div>

            <SecondaryButton onClick={cargar} disabled={trabajando}>
              <RefreshCw size={15} />
              Actualizar
            </SecondaryButton>
          </div>

          <p className="mt-1 text-sm text-ink-muted">
            {loan.title || 'Sin título'} · {nombreDe(loan.user)}
          </p>
        </div>

        {/* Resumen económico */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Monto del préstamo
              </p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {formatMoney(loan.amount)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Abonado
              </p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                {formatMoney(abonado)}
              </p>
              <p className="text-xs text-ink-muted">
                {loan.paymentCount ?? 0} abono
                {loan.paymentCount === 1 ? '' : 's'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Saldo pendiente
              </p>
              <p className="mt-1 text-2xl font-bold text-ink">
                {formatMoney(saldo)}
              </p>
              {loan.paymentMonths > 0 && (
                <p className="text-xs text-ink-muted">
                  {loan.paymentMonths} cuotas de{' '}
                  {formatMoney(loan.monthlyFee ?? 0)}
                </p>
              )}
            </div>
          </div>

          {/* Barra de avance */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted">
              <span>Avance de pago</span>
              <span className="font-semibold text-ink">
                {progreso.toFixed(0)}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
              <div
                className="h-full rounded-full bg-linear-to-r from-brand to-accent transition-all"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* Motivo de rechazo */}
        {estado === LOAN_STATUS.REJECTED && loan.rejectionReason && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="mb-1 text-xs uppercase tracking-wide text-red-700">
              Motivo del rechazo
            </p>
            <p className="text-sm text-red-800">{loan.rejectionReason}</p>
            {loan.rejectedBy && (
              <p className="mt-1 text-xs text-red-700">
                Por {loan.rejectedBy} · {formatDate(loan.rejectedAt)}
              </p>
            )}
          </div>
        )}

        {/* Detalle */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <SectionTitle>Detalle del préstamo</SectionTitle>
          <Divider className="my-3" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Dato label="Colaborador">{nombreDe(loan.user)}</Dato>
            <Dato label="Plazo">{loan.paymentMonths || 0} meses</Dato>
            <Dato label="Fecha de solicitud">{formatDate(loan.requestAt)}</Dato>
            <Dato label="Registrado por">{loan.createdBy || '—'}</Dato>
            <Dato label="Creado el">{formatDate(loan.createdAt)}</Dato>
            <Dato label="Última actualización">
              {formatDate(loan.lastUpdatedAt)}
            </Dato>

            {estado === LOAN_STATUS.APPROVED || estado === LOAN_STATUS.PAID ? (
              <>
                <Dato label="Aprobado por">{loan.approvedBy || '—'}</Dato>
                <Dato label="Fecha de aprobación">
                  {formatDate(loan.approvedAt)}
                </Dato>
              </>
            ) : null}
          </div>

          <div className="mt-4">
            <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">
              Descripción
            </p>
            <p className="text-sm text-ink-secondary">
              {loan.description || 'Sin descripción'}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <SectionTitle>Acciones</SectionTitle>
          <Divider className="my-3" />

          <div className="flex flex-wrap gap-2">
            {pendiente && (
              <>
                <button
                  type="button"
                  onClick={aprobar}
                  disabled={trabajando}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-transparent
                             bg-green-600 px-3 text-sm font-semibold text-white transition-colors
                             hover:bg-green-700 disabled:opacity-60"
                >
                  <Check size={15} />
                  Aprobar préstamo
                </button>

                <SecondaryButton
                  onClick={() => setDrawer('prestamo')}
                  disabled={trabajando}
                >
                  <Pencil size={15} />
                  Editar préstamo
                </SecondaryButton>

                <button
                  type="button"
                  onClick={rechazar}
                  disabled={trabajando}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-stroke
                             bg-surface px-3 text-sm font-semibold text-ink-secondary transition-colors
                             hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                >
                  <Ban size={15} />
                  Rechazar
                </button>
              </>
            )}

            {estado === LOAN_STATUS.APPROVED && (
              <>
                <PrimaryButton
                  onClick={() => {
                    setAbonoSel(null);
                    setDrawer('abono');
                  }}
                  disabled={trabajando}
                >
                  <Plus size={15} />
                  Registrar abono
                </PrimaryButton>

                <SecondaryButton onClick={saldar} disabled={trabajando}>
                  <Wallet size={15} />
                  Marcar como pagado
                </SecondaryButton>
              </>
            )}

            {(estado === LOAN_STATUS.APPROVED ||
              estado === LOAN_STATUS.REJECTED) && (
              <SecondaryButton onClick={reabrir} disabled={trabajando}>
                <RotateCcw size={15} />
                Volver a pendiente
              </SecondaryButton>
            )}

            {/* Un préstamo saldado no se elimina: el backend lo rechaza porque
                forma parte del historial del colaborador. */}
            {estado !== LOAN_STATUS.PAID && (
              <button
                type="button"
                onClick={eliminar}
                disabled={trabajando}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-red-500
                           px-3 text-sm font-semibold text-red-600 transition-colors
                           hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 size={15} />
                Eliminar
              </button>
            )}
          </div>

          {estado === LOAN_STATUS.PAID && (
            <p className="mt-3 text-sm text-ink-muted">
              Este préstamo está saldado: no admite más abonos ni cambios de
              estado.
            </p>
          )}
        </div>

        {/* Abonos */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle className="mb-0">Abonos</SectionTitle>

            {puedeAbonar && (
              <PrimaryButton
                onClick={() => {
                  setAbonoSel(null);
                  setDrawer('abono');
                }}
              >
                <Plus size={15} />
                Registrar abono
              </PrimaryButton>
            )}
          </div>

          <Divider className="my-3" />

          {/* La tabla se muestra según los abonos reales, no según un campo
              que quedaba desactualizado tras registrar el primero. */}
          {loan.payments?.length > 0 ? (
            <PaymentTable
              payments={loan.payments}
              onEdit={
                puedeEditarAbonos
                  ? (abono) => {
                      setAbonoSel(abono);
                      setDrawer('abono');
                    }
                  : undefined
              }
              onDelete={puedeEditarAbonos ? eliminarAbono : undefined}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-10 text-ink-muted">
              <Banknote size={26} />
              <p className="text-sm">No hay abonos registrados.</p>
              {pendiente && (
                <p className="text-xs">
                  Aprueba el préstamo para poder registrar abonos.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewLoanPage;
