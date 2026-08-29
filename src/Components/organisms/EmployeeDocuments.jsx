import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Download,
  Eye,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';

import FileApi from '../../api/FileApi';
import FilePreviewModal from './FilePreviewModal';
import {
  CATEGORIAS_DOCUMENTO,
  TABLA_DOCUMENTOS,
  etiquetaCategoria,
} from '../../data/documentos';
import { urlDeArchivo } from '../../utils/fileUrl';

const TIPOS = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_MB = 10;

const pesoLegible = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatFecha = (valor) => {
  if (!valor) return '';
  const f = new Date(valor);
  return Number.isNaN(f.getTime())
    ? ''
    : f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

/**
 * Documentos del expediente, clasificados por categoría.
 *
 * Antes se subían sin ninguna clasificación y a una tabla distinta
 * (`User_Data`) de la que se leía, así que el archivo desaparecía después de
 * subirlo. Ahora ambas operaciones usan `TABLA_DOCUMENTOS` y cada documento
 * lleva su categoría.
 *
 * @param {string} userId
 * @param {Array} files       Documentos ya cargados por el hook del expediente.
 * @param {() => void} onChanged  Se llama tras subir o eliminar.
 * @param {(id: number) => void} [onDelete] Borrado delegado al hook.
 */
const EmployeeDocuments = ({ userId, files = [], onChanged, onDelete }) => {
  const [categoriaSubida, setCategoriaSubida] = useState(
    CATEGORIAS_DOCUMENTO[0].id
  );
  const [filtro, setFiltro] = useState('todas');
  const [subiendo, setSubiendo] = useState(false);
  const [enVista, setEnVista] = useState(null);
  const inputRef = useRef(null);

  /* Sólo se ofrecen filtros de categorías que tienen documentos. */
  const categoriasConDocs = useMemo(() => {
    const cuentas = new Map();

    files.forEach((f) => {
      const clave = f.category || 'Sin clasificar';
      cuentas.set(clave, (cuentas.get(clave) ?? 0) + 1);
    });

    return [...cuentas.entries()].sort((a, b) => b[1] - a[1]);
  }, [files]);

  const visibles = useMemo(
    () =>
      filtro === 'todas'
        ? files
        : files.filter((f) => (f.category || 'Sin clasificar') === filtro),
    [files, filtro]
  );

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
      await FileApi.upload(
        archivo,
        TABLA_DOCUMENTOS,
        String(userId),
        categoriaSubida
      );
      toast.success(`Documento agregado a ${etiquetaCategoria(categoriaSubida)}`);
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo subir el documento.');
    } finally {
      setSubiendo(false);
    }
  };

  const eliminar = async (archivo) => {
    if (onDelete) {
      onDelete(archivo.fileModelId);
      return;
    }

    if (!window.confirm(`¿Eliminar "${archivo.fileName}"?`)) return;

    try {
      await FileApi.delete(archivo.fileModelId);
      toast.success('Documento eliminado');
      onChanged?.();
    } catch (error) {
      console.error(error);
      toast.error('No se pudo eliminar el documento.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Zona de carga */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-stroke-soft bg-surface-alt p-4">
        <div className="min-w-52 flex-1">
          <label
            htmlFor="doc-categoria"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted"
          >
            Categoría del documento
          </label>

          <select
            id="doc-categoria"
            value={categoriaSubida}
            onChange={(e) => setCategoriaSubida(e.target.value)}
            className="h-10 w-full rounded-md border border-stroke border-b-2 border-b-ink-muted
                       bg-surface px-3 text-sm text-ink transition-colors
                       focus:border-b-brand focus:outline-none"
          >
            {CATEGORIAS_DOCUMENTO.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <p className="mt-1 text-xs text-ink-muted">
            {
              CATEGORIAS_DOCUMENTO.find((c) => c.id === categoriaSubida)
                ?.descripcion
            }
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm
                     font-semibold text-white transition-colors hover:bg-brand-hover
                     disabled:cursor-not-allowed disabled:opacity-60"
        >
          {subiendo ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          Subir documento
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={subir}
          className="hidden"
        />
      </div>

      {/* Filtros por categoría */}
      {categoriasConDocs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFiltro('todas')}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors
              ${
                filtro === 'todas'
                  ? 'border-brand bg-brand-tint text-brand-700'
                  : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
              }`}
          >
            Todas
            <span className="ml-1.5 opacity-70">{files.length}</span>
          </button>

          {categoriasConDocs.map(([categoria, cuenta]) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setFiltro(categoria)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors
                ${
                  filtro === categoria
                    ? 'border-brand bg-brand-tint text-brand-700'
                    : 'border-stroke-soft bg-surface text-ink-muted hover:border-brand hover:text-brand'
                }`}
            >
              {etiquetaCategoria(categoria)}
              <span className="ml-1.5 opacity-70">{cuenta}</span>
            </button>
          ))}
        </div>
      )}

      {/* Listado */}
      {visibles.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl
                     border border-dashed border-stroke bg-surface-alt py-12 text-ink-muted"
        >
          <FolderOpen size={26} />
          <p className="text-sm">
            {files.length === 0
              ? 'No hay documentos en el expediente.'
              : 'No hay documentos en esa categoría.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visibles.map((a) => {
            const esPdf = a.contentType === 'application/pdf';

            return (
              <li
                key={a.fileModelId}
                className="flex items-center gap-3 rounded-lg border border-stroke-soft
                           bg-surface p-3 transition-colors hover:border-brand"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg
                    ${esPdf ? 'bg-red-50 text-red-600' : 'bg-brand-tint text-brand'}`}
                >
                  {esPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {a.fileName}
                  </p>
                  <p className="text-xs text-ink-muted">
                    <span className="font-medium text-ink-secondary">
                      {etiquetaCategoria(a.category)}
                    </span>
                    {a.size ? ` · ${pesoLegible(a.size)}` : ''}
                    {formatFecha(a.createdAt) ? ` · ${formatFecha(a.createdAt)}` : ''}
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
                  href={urlDeArchivo(a.filePath)}
                  download={a.fileName}
                  title="Descargar"
                  aria-label={`Descargar ${a.fileName}`}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-canvas hover:text-ink"
                >
                  <Download size={16} />
                </a>

                <button
                  type="button"
                  onClick={() => eliminar(a)}
                  title="Eliminar documento"
                  aria-label={`Eliminar ${a.fileName}`}
                  className="grid h-8 w-8 place-items-center rounded-md text-ink-muted
                             transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <FilePreviewModal archivo={enVista} onClose={() => setEnVista(null)} />
    </div>
  );
};

export default EmployeeDocuments;
