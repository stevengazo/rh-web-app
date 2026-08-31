import { useCallback, useEffect, useSyncExternalStore } from 'react';

import messagingApi from '../api/messagingApi';
import { useAppContext } from '../context/AppContext';

/** Cada cuánto se consulta el contador global de no leídos. */
const INTERVALO_MS = 20000;

/* Store compartido: aunque el hook se monte en varios sitios (barra de
   navegación y botón flotante), hay un solo sondeo y todos ven el mismo total. */
const suscriptores = new Set();
let total = 0;
let userIdActivo = null;
let timer = null;

const emitir = (n) => {
  if (n === total) return;
  total = n;
  suscriptores.forEach((fn) => fn());
};

const consultar = async () => {
  if (!userIdActivo || document.hidden) return;
  try {
    const res = await messagingApi.getUnread(userIdActivo);
    emitir(Number(res?.data?.total) || 0);
  } catch {
    /* se reintenta en el siguiente ciclo */
  }
};

const arrancar = (userId) => {
  if (userId === userIdActivo) return;
  userIdActivo = userId;
  emitir(0);
  clearInterval(timer);
  if (!userId) return;
  consultar();
  timer = setInterval(consultar, INTERVALO_MS);
};

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) consultar();
  });
}

const suscribir = (fn) => {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
};
const instantanea = () => total;

/**
 * Total de mensajes internos sin leer del usuario en sesión.
 */
export const useUnreadMessages = () => {
  const { user } = useAppContext();
  const userId = user?.id ?? null;

  const valor = useSyncExternalStore(suscribir, instantanea);

  useEffect(() => {
    arrancar(userId);
  }, [userId]);

  const refrescar = useCallback(() => consultar(), []);

  return { total: valor, refrescar };
};

export default useUnreadMessages;
