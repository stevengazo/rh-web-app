import { useEffect, useMemo, useState } from 'react';
import payrollApi from '../../api/payrollApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PAYROLL_TYPES = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
};

const PayrollGenerate = ({ onGenerated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    payrollType: '',
    payrollDescription: '',
    initialDate: '',
    finalDate: '',
    Payrolls: [],
  });

  // Calcula automáticamente la fecha final según el tipo
  useEffect(() => {
    if (!formData.initialDate || !formData.payrollType) return;

    const start = new Date(formData.initialDate);
    const end = new Date(start);

    if (formData.payrollType === PAYROLL_TYPES.WEEKLY) {
      end.setDate(start.getDate() + 6);
    }

    if (formData.payrollType === PAYROLL_TYPES.BIWEEKLY) {
      end.setDate(start.getDate() + 14);
    }

    setFormData((prev) => ({
      ...prev,
      finalDate: end.toISOString().split('T')[0],
    }));
  }, [formData.initialDate, formData.payrollType]);

  // Días seleccionados (dinámico)
  const selectedDays = useMemo(() => {
    if (!formData.initialDate || !formData.finalDate) return 0;

    const start = new Date(formData.initialDate);
    const end = new Date(formData.finalDate);

    if (end < start) return 0;

    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.initialDate, formData.finalDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.payrollType) {
      toast.error('Seleccione el tipo de planilla');
      return false;
    }

    if (!formData.initialDate) {
      toast.error('Seleccione la fecha inicial');
      return false;
    }

    if (selectedDays === 0) {
      toast.error('El rango de fechas no es válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await payrollApi.createPayroll({
        ...formData,
        deleted: false,
      });

      toast.success('Planilla generada correctamente');
      onGenerated?.();
      navigate(`/payroll/new/${response.data.payrollId}`);

      setFormData({
        payrollType: '',
        payrollDescription: '',
        initialDate: '',
        finalDate: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al generar la planilla');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Generar planilla</h2>
        <p className="text-xs text-gray-300 mt-1">
          Configura el período de la nueva planilla
        </p>
      </div>

      {/* Tipo */}
      <div>
        <label className="text-sm text-gray-200">Tipo de planilla</label>
        <select
          name="payrollType"
          value={formData.payrollType}
          onChange={handleChange}
          className="w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition"
        >
          <option value="">Seleccione...</option>
          <option value={PAYROLL_TYPES.WEEKLY}>Semanal</option>
          <option value={PAYROLL_TYPES.BIWEEKLY}>Quincenal</option>
        </select>
      </div>

      {/* Fechas */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-200">Fecha inicio</label>
          <input
            type="date"
            name="initialDate"
            value={formData.initialDate}
            onChange={handleChange}
            className="w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="text-sm text-gray-200">Fecha final</label>
          <input
            type="date"
            name="finalDate"
            value={formData.finalDate}
            disabled
            className="w-full mt-1 bg-gray-500 border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Días calculados */}
      {formData.initialDate && formData.finalDate && (
        <div className="border border-gray-600 rounded-lg px-4 py-3 text-sm">
          <span className="text-gray-300">Días del período:</span>{' '}
          <span
            className={`font-semibold ${
              selectedDays > 0 ? 'text-blue-400' : 'text-red-400'
            }`}
          >
            {selectedDays}
          </span>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-200">Descripción</label>
        <textarea
          name="payrollDescription"
          value={formData.payrollDescription}
          onChange={handleChange}
          rows={3}
          placeholder="Ej: Planilla primera quincena de enero"
          className="w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition resize-none"
        />
      </div>

      {/* Botón */}
      <button
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Generar planilla
      </button>
    </form>
  );
};

export default PayrollGenerate;
