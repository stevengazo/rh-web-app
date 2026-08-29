import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Check,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  ShieldOff,
  UserCog,
  Users,
} from 'lucide-react';

import EmployeeApi from '../../api/employeesApi';
import RolesApi from '../../api/roles';
import { useAppContext } from '../../context/AppContext';

import EmployeeAvatar from '../molecules/EmployeeAvatar';
import SecondaryButton from '../SecondaryButton';
import { fieldClasses } from '../atoms/fieldClasses';
import { mensajeDeError } from '../../utils/apiError';
import { COLOR_ROL, describirRol } from '../../data/roles';

/** Filtro que no corresponde a un rol concreto. */
const SIN_ROL = '__sin_rol__';

const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

const iniciales = (e) => {
  const a = e?.firstName?.trim?.()[0] ?? '';
  const b = e?.lastName?.trim?.()[0] ?? '';
  const dos = (a + b).toUpperCase();
  return dos || (e?.userName || e?.email || '?').slice(0, 2).toUpperCase();
};

/**
 * Color del distintivo de un rol.
 *
 * `Admin` se distingue del resto a propósito: es el que da acceso a planilla y
 * a datos de todo el personal, y conviene que salte a la vista quién lo tiene.
 */
const colorDeRol = (rol) => COLOR_ROL[describirRol(rol).tono] ?? COLOR_ROL.neutro;

/**
 * Roles y permisos.
 *
 * Antes había que hacer clic en cada persona para descubrir qué roles tenía, y
 * asignar uno era desplegable + botón + papelera. Ahora los roles de todos se
 * cargan de una vez y se ven en la propia lista, se puede filtrar por rol, y
 * asignar o quitar es un clic sobre el distintivo.
 *
 * Además protege contra dos formas de quedarse fuera: quitarse el propio
 * `Admin` y dejar el sistema sin ningún administrador.
 */
