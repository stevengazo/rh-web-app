import { useState } from 'react';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import PrimaryButton from '../PrimaryButton';
import courseApi from '../../api/courseApi';

const CourseAdd = ({ userId, author }) => {
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
    //    user: {},
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
    console.log('Enviando...');
    await courseApi
      .createCourse(newCourse)
      .then((e) => {
        alert('curso creado');
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 flex flex-col gap-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Agregar curso</h2>
        <p className="text-sm text-gray-500">Información básica del curso</p>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-4">
        <TextInput
          label="Nombre del curso"
          name="name"
          value={newCourse.name}
          onChange={handleChange}
          placeholder="React Avanzado"
        />

        <TextInput
          label="Institución"
          name="institution"
          value={newCourse.institution}
          onChange={handleChange}
          placeholder="Udemy, Coursera..."
        />

        {/* Fechas juntas */}
        <div className="grid grid-cols-2 gap-3">
          <DateInput
            label="Inicio"
            name="start"
            value={newCourse.start}
            onChange={handleChange}
          />
          <DateInput
            label="Fin"
            name="end"
            value={newCourse.end}
            onChange={handleChange}
          />
        </div>

        <TextInput
          label="Duración (horas)"
          name="durationInHours"
          type="number"
          value={newCourse.durationInHours}
          onChange={handleChange}
        />

        {/* Selects */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Modalidad</label>
            <select
              name="modality"
              value={newCourse.modality}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Mixta">Mixta</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Estado</label>
            <select
              name="state"
              value={newCourse.state}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="Activo">Activo</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="text-sm text-gray-600">Descripción</label>
          <textarea
            name="description"
            value={newCourse.description}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 border rounded-md px-3 py-2 text-sm resize-none"
            placeholder="Descripción breve del curso"
          />
        </div>
      </div>

      {/* Acción */}
      <PrimaryButton type="submit" className="w-full">
        Agregar curso
      </PrimaryButton>
    </form>
  );
};

export default CourseAdd;
