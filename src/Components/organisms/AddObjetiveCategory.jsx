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
    <div className="max-w-2xl mx-auto shadow-xl rounded-xl p-6 bg-gray-900 border border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">
        Nueva Categoría de Objetivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2
              placeholder-gray-400
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
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500
              focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">Activa</span>
        </div>

        {/* Botón */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center
              rounded-lg bg-blue-500 px-6 py-2 text-white font-medium
              hover:bg-blue-600 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddObjetiveCategory;
