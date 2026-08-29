import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ExternalLink, Save, ShieldAlert, Sparkles } from 'lucide-react';

import Label from '../Label';
import TextInput from '../TextInput';
import SelectInput from '../SelectInput';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import {
  CONFIG_POR_DEFECTO,
  PROVEEDORES,
  USOS,
  buscarProveedor,
} from '../../data/modelosIa';

const CLAVE = 'rh:ia-config';
const CLAVE_SECRETO = 'rh:ia-clave';

const leerConfig = () => {
  try {
    const guardado = localStorage.getItem(CLAVE);
    return guardado
      ? { ...CONFIG_POR_DEFECTO, ...JSON.parse(guardado) }
      : { ...CONFIG_POR_DEFECTO };
  } catch {
    return { ...CONFIG_POR_DEFECTO };
  }
};

const leerClave = () => {
  try {
    return localStorage.getItem(CLAVE_SECRETO) ?? '';
  } catch {
    return '';
  }
};

/**
 * Conexión con modelos de IA y elección del modelo por tarea.
 *
 * ⚠️ **Esto configura, no conecta.** No hay todavía endpoints en la API que
 * consuman estos ajustes: se guardan para que el trabajo de integración
 * arranque con la configuración ya definida. Mientras tanto, ninguna pantalla
 * llama a un modelo.
 *
 * La clave **no se guarda por omisión**. Una clave en `localStorage` queda
 * expuesta a cualquier XSS y viaja en el navegador de quien la escribió; lo
 * correcto es que viva en la API como variable de entorno. El campo existe
 * para pruebas locales y lo dice en pantalla.
 */
