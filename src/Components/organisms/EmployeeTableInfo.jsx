import { motion } from 'framer-motion';
import AvatarUpload from './AvatarUpload';
import {
  Cake,
  CalendarDays,
  Fingerprint,
  History,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserX,
} from 'lucide-react';

/* ------------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------------ */

/** Fecha utilizable, tolerando el viejo centinela 0001-01-01. */
const fechaValida = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) || fecha.getFullYear() < 1900
    ? null
    : fecha;
};

/** Fecha formateada, o `null` si no hay dato (no un guion). */
const formatDate = (valor) => {
  const fecha = fechaValida(valor);
  return fecha
    ? fecha.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;
};

/** Años completos transcurridos desde una fecha. */
const aniosDesde = (valor) => {
  const fecha = fechaValida(valor);
  if (!fecha) return null;

  const hoy = new Date();
  let anios = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) anios--;

  return anios >= 0 ? anios : null;
};

const textoAnios = (anios) =>
  anios === null ? null : `${anios} ${anios === 1 ? 'año' : 'años'}`;

/**
 * Iniciales del colaborador. Las cuentas creadas desde el registro público no
 * tienen nombre, así que se cae al usuario o al correo antes de rendirse.
 */
const getInitials = (employee) => {
  const desdeNombre =
    `${employee.firstName?.[0] ?? ''}${employee.lastName?.[0] ?? ''}`.toUpperCase();
  if (desdeNombre) return desdeNombre;

  const alterno = employee.userName || employee.email || '';
  return alterno.slice(0, 2).toUpperCase() || '—';
};

const nombreCompleto = (e) =>
  [e.firstName, e.middleName, e.lastName, e.secondLastName]
    .filter(Boolean)
    .join(' ')
    .trim();

/* ------------------------------------------------------------------
   Piezas
   ------------------------------------------------------------------ */

/** Skeleton mientras se carga el perfil. */
const InfoSkeleton = () => (
  <div className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 animate-pulse rounded-full bg-stroke-soft" />
      <div className="space-y-2">
        <div className="h-4 w-52 animate-pulse rounded bg-stroke-soft" />
        <div className="h-3 w-36 animate-pulse rounded bg-stroke-soft" />
        <div className="h-3 w-44 animate-pulse rounded bg-stroke-soft" />
      </div>
    </div>

    <div className="mt-5 space-y-2 border-t border-stroke-soft pt-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-full animate-pulse rounded bg-surface-alt"
        />
      ))}
    </div>
  </div>
);

/** Fila de datos: etiqueta a la izquierda, valor a la derecha. */
const Dato = ({ icon: Icon, label, value, extra }) => (
  <div className="flex items-baseline gap-3 py-2.5">
    <span className="flex w-44 shrink-0 items-center gap-2 text-sm text-ink-muted">
      <Icon size={14} className="shrink-0" />
      {label}
    </span>

    <span className="min-w-0 text-sm font-medium text-ink">
      {value}
      {extra && (
        <span className="ml-2 text-xs font-normal text-ink-muted">{extra}</span>
      )}
    </span>
  </div>
);

/* ------------------------------------------------------------------
   Componente
   ------------------------------------------------------------------ */

/**
 * Ficha del colaborador.
 *
 * Cabecera compacta (sin banner de color) y lista con **solo los campos que
 * tienen dato**; lo que falta se resume en una línea al pie, para que la ficha
 * no se vea como una pared de guiones.
 *
 * @param {object} employee
 * @param {boolean} [loading]    Muestra el skeleton.
 * @param {() => void} [onEdit]  Si se pasa, el aviso de campos faltantes
 *                               ofrece un enlace para completarlos.
 * @param {boolean} [puedeEditarFoto] Permite cambiar la foto de perfil.
 * @param {string} [emptyTitle]
 * @param {string} [emptyHint]
 */
