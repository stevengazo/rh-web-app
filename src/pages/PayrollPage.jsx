import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, Search } from 'lucide-react';

import SectionTitle from '../Components/SectionTitle';
import Divider from '../Components/Divider';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import PayrollListTable from '../Components/organisms/PayrollListTable';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import PayrollGenerate from '../Components/organisms/PayrollGenerate';
import { PAYROLL_STATUS } from '../Components/molecules/PayrollStatusBadge';
import { fieldClasses } from '../Components/atoms/fieldClasses';
import HelpButton from '../Components/molecules/HelpButton';

import payrollApi from '../api/payrollApi';
import { useAppContext } from '../context/AppContext';
import { formatMoney } from '../utils/formatMoney';

const FILTROS = [
  'Todas',
  PAYROLL_STATUS.DRAFT,
  PAYROLL_STATUS.APPROVED,
  PAYROLL_STATUS.PAID,
  PAYROLL_STATUS.VOIDED,
];

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Mensaje legible a partir del error de Axios. */
const mensajeError = (error, porDefecto) => {
  const data = error?.response?.data;
  return typeof data === 'string' && data ? data : porDefecto;
};

const PayrollPage = () => {
  const { user } = useAppContext();
  const quien = user?.userName ?? user?.email ?? '';

  const [payrolls, setPayrolls] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todas');

  const [open, setOpen] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const response = await payrollApi.getAllPayrolls();
      setPayrolls(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron cargar las planillas');
      setPayrolls([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /* Buscador. Antes usaba `number.parse`, importado de framer-motion, que no
     existe: escribir en el campo lanzaba una excepción. */
  const filtradas = useMemo(() => {
    const texto = search.trim().toLowerCase();

    return payrolls.filter((p) => {
      const estado = p.status ?? PAYROLL_STATUS.DRAFT;

      if (filtroEstado !== 'Todas' && estado !== filtroEstado) return false;
      if (!texto) return true;

      const campos = [
        String(p.payrollId ?? ''),
        p.payrollType ?? '',
        p.payrollDescription ?? '',
        estado,
      ]
        .join(' ')
        .toLowerCase();

      return campos.includes(texto);
    });
  }, [payrolls, search, filtroEstado]);

  /** Totales del listado filtrado, excluyendo las anuladas. */
  const totales = useMemo(() => {
    return filtradas
      .filter((p) => (p.status ?? PAYROLL_STATUS.DRAFT) !== PAYROLL_STATUS.VOIDED)
      .reduce(
        (acc, p) => {
          acc.neto += p.totalAmount ?? 0;
          acc.empleados += p.employeeCount ?? 0;
          return acc;
        },
        { neto: 0, empleados: 0 }
      );
  }, [filtradas]);

  /** Ejecuta una acción del ciclo de vida y refresca. */
  const ejecutar = async (accion, exito, errorPorDefecto) => {
    try {
      await accion();
      toast.success(exito);
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error(mensajeError(error, errorPorDefecto));
    }
  };

  const aprobar = (p) => {
    if (
      !window.confirm(
        `Aprobar la planilla #${p.payrollId} con ${p.employeeCount ?? 0} empleado(s) por ${formatMoney(p.totalAmount)}? Después no se podrá editar sin reabrirla.`
      )
    )
      return;

    ejecutar(
      () => payrollApi.approvePayroll(p.payrollId, quien),
      `Planilla #${p.payrollId} aprobada`,
      'No se pudo aprobar la planilla'
    );
  };

  const pagar = (p) => {
    if (
      !window.confirm(
        `Marcar como pagada la planilla #${p.payrollId} por ${formatMoney(p.totalAmount)}?`
      )
    )
      return;

    ejecutar(
      () => payrollApi.markPayrollPaid(p.payrollId, quien),
      `Planilla #${p.payrollId} marcada como pagada`,
      'No se pudo marcar como pagada'
    );
  };

  const reabrir = (p) => {
    if (
      !window.confirm(
        `Reabrir la planilla #${p.payrollId}? Volverá a borrador y se podrá editar.`
      )
    )
      return;

    ejecutar(
      () => payrollApi.reopenPayroll(p.payrollId, quien),
      `Planilla #${p.payrollId} reabierta`,
      'No se pudo reabrir la planilla'
    );
  };

  const anular = (p) => {
    const motivo = window.prompt(
      `Motivo por el que se anula la planilla #${p.payrollId}:`
    );
    if (motivo === null) return;

    if (!motivo.trim()) {
      toast.error('El motivo es obligatorio para anular.');
      return;
    }

    ejecutar(
      () => payrollApi.voidPayroll(p.payrollId, motivo.trim(), quien),
      `Planilla #${p.payrollId} anulada`,
      'No se pudo anular la planilla'
    );
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <OffCanvasLarge
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Generar Planilla"
          >
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              <PayrollGenerate onGenerated={() => setOpen(false)} />
            </motion.div>
          </OffCanvasLarge>
        )}
      </AnimatePresence>

      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2">
            <SectionTitle className="mb-0">Planilla de Empleados</SectionTitle>
            <HelpButton area="planilla" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Divider />
        </motion.div>

        {/* Buscador y acciones */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="relative w-full sm:w-96">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, tipo, descripción o estado…"
              className={fieldClasses({ className: 'h-10 pl-9' })}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={cargar} disabled={cargando}>
              <RefreshCw
                size={15}
                className={cargando ? 'animate-spin' : undefined}
              />
              Actualizar
            </SecondaryButton>

            <PrimaryButton onClick={() => setOpen(true)}>
              <Plus size={16} />
              Generar Nueva Planilla
            </PrimaryButton>
          </div>
        </motion.div>

        {/* Filtros por estado */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
          {FILTROS.map((estado) => {
            const activo = filtroEstado === estado;
            const cuenta =
              estado === 'Todas'
                ? payrolls.length
                : payrolls.filter(
                    (p) => (p.status ?? PAYROLL_STATUS.DRAFT) === estado
                  ).length;

            return (
              <button
                key={estado}
                type="button"
                onClick={() => setFiltroEstado(estado)}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors
                  ${
                    activo
                      ? 'border-brand bg-brand-tint text-brand-700'
                      : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
                  }`}
              >
                {estado}
                <span className="ml-1.5 text-xs opacity-70">{cuenta}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Totales */}
        {filtradas.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6 rounded-xl border border-stroke-soft bg-surface p-4"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Planillas
              </p>
              <p className="text-xl font-bold text-ink">{filtradas.length}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Registros de empleado
              </p>
              <p className="text-xl font-bold text-ink">{totales.empleados}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Neto acumulado
              </p>
              <p className="text-xl font-bold text-ink">
                {formatMoney(totales.neto)}
              </p>
              <p className="text-xs text-ink-muted">Sin contar anuladas</p>
            </div>
          </motion.div>
        )}

        {/* Tabla */}
        <motion.div variants={itemVariants}>
          {cargando ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-lg bg-surface-alt"
                />
              ))}
            </div>
          ) : (
            <PayrollListTable
              payrolls={filtradas}
              onApprove={aprobar}
              onPay={pagar}
              onReopen={reabrir}
              onVoid={anular}
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default PayrollPage;
