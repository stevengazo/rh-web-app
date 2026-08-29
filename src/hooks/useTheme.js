import { useCallback, useSyncExternalStore } from 'react';

import {
  TEMA_POR_DEFECTO,
  VARIABLES_DE_TEMA,
  buscarTema,
  variablesDe,
} from '../data/temas';

/**
 * Tema (paleta) y modo (claro/oscuro) de la aplicación.
 *
 * El estado real vive en el DOM y en `localStorage`, no en React: la clase
 * `.dark` y las variables sobre `<html>` las escribe también el script
 * anti-parpadeo de `index.html`, antes de que React arranque. Por eso se usa
 * `useSyncExternalStore` con un store propio: así todos los componentes que
 * lean el tema —el conmutador del header y el selector de Ajustes— ven
 * siempre lo mismo y se enteran de los cambios del otro.
 */

const CLAVE_TEMA = 'rh:tema';
const CLAVE_MODO = 'theme'; // el nombre que ya usaba el conmutador claro/oscuro

/* Variables ya resueltas del tema activo. Las lee el script anti-parpadeo de
   `index.html`, que no puede importar el catálogo por correr antes del
   bundle: así no hay que duplicar la paleta en dos sitios. */
const CLAVE_VARS = 'rh:tema-vars';

const leer = (clave, respaldo) => {
  try {
    return localStorage.getItem(clave) ?? respaldo;
  } catch {
    return respaldo;
  }
};

const escribir = (clave, valor) => {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* Modo privado: la preferencia dura lo que dure la pestaña. */
  }
};

export const modoInicial = () => {
  const guardado = leer(CLAVE_MODO, null);
  if (guardado === 'dark' || guardado === 'light') return guardado;

  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const temaInicial = () => buscarTema(leer(CLAVE_TEMA, null)).id;

/** Escribe la paleta sobre `<html>`, limpiando antes la del tema anterior. */
export const aplicar = (temaId, modo) => {
  const root = document.documentElement;

  root.classList.toggle('dark', modo === 'dark');
  root.style.colorScheme = modo;

  VARIABLES_DE_TEMA.forEach((v) => root.style.removeProperty(v));

  const vars = variablesDe(temaId, modo);
  Object.entries(vars).forEach(([v, valor]) => root.style.setProperty(v, valor));

  root.dataset.tema = temaId;
  escribir(CLAVE_VARS, JSON.stringify(vars));
};

/* ------------------------------------------------------------------
   Store mínimo: un conjunto de suscriptores y el valor actual.
   ------------------------------------------------------------------ */

const suscriptores = new Set();

let estado = { tema: TEMA_POR_DEFECTO, modo: 'light' };

/** Sincroniza el store con lo que ya hay en el DOM/localStorage. */
export const inicializarTema = () => {
  estado = { tema: temaInicial(), modo: modoInicial() };
  aplicar(estado.tema, estado.modo);
};

const suscribir = (fn) => {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
};

const instantanea = () => estado;

const actualizar = (parcial) => {
  const siguiente = { ...estado, ...parcial };
  if (siguiente.tema === estado.tema && siguiente.modo === estado.modo) return;

  estado = siguiente;
  aplicar(estado.tema, estado.modo);
  suscriptores.forEach((fn) => fn());
};

/**
 * @returns {{tema: string, modo: 'light'|'dark', setTema: Function,
 *            setModo: Function, alternarModo: Function}}
 */
const useTheme = () => {
  const { tema, modo } = useSyncExternalStore(suscribir, instantanea);

  const setTema = useCallback((id) => {
    escribir(CLAVE_TEMA, buscarTema(id).id);
    actualizar({ tema: buscarTema(id).id });
  }, []);

  const setModo = useCallback((nuevo) => {
    escribir(CLAVE_MODO, nuevo);
    actualizar({ modo: nuevo });
  }, []);

  const alternarModo = useCallback(
    () => setModo(estado.modo === 'dark' ? 'light' : 'dark'),
    [setModo]
  );

  return { tema, modo, setTema, setModo, alternarModo };
};

export default useTheme;
