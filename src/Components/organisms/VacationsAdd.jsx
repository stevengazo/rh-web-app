import { useState } from "react";

import VacationsApi from "../../api/vacationsApi";
import toast from "react-hot-toast";

const VacationsAdd = ({id}) => {
  const todayISO = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    userId: id,
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      // Si cambia la fecha inicial y la final queda inválida, se limpia
      if (name === "startDate" && prev.endDate && value > prev.endDate) {
        return { ...prev, startDate: value, endDate: "" };
      }

      return { ...prev, [name]: value };
    });
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const diff = end - start;

    return diff >= 0 ? diff / (1000 * 60 * 60 * 24) + 1 : 0;
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.userId.trim()) {
      newErrors.userId = "El usuario es obligatorio";
    }

    if (!form.startDate || !form.endDate) {
      newErrors.dateRange = "Debe seleccionar un rango de fechas válido";
    } else {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (start < today) {
        newErrors.dateRange = "No se permiten fechas pasadas";
      } else if (end < start) {
        newErrors.dateRange =
          "La fecha final no puede ser menor que la inicial";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      userId: form.userId,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "Pendiente", // 🔒 Estado fijo
      createdAt: new Date().toISOString(),
      deleted: false,
    };

    console.log("Enviar al API:", payload);
    // POST api/Vacations
    await VacationsApi.createVacation(payload);
    toast.success("✅ Solicitud de vacaciones registrada correctamente");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Solicitud de Vacaciones
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
              ${
                errors.userId
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
          />
          {errors.userId && (
            <p className="text-sm text-red-600 mt-1">{errors.userId}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              min={todayISO}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                ${
                  errors.dateRange
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de finalización
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              min={form.startDate || todayISO}
              disabled={!form.startDate}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2
                ${
                  errors.dateRange
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
            />
          </div>
        </div>

        {errors.dateRange && (
          <p className="text-sm text-red-600">{errors.dateRange}</p>
        )}

        {/* Días */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Días solicitados
          </label>
          <input
            type="number"
            value={calculateDays()}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
          />
        </div>

        {/* Estado (solo informativo) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <input
            type="text"
            value="Pendiente"
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
          />
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium
              hover:bg-blue-700 transition"
          >
            Guardar solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default VacationsAdd;
