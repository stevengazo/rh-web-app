import { useEffect, useMemo, useState } from "react";
import extrasApi from "../../api/extrasApi";
import extraTypeApi from "../../api/extraType";
import PrimaryButton from "../PrimaryButton";
import toast from "react-hot-toast";

// Helper fecha
const formatDateYYYYMMDD = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};

const ExtraAdd = ({ userId, author }) => {
  const [extraTypes, setExtraTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    extraId: 0,
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
     Cargar tipos
  ========================= */
  useEffect(() => {
    const fetchExtraTypes = async () => {
      try {
        const res = await extraTypeApi.getallExtraTypes();
        setExtraTypes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExtraTypes();
  }, []);

  /* =========================
     Calcular duración dinámica
  ========================= */
  const duration = useMemo(() => {
    if (!form.start || !form.end) return null;

    const startDate = new Date(form.start);
    const endDate = new Date(form.end);

    if (endDate < startDate) return "Rango inválido";

    const diffMs = endDate - startDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return `${diffDays} día${diffDays > 1 ? "s" : ""}`;
  }, [form.start, form.end]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
    "w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-white"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Registrar extra
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Registro de horas o compensaciones adicionales
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Tipo */}
      <div>
        <label className="text-sm text-gray-200">
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

      {/* Fecha inicio */}
      <div>
        <label className="text-sm text-gray-200">
          Fecha inicio
        </label>
        <input
          type="date"
          name="start"
          value={form.start}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Fecha fin */}
      <div>
        <label className="text-sm text-gray-200">
          Fecha fin
        </label>
        <input
          type="date"
          name="end"
          value={form.end}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Duración dinámica */}
      {duration && (
        <div className="bg-blue-500/10 border border-blue-400/40 text-blue-300 px-3 py-2 rounded text-sm">
          Duración calculada: <span className="font-semibold">{duration}</span>
        </div>
      )}

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

      {/* Notas */}
      <div>
        <label className="text-sm text-gray-200">
          Notas
        </label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          className={inputStyle + " resize-none"}
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