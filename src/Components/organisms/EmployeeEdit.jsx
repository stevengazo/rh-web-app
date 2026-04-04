import { useEffect, useState } from 'react';
import Label from '../Label';
import TextInput from '../TextInput';
import PrimaryButton from '../PrimaryButton';
import EmployeeApi from '../../api/employeesApi';
import DepartamentApi from '../../api/departamentApi';
import toast from 'react-hot-toast';

const EmployeeEdit = ({ employee, setEmployee, onClose }) => {

  console.log(employee)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [departaments, setDepartaments] = useState([]);

  // 🔧 Normalizar fechas para inputs
  const formatDate = (date) => {
    if (!date || date.startsWith('0001-01-01')) return '';
    return date.substring(0, 10);
  };

  const [localEmployee, setLocalEmployee] = useState({
    ...employee,
    birthDate: formatDate(employee.birthDate),
    hiredDate: formatDate(employee.hiredDate),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // 🔧 Convertir fechas a ISO antes de guardar
    if (name === 'birthDate' || name === 'hiredDate') {
      newValue = value ? new Date(value).toISOString() : null;
    }

    setLocalEmployee((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await DepartamentApi.getAllDepartaments();
        setDepartaments(response.data);
      } catch (err) {
        console.error(err);
      }
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
          <TextInput name="firstName" value={localEmployee.firstName || ''} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Segundo Nombre</Label>
          <TextInput name="middleName" value={localEmployee.middleName || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Apellido</Label>
          <TextInput name="lastName" value={localEmployee.lastName || ''} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Segundo Apellido</Label>
          <TextInput name="secondLastName" value={localEmployee.secondLastName || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <TextInput name="email" value={localEmployee.email || ''} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Teléfono</Label>
          <TextInput name="phoneNumber" value={localEmployee.phoneNumber || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Identificación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Cédula</Label>
          <TextInput name="dni" value={localEmployee.dni || ''} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Dirección</Label>
          <TextInput name="address" value={localEmployee.address || ''} onChange={handleChange} />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Fecha de nacimiento</Label>
          <TextInput
            type="date"
            name="birthDate"
            value={formatDate(localEmployee.birthDate)}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Fecha de contratación</Label>
          <TextInput
            type="date"
            name="hiredDate"
            value={formatDate(localEmployee.hiredDate)}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Trabajo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>Jornada</Label>
          <select name="jorney" value={localEmployee.jorney || ''} onChange={handleChange}>
            <option value="">Seleccione una jornada</option>
            <option value="Diurna">Diurna</option>
            <option value="Mixta">Mixta</option>
            <option value="Nocturna">Nocturna</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Departamento</Label>
          <select name="departamentId" value={localEmployee.departamentId || ''} onChange={handleChange}>
            <option value="">Seleccione un departamento</option>
            {departaments.map((dept) => (
              <option key={dept.departamentId} value={dept.departamentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mensajes */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && <p className="text-green-600 text-xs">{success}</p>}

      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </PrimaryButton>
    </form>
  );
};

export default EmployeeEdit;