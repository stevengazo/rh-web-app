import { Camera, Loader2, Trash2, Upload } from 'lucide-react';

import EmployeeAvatar from '../molecules/EmployeeAvatar';
import { useProfilePhoto } from '../../hooks/useProfilePhoto';
import FileApi from '../../api/FileApi';

export { TABLA_FOTO } from '../../hooks/useProfilePhoto';

/**
 * Devuelve la foto de perfil de un colaborador, o `null` si no tiene.
 * Útil donde solo hace falta consultarla (por ejemplo, el navbar).
 */
export const obtenerFoto = async (userId) => {
  if (!userId) return null;

  try {
    const archivos = await FileApi.getByReference('AspNetUsers', userId);
    if (!Array.isArray(archivos) || archivos.length === 0) return null;

    return [...archivos].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  } catch (error) {
    console.error('Error obteniendo la foto de perfil:', error);
    return null;
  }
};

/**
 * Avatar con opción de cambiar la foto.
 *
 * @param {string} userId
 * @param {string} iniciales
 * @param {boolean} [editable]
 * @param {('sm'|'md'|'lg')} [size]
 * @param {(archivo: object|null) => void} [onChange]
 */
const AvatarUpload = ({
  userId,
  iniciales = '—',
  editable = true,
  size = 'lg',
  onChange,
}) => {
  const {
    url,
    tieneFoto,
    cargando,
    subiendo,
    inputRef,
    elegirArchivo,
    alSeleccionar,
    quitar,
  } = useProfilePhoto(userId, onChange);

  const tamaño = { sm: 'sm', md: 'lg', lg: 'xl' }[size] ?? 'lg';

  const circulo = (
    <span className="relative inline-grid">
      {cargando ? (
        <span
          className={`animate-pulse rounded-full bg-stroke-soft ${
            tamaño === 'xl' ? 'h-20 w-20' : tamaño === 'lg' ? 'h-14 w-14' : 'h-10 w-10'
          }`}
        />
      ) : (
        <EmployeeAvatar src={url} iniciales={iniciales} size={tamaño} />
      )}

      {subiendo && (
        <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
          <Loader2 size={18} className="animate-spin text-white" />
        </span>
      )}
    </span>
  );

  if (!editable) return circulo;

  return (
    <div className="flex items-center gap-3">
      {/* El avatar entero actúa como botón para cambiar la foto */}
      <button
        type="button"
        onClick={elegirArchivo}
        disabled={subiendo}
        aria-label={tieneFoto ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
        title={tieneFoto ? 'Cambiar foto' : 'Subir foto'}
        className="group relative rounded-full focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {circulo}

        <span
          className="pointer-events-none absolute inset-0 grid place-items-center rounded-full
                     bg-black/45 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Camera size={size === 'lg' ? 20 : 16} className="text-white" />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={alSeleccionar}
        className="hidden"
      />

      {/* Acciones visibles: el hover no existe en móvil */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={elegirArchivo}
          disabled={subiendo}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand
                     transition-colors hover:underline disabled:opacity-50"
        >
          <Upload size={13} />
          {tieneFoto ? 'Cambiar foto' : 'Subir foto'}
        </button>

        {tieneFoto && (
          <button
            type="button"
            onClick={quitar}
            disabled={subiendo}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted
                       transition-colors hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 size={13} />
            Quitar
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
