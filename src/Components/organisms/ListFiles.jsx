import { Trash2, Download } from 'lucide-react';

const ListFiles = ({ files = [], onDelete }) => {
  const hasFiles = files && files.length > 0;

  const handleDelete = async (id) => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-surface rounded-xl border border-stroke-soft shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stroke-soft">
        <h3 className="text-lg font-semibold text-ink">
          Archivos Adjuntos
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        {!hasFiles ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-ink-muted">
            <p className="text-sm">No hay archivos cargados</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file.fileModelId}
                className="group flex items-center justify-between p-3 rounded-xl border border-stroke-soft hover:border-stroke hover:bg-canvas transition-all"
              >
                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-ink truncate max-w-[200px] sm:max-w-xs">
                    {file.fileName}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={file.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-brand hover:text-brand-hover transition-colors"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Descargar</span>
                  </a>

                  <button
                    onClick={() => handleDelete(file.fileModelId)}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListFiles;
