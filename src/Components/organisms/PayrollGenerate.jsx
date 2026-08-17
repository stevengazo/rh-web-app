import { useEffect, useMemo, useState } from 'react';
import payrollApi from '../../api/payrollApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';

const PAYROLL_TYPES = {
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
  MONTHLY: 'Mensual',
};

/** Días que suma cada tipo a partir de la fecha inicial. */
const DIAS_POR_TIPO = {
  [PAYROLL_TYPES.WEEKLY]: 6,
  [PAYROLL_TYPES.BIWEEKLY]: 14,
  [PAYROLL_TYPES.MONTHLY]: 29,
};

/* `payrolls: []` es obligatorio: el modelo del backend declara la colección
   como no nulable, así que sin ese campo el POST responde 400. */
const FORM_VACIO = {
  payrollType: '',
  payrollDescription: '',
  initialDate: '',
  finalDate: '',
  payrolls: [],
};

const PayrollGenerate = ({ onGenerated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);

  // Calcula automáticamente la fecha final según el tipo
  useEffect(() => {
    if (!formData.initialDate || !formData.payrollType) return;

    const dias = DIAS_POR_TIPO[formData.payrollType];
    if (dias === undefined) return;

    /* Se opera sobre la fecha en local (no con `new Date(iso)`, que la
       interpreta en UTC y adelanta o atrasa un día según la zona). */
    const [anio, mes, dia] = formData.initialDate.split('-').map(Number);
    const end = new Date(anio, mes - 1, dia + dias);

    const iso = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

    setFormData((prev) => ({ ...prev, finalDate: iso }));
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

    setEnviando(true);

    try {
      const response = await payrollApi.createPayroll({
        ...formData,
        payrolls: [],
        deleted: false,
      });

      toast.success('Planilla creada. Ahora agrega a los empleados.');
      setFormData(FORM_VACIO);
      onGenerated?.();
      navigate(`/payroll/new/${response.data.payrollId}`);
    } catch (error) {
      console.error(error);
      toast.error('Error al generar la planilla');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-ink">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Generar planilla</h2>
        <p className="text-xs text-ink-muted mt-1">
          Configura el período de la nueva planilla
        </p>
      </div>

      {/* Tipo */}
      <div>
        <label className="text-sm text-ink-secondary">Tipo de planilla</label>
        <select
          name="payrollType"
          value={formData.payrollType}
          onChange={handleChange}
          className="w-full mt-1 bg-surface border border-stroke rounded-md px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition"
        >
          <option value="">Seleccione...</option>
          <option value={PAYROLL_TYPES.WEEKLY}>Semanal</option>
          <option value={PAYROLL_TYPES.BIWEEKLY}>Quincenal</option>
          <option value={PAYROLL_TYPES.MONTHLY}>Mensual</option>
        </select>
      </div>

      {/* Fechas */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-ink-secondary">Fecha inicio</label>
          <input
            type="date"
            name="initialDate"
            value={formData.initialDate}
            onChange={handleChange}
            className="w-full mt-1 bg-surface border border-stroke rounded-md px-3 py-2 text-sm text-ink focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition"
          />
        </div>

        <div>
          <label className="text-sm text-ink-secondary">Fecha final</label>
          <input
            type="date"
            name="finalDate"
            value={formData.finalDate}
            disabled
            className="w-full mt-1 bg-canvas border border-stroke rounded-md px-3 py-2 text-sm text-ink-muted cursor-not-allowed"
          />
        </div>
      </div>

      {/* Días calculados */}
      {formData.initialDate && formData.finalDate && (
        <div className="border border-stroke-soft rounded-md px-4 py-3 text-sm">
          <span className="text-ink-secondary">Días del período:</span>{' '}
          <span
            className={`font-semibold ${
              selectedDays > 0 ? 'text-brand' : 'text-red-500'
            }`}
          >
            {selectedDays}
          </span>
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="text-sm text-ink-secondary">Descripción</label>
        <textarea
          name="payrollDescription"
          value={formData.payrollDescription}
          onChange={handleChange}
          rows={3}
          placeholder="Ej: Planilla primera quincena de enero"
          className="w-full mt-1 bg-surface border border-stroke rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition resize-none"
        />
      </div>

      {/* Botón */}
      <PrimaryButton type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Creando…' : 'Crear planilla y agregar empleados'}
      </PrimaryButton>
    </form>
  );
};

export default PayrollGenerate;
