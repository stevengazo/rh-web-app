import { Trash2, Download } from 'lucide-react';

const ListFiles = ({ files = [], onDelete }) => {
  const hasFiles = files && files.length > 0;

  const handleDelete = async (id) => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700">
          Archivos Adjuntos
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        {!hasFiles ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
            <p className="text-sm">No hay archivos cargados</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file.fileModelId}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                    {file.fileName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <a
                    href={file.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
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
