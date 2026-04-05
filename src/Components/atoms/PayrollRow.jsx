import { formatMoney } from '../../utils/formatMoney';
import { usePayrollCalculations } from '../../hooks/usePayrollCalculations';

/**
 * Celda editable para montos numéricos
 */
const EditableCell = ({ value, setter, isStatic, title }) => {
  return isStatic ? (
    formatMoney(value)
  ) : (
    <input
      type="number"
      step="0.01"
      min={0}
      value={value}
      onChange={(e) => setter(parseFloat(e.target.value) || 0)}
      className="input w-full text-right p-1 border border-gray-300 rounded"
      title={title}
    />
  );
};

const PayrollRow = ({ employee, PayrollData, onChanged, isStatic, typePayroll, StartDate, EndDate }) => {
  
    console.log("payroll type", typePayroll)
  const payroll = usePayrollCalculations({
    employee,
    payrollData: PayrollData,
    onChanged,
    isStatic,
    typePayroll,
    StartDate,
    EndDate
  });

  if (payroll.error) {
    return (
      <tr className="bg-red-50 text-red-600">
        <td colSpan={19} className="p-2 text-left">
          ⚠ {payroll.error}
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50 transition">
      {/* Nombre del empleado */}
      <td className="p-2 border border-gray-200 text-left font-medium" title="Nombre del empleado">
        {employee.firstName} {employee.lastName}
      </td>

      {/* Salarios base */}
      <td className="p-2 border border-gray-200 text-right" title="Salario mensual base">
        {formatMoney(payroll.salarioMensual)}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Salario quincenal">
        {formatMoney(payroll.salarioQuincenal)}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Salario por hora">
        {formatMoney(payroll.salarioHora)}
      </td>

      {/* Horas Extras */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de horas extras">
        <EditableCell value={payroll.extras} setter={payroll.setExtras} isStatic={isStatic} title="Ingresa las horas extras" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total por horas extras">
        {formatMoney(payroll.montoExtras)}
      </td>

      {/* Días Feriados */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de días feriados trabajados">
        <EditableCell value={payroll.feriados} setter={payroll.setFeriados} isStatic={isStatic} title="Ingresa los días feriados trabajados" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total por días feriados">
        {formatMoney(payroll.montoFeriados)}
      </td>

      {/* Extras Feriado */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de horas extras en feriado">
        <EditableCell value={payroll.extrasFeriado} setter={payroll.setExtrasFeriado} isStatic={isStatic} title="Ingresa las horas extras en feriado" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total de horas extras en feriado">
        {formatMoney(payroll.montoExtrasFeriado)}
      </td>

      {/* Retroactivo */}
      <td className="p-2 border border-gray-200 text-right" title="Monto de pago retroactivo">
        <EditableCell value={payroll.retroactivo} setter={payroll.setRetroactivo} isStatic={isStatic} title="Ingresa el monto retroactivo" />
      </td>

      {/* Bonos */}
      <td className="p-2 border border-gray-200 text-right" title="Monto de bonos">
        <EditableCell value={payroll.bonos} setter={payroll.setBonos} isStatic={isStatic} title="Ingresa el monto de bonos" />
      </td>

      {/* Comisiones */}
      <td className="p-2 border border-gray-200 text-right" title="Monto de comisiones">
        <EditableCell value={payroll.comisiones} setter={payroll.setComisiones} isStatic={isStatic} title="Ingresa el monto de comisiones" />
      </td>

      {/* Incapacidades CCSS */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de días de incapacidad CCSS">
        <EditableCell value={payroll.incCCSS} setter={payroll.setIncCCSS} isStatic={isStatic} title="Ingresa los días de incapacidad CCSS" />
      </td>

      {/* Incapacidades INS */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de días de incapacidad INS">
        <EditableCell value={payroll.incINS} setter={payroll.setIncINS} isStatic={isStatic} title="Ingresa los días de incapacidad INS" />
      </td>

      {/* Ausencias */}
      <td className="p-2 border border-gray-200 text-right" title="Cantidad de ausencias">
        <EditableCell value={payroll.ausencias} setter={payroll.setAusencias} isStatic={isStatic} title="Ingresa las ausencias" />
      </td>

      {/* Totales */}
      <td className="p-2 border border-gray-200 text-right font-semibold" title="Salario bruto">
        {formatMoney(payroll.salarioBruto)}
      </td>
      <td className="p-2 border border-gray-200 text-right text-red-600" title="Deducciones totales">
        {formatMoney(payroll.deducciones)}
      </td>
      <td className="p-2 border border-gray-200 text-right font-bold text-emerald-600" title="Monto neto a pagar">
        {formatMoney(payroll.netoPagar)}
      </td>
    </tr>
  );
};

export default PayrollRow;