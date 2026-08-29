import { useState } from 'react';
import toast from 'react-hot-toast';
import ObjetiveCategories from '../../api/ObjetiveCategories';
import PrimaryButton from '../PrimaryButton';

const AddObjetiveCategory = () => {
  const [newCategory, setNewCategory] = useState({
    objetiveCategoryId: 0,
    name: '',
    isActive: true,
    objetives: null,
  });

  const notify = () => toast.success('Agregado');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewCategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await ObjetiveCategories.createObjetiveCategory(newCategory);

      setNewCategory({
        objetiveCategoryId: 0,
        name: '',
        isActive: true,
        objetives: null,
      });

      notify();
    } catch (error) {
      console.error('Error creating category', error);
      toast.error('Error al agregar la categoría');
    }
  };

  return (
    <div className="max-w-2xl mx-auto shadow-xl rounded-xl p-6 bg-surface-alt border border-stroke-soft">
      <h2 className="text-2xl font-semibold text-ink mb-6">
        Nueva Categoría de Objetivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-stroke bg-surface text-ink px-3 py-2
              placeholder:text-ink-muted
              focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            placeholder="Nombre de la categoría"
          />
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={newCategory.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-stroke bg-surface text-brand
              focus:ring-brand focus:ring-2"
          />
          <span className="text-sm text-ink-secondary">Activa</span>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <PrimaryButton type="submit">
            Guardar Categoría
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default AddObjetiveCategory;
