import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Plug,
  Plus,
  RefreshCw,
  Save,
  ServerCog,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import mcpApi from '../../api/mcpApi';
import { TRANSPORTES, ejemploConexion, servidorNuevo } from '../../data/mcp';
import { mensajeDeError } from '../../utils/apiError';
import { useAppContext } from '../../context/AppContext';

/* Los servidores que este sistema *consume* siguen siendo configuración del
   cliente: la API no los necesita. Lo que sí vive en la base es el servidor
   que se expone, porque es la API quien lo atiende. */
const CLAVE_CLIENTES = 'rh:mcp-clientes';

/**
 * Genera un token de acceso.
 *
 * Usa `crypto.getRandomValues`, no `Math.random`: esto protege el acceso a
 * datos de personal y un generador predecible no sirve. 32 bytes en base64url
 * dan 256 bits de entropía, de sobra para un Bearer.
 */
const generarToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return `rhmcp_${btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}`;
};

const leer = (clave, respaldo) => {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : respaldo;
  } catch {
    return respaldo;
  }
};

/**
 * Model Context Protocol.
 *
 * Separa las dos caras que suelen confundirse: los servidores que este
 * sistema **consume** y el servidor que este sistema **expone** para que un
 * asistente externo lo consulte.
 *
 * ⚠️ **Configura, no conecta.** La API todavía no monta el endpoint MCP ni
 * habla con servidores externos. Lo que se define aquí queda listo.
 */
