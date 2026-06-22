import { useState } from 'react';
import contactEmergenciesApi from '../../api/contactEmergenciesApi';
import toast from 'react-hot-toast';
import PrimaryButton from '../PrimaryButton';

const ContactsEmergenciesAdd = ({ userId, onEdited, onAdded }) => {
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.relationship) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      await contactEmergenciesApi.createContactEmergency({
        ...formData,
        userId,
      });

      onEdited?.();
      setFormData({ name: '', phone: '', relationship: '' });
      toast.success('Contacto agregado correctamente');
      onAdded?.();
    } catch (error) {
      console.error('Error al guardar contacto de emergencia', error);
      setError('Error al guardar el contacto');
    }
  };

  const inputStyle =
    'w-full mt-1 bg-surface border border-stroke rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-ink">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Contacto de emergencia</h2>
        <p className="text-xs text-ink-secondary mt-1">
          Persona de contacto en caso de emergencia
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="text-sm text-ink-secondary">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Nombre completo"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="text-sm text-ink-secondary">Teléfono</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Número de contacto"
        />
      </div>

      {/* Relación */}
      <div>
        <label className="text-sm text-ink-secondary">Relación</label>
        <input
          type="text"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Ej: Madre, Esposo, Hermano..."
        />
      </div>

      <PrimaryButton
        type="submit"
        className="w-full py-2 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Guardar contacto
      </PrimaryButton>
    </form>
  );
};

export default ContactsEmergenciesAdd;
