import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import kpiApi from '../../api/kpiApi';
import ObjetiveCategories from '../../api/ObjetiveCategories';
import { toDate } from 'date-fns';

const AddObjetive = () => {
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
    console.log(newObjetive);
    try {
      await kpiApi.createKPI(newObjetive);
      notify();
    } catch (error) {
      toast.error('Error al agregar el objetivo');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Nuevo Objetivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={newObjetive.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el título del objetivo"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={newObjetive.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción del objetivo"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            name="objetiveCategoryId"
            value={newObjetive.objetiveCategoryId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Seleccione una categoría</option>
            {categories.map((cat) => (
              <option
                key={cat.objetiveCategoryId}
                value={cat.objetiveCategoryId}
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
            className="h-4 w-4 rounded border-gray-300 text-blue-600
              focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Activo</span>
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
            Guardar Objetivo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddObjetive;
