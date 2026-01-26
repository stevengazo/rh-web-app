import { useState } from 'react';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import EmployeeApi from '../../api/employeesApi';

const EmployeeEdit = ({ employee }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // ✅ mensaje éxito

  // estado local
  const [localEmployee, setLocalEmployee] = useState({ ...employee });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // limpiar mensaje previo

    try {
      await EmployeeApi.updateEmployee(localEmployee.id, localEmployee);

      // ✅ mensaje de éxito
      setSuccess('El usuario fue actualizado correctamente');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="flex flex-col gap-1 p-1">
        <Label>Nombre</Label>
        <TextInput
          name="firstName"
          value={localEmployee.firstName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Segundo Nombre</Label>
        <TextInput
          name="middleName"
          value={localEmployee.middleName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Apellido</Label>
        <TextInput
          name="lastName"
          value={localEmployee.lastName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Segundo Apellido</Label>
        <TextInput
          name="secondLastName"
          value={localEmployee.secondLastName || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Email</Label>
        <TextInput
          name="email"
          value={localEmployee.email || ''}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Cédula</Label>
        <TextInput
          name="dni"
          value={localEmployee.dni || ''}
          onChange={handleChange}
        />
      </div>

      {/* ❌ Error */}
      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}

      {/* ✅ Éxito */}
      {success && (
        <p className="text-green-600 text-sm mt-2">
          {success}
        </p>
      )}

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </PrimaryButton>
    </form>
  );
};

export default EmployeeEdit;
