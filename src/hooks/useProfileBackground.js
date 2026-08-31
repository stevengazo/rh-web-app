import { useEffect, useState } from 'react';

import FileApi from '../api/FileApi';
import { urlDeArchivo } from '../utils/fileUrl';
import { TABLA_FONDO } from './useUserPreferences';

/**
 * Imagen de fondo (portada) que un colaborador subió desde "Personalizar mi
 * perfil". Devuelve la URL lista para usar como `background-image`, o `null`.
 *
 * @param {string} [userId]
 */
export const useProfileBackground = (userId) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let vigente = true;

    if (!userId) return undefined;

    FileApi.getByReference(TABLA_FONDO, userId)
      .then((archivos) => {
        if (!vigente) return;
        const lista = Array.isArray(archivos) ? archivos : [];
        const ultimo = lista.length
          ? [...lista].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )[0]
          : null;
        setUrl(urlDeArchivo(ultimo?.filePath));
      })
      .catch((e) => {
        console.error('No se pudo cargar la portada del perfil', e);
        if (vigente) setUrl(null);
      });

    return () => {
      vigente = false;
    };
  }, [userId]);

  return url;
};

export default useProfileBackground;
