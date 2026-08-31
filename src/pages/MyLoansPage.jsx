import { useCallback, useEffect, useMemo, useState } from 'react';
import { Banknote, CalendarDays, Wallet } from 'lucide-react';

import { useAppContext } from '../context/AppContext';
import loansApi from '../api/loansApi';
import { formatMoney } from '../utils/formatMoney';

import PageTitle from '../Components/PageTitle';
import ReviewStatusBadge from '../Components/molecules/ReviewStatusBadge';
import PaymentTable from '../Components/organisms/PaymentTable';

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

const MyLoansPage = () => {
  const { user } = useAppContext();

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);

  const userId = user?.id;

  const cargar = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const resp = await loansApi.getLoansByUser(userId);
      setLoans(Array.isArray(resp?.data) ? resp.data : []);
    } catch (error) {
      console.error(error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /** Lo que el colaborador todavía debe, sumando solo préstamos vigentes. */
  const totales = useMemo(() => {
    const vigentes = loans.filter(
      (l) => estadoDePrestamo(l) === LOAN_STATUS.APPROVED
    );

    return {
      saldo: vigentes.reduce((acc, l) => acc + saldoDePrestamo(l), 0),
      cuotaMensual: vigentes.reduce((acc, l) => acc + (l.monthlyFee ?? 0), 0),
      vigentes: vigentes.length,
    };
  }, [loans]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-stroke-soft" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle className="mb-0">Mis préstamos</PageTitle>

      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-16 text-ink-muted">
          <Banknote size={30} />
          <p className="text-sm font-medium">No tienes préstamos registrados</p>
          <p className="text-xs">
            Si necesitas uno, solicítalo a Recursos Humanos.
          </p>
        </div>
      ) : (
        <>
          {/* Resumen */}
          {totales.vigentes > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Saldo total
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">
                  {formatMoney(totales.saldo)}
                </p>
              </div>

              <div className="rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Rebajo mensual
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">
                  {formatMoney(totales.cuotaMensual)}
                </p>
              </div>

              <div className="rounded-xl border border-stroke-soft bg-surface p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Préstamos vigentes
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">
                  {totales.vigentes}
                </p>
              </div>
            </div>
          )}

          {/* Listado */}
          <div className="space-y-4">
            {loans.map((loan) => {
              const estado = estadoDePrestamo(loan);
              const abonado = loan.paidAmount ?? 0;
              const saldo = saldoDePrestamo(loan);
              const progreso = progresoDePrestamo(loan);
              const abierto = expandido === loan.loanId;

              return (
                <article
                  key={loan.loanId}
                  className="rounded-xl border border-stroke-soft bg-surface p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold text-ink">
                        {loan.title || `Préstamo #${loan.loanId}`}
                      </h2>
                      <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <CalendarDays size={12} />
                        Solicitado el {formatDate(loan.requestAt)}
                      </p>
                    </div>

                    <ReviewStatusBadge status={estado} />
                  </div>

                  {loan.description && (
                    <p className="mt-2 text-sm text-ink-secondary">
                      {loan.description}
                    </p>
                  )}

                  {estado === LOAN_STATUS.REJECTED && loan.rejectionReason && (
                    <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                      <span className="font-semibold">Motivo:</span>{' '}
                      {loan.rejectionReason}
                    </p>
                  )}

                  {/* Cifras */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-ink-muted">Monto</p>
                      <p className="text-sm font-semibold text-ink">
                        {formatMoney(loan.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-muted">Abonado</p>
                      <p className="text-sm font-semibold text-green-700">
                        {formatMoney(abonado)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-muted">Saldo</p>
                      <p className="text-sm font-semibold text-ink">
                        {formatMoney(saldo)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-ink-muted">Cuota</p>
                      <p className="text-sm font-semibold text-ink">
                        {formatMoney(loan.monthlyFee ?? 0)}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {loan.paymentMonths || 0} meses
                      </p>
                    </div>
                  </div>

                  {/* Avance */}
                  {estado !== LOAN_STATUS.REJECTED && (
                    <div className="mt-4">
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
                  )}

                  {/* Abonos */}
                  {loan.payments?.length > 0 && (
                    <div className="mt-4 border-t border-stroke-soft pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandido(abierto ? null : loan.loanId)
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                      >
                        <Wallet size={14} />
                        {abierto ? 'Ocultar' : 'Ver'} mis {loan.payments.length}{' '}
                        abono{loan.payments.length === 1 ? '' : 's'}
                      </button>

                      {abierto && (
                        <div className="mt-3">
                          <PaymentTable payments={loan.payments} />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyLoansPage;
