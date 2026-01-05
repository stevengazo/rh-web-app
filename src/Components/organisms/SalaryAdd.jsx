import { useState } from "react";
import TextInput from "../TextInput";
import DateInput from "../DateInput";
import Label from "../Label";
import PrimaryButton from "../PrimaryButton";

import salaryApi from "../../api/salaryApi";

const SalaryAdd = ({ userId, author }) => {
  const today = new Date().toISOString().split("T")[0];

  const [newSalary, setNewSalary] = useState({
    salaryId: 0,
    salaryAmount: "",
    effectiveDate: today,
    type: "",
    currency: "",
    createdBy: author?.userName ?? "",
    createdAt: today,
    updatedBy: author?.userName ?? "",
    updatedAt: today,
    userId: userId,
    user: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSalary((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    salaryApi
      .createSalary(newSalary)
      .then((e) => alert("Salario Registrado"))
      .catch((e) => console.error(e));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Agregar salario</h2>
        <p className="text-sm text-gray-500">
          Información salarial del empleado
        </p>
      </div>

      {/* Monto */}
      <div>
        <Label>Monto</Label>
        <TextInput
          name="salaryAmount"
          type="number"
          value={newSalary.salaryAmount}
          onChange={handleChange}
          placeholder="₡ 850000"
        />
      </div>

      {/* Fecha efectiva */}
      <div>
        <Label>Fecha efectiva</Label>
        <DateInput
          name="effectiveDate"
          value={newSalary.effectiveDate}
          onChange={handleChange}
        />
      </div>

      {/* Tipo */}
      <div>
        <Label>Tipo de salario</Label>
        <select
          name="type"
          value={newSalary.type}
          onChange={handleChange}
          className="w-full text-sm"
        >
          <option className="text-gray-600" value="">
            Seleccionar
          </option>
          <option className="text-gray-600" value="Base">
            Base
          </option>
          <option className="text-gray-600" value="Hora">
            Por hora
          </option>
          <option className="text-gray-600" value="Contrato">
            Contrato
          </option>
        </select>
      </div>

      {/* Moneda */}
      <div>
        <Label>Moneda</Label>
        <select
          name="currency"
          value={newSalary.currency}
          onChange={handleChange}
          className="w-full text-sm"
        >
          <option className="text-gray-600" value="">
            Seleccionar
          </option>
          <option className="text-gray-600" value="CRC">
            CRC
          </option>
          <option className="text-gray-600" value="USD">
            USD
          </option>
          <option className="text-gray-600" value="EUR">
            EUR
          </option>
        </select>
      </div>

      {/* Acción */}
      <PrimaryButton type="submit" className="w-full">
        Agregar salario
      </PrimaryButton>
    </form>
  );
};

export default SalaryAdd;