const AiSettings = () => {
  const [config, setConfig] = useState(leerConfig);
  const [clave, setClave] = useState(leerClave);
  const [verClave, setVerClave] = useState(false);
  const [sucio, setSucio] = useState(false);

  const proveedor = buscarProveedor(config.proveedor);

  const cambiar = (parcial) => {
    setConfig((prev) => ({ ...prev, ...parcial }));
    setSucio(true);
  };

  const cambiarProveedor = (id) => {
    const nuevo = buscarProveedor(id);
    cambiar({
      proveedor: id,
      endpoint: '',
      // Los modelos del proveedor anterior no existen en el nuevo.
      modeloPorDefecto: nuevo.modelos[0]?.id ?? '',
      modelosPorUso: {},
    });
  };

  const guardar = () => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(config));

      if (config.guardarClaveLocal && clave.trim()) {
        localStorage.setItem(CLAVE_SECRETO, clave.trim());
      } else {
        localStorage.removeItem(CLAVE_SECRETO);
      }

      toast.success('Configuración de IA guardada');
      setSucio(false);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo guardar la configuración.');
    }
  };

  const restablecer = () => {
    setConfig({ ...CONFIG_POR_DEFECTO });
    setClave('');
    setSucio(true);
  };

  const opcionesModelo = proveedor.modelos;

  return (
    <div className="space-y-6">
      {/* Aviso de alcance: es lo primero que hay que saber. */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-700" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold">
            Estos ajustes todavía no se consumen desde ninguna pantalla.
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            La API aún no tiene los endpoints que llamarían al modelo. Lo que
            se guarda aquí queda listo para cuando existan; nada se envía a
            ningún proveedor por ahora.
          </p>
        </div>
      </div>

      {/* Interruptor general */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <input
          type="checkbox"
          checked={config.habilitado}
          onChange={(e) => cambiar({ habilitado: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-brand"
        />
        <span>
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles size={15} className="text-brand" />
            Habilitar funciones con IA
          </span>
          <span className="mt-0.5 block text-xs text-ink-muted">
            Cuando esté apagado, las pantallas no ofrecerán acciones asistidas
            aunque haya un modelo configurado.
          </span>
        </span>
      </label>

      {/* Proveedor */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Proveedor</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Quién atiende las peticiones del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PROVEEDORES.map((p) => {
            const activo = p.id === config.proveedor;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => cambiarProveedor(p.id)}
                aria-pressed={activo}
                className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
                  ${activo ? 'border-brand ring-1 ring-brand' : 'border-stroke-soft'}`}
              >
                <p className="text-sm font-semibold text-ink">{p.nombre}</p>
                <p className="mt-1 text-xs leading-snug text-ink-muted">
                  {p.descripcion}
                </p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ia-endpoint">Endpoint</Label>
            <TextInput
              id="ia-endpoint"
              value={config.endpoint}
              onChange={(e) => cambiar({ endpoint: e.target.value })}
              placeholder={proveedor.endpoint}
            />
            <p className="mt-1 text-xs text-ink-muted">
              Vacío usa el endpoint público del proveedor.
            </p>
          </div>

          <div>
            <Label htmlFor="ia-clave">Clave de API</Label>

            <div className="relative">
              <TextInput
                id="ia-clave"
                type={verClave ? 'text' : 'password'}
                value={clave}
                onChange={(e) => {
                  setClave(e.target.value);
                  setSucio(true);
                }}
                placeholder={proveedor.formatoClave}
                autoComplete="off"
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setVerClave((v) => !v)}
                aria-label={verClave ? 'Ocultar la clave' : 'Mostrar la clave'}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center
                           rounded text-ink-muted transition-colors hover:text-ink"
              >
                {verClave ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs text-ink-muted">
              <input
                type="checkbox"
                checked={config.guardarClaveLocal}
                onChange={(e) =>
                  cambiar({ guardarClaveLocal: e.target.checked })
                }
                className="mt-0.5 h-3.5 w-3.5 accent-brand"
              />
              <span>
                Guardar la clave en este navegador.{' '}
                <span className="font-semibold text-amber-700">
                  Solo para pruebas locales:
                </span>{' '}
                en producción la clave debe vivir en la API, no en el cliente.
              </span>
            </label>
          </div>
        </div>

        <a
          href={proveedor.docs}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
        >
          Documentación de {proveedor.nombre}
          <ExternalLink size={12} />
        </a>
      </section>

      {/* Modelos */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Modelos</h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            Cada tarea puede usar un modelo distinto: no hace falta gastar el
            más caro en clasificar un documento.
          </p>
        </div>

        {proveedor.despliegueLibre ? (
          <div>
            <Label htmlFor="ia-despliegue">Nombre del despliegue</Label>
            <TextInput
              id="ia-despliegue"
              value={config.modeloPorDefecto}
              onChange={(e) => cambiar({ modeloPorDefecto: e.target.value })}
              placeholder="mi-despliegue-gpt-4"
            />
            <p className="mt-1 text-xs text-ink-muted">
              En Azure el modelo se identifica por el nombre que le pusiste al
              despliegue en tu recurso.
            </p>
          </div>
        ) : (
          <>
            <div className="sm:max-w-sm">
              <Label htmlFor="ia-modelo">Modelo por defecto</Label>
              <SelectInput
                id="ia-modelo"
                value={config.modeloPorDefecto}
                onChange={(e) => cambiar({ modeloPorDefecto: e.target.value })}
              >
                {opcionesModelo.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                    {m.recomendado ? ' — recomendado' : ''}
                  </option>
                ))}
              </SelectInput>

              <p className="mt-1 text-xs text-ink-muted">
                {opcionesModelo.find((m) => m.id === config.modeloPorDefecto)
                  ?.nota ?? 'Lo usan las tareas que no tengan uno propio.'}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-stroke-soft">
              <table className="min-w-full">
                <thead className="bg-surface-alt text-ink-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Tarea
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Modelo
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stroke-soft bg-surface">
                  {USOS.map((uso) => (
                    <tr key={uso.id}>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-ink">
                          {uso.nombre}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {uso.descripcion}
                        </p>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <SelectInput
                          aria-label={`Modelo para ${uso.nombre}`}
                          value={config.modelosPorUso[uso.id] ?? ''}
                          onChange={(e) =>
                            cambiar({
                              modelosPorUso: {
                                ...config.modelosPorUso,
                                [uso.id]: e.target.value,
                              },
                            })
                          }
                          className="min-w-48"
                        >
                          <option value="">Usar el modelo por defecto</option>
                          {opcionesModelo.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nombre}
                            </option>
                          ))}
                        </SelectInput>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-stroke-soft pt-4">
        <SecondaryButton onClick={restablecer}>Restablecer</SecondaryButton>

        <PrimaryButton onClick={guardar} disabled={!sucio}>
          <Save size={15} />
          Guardar configuración
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AiSettings;
