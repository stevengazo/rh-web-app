const TablePayrollHeader = () => {
  return (
    <thead className="bg-slate-100 sticky top-0 z-10">
      <tr>
        <th className="p-2 text-md" title="Nombre completo del empleado">
          Empleado
        </th>
        <th
          className="p-2 text-md"
          title="Salario mensual obtenido del sistema"
        >
          Salario Mensual
        </th>
        <th className="p-2 text-md" title="Salario Mensual / 2">
          Salario Quincenal
        </th>

        <th className="p-2 text-md" title="Salario Mensual / 30 / 8">
          Salario Por Hora
        </th>

        <th className="p-2 text-md" title="Cantidad de horas extra trabajadas">
          Cantidad Extras
        </th>

        <th className="p-2 text-md" title="Cant Extras × Salario Hora × 1.5">
          Monto Horas Extras
        </th>

        <th className="p-2 text-md" title="Cantidad de días feriado laborados">
          Cantidad Feriado
        </th>

        <th className="p-2 text-md" title="Cant Feriado × Salario Hora × 8 × 2">
          Monto Feriado
        </th>

        <th className="p-2 text-md" title="Cantidad de horas extra en feriado">
          Cantitada Extras Feriado
        </th>

        <th
          className="p-2 text-md"
          title="Cant Extras Feriado × Salario Hora × 2.5"
        >
          Monto Extras Feriado
        </th>

        <th className="p-2 text-md" title="Monto ingresado manualmente">
          Retroactivo
        </th>

        <th className="p-2 text-md" title="Monto ingresado manualmente">
          Bono
        </th>

        <th className="p-2 text-md" title="Monto ingresado manualmente">
          Comisiones
        </th>

        <th
          className="p-2 text-md"
          title="Días INC CCSS × (Salario Mensual / 30)"
        >
          Días Incapacidad CCSS
        </th>

        <th
          className="p-2 text-md"
          title="Días INC INS × (Salario Mensual / 30)"
        >
          Días Incapacidad INS
        </th>

        <th className="p-2 text-md" title="Horas Ausentes × Salario Hora">
          Tiempo Ausente
        </th>

        <th
          className="p-2 text-md"
          title="Salario Mensual + Extras + Feriados + Bonos + Comisiones + Retroactivo"
        >
          Salario Bruto
        </th>

        <th className="p-2 text-md" title="INC CCSS + INC INS + Tiempo Ausente">
          Total Deducciones
        </th>

        <th className="p-2 text-md" title="Salario Bruto − Total Deducciones">
          Monto Pagar
        </th>
      </tr>
    </thead>
  );
};



export default TablePayrollHeader;