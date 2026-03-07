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
        user_ObjetiveId,
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
      className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 space-y-6"
    >
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Agregar Resultado
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registra una nueva evaluación del objetivo.
        </p>
      </div>

      {/* Evaluación */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Evaluación
        </label>

        <input
          type="number"
          name="evalution"
          value={formData.evalution}
          onChange={handleChange}
          placeholder="Ej: 85"
          className="
            w-full
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-950
            rounded-lg
            px-3 py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:border-primary
            transition
          "
        />
      </div>

      {/* Fecha */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Fecha del resultado
        </label>

        <input
          type="date"
          name="resultDate"
          value={formData.resultDate}
          onChange={handleChange}
          className="
            w-full
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-950
            rounded-lg
            px-3 py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:border-primary
            transition
          "
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex items-center gap-2
            bg-primary
            text-white
            px-5 py-2.5
            text-sm
            font-medium
            rounded-lg
            hover:opacity-90
            transition
            disabled:opacity-50
          "
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}

          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ResultAdd;