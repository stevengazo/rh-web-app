import { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-react';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';

/**
 * Diálogo modal de confirmación, en el estilo Fluent del sistema.
 *
 * Sustituye a `window.confirm` / `window.prompt`: además de confirmar, puede
 * pedir un motivo obligatorio (para rechazos) y muestra un botón primario rojo
 * cuando la acción es destructiva.
 *
 * Se monta solo mientras está visible (lo hace `useConfirm`), así que el estado
 * interno arranca limpio en cada apertura sin necesidad de efectos.
 *
 * @param {string} title
 * @param {import('react').ReactNode} [message]
 * @param {string} [confirmLabel]
 * @param {string} [cancelLabel]
 * @param {'brand'|'danger'} [tone]
 * @param {boolean} [requireReason] Muestra un campo de texto obligatorio.
 * @param {string} [reasonLabel]
 * @param {string} [reasonPlaceholder]
 * @param {boolean} [busy] Bloquea los botones mientras se resuelve la acción.
 * @param {(reason: string) => void} onConfirm
 * @param {() => void} onCancel
 */
const ConfirmDialog = ({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'brand',
  requireReason = false,
  reasonLabel = 'Motivo',
  reasonPlaceholder = 'Escribe el motivo…',
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const titleId = useId();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const confirmRef = useRef(null);
  const reasonRef = useRef(null);

  // Foco inicial: al campo de motivo si lo hay, si no al botón primario.
  useEffect(() => {
    const t = setTimeout(() => {
      (requireReason ? reasonRef.current : confirmRef.current)?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [requireReason]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !busy) onCancel?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [busy, onCancel]);

  const faltaMotivo = requireReason && !reason.trim();

  const handleConfirm = () => {
    if (faltaMotivo) {
      setTouched(true);
      reasonRef.current?.focus();
      return;
    }
    onConfirm?.(reason.trim());
  };

  const Icon = tone === 'danger' ? AlertTriangle : HelpCircle;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !busy && onCancel?.()}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl"
      >
        <div
          aria-hidden="true"
          className="h-1.5 bg-linear-to-r from-brand to-accent"
        />

        <div className="p-6">
          <div className="flex items-start gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                tone === 'danger'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-brand-tint text-brand'
              }`}
            >
              <Icon size={20} />
            </span>

            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold text-ink">
                {title}
              </h2>
              {message && (
                <div className="mt-1 text-sm text-ink-secondary">{message}</div>
              )}
            </div>
          </div>

          {requireReason && (
            <div className="mt-4">
              <label
                htmlFor={`${titleId}-reason`}
                className="mb-1 block text-sm font-medium text-ink-secondary"
              >
                {reasonLabel} *
              </label>
              <textarea
                id={`${titleId}-reason`}
                ref={reasonRef}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                onBlur={() => setTouched(true)}
                rows={3}
                placeholder={reasonPlaceholder}
                className="w-full resize-none rounded-md border border-stroke border-b-2 border-b-ink-muted
                           bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted
                           transition-colors focus:border-b-brand focus:outline-none"
              />
              {touched && faltaMotivo && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  El motivo es obligatorio.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton onClick={onCancel} disabled={busy}>
              {cancelLabel}
            </SecondaryButton>

            <PrimaryButton
              ref={confirmRef}
              onClick={handleConfirm}
              disabled={busy || faltaMotivo}
              className={
                tone === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600'
                  : ''
              }
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Procesando…
                </>
              ) : (
                confirmLabel
              )}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
