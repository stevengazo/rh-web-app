import { useState } from 'react';
import toast from 'react-hot-toast';
import awardApi from '../../api/awardsApi';
import { useAppContext } from '../../context/AppContext';
import PrimaryButton from '../PrimaryButton';

const AddAward = ({ userId }) => {
  const { user } = useAppContext();

  const [error, setError] = useState('');

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
    setError('');

    if (!newAward.title || !newAward.description) {
      setError('Debe completar título y descripción');
      return;
    }

    try {
      await awardApi.createAward(newAward);

      setNewAward((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));

      toast.success('Premio agregado correctamente');
    } catch (error) {
      console.error(error);
      setError('Error al crear el premio');
    }
  };

  const inputStyle =
    'w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Registrar premio</h2>
        <p className="text-xs text-gray-300 mt-1">
          Reconocimiento otorgado al empleado
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label className="text-sm text-gray-200">Título</label>
        <input
          type="text"
          name="title"
          value={newAward.title}
          onChange={handleChange}
          className={inputStyle}
          placeholder="Ej: Empleado del mes"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-200">Descripción</label>
        <textarea
          name="description"
          rows={4}
          value={newAward.description}
          onChange={handleChange}
          className={inputStyle + ' resize-none'}
          placeholder="Detalle del reconocimiento"
        />
      </div>

      <PrimaryButton
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Guardar premio
      </PrimaryButton>
    </form>
  );
};

export default AddAward;
