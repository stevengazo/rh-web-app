import { useState } from "react";
import { MessageSquare, Save } from "lucide-react";
import answersApi from "../../api/answersApi";

const AnswersAdd = ({ user_QuestionId, onSuccess }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("La respuesta no puede estar vacía.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        text,
        user_QuestionId,
      };

      await answersApi.post("/", payload);

      setText("");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Error al guardar la respuesta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5"
      >
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Agregar respuesta
          </h3>
          <p className="text-sm text-gray-500">
            Registra la respuesta asociada a la pregunta
          </p>
        </div>

        {/* Respuesta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Respuesta
          </label>

          <div className="relative">
            <MessageSquare
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe la respuesta aquí..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white
              px-6 py-2 rounded-lg text-sm font-medium
              hover:bg-blue-700 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {loading ? "Guardando..." : "Guardar respuesta"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswersAdd;
