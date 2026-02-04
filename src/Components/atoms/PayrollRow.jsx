const PayrollRow = ({ data, onChanged }) => {
  return (
    <tr className="hover:bg-gray-300 duration-700 transition">
      {/* Empleado */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        Empleado
      </td>
      {/* Salario Mensual */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        {' '}
        ₡0.00
      </td>
      {/* Salario Quincenal */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Salario por Hora */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Cantidad Extras */}
      <td className="text-center  border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Monto Horas Extras */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Cantidad Feriados */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Monto Feriado */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Cantidad Extras Feriado */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Monto Extra Feriado */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Retroactivo */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Bonos */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Comisiones */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Dias Incapacidad CCSS */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Dias Incapacidad INS */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Tiempo Ausente */}
      <td className="text-center border border-gray-200 hover:bg-gray-400 duration-500">
        <input type="number" className="p-1.5 text-start w-full bg-blue-100 hover:bg-blue-300 transition duration-500" />
      </td>
      {/* Salario Bruto */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Total Deducciones */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
      {/* Monto Por Pagar */}
      <td className="text-center p-1 border border-gray-200 hover:bg-gray-400 duration-500">
        ₡0.00
      </td>
    </tr>
  );
};

export default PayrollRow;
