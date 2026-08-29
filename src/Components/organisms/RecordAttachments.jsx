import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
} from 'lucide-react';

import FileApi from '../../api/FileApi';
import FilePreviewModal from './FilePreviewModal';
import { urlDeArchivo } from '../../utils/fileUrl';

/** Tipos que acepta la API. */
const TIPOS = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_MB = 10;

const pesoLegible = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Archivos adjuntos de un registro (el certificado en PDF de un curso, el
 * comprobante de una certificación, etc.).
 *
 * Se apoya en la tabla `Files`, que asocia por `(TableName, ReferenceId)`.
 *
 * @param {string} tabla          Ej. 'Course'.
 * @param {string|number} referenciaId
 * @param {boolean} [editable]
 * @param {string} [titulo]
 */
const RecordAttachments = ({
  tabla,
  referenciaId,
  editable = true,
  titulo = 'Documentos adjuntos',
}) => {
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [enVista, setEnVista] = useState(null); // archivo abierto en el visor
  const inputRef = useRef(null);

  const cargar = useCallback(async () => {
    if (!tabla || referenciaId === undefined || referenciaId === null) {
      setCargando(false);
      return;
    }

    setCargando(true);

    try {
      const lista = await FileApi.getByReference(tabla, String(referenciaId));
      setArchivos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error('Error cargando adjuntos:', error);
      setArchivos([]);
    } finally {
      setCargando(false);
    }
  }, [tabla, referenciaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const subir = async (evento) => {
    const archivo = evento.target.files?.[0];
    evento.target.value = '';
    if (!archivo) return;

    if (!TIPOS.includes(archivo.type)) {
      toast.error('Solo se admiten archivos PDF, JPG o PNG.');
      return;
    }

    if (archivo.size > MAX_MB * 1024 * 1024) {
      toast.error(`El archivo no puede pesar más de ${MAX_MB} MB.`);
      return;
    }

    setSubiendo(true);

    try {
      await FileApi.upload(archivo, tabla, String(referenciaId));
      toast.success('Documento adjuntado');
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo subir el documento.');
    } finally {
      setSubiendo(false);
    }
  };

  const eliminar = async (archivo) => {
    if (!window.confirm(`¿Eliminar "${archivo.fileName}"?`)) return;

    setSubiendo(true);

    try {
      await FileApi.delete(archivo.fileModelId);
      toast.success('Documento eliminado');
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar el documento.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
          <Paperclip size={14} />
          {titulo}
          {archivos.length > 0 && (
            <span className="rounded-full bg-brand-tint px-1.5 py-0.5 text-[11px] text-brand-700">
              {archivos.length}
            </span>
          )}
        </h3>

        {editable && (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={subiendo}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke
                         bg-surface px-2.5 py-1.5 text-xs font-semibold text-ink-secondary
                         transition-colors hover:border-brand hover:text-brand
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              {subiendo ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Upload size={13} />
              )}
              Adjuntar PDF
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              onChange={subir}
              className="hidden"
            />
          </>
        )}
      </div>

      {cargando ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-alt" />
          ))}
        </div>
      ) : archivos.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed
                        border-stroke bg-surface-alt py-6 text-ink-muted">
          <FileText size={22} />
          <p className="text-sm">Sin documentos adjuntos.</p>
          {editable && (
            <p className="text-xs">Adjunta aquí el certificado en PDF.</p>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {archivos.map((a) => {
            const url = urlDeArchivo(a.filePath);
            const esPdf = a.contentType === 'application/pdf';

            return (
              <li
                key={a.fileModelId}
                onDoubleClick={() => setEnVista(a)}
                className="flex items-center gap-3 rounded-lg border border-stroke-soft
                           bg-surface-alt p-3 transition-colors hover:border-brand"
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg
                    ${esPdf ? 'bg-red-50 text-red-600' : 'bg-brand-tint text-brand'}`}
                >
                  {esPdf ? <FileText size={17} /> : <ImageIcon size={17} />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {a.fileName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {esPdf ? 'PDF' : 'Imagen'}
                    {a.size ? ` · ${pesoLegible(a.size)}` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEnVista(a)}
                  title="Ver documento"
                  aria-label={`Ver ${a.fileName}`}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-brand-tint hover:text-brand"
                >
                  <Eye size={16} />
                </button>

                <a
                  href={url}
                  download={a.fileName}
                  title="Descargar"
                  aria-label={`Descargar ${a.fileName}`}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-ink"
                >
                  <Download size={16} />
                </a>

                {editable && (
                  <button
                    type="button"
                    onClick={() => eliminar(a)}
                    disabled={subiendo}
                    title="Eliminar documento"
                    aria-label={`Eliminar ${a.fileName}`}
                    className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                               transition-colors hover:bg-red-50 hover:text-red-600
                               disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <FilePreviewModal archivo={enVista} onClose={() => setEnVista(null)} />
    </section>
  );
};

export default RecordAttachments;
