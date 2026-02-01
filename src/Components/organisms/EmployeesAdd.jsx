import EmployeeApi from '../../api/employeesApi';
import DepartamentApi from '../../api/departamentApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import Label from '../Label';
import PrimaryButton from '../PrimaryButton';

const EmployeesAdd = () => {
  const [departaments, setDepartaments] = useState([]);
  const [loading, setLoading] = useState(false);

  const notify = () => toast.success('Agregado');
  const today = new Date().toISOString().split('T')[0];

  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    password: 'Sjfjvi4$%',
    phoneNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    birthDate: today,
    dni: '',
    address: '',
    hiredDate: today,
    jorney: '',
    departamentId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await EmployeeApi.createEmployee(newUser);
      alert('Empleado creado correctamente');
      setNewUser({
        userName: '',
        email: '',
        password: '',
        phoneNumber: 0,
        firstName: '',
        middleName: '',
        lastName: '',
        secondLastName: '',
        birthDate: '',
        dni: '',
        address: '',
        hiredDate: '',
        jorney: '',
        departamentId: 0,
      });
      notify();
    } catch (error) {
      console.error('Error creando empleado:', error);
      alert('Error al crear el empleado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDepartaments = async () => {
      try {
        const response = await DepartamentApi.getAllDepartaments();
        setDepartaments(response.data);
      } catch (error) {
        console.error('Error fetching departaments:', error);
      }
    };
    fetchDepartaments();
  }, []);

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* ================= IDENTIFICACIÓN ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Identificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Cédula</Label>
            <TextInput
              name="dni"
              value={newUser.dni}
              onChange={handleChange}
              placeholder="1-520-151"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Fecha de Nacimiento</Label>
            <DateInput
              name="birthDate"
              value={newUser.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ================= INFORMACIÓN PERSONAL ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Información personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Nombre</Label>
            <TextInput
              name="firstName"
              value={newUser.firstName}
              onChange={handleChange}
              placeholder="Juan"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Segundo Nombre</Label>
            <TextInput
              name="middleName"
              value={newUser.middleName}
              onChange={handleChange}
              placeholder="Carlos"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Apellido</Label>
            <TextInput
              name="lastName"
              value={newUser.lastName}
              onChange={handleChange}
              placeholder="Pérez"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Segundo Apellido</Label>
            <TextInput
              name="secondLastName"
              value={newUser.secondLastName}
              onChange={handleChange}
              placeholder="Gómez"
            />
          </div>
        </div>
      </section>

      {/* ================= CONTACTO ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Correo electrónico</Label>
            <TextInput
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              placeholder="demo@mail.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Nombre de Usuario</Label>
            <TextInput
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={handleChange}
              placeholder="nombre.apellido"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Teléfono</Label>
            <TextInput
              type="tel"
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleChange}
              placeholder="8888-8888"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Dirección</Label>
            <TextInput
              name="address"
              value={newUser.address}
              onChange={handleChange}
              placeholder="San José, Costa Rica"
            />
          </div>
        </div>
      </section>

      {/* ================= INFORMACIÓN LABORAL ================= */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Información laboral
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Fecha de contratación</Label>
            <DateInput
              name="hiredDate"
              value={newUser.hiredDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Jornada</Label>
            <select
              name="journey"
              value={newUser.jorney}
              onChange={handleChange}
              className="bg-white border text-gray-600 border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Seleccione una jornada</option>
              <option value="Diurna">Diurna</option>
              <option value="Mixta">Mixta</option>
              <option value="Nocturna">Nocturna</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <Label>Departamento</Label>
            <select
              name="departamentId"
              value={newUser.departamentId}
              onChange={handleChange}
              className="bg-white border text-gray-600 border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
      </section>

      {/* ================= ACTIONS ================= */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <PrimaryButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Agregar Empleado'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default EmployeesAdd;
