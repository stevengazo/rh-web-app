import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessagesSquare } from 'lucide-react';

import messagingApi from '../api/messagingApi';
import { useAppContext } from '../context/AppContext';
import useOffCanvas from '../hooks/useOffCanvas';

import PageTitle from '../Components/PageTitle';
import OffCanvas from '../Components/OffCanvas';
import ConversationList from '../Components/organisms/messaging/ConversationList';
import MessageThread from '../Components/organisms/messaging/MessageThread';
import NewConversationForm from '../Components/organisms/messaging/NewConversationForm';

/** Cada cuánto se refresca la bandeja de conversaciones. */
const POLL_MS = 12000;

const MessagesPage = () => {
  const { user } = useAppContext();
  const userId = user?.id;
  const { open, canvasTitle, canvasContent, openCanvas, closeCanvas } = useOffCanvas();

  const [conversaciones, setConversaciones] = useState([]);
  const [activa, setActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const primeraCarga = useRef(true);

  const cargar = useCallback(async () => {
    if (!userId) {
      setCargando(false);
      return;
    }
    try {
      const res = await messagingApi.getConversations(userId);
      const lista = Array.isArray(res.data) ? res.data : [];
      setConversaciones(lista);
      if (primeraCarga.current) {
        primeraCarga.current = false;
        if (lista.length && window.innerWidth >= 768) {
          setActiva(lista[0].conversationId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  }, [userId]);

  useEffect(() => {
    cargar();
    const id = setInterval(() => {
      if (!document.hidden) cargar();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [cargar]);

  const abrirNueva = () =>
    openCanvas(
      'Nuevo mensaje',
      <NewConversationForm
        onCreated={(convId) => {
          closeCanvas();
          setActiva(convId);
          cargar();
        }}
        onCancel={closeCanvas}
      />
    );

  return (
    <>
      <AnimatePresence>
        {open && (
          <OffCanvas isOpen={open} onClose={closeCanvas} title={canvasTitle}>
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
            >
              {canvasContent}
            </motion.div>
          </OffCanvas>
        )}
      </AnimatePresence>

      <div className="mb-4">
        <PageTitle className="mb-0">Mensajes</PageTitle>
        <p className="text-sm text-ink-muted">
          Mensajería interna entre colaboradores.
        </p>
      </div>

      <div className="grid h-[calc(100vh-13rem)] grid-cols-1 overflow-hidden rounded-xl border border-stroke-soft bg-surface shadow-sm md:grid-cols-[320px_1fr]">
        {/* Lista — se oculta en móvil cuando hay un hilo abierto */}
        <div
          className={`min-h-0 border-r border-stroke-soft ${
            activa ? 'hidden md:block' : 'block'
          }`}
        >
          {cargando ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-alt" />
              ))}
            </div>
          ) : (
            <ConversationList
              conversations={conversaciones}
              activeId={activa}
              onSelect={setActiva}
              onNew={abrirNueva}
            />
          )}
        </div>

        {/* Hilo */}
        <div className={`min-h-0 ${activa ? 'block' : 'hidden md:block'}`}>
          {activa ? (
            <MessageThread
              key={activa}
              conversationId={activa}
              onBack={() => setActiva(null)}
              onChanged={cargar}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-muted">
              <MessagesSquare size={34} />
              <p className="text-sm font-medium">Elige una conversación</p>
              <p className="text-xs">o empieza una nueva con el botón +</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
