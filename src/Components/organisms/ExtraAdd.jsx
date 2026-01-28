import { useEffect, useState } from "react";
import extrasApi from "../../api/extrasApi";
import extraTypeApi from "../../api/extraType";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

// Helpers
const formatDateYYYYMMDD = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const ExtraAdd = ({ userId, author }) => {
  const [extraTypes, setExtraTypes] = useState([]);

  const [form, setForm] = useState({
    extraId: 0,
    start: "",
    end: "",
    amount: "",
    notes: "",
    createdBy: author?.email || author || "",
    createdAt: new Date().toISOString(),
    updatedBy: null,
    updatedAt: null,
    approvedBy: null,
    approvedAt: null,
    isAproved: false,
    isDeleted: false,
    userId: userId || "",
    user: null,
    extraTypeId: "",
    extraType: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Cargar tipos de extra
  useEffect(() => {
    const fetchExtraTypes = async () => {
      try {
        const res = await extraTypeApi.getallExtraTypes();
        setExtraTypes(res.data);
      } catch (err) {
        console.error("Error cargando tipos de extra", err);
      }
    };

    fetchExtraTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      updatedAt: new Date().toISOString(),
      updatedBy: prev.createdBy,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.start || !form.end || !form.amount || !form.extraTypeId) {
      setError("Debe completar fechas, monto y tipo de extra");
      return;
    }

    const payload = {
      ...form,
      start: formatDateYYYYMMDD(form.start),
      end: formatDateYYYYMMDD(form.end),
      amount: Number(form.amount),
    };

    // ❌ eliminar DateTime nulos
    if (!payload.approvedAt) delete payload.approvedAt;
    if (!payload.updatedAt) delete payload.updatedAt;
    if (!payload.approvedBy) delete payload.approvedBy;
    if (!payload.updatedBy) delete payload.updatedBy;

    try {
      setLoading(true);
      await extrasApi.createExtra(payload);
      toast.success("Extra registrado exitosamente");

      // reset parcial
      setForm((prev) => ({
        ...prev,
        start: "",
        end: "",
        amount: "",
        notes: "",
        extraTypeId: "",
      }));
    } catch (err) {
      setError("Error al guardar el extra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg text-black bg-white p-6 rounded-xl shadow-md space-y-5"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Registrar extra
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Tipo de extra */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de extra
        </label>
        <select
          name="extraTypeId"
          value={form.extraTypeId}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un tipo</option>
          {extraTypes.map((t) => (
            <option key={t.extraTypeId} value={t.extraTypeId}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fecha inicio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha inicio
        </label>
        <input
          type="date"
          name="start"
          value={form.start}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Fecha fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha fin
        </label>
        <input
          type="date"
          name="end"
          value={form.end}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Monto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botón */}
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar extra"}
      </PrimaryButton>
    </form>
  );
};

export default ExtraAdd;