const McpSettings = () => {
  const { user } = useAppContext();

  const [catalogo, setCatalogo] = useState([]);
  const [servidor, setServidor] = useState(null);
  const [clientes, setClientes] = useState(() => leer(CLAVE_CLIENTES, []));
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [sucio, setSucio] = useState(false);
  const [token, setToken] = useState('');
  const [verToken, setVerToken] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const [toolsRes, configRes] = await Promise.all([
        mcpApi.getTools(),
        mcpApi.getConfig(),
      ]);

      setCatalogo(Array.isArray(toolsRes?.data) ? toolsRes.data : []);
      setServidor(configRes?.data ?? null);
      setToken('');
      setSucio(false);
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo cargar la configuración MCP.'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /** El catálogo llega plano; se agrupa como lo muestra la pantalla. */
  const grupos = useMemo(() => {
    const mapa = new Map();

    catalogo.forEach((t) => {
      if (!mapa.has(t.group)) mapa.set(t.group, []);
      mapa.get(t.group).push(t);
    });

    return [...mapa.entries()].map(([grupo, items]) => ({
      grupo,
      items,
      escritura: items.some((i) => i.writes),
    }));
  }, [catalogo]);

  const cambiarServidor = (parcial) => {
    setServidor((prev) => ({ ...prev, ...parcial }));
    setSucio(true);
  };

  const alternarHerramienta = (id) => {
    const actuales = servidor?.tools ?? [];
    cambiarServidor({
      tools: actuales.includes(id)
        ? actuales.filter((h) => h !== id)
        : [...actuales, id],
    });
  };

  const guardar = async () => {
    setGuardando(true);

    try {
      const resp = await mcpApi.updateConfig({
        enabled: servidor.enabled,
        serverName: servidor.serverName,
        tools: servidor.tools,
        confirmWrites: servidor.confirmWrites,
        // Cadena vacía sin tocar = no cambiar el token guardado.
        token: token === '' ? null : token,
        userName: user?.userName ?? user?.email,
      });

      setServidor(resp.data);
      setToken('');
      setSucio(false);

      localStorage.setItem(CLAVE_CLIENTES, JSON.stringify(clientes));
      toast.success('Configuración MCP guardada');
    } catch (error) {
      console.error(error);
      toast.error(mensajeDeError(error, 'No se pudo guardar la configuración.'));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando || !servidor) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-alt" />
        ))}
      </div>
    );
  }

  const base =
    typeof window !== 'undefined' ? window.location.origin : 'https://rh.local';

  /* Con un token recién generado se pega tal cual en el cliente; si el token
     ya estaba guardado, la API no lo devuelve y solo queda el marcador. */
  const fragmento = ejemploConexion(servidor, base).replace(
    'Bearer <token>',
    token.trim() ? `Bearer ${token.trim()}` : 'Bearer <token>'
  );

  const escrituraActiva = catalogo
    .filter((t) => t.writes)
    .some((t) => servidor.tools.includes(t.name));

  return (
    <div className="space-y-8">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          servidor.enabled
            ? 'border-green-200 bg-green-50'
            : 'border-stroke bg-surface-alt'
        }`}
      >
        <ShieldAlert
          size={18}
          className={`mt-0.5 shrink-0 ${servidor.enabled ? 'text-green-700' : 'text-ink-muted'}`}
        />
        <div className={`text-sm ${servidor.enabled ? 'text-green-900' : 'text-ink-secondary'}`}>
          <p className="font-semibold">
            {servidor.enabled
              ? `Servidor activo en ${servidor.endpoint} · protocolo ${servidor.protocolVersion}`
              : 'Servidor apagado: el endpoint responde 404.'}
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            {servidor.enabled
              ? servidor.hasToken
                ? 'Requiere un token Bearer. Las herramientas de escritura dejan los registros pendientes de aprobación.'
                : 'Sin token: cualquiera con la URL puede leer datos de personal. Ponle uno si no está en una red cerrada.'
              : 'Enciéndelo para que un asistente externo pueda consultar el sistema.'}
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      <section className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ServerCog size={16} className="text-brand" />
            Exponer este sistema
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Permite que un asistente externo consulte los datos de RR.HH. con
            las herramientas que elijas.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4">
          <input
            type="checkbox"
            checked={servidor.enabled}
            onChange={(e) => cambiarServidor({ enabled: e.target.checked })}
            className="mt-0.5 h-4 w-4 accent-brand"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              Habilitar el servidor MCP
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              Apagado, el endpoint responde 404 aunque haya herramientas
              seleccionadas.
            </span>
          </span>
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mcp-nombre">Nombre del servidor</Label>
            <TextInput
              id="mcp-nombre"
              value={servidor.serverName}
              onChange={(e) => cambiarServidor({ serverName: e.target.value })}
              placeholder="rh-sistema"
            />
          </div>

          <div>
            <Label htmlFor="mcp-ruta">Endpoint</Label>
            <TextInput id="mcp-ruta" value={servidor.endpoint} disabled />
            <p className="mt-1 text-xs text-ink-muted">
              Lo fija la API. Transporte: HTTP streamable (JSON-RPC por POST).
            </p>
          </div>

          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="mcp-token" className="mb-0">
                Token de acceso
              </Label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setToken(generarToken());
                    setVerToken(true);
                    setSucio(true);
                    toast.success('Token generado. Cópialo: no se vuelve a mostrar.');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  <KeyRound size={13} />
                  Generar token
                </button>

                {token.trim() && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(token);
                        toast.success('Token copiado');
                      } catch {
                        toast.error('El navegador no permitió copiar.');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
                  >
                    <Copy size={13} />
                    Copiar
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setVerToken((v) => !v)}
                  aria-label={verToken ? 'Ocultar el token' : 'Mostrar el token'}
                  className="text-ink-muted transition-colors hover:text-ink"
                >
                  {verToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <TextInput
              id="mcp-token"
              type={verToken ? 'text' : 'password'}
              className="mt-2 font-mono"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setSucio(true);
              }}
              autoComplete="off"
              placeholder={
                servidor.hasToken
                  ? 'Hay un token guardado. Escribe uno nuevo para cambiarlo.'
                  : 'Sin token, el endpoint queda abierto'
              }
            />

            {token.trim() && (
              <p className="mt-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900">
                <span className="font-semibold">Cópialo ahora:</span> una vez
                guardado, la API no lo devuelve nunca más. Si lo pierdes, genera
                otro y actualiza el cliente.
              </p>
            )}

            <p className="mt-1 text-xs text-ink-muted">
              El cliente lo envía como{' '}
              <code className="rounded bg-surface-alt px-1">
                Authorization: Bearer …
              </code>
              .{' '}
              {servidor.hasToken ? (
                <button
                  type="button"
                  onClick={() => {
                    setToken(' ');
                    setSucio(true);
                  }}
                  className="font-semibold text-red-600 hover:underline"
                >
                  Quitar el token
                </button>
              ) : (
                <span className="text-amber-700">
                  Ahora mismo el endpoint no pide autenticación.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Herramientas */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
            Herramientas disponibles
          </h4>
          <p className="mt-0.5 text-xs text-ink-muted">
            Lo que el asistente podrá hacer. Empieza solo con lectura y abre lo
            demás cuando haga falta.
          </p>

          <div className="mt-3 space-y-4">
            {grupos.map((grupo) => (
              <div key={grupo.grupo}>
                <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                  {grupo.grupo}
                  {grupo.escritura && (
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                      Modifica datos
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {grupo.items.map((item) => {
                    const activa = servidor.tools.includes(item.name);

                    return (
                      <label
                        key={item.name}
                        className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 transition-colors
                          ${
                            activa
                              ? item.writes
                                ? 'border-amber-300 bg-amber-50'
                                : 'border-brand bg-brand-tint'
                              : 'border-stroke-soft bg-surface hover:border-brand'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={activa}
                          onChange={() => alternarHerramienta(item.name)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-brand"
                        />
                        <span className="min-w-0">
                          <span className="block font-mono text-xs font-semibold text-ink">
                            {item.name}
                          </span>
                          <span className="block text-[11px] leading-snug text-ink-muted">
                            {item.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {escrituraActiva && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <input
              type="checkbox"
              checked={servidor.confirmWrites}
              onChange={(e) =>
                cambiarServidor({ confirmWrites: e.target.checked })
              }
              className="mt-0.5 h-4 w-4 accent-amber-600"
            />
            <span className="text-sm text-amber-900">
              <span className="block font-semibold">
                Pedir confirmación humana antes de escribir
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed">
                Las herramientas de escritura ya dejan todo en estado
                <span className="font-semibold"> Pendiente</span> y nunca
                aprueban nada por su cuenta. Esto además lo deja anotado en el
                registro, para que se vea que vino de un asistente.
              </span>
            </span>
          </label>
        )}

        {/* Cómo conectarse */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand">
              Cómo conectarse
            </h4>

            <SecondaryButton
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fragmento);
                  toast.success('Copiado');
                } catch {
                  toast.error('El navegador no permitió copiar.');
                }
              }}
            >
              <Copy size={14} />
              Copiar
            </SecondaryButton>
          </div>

          <pre className="overflow-x-auto rounded-lg border border-stroke-soft bg-surface-alt p-3 font-mono text-[11px] leading-relaxed text-ink">
            {fragmento}
          </pre>
          <p className="mt-1 text-xs text-ink-muted">
            Pégalo en la configuración del cliente MCP (por ejemplo{' '}
            <code className="rounded bg-surface-alt px-1">
              claude_desktop_config.json
            </code>
            ).
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="space-y-4 border-t border-stroke-soft pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Plug size={16} className="text-brand" />
              Servidores que este sistema consume
            </h3>
            <p className="mt-0.5 text-sm text-ink-muted">
              Herramientas de fuera que el asistente podrá usar desde aquí.
            </p>
          </div>

          <PrimaryButton
            onClick={() => {
              setClientes((prev) => [...prev, servidorNuevo()]);
              setSucio(true);
            }}
          >
            <Plus size={15} />
            Agregar servidor
          </PrimaryButton>
        </div>

        {clientes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-stroke bg-surface-alt py-10 text-ink-muted">
            <Plug size={26} />
            <p className="text-sm font-medium">Ninguno conectado</p>
            <p className="text-center text-xs">
              Por ejemplo un servidor de calendario, para cruzar vacaciones con
              la agenda del equipo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-stroke-soft bg-surface p-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`mcp-c-nombre-${c.id}`}>Nombre</Label>
                    <TextInput
                      id={`mcp-c-nombre-${c.id}`}
                      value={c.nombre}
                      onChange={(e) => {
                        setClientes((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, nombre: e.target.value } : x
                          )
                        );
                        setSucio(true);
                      }}
                      placeholder="calendario"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`mcp-c-transporte-${c.id}`}>Transporte</Label>
                    <SelectInput
                      id={`mcp-c-transporte-${c.id}`}
                      value={c.transporte}
                      onChange={(e) => {
                        setClientes((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, transporte: e.target.value }
                              : x
                          )
                        );
                        setSucio(true);
                      }}
                    >
                      {TRANSPORTES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor={`mcp-c-url-${c.id}`}>
                      {c.transporte === 'stdio' ? 'Comando' : 'URL'}
                    </Label>
                    <TextInput
                      id={`mcp-c-url-${c.id}`}
                      value={c.transporte === 'stdio' ? c.comando : c.url}
                      onChange={(e) => {
                        const campo =
                          c.transporte === 'stdio' ? 'comando' : 'url';
                        setClientes((prev) =>
                          prev.map((x) =>
                            x.id === c.id ? { ...x, [campo]: e.target.value } : x
                          )
                        );
                        setSucio(true);
                      }}
                      placeholder={
                        c.transporte === 'stdio'
                          ? 'npx -y @scope/mi-servidor'
                          : 'https://ejemplo.com/mcp'
                      }
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-stroke-soft pt-3">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink-muted">
                    <input
                      type="checkbox"
                      checked={c.activo}
                      onChange={(e) => {
                        setClientes((prev) =>
                          prev.map((x) =>
                            x.id === c.id
                              ? { ...x, activo: e.target.checked }
                              : x
                          )
                        );
                        setSucio(true);
                      }}
                      className="h-3.5 w-3.5 accent-brand"
                    />
                    Activo
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setClientes((prev) => prev.filter((x) => x.id !== c.id));
                      setSucio(true);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                               transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Quitar servidor"
                    aria-label="Quitar servidor"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-3 border-t border-stroke-soft pt-4">
        <SecondaryButton onClick={cargar} disabled={guardando}>
          <RefreshCw size={15} />
          Descartar cambios
        </SecondaryButton>

        <PrimaryButton onClick={guardar} disabled={!sucio || guardando}>
          {guardando ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          Guardar configuración
        </PrimaryButton>
      </div>
    </div>
  );
};

export default McpSettings;
