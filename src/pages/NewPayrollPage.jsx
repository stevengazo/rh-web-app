import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Save,
  UserPlus,
  Users,
} from 'lucide-react';

import PageTitle from '../Components/PageTitle';
import SectionTitle from '../Components/SectionTitle';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import OffCanvasLarge from '../Components/OffCanvasLarge';
import PayrollRow from '../Components/atoms/PayrollRow';
import PayrollResumeTable from '../Components/organisms/PayrollResumeTable';
import PayrollAddEmployees from '../Components/organisms/PayrollAddEmployees';
import TablePayrollHeader from '../Components/molecules/tablePayrollHeader';
import PayrollStatusBadge from '../Components/molecules/PayrollStatusBadge';

import usePayrollData from '../hooks/usePayrollData';
import payrollApi from '../api/payrollApi';
import { useAppContext } from '../context/AppContext';
import { formatMoney } from '../utils/formatMoney';

const formatDate = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-CR') : '—';

const NewPayrollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const {
    employees,
    payroll,
    payrollByEmployee,
    payrollResume,
    availableEmployees,
    employeesWithoutSalary,
    loading,
    saving,
    dirty,
    readOnly,
    handleRowChange,
    handleSave,
    addEmployees,
    addAllAvailable,
    removeEmployee,
    reload,
  } = usePayrollData(id);

  const [pickerAbierto, setPickerAbierto] = useState(false);
  const [aprobando, setAprobando] = useState(false);

  const filas = Object.values(payrollByEmployee);
  const tipoPlanilla = payroll?.payrollType ?? '';

  // Avisa si se intenta cerrar la pestaña con cambios sin guardar
  useEffect(() => {
    if (!dirty) return;

    const avisar = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [dirty]);

  const salir = () => {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Salir de todos modos?'))
      return;
    navigate('/manager/payroll');
  };

  const aprobar = async () => {
    if (dirty) {
      toast.error('Guarda los cambios antes de aprobar.');
      return;
    }

    if (filas.length === 0) {
      toast.error('Agrega al menos un empleado.');
      return;
    }

    if (
      !window.confirm(
        `Se aprobará la planilla con ${filas.length} empleado(s) por ${formatMoney(payrollResume.totalToPay)}. Después no se podrá editar sin reabrirla. ¿Continuar?`
      )
    )
      return;

    setAprobando(true);

    try {
      await payrollApi.approvePayroll(id, user?.userName ?? user?.email ?? '');
      toast.success('Planilla aprobada');
      await reload();
    } catch (error) {
      const mensaje =
        error?.response?.data ?? 'No se pudo aprobar la planilla.';
      toast.error(typeof mensaje === 'string' ? mensaje : 'No se pudo aprobar.');
    } finally {
      setAprobando(false);
    }
  };

  const reabrir = async () => {
    setAprobando(true);
    try {
      await payrollApi.reopenPayroll(id, user?.userName ?? user?.email ?? '');
      toast.success('Planilla reabierta como borrador');
      await reload();
    } catch (error) {
      const mensaje = error?.response?.data ?? 'No se pudo reabrir.';
      toast.error(typeof mensaje === 'string' ? mensaje : 'No se pudo reabrir.');
    } finally {
      setAprobando(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-stroke-soft" />
        <div className="h-32 animate-pulse rounded-xl bg-surface-alt" />
        <div className="h-96 animate-pulse rounded-xl bg-surface-alt" />
      </div>
    );
  }

  return (
    <>
      {/* Selector de empleados */}
      <OffCanvasLarge
        isOpen={pickerAbierto}
        onClose={() => setPickerAbierto(false)}
        title="Agregar empleados a la planilla"
      >
        <PayrollAddEmployees
          employees={availableEmployees}
          onAdd={(ids) => {
            addEmployees(ids);
            toast.success(
              `${ids.length} empleado${ids.length === 1 ? '' : 's'} agregado${ids.length === 1 ? '' : 's'}`
            );
          }}
          onClose={() => setPickerAbierto(false)}
        />
      </OffCanvasLarge>

      <motion.div
        className="space-y-6 pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Encabezado */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={salir}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
            >
              <ArrowLeft size={15} />
              Volver a planillas
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <PageTitle className="mb-0">
                Planilla #{payroll?.payrollId ?? id}
              </PageTitle>
              <PayrollStatusBadge status={payroll?.status} />
            </div>

            <p className="mt-1 text-sm text-ink-muted">
              {payroll?.payrollDescription || 'Sin descripción'} ·{' '}
              {tipoPlanilla || 'Sin tipo'} · {formatDate(payroll?.initialDate)} –{' '}
              {formatDate(payroll?.finalDate)}
            </p>
          </div>
        </div>

        {/* Aviso: planilla congelada */}
        {readOnly && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-brand-tint p-4">
            <Lock size={18} className="shrink-0 text-brand-700" />
            <p className="flex-1 text-sm text-brand-700">
              Esta planilla está <strong>{payroll?.status}</strong>
              {payroll?.approvedBy ? ` por ${payroll.approvedBy}` : ''} y no
              admite cambios.
            </p>

            {payroll?.status === 'Aprobada' && (
              <SecondaryButton onClick={reabrir} disabled={aprobando}>
                {aprobando ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : null}
                Reabrir como borrador
              </SecondaryButton>
            )}
          </div>
        )}

        {/* Aviso: empleados sin salario */}
        {!readOnly && employeesWithoutSalary.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-800">
              {employeesWithoutSalary.length} empleado
              {employeesWithoutSalary.length === 1 ? '' : 's'} activo
              {employeesWithoutSalary.length === 1 ? '' : 's'} no aparece
              {employeesWithoutSalary.length === 1 ? '' : 'n'} porque no tiene
              salario vigente registrado:{' '}
              <span className="font-medium">
                {employeesWithoutSalary
                  .slice(0, 4)
                  .map((e) =>
                    [e.firstName, e.lastName].filter(Boolean).join(' ') ||
                    e.userName
                  )
                  .join(', ')}
                {employeesWithoutSalary.length > 4
                  ? ` y ${employeesWithoutSalary.length - 4} más`
                  : ''}
              </span>
              .
            </p>
          </div>
        )}

        {/* Barra de empleados */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stroke-soft bg-surface p-4">
          <div className="flex items-center gap-2 text-sm">
            <Users size={17} className="text-brand" />
            <span className="font-semibold text-ink">
              {filas.length} empleado{filas.length === 1 ? '' : 's'}
            </span>
            <span className="text-ink-muted">en esta planilla</span>

            {dirty && (
              <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                Cambios sin guardar
              </span>
            )}
          </div>

          {!readOnly && (
            <div className="flex flex-wrap gap-2">
              {availableEmployees.length > 0 && (
                <SecondaryButton onClick={addAllAvailable}>
                  Agregar los {availableEmployees.length} restantes
                </SecondaryButton>
              )}

              <PrimaryButton onClick={() => setPickerAbierto(true)}>
                <UserPlus size={16} />
                Agregar empleados
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Tabla */}
        {filas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stroke bg-surface-alt py-20 text-ink-muted">
            <Users size={34} />
            <p className="font-medium">Esta planilla no tiene empleados</p>
            <p className="max-w-sm text-center text-sm">
              Agrega a quienes se les va a pagar en este periodo. Puedes
              incorporarlos de golpe o uno por uno.
            </p>

            {!readOnly && (
              <PrimaryButton
                onClick={addAllAvailable}
                className="mt-2"
                disabled={availableEmployees.length === 0}
              >
                <UserPlus size={16} />
                Agregar los {availableEmployees.length} empleados activos
              </PrimaryButton>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-stroke-soft bg-surface shadow-sm">
            <div className="border-b border-stroke-soft px-5 py-3">
              <SectionTitle className="mb-0">
                Detalle por empleado
              </SectionTitle>
            </div>

            <div className="max-h-[65vh] overflow-auto scrollbar-slim">
              <table className="min-w-[2400px] border-collapse text-xs">
                <TablePayrollHeader conAcciones={!readOnly} />
                <tbody>
                  {filas.map((fila, index) => {
                    const empleado = employees.find(
                      (e) => e.id === fila.userId
                    ) ?? {
                      id: fila.userId,
                      firstName: 'Empleado',
                      lastName: '(no encontrado)',
                    };

                    return (
                      <PayrollRow
                        key={fila.userId ?? index}
                        employee={empleado}
                        PayrollData={fila}
                        onChanged={handleRowChange}
                        isStatic={readOnly}
                        typePayroll={tipoPlanilla}
                        StartDate={payroll?.initialDate}
                        EndDate={payroll?.finalDate}
                        onRemove={readOnly ? undefined : removeEmployee}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detalle + resumen */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
            <SectionTitle className="mb-1">Datos de la planilla</SectionTitle>

            {[
              ['Tipo', tipoPlanilla || '—'],
              ['Descripción', payroll?.payrollDescription || '—'],
              ['Fecha inicio', formatDate(payroll?.initialDate)],
              ['Fecha final', formatDate(payroll?.finalDate)],
              ['Empleados incluidos', filas.length],
              [
                'Creada',
                payroll?.createdAt ? formatDate(payroll.createdAt) : '—',
              ],
              ...(payroll?.approvedBy
                ? [
                    [
                      'Aprobada por',
                      `${payroll.approvedBy} · ${formatDate(payroll.approvedAt)}`,
                    ],
                  ]
                : []),
              ...(payroll?.paidBy
                ? [
                    [
                      'Pagada por',
                      `${payroll.paidBy} · ${formatDate(payroll.paidAt)}`,
                    ],
                  ]
                : []),
            ].map(([label, valor]) => (
              <div
                key={label}
                className="flex justify-between gap-4 text-sm text-ink-secondary"
              >
                <span className="font-medium">{label}:</span>
                <span className="text-right">{valor}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
            <SectionTitle>Resumen</SectionTitle>
            <PayrollResumeTable resume={payrollResume} />
          </div>
        </div>
      </motion.div>

      {/* Barra de acciones fija */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stroke-soft bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-full flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="text-sm">
            <span className="text-ink-muted">Total a pagar: </span>
            <span className="text-lg font-bold text-ink">
              {formatMoney(payrollResume.totalToPay)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={salir}>Cancelar</SecondaryButton>

            {!readOnly && (
              <>
                <PrimaryButton onClick={handleSave} disabled={saving || !dirty}>
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar planilla
                    </>
                  )}
                </PrimaryButton>

                {/* Botón propio en vez de PrimaryButton: sobrescribir su
                    `bg-brand` con una utilidad verde depende del orden del CSS
                    generado, que no es fiable. */}
                <button
                  type="button"
                  onClick={aprobar}
                  disabled={aprobando || saving || dirty || filas.length === 0}
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-transparent
                             bg-green-600 px-3 text-sm font-semibold text-white transition-colors
                             hover:bg-green-700 active:bg-green-800
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1
                             disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-ink-disabled"
                >
                  {aprobando ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Aprobar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPayrollPage;
