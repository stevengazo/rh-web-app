import { Trash2, Download } from "lucide-react";

const ListFiles = ({ files = [], onDelete }) => {
    console.log(files)
  if (!files || files.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Archivos Adjuntos</h3>
        <p>No hay archivos cargados.</p>
      </div>
    );
  }

  // Eliminar archivo
  const handleDelete = async (id) => {
    if (!confirm("¿Desea eliminar este archivo?")) return;
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Archivos Adjuntos</h3>

      <ul className="space-y-3">
        {files.map((file) => (
          <li
            key={file.fileModelId}
            className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{file.fileName}</span>
              <span className="text-gray-400 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={file.filePath}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download size={16} />
                Descargar
              </a>

              <button
                onClick={() => handleDelete(file.fileModelId)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListFiles;