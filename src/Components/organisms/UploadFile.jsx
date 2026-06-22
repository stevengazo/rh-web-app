import { useState } from 'react';
import FileApi from '../../api/FileApi';
import PrimaryButton from '../PrimaryButton';

const UploadFile = ({ userId, onUploaded, onAdded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Seleccionar archivo
  const handleSelectFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // Validar tipo permitido
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];
    if (!allowedTypes.includes(selected.type)) {
      alert('Tipo de archivo no permitido. Solo imágenes o PDF.');
      return;
    }

    setFile(selected);

    // Vista previa solo para imágenes
    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  // Subir archivo
  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const result = await FileApi.upload(file, 'User_Data', userId);

      setFile(null);

      // Notificar al padre que se subió un archivo
      if (onUploaded) onUploaded(result);

      // Mostrar preview si es imagen
      if (result.contentType.startsWith('image/')) {
        setPreview(result.filePath);
      } else {
        setPreview(null);
      }
      onAdded();
    } catch (error) {
      console.error(error);
      alert('Error subiendo archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview solo para imágenes */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-full border border-stroke-soft shadow-sm"
        />
      )}

      {/* Input archivo */}
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleSelectFile}
        className="block w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-tint file:text-brand hover:file:bg-brand-100"
      />

      {/* Mensaje de estado */}
      {!file && !loading && (
        <p className="text-sm text-ink-muted">
          Seleccione un archivo para habilitar el botón
        </p>
      )}
      {loading && (
        <p className="text-sm text-ink-muted">
          Subiendo archivo, por favor espere...
        </p>
      )}

      {/* Botón subir */}
      <PrimaryButton
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Subiendo...' : 'Subir'}
      </PrimaryButton>
    </div>
  );
};

export default UploadFile;
