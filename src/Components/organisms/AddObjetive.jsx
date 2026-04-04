import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import kpiApi from '../../api/kpiApi';
import ObjetiveCategories from '../../api/ObjetiveCategories';

const AddObjetive = ({ onAdded }) => {
  const [newObjetive, setNewObjetive] = useState({
    objetiveId: 0,
    title: '',
    description: '',
    isActive: true,
    objetiveCategoryId: 0,
    category: null,
  });

  const notify = () => toast.success('Agregado');

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await ObjetiveCategories.getAllObjetiveCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories', error);
      }
    };

    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewObjetive((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'objetiveCategoryId'
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await kpiApi.createKPI(newObjetive);
      notify();
      onAdded && onAdded();
    } catch (error) {
      toast.error('Error al agregar el objetivo');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-xl p-6 ">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">
        Nuevo Objetivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={newObjetive.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el título del objetivo"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={newObjetive.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción del objetivo"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Categoría
          </label>
          <select
            name="objetiveCategoryId"
            value={newObjetive.objetiveCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-600 bg-gray-800 text-gray-100 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0} className="bg-gray-800">
              Seleccione una categoría
            </option>
            {categories.map((cat) => (
              <option
                key={cat.objetiveCategoryId}
                value={cat.objetiveCategoryId}
                className="bg-gray-800"
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Activo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={newObjetive.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-500
              focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm text-gray-300">Activo</span>
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
            Guardar Objetivo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddObjetive;
