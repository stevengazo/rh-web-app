import { useState } from 'react';

/** Iniciales a partir del expediente, con respaldo en usuario o correo. */
export const inicialesDe = (employee) => {
  const desdeNombre =
    `${employee?.firstName?.[0] ?? ''}${employee?.lastName?.[0] ?? ''}`.toUpperCase();
  if (desdeNombre) return desdeNombre;

  const alterno = employee?.userName || employee?.email || '';
  return alterno.slice(0, 2).toUpperCase() || '—';
};

const MEDIDAS = {
  xs: 'h-8 w-8 text-[11px]',
  sm: 'h-10 w-10 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

/**
 * Avatar del colaborador: muestra su foto si la hay, y si no, sus iniciales.
 *
 * Es puramente presentacional — la URL se le pasa desde fuera (con
 * `useEmployeePhotos` en las listas) para no disparar una petición por tarjeta.
 *
 * @param {object} [employee]  De donde salen las iniciales.
 * @param {string} [src]       URL de la foto.
 * @param {keyof MEDIDAS} [size]
 */
const EmployeeAvatar = ({
  employee,
  src,
  size = 'md',
  className = '',
  iniciales,
}) => {
  const [falló, setFalló] = useState(false);
  const texto = iniciales ?? inicialesDe(employee);
  const mostrarFoto = Boolean(src) && !falló;

  return (
    <span
      className={`grid ${MEDIDAS[size] ?? MEDIDAS.md} shrink-0 place-items-center
                  overflow-hidden rounded-full bg-brand-tint font-semibold
                  text-brand ring-1 ring-brand/10 ${className}`}
    >
      {mostrarFoto ? (
        <img
          src={src}
          alt={`Foto de ${texto}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFalló(true)}
        />
      ) : (
        texto
      )}
    </span>
  );
};

export default EmployeeAvatar;
