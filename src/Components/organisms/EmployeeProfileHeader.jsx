import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Cake,
  CalendarDays,
  Clock,
  Fingerprint,
  Mail,
  MapPin,
  Camera,
  Download,
  Loader2,
  Pencil,
  Phone,
  Settings2,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';

import { useState } from 'react';
import toast from 'react-hot-toast';

import EmployeeAvatar from '../molecules/EmployeeAvatar';
import DropdownMenu from '../molecules/DropdownMenu';
import { useProfilePhoto } from '../../hooks/useProfilePhoto';
import { useProfileBackground } from '../../hooks/useProfileBackground';
import { formatMoney } from '../../utils/formatMoney';
import { descargarPerfilPdf } from '../../utils/perfilPdf';
import { mensajeDeError } from '../../utils/apiError';
import EmployeeApi from '../../api/employeesApi';

/* ------------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------------ */

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

const formatFecha = (v) => {
  const f = fechaValida(v);
  return f
    ? f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;
};

const aniosDesde = (v) => {
  const f = fechaValida(v);
  if (!f) return null;

  const hoy = new Date();
  let a = hoy.getFullYear() - f.getFullYear();
  const m = hoy.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) a--;
  return a >= 0 ? a : null;
};

/** Antigüedad legible: "3 años", "8 meses", "Este mes". */
const antiguedad = (v) => {
  const f = fechaValida(v);
  if (!f) return null;

  const a = aniosDesde(v);
  if (a >= 1) return `${a} ${a === 1 ? 'año' : 'años'}`;

  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - f.getFullYear()) * 12 + (hoy.getMonth() - f.getMonth());
  return meses >= 1 ? `${meses} ${meses === 1 ? 'mes' : 'meses'}` : 'Este mes';
};

const iniciales = (e) => {
  const n = `${e?.firstName?.[0] ?? ''}${e?.lastName?.[0] ?? ''}`.toUpperCase();
  if (n) return n;
  return (e?.userName || e?.email || '—').slice(0, 2).toUpperCase();
};

const nombreCompleto = (e) =>
  [e?.firstName, e?.middleName, e?.lastName, e?.secondLastName]
    .filter(Boolean)
    .join(' ')
    .trim();

/* ------------------------------------------------------------------
   Piezas
   ------------------------------------------------------------------ */

/** Métrica del expediente. */
const Metrica = ({ label, valor, detalle }) => (
  <div className="min-w-0">
    <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    <p className="truncate text-lg font-bold text-ink">{valor}</p>
    {detalle && <p className="truncate text-xs text-ink-muted">{detalle}</p>}
  </div>
);

/** Dato secundario, con su icono. */
const Dato = ({ icon: Icon, label, valor }) => (
  <div className="flex items-start gap-2.5">
    <Icon size={15} className="mt-0.5 shrink-0 text-ink-muted" />
    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="truncate text-sm font-medium text-ink">{valor}</p>
    </div>
  </div>
);

/* ------------------------------------------------------------------
   Componente
   ------------------------------------------------------------------ */

/**
 * Cabecera del expediente del colaborador.
 *
 * Sustituye al bloque anterior, que apilaba dos títulos, una foto genérica
 * traída de un CDN externo y una rejilla donde el correo salía dos veces y los
 * campos vacíos llenaban la pantalla de guiones.
 *
 * @param {object} employee
 * @param {Array}  [salaries]        Para mostrar el salario vigente.
 * @param {object} [conteos]         {cursos, certificaciones, acciones}
 * @param {() => void} [onEdit]
 */
