import Label from "../Label";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";

const EmployeeEdit = ({ employee, setEmployee }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(employee);

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <div className="flex flex-col gap-1 p-1">
        <Label>Nombre</Label>
        <TextInput
          name="firstName"
          value={employee.firstName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Segundo Nombre</Label>
        <TextInput
          name="middleName"
          value={employee.middleName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1 p-1">
        <Label>Apellido</Label>
        <TextInput
          name="lastName"
          value={employee.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Segundo Apellido</Label>
        <TextInput
          name="secondLastName"
          value={employee.secondLastName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1 p-1">
        <Label>Email</Label>
        <TextInput
          name="email"
          value={employee.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-1 p-1">
        <Label>Cedula</Label>
        <TextInput name="dni" value={employee.dni} onChange={handleChange} />
      </div>

      <PrimaryButton>Actualizar</PrimaryButton>
    </form>
  );
};

export default EmployeeEdit;
