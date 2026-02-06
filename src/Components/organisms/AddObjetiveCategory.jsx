import { useState } from 'react';
import toast from 'react-hot-toast';
import ObjetiveCategories from '../../api/ObjetiveCategories';

const AddObjetiveCategory = () => {
  const [newCategory, setNewCategory] = useState({
    objetiveCategoryId: 0,
    name: '',
    isActived: true,
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

      // Reset opcional
      setNewCategory({
        objetiveCategoryId: 0,
        name: '',
        isActived: true,
        objetives: null,
      });
      notify();
    } catch (error) {
      console.error('Error creating category', error);
      toast.error('Error al agregar la categoría');
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Nueva Categoría de Objetivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre de la categoría"
          />
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActived"
            checked={newCategory.isActived}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600
              focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Activa</span>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center
              rounded-lg bg-blue-600 px-6 py-2 text-white font-medium
              hover:bg-blue-700 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddObjetiveCategory;