const EmployeeProfileHeader = ({
  employee,
  salaries = [],
  conteos = {},
  onEdit,
  onEstadoCambiado,
}) => {
  const {
    url: fotoUrl,
    tieneFoto,
    subiendo,
    inputRef,
    elegirArchivo,
    alSeleccionar,
    quitar: quitarFoto,
  } = useProfilePhoto(employee?.id);

  const fondoUrl = useProfileBackground(employee?.id);
  const [trabajando, setTrabajando] = useState(false);

  /** Descarga el expediente como PDF. */
  const descargarPdf = async () => {
    setTrabajando(true);
    try {
      const archivo = await descargarPerfilPdf(employee, salaries, conteos);
      toast.success(`Descargado: ${archivo}`);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo generar el PDF.');
    } finally {
      setTrabajando(false);
    }
  };

  /** Activa o desactiva al colaborador. */
  const cambiarEstado = async () => {
    const desactivar = employee.isActive;

    const mensaje = desactivar
      ? 'Al desactivarlo dejará de aparecer en planillas y selectores, pero su historial se conserva. ¿Continuar?'
      : '¿Reactivar a este colaborador?';

    if (!window.confirm(mensaje)) return;

    setTrabajando(true);

    try {
      if (desactivar) {
        await EmployeeApi.deactivateEmployee(employee.id);
        toast.success('Colaborador desactivado');
      } else {
        await EmployeeApi.activateEmployee(employee.id);
        toast.success('Colaborador reactivado');
      }
      onEstadoCambiado?.();
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo cambiar el estado.'));
    } finally {
      setTrabajando(false);
    }
  };

  if (!employee?.id) {
    return (
      <div className="h-40 animate-pulse rounded-xl border border-stroke-soft bg-surface-alt" />
    );
  }

  const nombre = nombreCompleto(employee);
  const activo = Boolean(employee.isActive);

  // Salario vigente: el de fecha efectiva más reciente
  const salarioActual = [...salaries]
    .filter((s) => s?.salaryAmount)
    .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0];

  const ingreso = formatFecha(employee.hiredDate);
  const nacimiento = formatFecha(employee.birthDate);

  /* Solo los datos que existen; los vacíos se resumen abajo. */
  const secundarios = [
    employee.dni && {
      icon: Fingerprint,
      label: 'Cédula',
      valor: employee.dni,
    },
    employee.address && {
      icon: MapPin,
      label: 'Dirección',
      valor: employee.address,
    },
    ingreso && {
      icon: CalendarDays,
      label: 'Fecha de ingreso',
      valor: ingreso,
    },
    nacimiento && {
      icon: Cake,
      label: 'Nacimiento',
      valor: `${nacimiento}${aniosDesde(employee.birthDate) !== null ? ` · ${aniosDesde(employee.birthDate)} años` : ''}`,
    },
  ].filter(Boolean);

  const faltantes = [
    !employee.dni && 'cédula',
    !employee.address && 'dirección',
    !employee.journey && 'jornada',
    !ingreso && 'fecha de ingreso',
    !nacimiento && 'fecha de nacimiento',
    !employee.phoneNumber && 'teléfono',
  ].filter(Boolean);

  const contexto = [employee.departament?.name, employee.journey]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="space-y-4">
      <Link
        to="/manager/employees"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted
                   transition-colors hover:text-brand"
      >
        <ArrowLeft size={15} />
        Empleados
      </Link>

      <div className="overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm">
        {/* Portada: la imagen que el colaborador subió, o la banda de marca */}
        {fondoUrl ? (
          <div
            className="h-28 bg-cover bg-center sm:h-36"
            style={{ backgroundImage: `url(${fondoUrl})` }}
          />
        ) : (
          <div className="h-20 bg-linear-to-r from-brand to-accent sm:h-24" />
        )}

        <div className="p-6 pt-4">
        {/* ------------------------- Identidad ------------------------- */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-end gap-4">
            <button
              type="button"
              onClick={elegirArchivo}
              disabled={subiendo}
              title={tieneFoto ? 'Cambiar foto' : 'Subir foto'}
              aria-label={tieneFoto ? 'Cambiar foto' : 'Subir foto'}
              className="group relative -mt-16 shrink-0 rounded-full ring-4 ring-surface focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:-mt-20"
            >
              <EmployeeAvatar
                employee={employee}
                src={fotoUrl}
                size="xl"
                iniciales={iniciales(employee)}
              />

              <span className="pointer-events-none absolute inset-0 grid place-items-center
                               rounded-full bg-black/45 opacity-0 transition-opacity
                               group-hover:opacity-100">
                {subiendo ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  <Camera size={20} className="text-white" />
                )}
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={alSeleccionar}
              className="hidden"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={`truncate text-xl font-bold ${
                    nombre ? 'text-ink' : 'text-ink-muted'
                  }`}
                >
                  {nombre || 'Sin nombre registrado'}
                </h2>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5
                    text-xs font-semibold ${
                      activo
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      activo ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  {activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {contexto && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-secondary">
                  <Building2 size={14} className="shrink-0 text-ink-muted" />
                  {contexto}
                </p>
              )}

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                {employee.email && (
                  <a
                    href={`mailto:${employee.email}`}
                    className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-brand"
                  >
                    <Mail size={13} className="shrink-0" />
                    <span className="truncate">{employee.email}</span>
                  </a>
                )}

                {employee.phoneNumber && (
                  <a
                    href={`tel:${employee.phoneNumber}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
                  >
                    <Phone size={13} className="shrink-0" />
                    {employee.phoneNumber}
                  </a>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu
            label="Acciones"
            icon={Settings2}
            items={[
              {
                label: 'Editar información',
                icon: Pencil,
                onClick: onEdit,
                disabled: !onEdit,
              },
              {
                label: tieneFoto ? 'Cambiar foto' : 'Subir foto',
                icon: Camera,
                onClick: elegirArchivo,
                disabled: subiendo,
              },
              ...(tieneFoto
                ? [
                    {
                      label: 'Quitar foto',
                      icon: Trash2,
                      onClick: quitarFoto,
                      disabled: subiendo,
                    },
                  ]
                : []),
              {
                label: 'Descargar perfil en PDF',
                icon: Download,
                onClick: descargarPdf,
                disabled: trabajando,
                separador: true,
              },
              {
                label: employee.isActive
                  ? 'Desactivar colaborador'
                  : 'Reactivar colaborador',
                icon: employee.isActive ? UserX : UserCheck,
                onClick: cambiarEstado,
                disabled: trabajando,
                tono: employee.isActive ? 'danger' : 'default',
                separador: true,
              },
            ]}
          />
        </div>

        {/* ------------------------- Métricas -------------------------- */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-stroke-soft pt-5 sm:grid-cols-4">
          <Metrica
            label="Salario vigente"
            valor={
              salarioActual ? formatMoney(salarioActual.salaryAmount) : 'Sin registrar'
            }
            detalle={
              salarioActual
                ? `Desde ${formatFecha(salarioActual.effectiveDate) ?? '—'}`
                : 'No entra en planilla'
            }
          />

          <Metrica
            label="Antigüedad"
            valor={antiguedad(employee.hiredDate) ?? '—'}
            detalle={ingreso ? `Ingresó el ${ingreso}` : 'Sin fecha de ingreso'}
          />

          <Metrica
            label="Formación"
            valor={(conteos.cursos ?? 0) + (conteos.certificaciones ?? 0)}
            detalle={`${conteos.cursos ?? 0} cursos · ${conteos.certificaciones ?? 0} certificaciones`}
          />

          <Metrica
            label="Acciones de personal"
            valor={conteos.acciones ?? 0}
            detalle="Movimientos registrados"
          />
        </div>

        {/* ------------------------ Datos varios ----------------------- */}
        {secundarios.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-stroke-soft pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {secundarios.map((d) => (
              <Dato key={d.label} {...d} />
            ))}
          </div>
        )}

        {faltantes.length > 0 && (
          <p className="mt-4 flex items-start gap-2 border-t border-stroke-soft pt-4 text-sm text-ink-muted">
            <Clock size={14} className="mt-0.5 shrink-0" />
            <span>
              Faltan por completar:{' '}
              <span className="text-ink-secondary">{faltantes.join(', ')}</span>.
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="ml-2 font-semibold text-brand hover:underline"
                >
                  Completar
                </button>
              )}
            </span>
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileHeader;
