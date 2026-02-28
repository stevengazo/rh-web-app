import { useEffect, useMemo, useState } from "react";
import extrasApi from "../../api/extrasApi";
import extraTypeApi from "../../api/extraType";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

const ExtraAdd = ({ userId, author }) => {
  const [extraTypes, setExtraTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    start: "",
    end: "",
    amount: "",
    notes: "",
    createdBy: author?.email || author || "",
    createdAt: new Date().toISOString(),
    userId: userId || "",
    extraTypeId: "",
  });

  /* =========================
     Cargar tipos de extra
  ========================= */
  useEffect(() => {
    const fetchExtraTypes = async () => {
      try {
        const res = await extraTypeApi.getallExtraTypes();
        setExtraTypes(res.data);
      } catch (err) {
        toast.error("Error cargando tipos de extra");
      }
    };
    fetchExtraTypes();
  }, []);

  /* =========================
     Calcular duración en horas
  ========================= */
  const duration = useMemo(() => {
    if (!form.start || !form.end) return null;

    const startDate = new Date(form.start);
    const endDate = new Date(form.end);

    if (endDate <= startDate) return "Rango inválido";

    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    return `${diffHours.toFixed(2)} hora${diffHours !== 1 ? "s" : ""}`;
  }, [form.start, form.end]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "start" &&
        prev.end &&
        value >= prev.end && { end: "" }),
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
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      amount: Number(form.amount),
    };

    try {
      setLoading(true);
      await extrasApi.createExtra(payload);
      toast.success("Extra registrado exitosamente");

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

  const inputStyle =
    "w-full mt-2 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-gray-200"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Registrar extra
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Registro de horas o compensaciones adicionales
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Tipo */}
      <div>
        <label className="text-xs uppercase tracking-wide text-gray-400">
          Tipo de extra
        </label>
        <select
          name="extraTypeId"
          value={form.extraTypeId}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Seleccione un tipo</option>
          {extraTypes.map((t) => (
            <option key={t.extraTypeId} value={t.extraTypeId}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-gray-400">
            Fecha y hora inicio
          </label>
          <input
            type="datetime-local"
            name="start"
            value={form.start}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-gray-400">
            Fecha y hora fin
          </label>
          <input
            type="datetime-local"
            name="end"
            value={form.end}
            onChange={handleChange}
            min={form.start}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Duración */}
      {duration && (
        <div className="bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg px-3 py-2 text-sm">
          Duración calculada:{" "}
          <span className="font-semibold">{duration}</span>
        </div>
      )}

      {/* Monto */}
      <div>
        <label className="text-xs uppercase tracking-wide text-gray-400">
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

      {/* Notas */}
      <div>
        <label className="text-xs uppercase tracking-wide text-gray-400">
          Notas
        </label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className={`${inputStyle} resize-none`}
        />
      </div>

      <PrimaryButton
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        {loading ? "Guardando..." : "Guardar extra"}
      </PrimaryButton>
    </form>
  );
};

export default ExtraAdd;