import { useCallback, useEffect, useState } from 'react';

import FileApi from '../api/FileApi';
import { urlDeArchivo } from '../utils/fileUrl';
import { TABLA_FOTO } from '../Components/organisms/AvatarUpload';

/**
 * Fotos de perfil de todos los colaboradores, en **una sola petición**.
 *
 * Las listas (tarjetas, tablas) pintan decenas de personas; pedir la foto de
 * cada una por separado serían decenas de llamadas. Aquí se trae el índice de
 * archivos completo y se arma un mapa `userId → url`.
 *
 * @returns {{fotos: Record<string,string>, cargando: boolean, recargar: () => void}}
 */
export const useEmployeePhotos = () => {
  const [fotos, setFotos] = useState({});
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);

    try {
      const archivos = await FileApi.getAll();

      const mapa = {};

      (Array.isArray(archivos) ? archivos : [])
        .filter((f) => f.tableName === TABLA_FOTO && f.referenceId)
        // La más reciente gana si quedaron varias del mismo usuario
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .forEach((f) => {
          mapa[f.referenceId] = urlDeArchivo(f.filePath);
        });

      setFotos(mapa);
    } catch (error) {
      console.error('No se pudieron cargar las fotos de perfil:', error);
      setFotos({});
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { fotos, cargando, recargar: cargar };
};

export default useEmployeePhotos;
