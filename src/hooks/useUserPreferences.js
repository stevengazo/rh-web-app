import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import userPreferencesApi from '../api/userPreferencesApi';
import FileApi from '../api/FileApi';
import { urlDeArchivo } from '../utils/fileUrl';
import { useAppContext } from '../context/AppContext';
import useTheme from './useTheme';

/** Tabla con la que se referencia la imagen de fondo del perfil en `Files`. */
export const TABLA_FONDO = 'ProfileBackground';

const CLAVE_CACHE = 'rh:prefs';

const leerCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CACHE) || 'null');
  } catch {
    return null;
  }
};

const guardarCache = (p) => {
  try {
    if (p) localStorage.setItem(CLAVE_CACHE, JSON.stringify(p));
    else localStorage.removeItem(CLAVE_CACHE);
  } catch {
    /* modo privado */
  }
};

const modoEfectivo = (mode) => {
  if (mode === 'light' || mode === 'dark') return mode;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/** Escribe (o limpia) el override del color de acento sobre `<html>`. */
const aplicarAcento = (hex) => {
  const root = document.documentElement;
  if (hex) {
    root.style.setProperty('--color-accent', hex);
    root.style.setProperty('--color-accent-strong', hex);
  } else {
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--color-accent-strong');
  }
};

/* ------------------------------------------------------------------
   Store mínimo compartido: la personalización es una sola por sesión,
   así que el loader de `App`, "Mi perfil" y el panel de personalización
   ven todos el mismo estado.
   ------------------------------------------------------------------ */
const suscriptores = new Set();
let estado = { prefs: leerCache(), fondo: null, cargando: true, guardando: false };

const emitir = (parcial) => {
  estado = { ...estado, ...parcial };
  suscriptores.forEach((fn) => fn());
};
const suscribir = (fn) => {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
};
const instantanea = () => estado;

/**
 * Personalización de la interfaz del colaborador, persistida en el servidor.
 *
 * Se monta una vez en `App` (para aplicar el tema al entrar) y también en la
 * pantalla de "Mi perfil" (para editarla); comparten el store de arriba y la
 * caché de `localStorage`, que solo evita el parpadeo inicial.
 */
export const useUserPreferences = () => {
  const { user } = useAppContext();
  const userId = user?.id;
  const { tema, modo, setTema, setModo } = useTheme();

  const { prefs, fondo, cargando, guardando } = useSyncExternalStore(
    suscribir,
    instantanea
  );
  const aplicadoInicial = useRef(false);

  const aplicar = useCallback(
    (p) => {
      if (!p) return;
      if (p.themeId && p.themeId !== tema) setTema(p.themeId);
      const m = modoEfectivo(p.mode);
      if (m !== modo) setModo(m);
    },
    [tema, modo, setTema, setModo]
  );

  const cargar = useCallback(async () => {
    if (!userId) {
      emitir({ cargando: false });
      return;
    }
    emitir({ cargando: true });
    try {
      const [prefRes, fondoRes] = await Promise.allSettled([
        userPreferencesApi.getForUser(userId),
        FileApi.getByReference(TABLA_FONDO, userId),
      ]);

      const p = prefRes.status === 'fulfilled' ? prefRes.value?.data ?? null : null;
      guardarCache(p);

      const archivos =
        fondoRes.status === 'fulfilled' && Array.isArray(fondoRes.value)
          ? fondoRes.value
          : [];
      const f = archivos.length
        ? [...archivos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        : null;

      emitir({ prefs: p, fondo: f, cargando: false });
      if (p) aplicar(p);
    } catch (e) {
      console.error('No se pudieron cargar las preferencias', e);
      emitir({ cargando: false });
    }
  }, [userId, aplicar]);

  useEffect(() => {
    const cache = leerCache();
    if (cache && !aplicadoInicial.current) {
      aplicar(cache);
      aplicadoInicial.current = true;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Mantiene vivo el override de acento aunque cambie el tema o el modo.
  useEffect(() => {
    aplicarAcento(prefs?.accentColor || null);
  }, [prefs?.accentColor, tema, modo]);

  const guardar = useCallback(
    async (patch) => {
      if (!userId) return;
      emitir({ guardando: true });
      try {
        const dto = {
          themeId: patch.themeId ?? prefs?.themeId ?? tema,
          mode: patch.mode ?? prefs?.mode ?? modo,
          accentColor:
            'accentColor' in patch ? patch.accentColor : prefs?.accentColor ?? null,
          backgroundOpacity:
            patch.backgroundOpacity ?? prefs?.backgroundOpacity ?? 100,
          settingsJson: patch.settingsJson ?? prefs?.settingsJson ?? null,
        };
        const res = await userPreferencesApi.saveForUser(userId, dto);
        const nuevo = res?.data ?? dto;
        guardarCache(nuevo);
        emitir({ prefs: nuevo, guardando: false });
        aplicar(nuevo);
        return nuevo;
      } catch (e) {
        emitir({ guardando: false });
        throw e;
      }
    },
    [userId, prefs, tema, modo, aplicar]
  );

  const subirFondo = useCallback(
    async (file) => {
      if (!userId || !file) return;
      const subida = await FileApi.upload(file, TABLA_FONDO, userId);
      if (fondo?.fileModelId) {
        try {
          await FileApi.delete(fondo.fileModelId);
        } catch (e) {
          console.error('No se pudo borrar el fondo anterior', e);
        }
      }
      emitir({ fondo: subida });
      return subida;
    },
    [userId, fondo]
  );

  const quitarFondo = useCallback(async () => {
    if (!fondo?.fileModelId) return;
    await FileApi.delete(fondo.fileModelId);
    emitir({ fondo: null });
  }, [fondo]);

  return {
    prefs,
    fondo,
    fondoUrl: urlDeArchivo(fondo?.filePath),
    cargando,
    guardando,
    tema,
    modo,
    guardar,
    subirFondo,
    quitarFondo,
    recargar: cargar,
  };
};

export default useUserPreferences;