const EmployeeTableInfo = ({
  employee,
  loading = false,
  onEdit,
  puedeEditarFoto = false,
  emptyTitle = 'No hay información del empleado',
  emptyHint = 'Selecciona un empleado para ver sus datos',
}) => {
  if (loading) return <InfoSkeleton />;

  /* Sólo se considera vacío cuando no llegó el registro. Un colaborador sin
     `firstName` (creado desde el registro público) sí tiene qué mostrar. */
  const sinDatos = !employee || Object.keys(employee).length === 0;

  if (sinDatos) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl
                   border border-dashed border-stroke bg-surface p-8 text-ink-muted"
      >
        <UserX size={40} className="mb-3 text-ink-muted" />
        <p className="font-medium">{emptyTitle}</p>
        <p className="text-sm">{emptyHint}</p>
      </motion.div>
    );
  }

  const nombre = nombreCompleto(employee);
  const activo = Boolean(employee.isActive);

  const ingreso = formatDate(employee.hiredDate);
  const nacimiento = formatDate(employee.birthDate);
  const ultimaEdicion = formatDate(employee.lastEditedDate);

  /* Solo se listan los campos con dato. */
  const datos = [
    employee.dni && {
      icon: Fingerprint,
      label: 'Cédula',
      value: employee.dni,
    },
    employee.address && {
      icon: MapPin,
      label: 'Dirección',
      value: employee.address,
    },
    ingreso && {
      icon: CalendarDays,
      label: 'Fecha de ingreso',
      value: ingreso,
      extra: textoAnios(aniosDesde(employee.hiredDate)),
    },
    nacimiento && {
      icon: Cake,
      label: 'Fecha de nacimiento',
      value: nacimiento,
      extra: textoAnios(aniosDesde(employee.birthDate)),
    },
    ultimaEdicion && {
      icon: History,
      label: 'Última edición',
      value: ultimaEdicion,
    },
  ].filter(Boolean);

  /* …y lo que falta se resume al pie, en una sola línea. */
  const faltantes = [
    !nombre && 'nombre',
    !employee.dni && 'cédula',
    !employee.phoneNumber && 'teléfono',
    !employee.address && 'dirección',
    !nacimiento && 'fecha de nacimiento',
    !employee.departament?.name && 'departamento',
    !employee.journey && 'jornada',
    !ingreso && 'fecha de ingreso',
  ].filter(Boolean);

  /* Subtítulo: departamento y jornada, sin repetir el correo. */
  const contexto = [employee.departament?.name, employee.journey]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-stroke-soft bg-surface p-6 shadow-sm"
    >
      {/* ---------------------------- Identidad ---------------------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <AvatarUpload
            userId={employee.id}
            iniciales={getInitials(employee)}
            editable={puedeEditarFoto}
            size="md"
          />

          <div className="min-w-0">
            <h3
              className={`truncate text-lg font-semibold ${
                nombre ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              {nombre || 'Sin nombre registrado'}
            </h3>

            {contexto && (
              <p className="truncate text-sm text-ink-secondary">{contexto}</p>
            )}

            {/* Contacto enlazado; no se repite en la lista de abajo */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
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

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1
            text-xs font-semibold ${
              activo ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
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

      {/* ------------------------------ Datos ------------------------------ */}
      {datos.length > 0 && (
        <div className="mt-5 divide-y divide-stroke-soft border-t border-stroke-soft pt-1">
          {datos.map((d) => (
            <Dato key={d.label} {...d} />
          ))}
        </div>
      )}

      {/* --------------------------- Qué falta ----------------------------- */}
      {faltantes.length > 0 && (
        <p className="mt-4 border-t border-stroke-soft pt-4 text-sm text-ink-muted">
          Faltan por completar:{' '}
          <span className="text-ink-secondary">{faltantes.join(', ')}</span>.
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="ml-2 inline-flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              <Pencil size={13} />
              Completar
            </button>
          )}
        </p>
      )}
    </motion.div>
  );
};

export default EmployeeTableInfo;
