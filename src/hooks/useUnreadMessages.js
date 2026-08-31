import { useCallback, useEffect, useRef, useState } from 'react';

import messagingApi from '../api/messagingApi';
import { useAppContext } from '../context/AppContext';

/** Cada cuánto se consulta el contador global de no leídos. */
const INTERVALO_MS = 20000;

/**
 * Total de mensajes internos sin leer del usuario en sesión, para el distintivo
 * de la barra de navegación. Se refresca por sondeo y también cuando la pestaña
 * vuelve a estar visible.
 */
export const useUnreadMessages = () => {
  const { user } = useAppContext();
  const userId = user?.id;
  const [total, setTotal] = useState(0);
  const timer = useRef(null);

  const consultar = useCallback(async () => {
    if (!userId || document.hidden) return;
    try {
      const res = await messagingApi.getUnread(userId);
      setTotal(Number(res?.data?.total) || 0);
    } catch {
      /* la red puede fallar; se reintenta en el siguiente ciclo */
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return undefined;

    consultar();
    timer.current = setInterval(consultar, INTERVALO_MS);

    const alVolver = () => {
      if (!document.hidden) consultar();
    };
    document.addEventListener('visibilitychange', alVolver);

    return () => {
      clearInterval(timer.current);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [userId, consultar]);

  return { total, refrescar: consultar };
};

export default useUnreadMessages;
