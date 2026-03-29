import { useEffect, useState } from 'react';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import EmployeeApi from '../../api/employeesApi';
import DepartamentApi from '../../api/departamentApi';
import toast from 'react-hot-toast';

const EmployeeEdit = ({ employee, setEmployee, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [departaments, setDepartaments] = useState([]);

  const [localEmployee, setLocalEmployee] = useState({
    ...employee,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalEmployee((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const GetData = async () => {
      const response = await DepartamentApi.getAllDepartaments();
      setDepartaments(response.data);
    };

    GetData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await EmployeeApi.updateEmployee(localEmployee.id, localEmployee);
      setSuccess('El empleado fue actualizado correctamente');
      toast.success('Empleado actualizado correctamente');
      setEmployee(localEmployee);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el empleado');
      toast.error('Error al actualizar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
      {/* Nombres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Nombre</Label>
          <TextInput
            name="firstName"
            value={localEmployee.firstName || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Segundo Nombre</Label>
          <TextInput
            name="middleName"
            value={localEmployee.middleName || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Apellido</Label>
          <TextInput
            name="lastName"
            value={localEmployee.lastName || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Segundo Apellido</Label>
          <TextInput
            name="secondLastName"
            value={localEmployee.secondLastName || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <TextInput
            name="email"
            value={localEmployee.email || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Teléfono</Label>
          <TextInput
            name="phoneNumber"
            value={localEmployee.phoneNumber || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Identificación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Cédula</Label>
          <TextInput
            name="dni"
            value={localEmployee.dni || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Dirección</Label>
          <TextInput
            name="address"
            value={localEmployee.address || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Fecha de nacimiento</Label>
          <TextInput
            type="date"
            name="birthDate"
            value={localEmployee.birthDate?.substring(0, 10) || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Fecha de contratación</Label>
          <TextInput
            type="date"
            name="hiredDate"
            value={localEmployee.hiredDate?.substring(0, 10) || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Trabajo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Jornada</Label>
          <select
            name="jorney"
            value={localEmployee.jorney || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
          >
            <option value="">Seleccione una jornada</option>
            <option value="Diurna">Diurna</option>
            <option value="Mixta">Mixta</option>
            <option value="Nocturna">Nocturna</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Departamento</Label>
          <select
            name="departamentId"
            value={localEmployee.departamentId || ''}
            onChange={handleChange}
            className="bg-white/90 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-700"
          >
            <option value="">Seleccione un departamento</option>
            {departaments.map((dept) => (
              <option
                key={dept.departamentId}
                value={dept.departamentId}
                className="text-black"
              >
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-md px-2 py-1">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-xs bg-green-50 border border-green-200 rounded-md px-2 py-1">
          {success}
        </p>
      )}

      <PrimaryButton
        type="submit"
        disabled={loading}
        className="mt-2 w-full py-2 rounded-lg text-sm font-medium"
      >
        {loading ? 'Actualizando...' : 'Actualizar'}
      </PrimaryButton>
    </form>
  );
};

export default EmployeeEdit;
