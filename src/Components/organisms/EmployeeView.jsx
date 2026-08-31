import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Cake,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import PrimaryButton from '../PrimaryButton';
import EmployeeAvatar from '../molecules/EmployeeAvatar';
import { useProfileBackground } from '../../hooks/useProfileBackground';

/* ------------------------------------------------------------------
   Utilidades de presentación
   ------------------------------------------------------------------ */

/** Nombre completo con los cuatro campos que expone la API. */
const nombreCompleto = (e) =>
  [e?.firstName, e?.middleName, e?.lastName, e?.secondLastName]
    .filter(Boolean)
    .join(' ')
    .trim();

/**
 * Iniciales del colaborador. Si no hay nombre registrado (pasa con las
 * cuentas creadas desde el registro público) cae al usuario o al correo.
 */
const iniciales = (e) => {
  const desdeNombre = `${e?.firstName?.[0] ?? ''}${e?.lastName?.[0] ?? ''}`;
  if (desdeNombre) return desdeNombre.toUpperCase();

  const alterno = e?.userName || e?.email || '';
  return alterno.slice(0, 2).toUpperCase();
};

/** `DateTime` sin asignar llega como 0001-01-01: se trata como vacío. */
const fechaValida = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) || fecha.getFullYear() < 1900
    ? null
    : fecha;
};

const formatearFecha = (valor) => {
  const fecha = fechaValida(valor);
  return fecha
    ? fecha.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'long',
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

/** Antigüedad en texto legible ("3 años", "8 meses", "Este mes"). */
const antiguedad = (valor) => {
  const fecha = fechaValida(valor);
  if (!fecha) return null;

  const anios = aniosDesde(valor);
  if (anios >= 1) return `${anios} ${anios === 1 ? 'año' : 'años'}`;

  const hoy = new Date();
  const meses =
    (hoy.getFullYear() - fecha.getFullYear()) * 12 +
    (hoy.getMonth() - fecha.getMonth());

  if (meses >= 1) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  return 'Este mes';
};

/* ------------------------------------------------------------------
   Piezas de la ficha
   ------------------------------------------------------------------ */

/** Fila de dato: icono, etiqueta y valor (o "No registrado"). */
const Dato = ({ icon: Icon, label, valor, href, sufijo }) => {
  const vacio = valor === null || valor === undefined || valor === '';

  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-canvas text-ink-muted">
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {label}
        </p>

        {vacio ? (
          <p className="text-sm italic text-ink-disabled">No registrado</p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-ink">
            {href ? (
              <a
                href={href}
                className="break-all text-brand transition-colors hover:underline"
              >
                {valor}
              </a>
            ) : (
              <span className="wrap-break-word">{valor}</span>
            )}

            {sufijo && (
              <span className="text-xs font-normal text-ink-muted">
                {sufijo}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

/** Bloque agrupador de datos. */
const Seccion = ({ titulo, children }) => (
  <section>
    <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-brand">
      {titulo}
    </h3>
    <div className="divide-y divide-stroke-soft">{children}</div>
  </section>
);

/* ------------------------------------------------------------------
   Componente
   ------------------------------------------------------------------ */

const EmployeeView = ({ employee, fotoUrl }) => {
  const navigate = useNavigate();
  const fondoUrl = useProfileBackground(employee?.id);

  if (!employee) {
    return (
      <p className="py-10 text-center text-sm text-ink-muted">
        No hay información del colaborador.
      </p>
    );
  }

  const nombre = nombreCompleto(employee);
  const activo = Boolean(employee.isActive);
  const departamento = employee?.departament?.name;
  const tiempoEnEmpresa = antiguedad(employee.hiredDate);
  const edad = aniosDesde(employee.birthDate);

  return (
    /* Se sale del padding del OffCanvas para que la cabecera sea a sangre */
    <div className="-mx-5 -mt-4 flex min-h-full flex-col">
      {/* ---------------------------- Cabecera ---------------------------- */}
      <header className="relative">
        {/* Portada: la imagen que el colaborador subió, o la banda de marca */}
        {fondoUrl ? (
          <div
            className="h-24 bg-cover bg-center"
            style={{ backgroundImage: `url(${fondoUrl})` }}
          />
        ) : (
          <div className="h-20 bg-linear-to-r from-brand to-accent" />
        )}

        <div className="px-5 pb-5">
          {/* Avatar montado sobre la banda */}
          <EmployeeAvatar
            employee={employee}
            src={fotoUrl}
            size="xl"
            iniciales={iniciales(employee) || undefined}
            className="-mt-10 border-4 border-surface shadow-md ring-0"
          />

          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              {nombre ? (
                <h2 className="text-xl font-bold leading-tight text-ink">
                  {nombre}
                </h2>
              ) : (
                <h2 className="text-xl font-bold leading-tight text-ink-muted">
                  Sin nombre registrado
                </h2>
              )}

              {employee.userName && employee.userName !== nombre && (
                <p className="mt-0.5 break-all text-sm text-ink-muted">
                  @{employee.userName}
                </p>
              )}
            </div>

            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1
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

          {/* Resumen rápido */}
          {(departamento || tiempoEnEmpresa) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {departamento && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2.5 py-1 text-xs font-medium text-ink-secondary">
                  <Building2 size={13} className="text-ink-muted" />
                  {departamento}
                </span>
              )}

              {tiempoEnEmpresa && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2.5 py-1 text-xs font-medium text-ink-secondary">
                  <Clock size={13} className="text-ink-muted" />
                  {tiempoEnEmpresa} en la empresa
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ----------------------------- Datos ------------------------------ */}
      <div className="flex-1 space-y-6 border-t border-stroke-soft px-5 py-5">
        <Seccion titulo="Contacto">
          <Dato
            icon={Mail}
            label="Correo"
            valor={employee.email}
            href={employee.email ? `mailto:${employee.email}` : undefined}
          />
          <Dato
            icon={Phone}
            label="Teléfono"
            valor={employee.phoneNumber}
            href={
              employee.phoneNumber ? `tel:${employee.phoneNumber}` : undefined
            }
          />
          <Dato icon={MapPin} label="Dirección" valor={employee.address} />
        </Seccion>

        <Seccion titulo="Información laboral">
          <Dato icon={Building2} label="Departamento" valor={departamento} />
          <Dato icon={BadgeCheck} label="Jornada" valor={employee.journey} />
          <Dato
            icon={CalendarDays}
            label="Fecha de ingreso"
            valor={formatearFecha(employee.hiredDate)}
            sufijo={tiempoEnEmpresa ? `· ${tiempoEnEmpresa}` : null}
          />
        </Seccion>

        <Seccion titulo="Datos personales">
          <Dato icon={CreditCard} label="Identificación" valor={employee.dni} />
          <Dato
            icon={Cake}
            label="Fecha de nacimiento"
            valor={formatearFecha(employee.birthDate)}
            sufijo={edad !== null ? `· ${edad} años` : null}
          />
        </Seccion>

        {formatearFecha(employee.lastEditedDate) && (
          <p className="pt-1 text-xs text-ink-muted">
            Última actualización: {formatearFecha(employee.lastEditedDate)}
            {employee.lastEditedBy ? ` por ${employee.lastEditedBy}` : ''}
          </p>
        )}
      </div>

      {/* ----------------------------- Acción ----------------------------- */}
      <div className="sticky bottom-0 border-t border-stroke-soft bg-surface px-5 py-4">
        <PrimaryButton
          onClick={() => navigate(`/manager/employees/${employee.id}`)}
          className="w-full"
        >
          Ver perfil completo
          <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </div>
  );
};

export default EmployeeView;
