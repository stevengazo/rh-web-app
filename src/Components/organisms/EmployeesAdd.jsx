import EmployeeApi from '../../api/employeesApi';
import DepartamentApi from '../../api/departamentApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TextInput from '../TextInput';
import DateInput from '../DateInput';
import Label from '../Label';
import PrimaryButton from '../PrimaryButton';

const EmployeesAdd = ({ OnClose }) => {
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
      toast.success('Empleado creado correctamente');
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
      OnClose();
    } catch (error) {
      console.error('Error creando empleado:');
      console.error(error);
      toast.error('Error al crear el empleado');
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

  const inputStyle =
    'w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 text-white py-4"
    >
      {/* Header */}
      <div className="border-b border-gray-600 pb-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Agregar empleado
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Completa la información del nuevo colaborador
        </p>
      </div>

      {/* ================= IDENTIFICACIÓN ================= */}
      <section className="flex flex-col gap-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
          Identificación
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Label className="text-gray-300 text-sm">Cédula</Label>
            <TextInput
              name="dni"
              value={newUser.dni}
              onChange={handleChange}
              placeholder="1-520-151"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Fecha de nacimiento</Label>
            <DateInput
              name="birthDate"
              value={newUser.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      {/* ================= INFORMACIÓN PERSONAL ================= */}
      <section className="flex flex-col gap-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
          Información personal
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Label className="text-gray-300 text-sm">Nombre</Label>
            <TextInput
              name="firstName"
              value={newUser.firstName}
              onChange={handleChange}
              placeholder="Juan"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Segundo nombre</Label>
            <TextInput
              name="middleName"
              value={newUser.middleName}
              onChange={handleChange}
              placeholder="Carlos"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Apellido</Label>
            <TextInput
              name="lastName"
              value={newUser.lastName}
              onChange={handleChange}
              placeholder="Pérez"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Segundo apellido</Label>
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
      <section className="flex flex-col gap-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
          Contacto
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Label className="text-gray-300 text-sm">Correo electrónico</Label>
            <TextInput
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              placeholder="demo@mail.com"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Nombre de usuario</Label>
            <TextInput
              type="text"
              name="userName"
              value={newUser.userName}
              onChange={handleChange}
              placeholder="nombre.apellido"
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Teléfono</Label>
            <TextInput
              type="tel"
              name="phoneNumber"
              value={newUser.phoneNumber}
              onChange={handleChange}
              placeholder="8888-8888"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-gray-300 text-sm">Dirección</Label>
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
      <section className="flex flex-col gap-5">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
          Información laboral
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <Label className="text-gray-300 text-sm">
              Fecha de contratación
            </Label>
            <DateInput
              name="hiredDate"
              value={newUser.hiredDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="text-gray-300 text-sm">Jornada</Label>
            <select
              name="journey"
              value={newUser.jorney}
              onChange={handleChange}
              className="w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition"
            >
              <option value="">Seleccione una jornada</option>
              <option value="Diurna">Diurna</option>
              <option value="Mixta">Mixta</option>
              <option value="Nocturna">Nocturna</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label className="text-gray-300 text-sm">Departamento</Label>
            <select
              name="departamentId"
              value={newUser.departamentId}
              onChange={handleChange}
              className="w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none transition"
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

      {/* ================= ACTION ================= */}
      <div className="pt-4 border-t border-gray-600">
        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition"
        >
          {loading ? 'Guardando...' : 'Agregar Empleado'}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default EmployeesAdd;
