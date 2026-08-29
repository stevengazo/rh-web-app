import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, FileText, X } from 'lucide-react';

import { urlDeArchivo } from '../../utils/fileUrl';

/**
 * Visor de un archivo adjunto (PDF o imagen).
 *
 * Se monta con `createPortal` sobre `document.body` a propósito: el drawer que
 * suele contenerlo lleva `transform`, y un elemento `fixed` dentro de un
 * elemento transformado se posiciona respecto a ese contenedor, no a la
 * ventana — el modal habría quedado encerrado en el panel lateral.
 *
 * @param {object|null} archivo  Registro de `Files`.
 * @param {() => void} onClose
 */
const FilePreviewModal = ({ archivo, onClose }) => {
  const abierto = Boolean(archivo);

  // Cerrar con Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!abierto) return;

    const alTeclear = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', alTeclear);

    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener('keydown', alTeclear);
    };
  }, [abierto, onClose]);

  if (typeof document === 'undefined') return null;

  const url = urlDeArchivo(archivo?.filePath);
  const esPdf = archivo?.contentType === 'application/pdf';

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista previa de ${archivo.fileName}`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.97, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden
                       rounded-xl border border-stroke-soft bg-surface shadow-2xl"
          >
            {/* Franja de acento, igual que en los paneles */}
            <div
              aria-hidden="true"
              className="h-1.5 shrink-0 bg-linear-to-r from-brand to-accent"
            />

            {/* Cabecera */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stroke-soft px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg
                    ${esPdf ? 'bg-red-50 text-red-600' : 'bg-brand-tint text-brand'}`}
                >
                  <FileText size={17} />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {archivo.fileName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {esPdf ? 'Documento PDF' : 'Imagen'}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title="Abrir en una pestaña nueva"
                  aria-label="Abrir en una pestaña nueva"
                  className="grid h-9 w-9 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-brand"
                >
                  <ExternalLink size={17} />
                </a>

                <a
                  href={url}
                  download={archivo.fileName}
                  title="Descargar"
                  aria-label="Descargar"
                  className="grid h-9 w-9 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-brand"
                >
                  <Download size={17} />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  title="Cerrar"
                  aria-label="Cerrar vista previa"
                  className="grid h-9 w-9 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-ink"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="min-h-0 flex-1 bg-canvas">
              {esPdf ? (
                <iframe
                  src={url}
                  title={archivo.fileName}
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full items-center justify-center overflow-auto p-4">
                  <img
                    src={url}
                    alt={archivo.fileName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FilePreviewModal;
