import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import FileApi from '../api/FileApi';
import { urlDeArchivo } from '../utils/fileUrl';

/** Tabla con la que se referencian las fotos en `Files`. */
export const TABLA_FOTO = 'AspNetUsers';

/** La API solo acepta estos tipos. */
const TIPOS = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_MB = 5;

/**
 * Foto de perfil de un colaborador: consulta, sustitución y borrado.
 *
 * Vive en un hook para que el avatar y el menú de acciones compartan el mismo
 * estado en lugar de pedir la foto cada uno por su lado.
 *
 * @param {string} userId
 * @param {(archivo: object|null) => void} [onChange]
 */
export const useProfilePhoto = (userId, onChange) => {
  const [foto, setFoto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef(null);

  const cargar = useCallback(async () => {
    if (!userId) {
      setFoto(null);
      setCargando(false);
      return;
    }

    setCargando(true);

    try {
      const archivos = await FileApi.getByReference(TABLA_FOTO, userId);
      const lista = Array.isArray(archivos) ? archivos : [];

      // La más reciente gana, por si quedaron varias
      setFoto(
        lista.length
          ? [...lista].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )[0]
          : null
      );
    } catch (error) {
      console.error('Error obteniendo la foto de perfil:', error);
      setFoto(null);
    } finally {
      setCargando(false);
    }
  }, [userId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /** Abre el selector de archivos del sistema. */
  const elegirArchivo = useCallback(() => inputRef.current?.click(), []);

  /** Handler del `<input type="file">`. */
  const alSeleccionar = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = ''; // permite reelegir el mismo archivo
    if (!archivo) return;

    if (!TIPOS.includes(archivo.type)) {
      toast.error('La foto debe ser JPG o PNG.');
      return;
    }

    if (archivo.size > MAX_MB * 1024 * 1024) {
      toast.error(`La foto no puede pesar más de ${MAX_MB} MB.`);
      return;
    }

    setSubiendo(true);
    const anterior = foto;

    try {
      const subida = await FileApi.upload(archivo, TABLA_FOTO, userId);

      // La anterior se borra después, para no quedarse sin foto si algo falla.
      if (anterior?.fileModelId) {
        try {
          await FileApi.delete(anterior.fileModelId);
        } catch (error) {
          console.error('No se pudo borrar la foto anterior:', error);
        }
      }

      setFoto(subida);
      onChange?.(subida);
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo subir la foto. Intenta con otra imagen.');
    } finally {
      setSubiendo(false);
    }
  };

  const quitar = async () => {
    if (!foto?.fileModelId) return;
    if (!window.confirm('¿Quitar la foto de perfil?')) return;

    setSubiendo(true);

    try {
      await FileApi.delete(foto.fileModelId);
      setFoto(null);
      onChange?.(null);
      toast.success('Foto eliminada');
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar la foto.');
    } finally {
      setSubiendo(false);
    }
  };

  return {
    foto,
    url: urlDeArchivo(foto?.filePath),
    tieneFoto: Boolean(foto),
    cargando,
    subiendo,
    inputRef,
    elegirArchivo,
    alSeleccionar,
    quitar,
    recargar: cargar,
  };
};

export default useProfilePhoto;
