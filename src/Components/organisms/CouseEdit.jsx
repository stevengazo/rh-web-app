import { useState } from 'react';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import toast from 'react-hot-toast';
import courseApi from '../../api/courseApi';

const normalizeDate = (date) => {
  if (!date || date.startsWith('0001-01-01')) return '';
  return date.substring(0, 10);
};

const CourseEdit = ({ item, onUpdated, OnClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [course, setCourse] = useState({
    ...item,
    start: normalizeDate(item?.start),
    end: normalizeDate(item?.end),
  });

  if (!item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await courseApi.updateCourse(course.courseId, course);
      toast.success('Curso actualizado correctamente');
      onUpdated?.();
      OnClose?.();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el curso');
      toast.error('Error al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Nombre */}
      <div>
        <Label>Nombre del curso</Label>
        <TextInput
          name="name"
          value={course.name || ''}
          onChange={handleChange}
        />
      </div>

      {/* Institución */}
      <div>
        <Label>Institución</Label>
        <TextInput
          name="institution"
          value={course.institution || ''}
          onChange={handleChange}
        />
      </div>

      {/* Autor */}
      <div>
        <Label>Autor / Instructor</Label>
        <TextInput
          name="author"
          value={course.author || ''}
          onChange={handleChange}
        />
      </div>

      {/* Modalidad y Estado */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Modalidad</Label>
          <select
            name="modality"
            value={course.modality || ''}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-1"
          >
            <option value="">Seleccione</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div>
          <Label>Estado</Label>
          <select
            name="state"
            value={course.state || ''}
            onChange={handleChange}
            className="w-full border rounded-md px-2 py-1"
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Fecha inicio</Label>
          <TextInput
            type="date"
            name="start"
            value={course.start}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Fecha fin</Label>
          <TextInput
            type="date"
            name="end"
            value={course.end}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Duración */}
      <div>
        <Label>Duración (horas)</Label>
        <TextInput
          type="number"
          name="durationInHours"
          value={course.durationInHours || ''}
          onChange={handleChange}
        />
      </div>

      {/* Descripción */}
      <div>
        <Label>Descripción</Label>
        <textarea
          name="description"
          value={course.description || ''}
          onChange={handleChange}
          className="w-full border rounded-md px-2 py-1 min-h-[80px]"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Actualizar curso'}
      </PrimaryButton>
    </form>
  );
};

export default CourseEdit;
