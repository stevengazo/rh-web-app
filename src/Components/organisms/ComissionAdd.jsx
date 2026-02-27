import { useState } from "react";
import comissionsApi from "../../api/comissionsApi";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

// Helper
const formatDateYYYYMMDD = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const ComissionAdd = ({ userId, author }) => {
  const [form, setForm] = useState({
    comissionId: 0,
    date: "",
    amount: "",
    description: "",
    createdBy: author?.email || author || "",
    createdAt: new Date().toISOString(),
    draft: true,
    deleted: false,
    userId: userId || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.date || !form.amount) {
      setError("La fecha y el monto son obligatorios");
      return;
    }

    const payload = {
      ...form,
      date: formatDateYYYYMMDD(form.date),
      amount: Number(form.amount),
    };

    try {
      setLoading(true);
      await comissionsApi.createComission(payload);
      toast.success("Comisión guardada exitosamente");

      setForm((prev) => ({
        ...prev,
        date: "",
        amount: "",
        description: "",
        draft: true,
      }));
    } catch (err) {
      setError("Error al guardar la comisión");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-white"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Registrar comisión
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Registro de comisiones del empleado
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="text-sm text-gray-200">
          Fecha
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Monto */}
      <div>
        <label className="text-sm text-gray-200">
          Monto
        </label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-200">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className={inputStyle + " resize-none"}
        />
      </div>

      {/* Draft */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="draft"
          checked={form.draft}
          onChange={handleChange}
          className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-blue-400 focus:ring-blue-400"
        />
        <span className="text-sm text-gray-200">
          Guardar como borrador
        </span>
      </div>

      {/* Botón */}
      <PrimaryButton
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        {loading ? "Guardando..." : "Guardar comisión"}
      </PrimaryButton>
    </form>
  );
};

export default ComissionAdd;