const RolesSettings = () => {
  const { user } = useAppContext();

  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  /** `{ [userId]: string[] }` con los roles de cada quien. */
  const [rolesPorUsuario, setRolesPorUsuario] = useState({});

  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');

  const [cargando, setCargando] = useState(true);
  const [aplicando, setAplicando] = useState(null);

  /* ------------------------------------------------------------------
     Carga
     ------------------------------------------------------------------ */
  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const [rolesRes, empleadosRes] = await Promise.all([
        RolesApi.getAll(),
        EmployeeApi.getAllEmployees(),
      ]);

      const lista = (empleadosRes?.data ?? []).filter((e) => !e.deleted);

      setRoles(rolesRes?.data ?? []);
      setEmployees(lista);

      /* Los roles de todos, en paralelo. Es una petición por persona —la API
         no expone un listado conjunto— pero permite que la lista muestre quién
         tiene qué sin obligar a hacer clic uno por uno. */
      const pares = await Promise.all(
        lista.map(async (e) => {
          try {
            const r = await RolesApi.getByUser(e.id);
            return [e.id, Array.isArray(r?.data) ? r.data : []];
          } catch {
            return [e.id, []];
          }
        })
      );

      setRolesPorUsuario(Object.fromEntries(pares));
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudieron cargar los roles.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /* ------------------------------------------------------------------
     Derivados
     ------------------------------------------------------------------ */

  const conteos = useMemo(() => {
    const mapa = { todos: employees.length, [SIN_ROL]: 0 };

    roles.forEach((r) => {
      mapa[r.name] = 0;
    });

    employees.forEach((e) => {
      const suyos = rolesPorUsuario[e.id] ?? [];
      if (suyos.length === 0) mapa[SIN_ROL] += 1;
      suyos.forEach((r) => {
        mapa[r] = (mapa[r] ?? 0) + 1;
      });
    });

    return mapa;
  }, [employees, roles, rolesPorUsuario]);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    return employees
      .filter((e) => {
        const suyos = rolesPorUsuario[e.id] ?? [];

        if (filtroRol === SIN_ROL) return suyos.length === 0;
        if (filtroRol !== 'todos' && !suyos.includes(filtroRol)) return false;

        return true;
      })
      .filter((e) => {
        if (!q) return true;

        /* Se compara sobre campos que pueden venir nulos; antes un empleado
           sin `userName` reventaba el buscador entero. */
        return [nombreDe(e), e.userName, e.email, e.dni]
          .filter(Boolean)
          .some((campo) => String(campo).toLowerCase().includes(q));
      })
      .sort((a, b) => nombreDe(a).localeCompare(nombreDe(b)));
  }, [employees, rolesPorUsuario, busqueda, filtroRol]);

  const empleadoActual = employees.find((e) => e.id === seleccionado) ?? null;
  const rolesActuales = seleccionado ? (rolesPorUsuario[seleccionado] ?? []) : [];

  /** Cuántas personas conservan `Admin`; se usa para no dejar el sistema huérfano. */
  const admins = useMemo(
    () =>
      employees.filter((e) => (rolesPorUsuario[e.id] ?? []).includes('Admin'))
        .length,
    [employees, rolesPorUsuario]
  );

  /* ------------------------------------------------------------------
     Asignación
     ------------------------------------------------------------------ */

  const alternarRol = async (nombreRol) => {
    if (!empleadoActual) return;

    const tiene = rolesActuales.includes(nombreRol);

    /* Dos maneras de quedarse fuera del sistema, y las dos se avisan antes de
       hacer nada: quitarse el propio Admin y dejar cero administradores. */
    if (tiene && nombreRol === 'Admin') {
      if (empleadoActual.id === user?.id) {
        toast.error('No puedes quitarte tu propio rol de administrador.');
        return;
      }

      if (admins <= 1) {
        toast.error(
          'Es el último administrador. Asigna el rol a alguien más antes de quitárselo.'
        );
        return;
      }

      const ok = window.confirm(
        `¿Quitar el rol de administrador a ${nombreDe(empleadoActual)}? Perderá el acceso al panel de gestión.`
      );
      if (!ok) return;
    }

    setAplicando(nombreRol);

    try {
      if (tiene) {
        await RolesApi.removeFromUser(empleadoActual.id, nombreRol);
      } else {
        await RolesApi.assignToUser(empleadoActual.id, nombreRol);
      }

      const actualizados = await RolesApi.getByUser(empleadoActual.id);

      setRolesPorUsuario((prev) => ({
        ...prev,
        [empleadoActual.id]: Array.isArray(actualizados?.data)
          ? actualizados.data
          : [],
      }));

      toast.success(
        tiene
          ? `Se quitó "${nombreRol}" a ${nombreDe(empleadoActual)}`
          : `Se asignó "${nombreRol}" a ${nombreDe(empleadoActual)}`
      );
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo cambiar el rol.'));
    } finally {
      setAplicando(null);
    }
  };

  /* ------------------------------------------------------------------
     Render
     ------------------------------------------------------------------ */

  if (cargando) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Roles y permisos</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Elige un colaborador y activa o desactiva sus roles con un clic.
          </p>
        </div>

        <SecondaryButton onClick={cargar}>
          <RefreshCw size={15} />
          Actualizar
        </SecondaryButton>
      </div>

      {/* Sin administradores el panel de gestión queda inaccesible. */}
      {admins === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">
            <span className="font-semibold">
              Nadie tiene el rol de administrador.
            </span>{' '}
            Sin al menos una persona con ese rol, el panel de gestión queda
            inaccesible.
          </p>
        </div>
      )}

      {/* Filtros por rol */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todos', label: 'Todos', icon: Users },
          ...roles.map((r) => ({
            id: r.name,
            label: describirRol(r.name).etiqueta,
            icon: Shield,
          })),
          { id: SIN_ROL, label: 'Sin rol', icon: ShieldOff },
        ].map(({ id, label, icon: Icono }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFiltroRol(id)}
            aria-pressed={filtroRol === id}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium
              transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
              ${
                filtroRol === id
                  ? 'border-brand bg-brand-tint text-brand-700'
                  : 'border-stroke-soft bg-surface text-ink-secondary hover:border-brand hover:text-brand'
              }`}
          >
            <Icono size={14} />
            {label}
            <span
              className={`rounded-full px-1.5 text-xs font-semibold
                ${filtroRol === id ? 'bg-brand text-white' : 'bg-surface-alt text-ink-muted'}`}
            >
              {conteos[id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* ---------------- Colaboradores ---------------- */}
        <div className="flex flex-col rounded-xl border border-stroke-soft bg-surface">
          <div className="border-b border-stroke-soft p-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="search"
                placeholder="Buscar por nombre, correo o cédula…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={fieldClasses({ className: 'h-10 pl-9' })}
              />
            </div>
          </div>

          {visibles.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-muted">
              {busqueda
                ? `No hay coincidencias con “${busqueda}”.`
                : 'No hay colaboradores en este filtro.'}
            </p>
          ) : (
            <ul className="max-h-112 divide-y divide-stroke-soft overflow-y-auto">
              {visibles.map((emp) => {
                const suyos = rolesPorUsuario[emp.id] ?? [];
                const activo = seleccionado === emp.id;

                return (
                  <li key={emp.id}>
                    <button
                      type="button"
                      onClick={() => setSeleccionado(emp.id)}
                      aria-pressed={activo}
                      className={`flex w-full items-center gap-3 border-l-4 px-4 py-3 text-left transition-colors
                        ${
                          activo
                            ? 'border-l-brand bg-brand-subtle'
                            : 'border-l-transparent hover:bg-canvas'
                        }`}
                    >
                      <EmployeeAvatar
                        iniciales={iniciales(emp)}
                        size="sm"
                        className="shrink-0"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">
                          {nombreDe(emp)}
                          {!emp.isActive && (
                            <span className="ml-2 rounded-full bg-surface-alt px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                              Inactivo
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-ink-muted">
                          {emp.email}
                        </span>
                      </span>

                      <span className="flex shrink-0 flex-wrap justify-end gap-1">
                        {suyos.length === 0 ? (
                          <span className="rounded-full border border-stroke-soft px-2 py-0.5 text-[11px] text-ink-muted">
                            Sin rol
                          </span>
                        ) : (
                          suyos.map((r) => (
                            <span
                              key={r}
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${colorDeRol(r)}`}
                            >
                              {r}
                            </span>
                          ))
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ---------------- Detalle ---------------- */}
        <div className="rounded-xl border border-stroke-soft bg-surface p-5">
          {!empleadoActual ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-ink-muted">
              <UserCog size={28} />
              <p className="text-sm font-medium">Elige un colaborador</p>
              <p className="text-center text-xs">
                Sus roles aparecerán aquí y podrás activarlos o desactivarlos.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <EmployeeAvatar iniciales={iniciales(empleadoActual)} size="md" />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {nombreDe(empleadoActual)}
                  </p>
                  <p className="truncate text-sm text-ink-muted">
                    {empleadoActual.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand">
                  Roles
                </p>

                {roles.length === 0 ? (
                  <p className="text-sm text-ink-muted">
                    No hay roles definidos en el sistema.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {roles.map((rol) => {
                      const tiene = rolesActuales.includes(rol.name);
                      const ocupado = aplicando === rol.name;
                      const info = describirRol(rol.name);

                      return (
                        <button
                          key={rol.id}
                          type="button"
                          onClick={() => alternarRol(rol.name)}
                          disabled={aplicando !== null}
                          aria-pressed={tiene}
                          title={info.detalle}
                          className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left
                            transition-colors disabled:opacity-60
                            ${
                              tiene
                                ? colorDeRol(rol.name)
                                : 'border-stroke-soft bg-surface text-ink-secondary hover:border-brand'
                            }`}
                        >
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border
                              ${
                                tiene
                                  ? 'border-transparent bg-brand text-white'
                                  : 'border-stroke'
                              }`}
                          >
                            {ocupado ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              tiene && <Check size={12} />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-x-2">
                              <span className="text-sm font-semibold">
                                {info.etiqueta}
                              </span>
                              <span className="font-mono text-[11px] opacity-70">
                                {rol.name}
                              </span>

                              {/* Se dice cuáles ya restringen algo de verdad y
                                  cuáles todavía no, para no prometer un
                                  control que la aplicación no aplica. */}
                              {!info.aplicado && (
                                <span className="rounded-full border border-stroke-soft px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                                  Sin efecto aún
                                </span>
                              )}
                            </span>

                            <span className="mt-0.5 block text-xs leading-snug opacity-80">
                              {info.detalle}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
                Hoy la aplicación solo comprueba{' '}
                <span className="font-semibold text-ink-secondary">Admin</span>{' '}
                para dar acceso al panel de gestión. Los demás roles se pueden
                asignar y quedan guardados, pero todavía no cambian lo que la
                persona puede hacer.
              </p>

              {empleadoActual.id === user?.id && (
                <p className="rounded-lg bg-surface-alt p-3 text-xs text-ink-muted">
                  Estás viendo tu propia cuenta. Por seguridad no puedes
                  quitarte el rol de administrador.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesSettings;
