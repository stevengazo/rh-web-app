import { useState } from "react";
import resultsApi from "../../api/resultsApi";

const ResultAdd = ({ user_ObjetiveId, onSuccess }) => {
  const [formData, setFormData] = useState({
    evalution: "",
    resultDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.evalution || !formData.resultDate) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        evalution: Number(formData.evalution),
        resultDate: formData.resultDate,
        user_ObjetiveId: user_ObjetiveId,
      };

      await resultsApi.createResult(payload);

      setFormData({
        evalution: "",
        resultDate: "",
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Error al guardar el resultado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Agregar Resultado
      </h2>

      {/* Evaluación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Evaluación
        </label>
        <input
          type="number"
          name="evalution"
          value={formData.evalution}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 85"
        />
      </div>

      {/* Fecha del resultado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha del resultado
        </label>
        <input
          type="date"
          name="resultDate"
          value={formData.resultDate}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Botón */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ResultAdd;
