import { useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import courseApi from '../../api/courseApi';

const CourseAdd = ({ userId, author, onAdded }) => {
  const today = new Date().toISOString().split('T')[0];

  const [newCourse, setNewCourse] = useState({
    name: '',
    institution: '',
    start: today,
    end: today,
    durationInHours: 0,
    modality: '',
    state: '',
    description: '',
    author: author?.email ?? '',
    UpdatedBy: author?.email ?? '',
    userId: userId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewCourse((prev) => ({
      ...prev,
      [name]: name === 'durationInHours' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await courseApi.createCourse(newCourse);
      toast.success('Curso agregado');
      onAdded && onAdded();
    } catch (err) {
      toast.error('Ocurrió un error');
      console.error(err);
    }
  };

  const inputStyle =
    'w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Agregar curso</h2>
        <p className="text-xs text-gray-300 mt-1">
          Información básica del curso
        </p>
      </div>

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-200">Nombre del curso</label>
        <input
          type="text"
          name="name"
          value={newCourse.name}
          onChange={handleChange}
          placeholder="React Avanzado"
          className={inputStyle}
        />
      </div>

      {/* Institución */}
      <div>
        <label className="text-sm text-gray-200">Institución</label>
        <input
          type="text"
          name="institution"
          value={newCourse.institution}
          onChange={handleChange}
          placeholder="Udemy, Coursera..."
          className={inputStyle}
        />
      </div>

      {/* Fechas */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-200">Inicio</label>
          <input
            type="date"
            name="start"
            value={newCourse.start}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        <div>
          <label className="text-sm text-gray-200">Fin</label>
          <input
            type="date"
            name="end"
            value={newCourse.end}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Duración */}
      <div>
        <label className="text-sm text-gray-200">Duración (horas)</label>
        <input
          type="number"
          name="durationInHours"
          value={newCourse.durationInHours}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Selects */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm text-gray-200">Modalidad</label>
          <select
            name="modality"
            value={newCourse.modality}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Mixta">Mixta</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-200">Estado</label>
          <select
            name="state"
            value={newCourse.state}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Seleccionar</option>
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-200">Descripción</label>
        <textarea
          name="description"
          value={newCourse.description}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción breve del curso"
          className={inputStyle + ' resize-none'}
        />
      </div>

      {/* Botón */}
      <PrimaryButton
        type="submit"
        className="w-full py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition"
      >
        Agregar curso
      </PrimaryButton>
    </form>
  );
};

export default CourseAdd;
