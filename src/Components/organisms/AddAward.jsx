import { useState } from 'react';
import toast from 'react-hot-toast';
import awardApi from '../../api/awardsApi';
import { useAppContext } from '../../context/AppContext';

const AddAward = ({ userId }) => {
  const { user } = useAppContext();

  const notify = () => toast.success('Agregado');

  const [newAward, setNewAward] = useState({
    awardId: 0,
    title: '',
    description: '',
    createdAt: new Date().toISOString(),
    createdBy: user.userName,
    userId: userId,
    user: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAward((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await awardApi.createAward(newAward);
      // Limpia el formulario si quieres
      setNewAward((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));

      notify();
    } catch (error) {
      console.error(error);
      alert('Error al crear el premio');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          name="title"
          value={newAward.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          value={newAward.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar premio
      </button>
    </form>
  );
};

export default AddAward;
