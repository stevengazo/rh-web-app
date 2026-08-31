import { useCallback, useRef, useState } from 'react';

import ConfirmDialog from '../Components/organisms/ConfirmDialog';

/**
 * Confirmaciones modales sin `window.confirm` / `window.prompt`.
 *
 * Uso: `const { confirm, dialog } = useConfirm();`, se renderiza `{dialog}` una
 * vez en la página y se llama `await confirm({ title, tone, confirmLabel, ... })`.
 *
 * `confirm(opts)` devuelve una promesa que resuelve a `false` si se cancela, o a
 * un string (vacío, o el motivo si `requireReason: true`) si se confirma. Si se
 * pasa `opts.onConfirm`, el diálogo queda en estado "procesando" hasta que esa
 * función termine.
 */
export const useConfirm = () => {
  const [state, setState] = useState(null); // { ...opts } | null
  const [busy, setBusy] = useState(false);
  const resolver = useRef(null);

  const cerrar = useCallback((valor) => {
    resolver.current?.(valor);
    resolver.current = null;
    setBusy(false);
    setState(null);
  }, []);

  const confirm = useCallback((opts = {}) => {
    setState(opts);
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(
    (reason) => {
      // Si el llamador pasó `onConfirm`, se ejecuta con el diálogo en estado
      // "procesando"; si no, se resuelve la promesa de inmediato.
      if (typeof state?.onConfirm === 'function') {
        setBusy(true);
        Promise.resolve(state.onConfirm(reason))
          .then(() => cerrar(reason))
          .catch(() => setBusy(false));
      } else {
        cerrar(reason);
      }
    },
    [state, cerrar]
  );

  const dialog =
    state !== null ? (
      <ConfirmDialog
        busy={busy}
        title={state.title ?? ''}
        message={state.message}
        confirmLabel={state.confirmLabel}
        cancelLabel={state.cancelLabel}
        tone={state.tone}
        requireReason={state.requireReason}
        reasonLabel={state.reasonLabel}
        reasonPlaceholder={state.reasonPlaceholder}
        onConfirm={handleConfirm}
        onCancel={() => cerrar(false)}
      />
    ) : null;

  return { confirm, dialog };
};

export default useConfirm;
