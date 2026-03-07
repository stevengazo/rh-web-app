import { useState } from "react";
import FileApi from "../../api/FileApi";

const UploadImage = ({ userId }) => {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {

    if (!file) return;

    try {

      setLoading(true);

      const result = await FileApi.upload(
        file,
        "Users", // tabla
        userId   // id referencia
      );

      setPreview(result.filePath);
      setFile(null);

    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4 w-full max-w-sm">

      <h3 className="font-semibold text-lg">
        Subir Imagen
      </h3>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover rounded-md border"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleSelectFile}
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Subiendo..." : "Subir Imagen"}
      </button>

    </div>
  );
};

export default UploadImage;