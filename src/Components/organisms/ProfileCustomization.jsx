import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Image as ImageIcon, Loader2, Monitor, Moon, Sun, Trash2, Upload } from 'lucide-react';

import TEMAS from '../../data/temas';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { mensajeDeError } from '../../utils/apiError';

import SecondaryButton from '../SecondaryButton';
import Label from '../Label';

const TIPOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_MB = 6;

const MODOS = [
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Oscuro', icon: Moon },
  { id: 'system', label: 'Sistema', icon: Monitor },
];

/**
 * Panel de personalización del perfil: tema, modo, color de acento e imagen de
 * fondo. Todo se guarda en el servidor y sigue al colaborador entre equipos.
 */
const ProfileCustomization = ({ onClose }) => {
  const {
    prefs,
    fondoUrl,
    guardando,
    tema,
    modo,
    guardar,
    subirFondo,
    quitarFondo,
  } = useUserPreferences();

  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  const opacidad = prefs?.backgroundOpacity ?? 100;
  const acento = prefs?.accentColor ?? '';

  const cambiar = async (patch, exito) => {
    try {
      await guardar(patch);
      if (exito) toast.success(exito);
    } catch (e) {
      console.error(e);
      toast.error(mensajeDeError(e, 'No se pudo guardar la preferencia.'));
    }
  };

  const alSeleccionar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!TIPOS.includes(file.type)) {
      toast.error('La imagen debe ser JPG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`La imagen no puede pesar más de ${MAX_MB} MB.`);
      return;
    }

    setSubiendo(true);
    try {
      await subirFondo(file);
      toast.success('Imagen de fondo actualizada.');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarFondo = async () => {
    try {
      await quitarFondo();
      toast.success('Imagen de fondo eliminada.');
    } catch (err) {
      console.error(err);
      toast.error('No se pudo eliminar la imagen.');
    }
  };

  return (
    <div className="space-y-6 text-ink">
      <div>
        <h2 className="text-lg font-semibold">Personalizar mi perfil</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Los cambios se guardan al instante y te acompañan en cualquier equipo.
          {guardando && (
            <span className="ml-2 inline-flex items-center gap-1 text-brand">
              <Loader2 size={12} className="animate-spin" />
              guardando…
            </span>
          )}
        </p>
      </div>

      {/* Tema */}
      <section>
        <Label>Paleta de color</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEMAS.map((t) => {
            const activo = t.id === tema;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => cambiar({ themeId: t.id })}
                className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition-colors ${
                  activo
                    ? 'border-brand ring-1 ring-brand'
                    : 'border-stroke-soft hover:border-brand/40'
                }`}
              >
                <span className="flex shrink-0 overflow-hidden rounded-md border border-stroke-soft">
                  {t.muestra.map((c) => (
                    <span key={c} className="h-6 w-3" style={{ background: c }} />
                  ))}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{t.nombre}</span>
                </span>
                {activo && <Check size={15} className="ml-auto shrink-0 text-brand" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Modo */}
      <section>
        <Label>Modo</Label>
        <div className="inline-flex rounded-lg border border-stroke-soft bg-surface-alt p-1">
          {MODOS.map(({ id, label, icon: Icon }) => {
            const activo =
              id === 'system' ? !['light', 'dark'].includes(prefs?.mode) : prefs?.mode === id || modo === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => cambiar({ mode: id })}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activo ? 'bg-surface text-brand shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Acento */}
      <section>
        <Label htmlFor="pc-accent">Color de acento</Label>
        <div className="flex items-center gap-3">
          <input
            id="pc-accent"
            type="color"
            value={acento || '#7c3aed'}
            onChange={(e) => cambiar({ accentColor: e.target.value })}
            className="h-9 w-14 cursor-pointer rounded-md border border-stroke bg-surface"
          />
          <span className="text-sm text-ink-muted">
            {acento || 'El del tema'}
          </span>
          {acento && (
            <button
              type="button"
              onClick={() => cambiar({ accentColor: null }, 'Acento restablecido.')}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Restablecer
            </button>
          )}
        </div>
      </section>

      {/* Imagen de fondo */}
      <section>
        <Label>Imagen de fondo del perfil</Label>

        <div className="overflow-hidden rounded-xl border border-stroke-soft">
          <div
            className="flex h-32 items-center justify-center bg-surface-alt bg-cover bg-center"
            style={
              fondoUrl
                ? { backgroundImage: `url(${fondoUrl})`, opacity: opacidad / 100 }
                : undefined
            }
          >
            {!fondoUrl && (
              <span className="flex flex-col items-center gap-1 text-ink-muted">
                <ImageIcon size={22} />
                <span className="text-xs">Sin imagen</span>
              </span>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={TIPOS.join(',')}
          onChange={alSeleccionar}
          className="hidden"
        />

        <div className="mt-2 flex flex-wrap gap-2">
          <SecondaryButton onClick={() => inputRef.current?.click()} disabled={subiendo}>
            {subiendo ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {fondoUrl ? 'Cambiar imagen' : 'Subir imagen'}
          </SecondaryButton>

          {fondoUrl && (
            <button
              type="button"
              onClick={eliminarFondo}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-red-500 px-3
                         text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={15} />
              Quitar
            </button>
          )}
        </div>

        {fondoUrl && (
          <div className="mt-3">
            <label htmlFor="pc-op" className="mb-1 block text-xs text-ink-muted">
              Opacidad: {opacidad}%
            </label>
            <input
              id="pc-op"
              type="range"
              min="20"
              max="100"
              step="5"
              value={opacidad}
              onChange={(e) => cambiar({ backgroundOpacity: Number(e.target.value) })}
              className="w-full accent-brand"
            />
          </div>
        )}
      </section>

      {onClose && (
        <div className="flex justify-end border-t border-stroke-soft pt-4">
          <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
        </div>
      )}
    </div>
  );
};

export default ProfileCustomization;
