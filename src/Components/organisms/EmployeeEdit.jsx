import { useEffect, useState } from 'react';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import EmployeeApi from '../../api/employeesApi';
import DepartamentApi from '../../api/departamentApi';
import toast from 'react-hot-toast';

const EmployeeEdit = ({ employee ,setEmployee, onClose }) => {
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
      const response = await DepartamentApi.getAllDepartaments()
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
      setEmployee(localEmployee)
      onClose()
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el empleado');
      toast.error('Error al actualizar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* Nombres */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Nombre</Label>
          <TextInput
            name="firstName"
            value={localEmployee.firstName || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Segundo Nombre</Label>
          <TextInput
            name="middleName"
            value={localEmployee.middleName || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Apellidos */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Apellido</Label>
          <TextInput
            name="lastName"
            value={localEmployee.lastName || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Segundo Apellido</Label>
          <TextInput
            name="secondLastName"
            value={localEmployee.secondLastName || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Email</Label>
          <TextInput
            name="email"
            value={localEmployee.email || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Teléfono</Label>
          <TextInput
            name="phoneNumber"
            value={localEmployee.phoneNumber || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Identificación */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Cédula</Label>
          <TextInput
            name="dni"
            value={localEmployee.dni || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Dirección</Label>
          <TextInput
            name="address"
            value={localEmployee.address || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Fecha de nacimiento</Label>
          <TextInput
            type="date"
            name="birthDate"
            value={localEmployee.birthDate?.substring(0, 10) || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Fecha de contratación</Label>
          <TextInput
            type="date"
            name="hiredDate"
            value={localEmployee.hiredDate?.substring(0, 10) || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Trabajo */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Jornada</Label>
          <select
            name="jorney"
            value={localEmployee.jorney || ''}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full text-black"
          >
            <option value="">Seleccione una jornada</option>
            <option value="Diurna">Diurna</option>
            <option value="Mixta">Mixta</option>
            <option value="Nocturna">Nocturna</option>
          </select>
        </div>

        <div>
          <Label>Departamento</Label>
          <select
            name="departamentId"
            value={localEmployee.departamentId || ''}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full text-black"
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
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </PrimaryButton>
    </form>
  );
};

export default EmployeeEdit;
