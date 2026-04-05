import { formatMoney } from '../../utils/formatMoney';
import { usePayrollCalculations } from '../../hooks/usePayrollCalculations';

/** Celda editable para montos numéricos */
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
  const payroll = usePayrollCalculations({
    employee,
    payrollData: PayrollData,
    onChanged,
    isStatic,
    typePayroll,
    StartDate,
    EndDate,
  });

  if (payroll.error) {
    return (
      <tr className="bg-red-50 text-red-600">
        <td colSpan={25} className="p-2 text-left">
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

      {/* Salarios */}
      <td className="p-2 border border-gray-200 text-right" title="Salario mensual">
        {formatMoney(payroll.salarioMensual)}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Salario quincenal">
        {formatMoney(payroll.salarioMensual / 2)}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Salario por hora">
        {formatMoney(payroll.salarioHora)}
      </td>

      {/* Horas Extras */}
      <td className="p-2 border border-gray-200 text-right" title="Horas extras">
        <EditableCell value={payroll.extras} setter={payroll.setExtras} isStatic={isStatic} title="Ingresa horas extras" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto por horas extras">
        {formatMoney(payroll.montoExtras)}
      </td>

      {/* Días Feriados */}
      <td className="p-2 border border-gray-200 text-right" title="Días feriados trabajados">
        <EditableCell value={payroll.feriados} setter={payroll.setFeriados} isStatic={isStatic} title="Ingresa días feriados" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto por feriados">
        {formatMoney(payroll.montoFeriados)}
      </td>

      {/* Extras Feriado */}
      <td className="p-2 border border-gray-200 text-right" title="Horas extras en feriado">
        <EditableCell value={payroll.extrasFeriado} setter={payroll.setExtrasFeriado} isStatic={isStatic} title="Ingresa horas extras feriado" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto extras feriado">
        {formatMoney(payroll.montoExtrasFeriado)}
      </td>

      {/* Retroactivo */}
      <td className="p-2 border border-gray-200 text-right" title="Retroactivo">
        <EditableCell value={payroll.retroactivo} setter={payroll.setRetroactivo} isStatic={isStatic} title="Ingresa retroactivo" />
      </td>

      {/* Bonos */}
      <td className="p-2 border border-gray-200 text-right" title="Bonos">
        <EditableCell value={payroll.bonos} setter={payroll.setBonos} isStatic={isStatic} title="Ingresa bonos" />
      </td>

      {/* Comisiones */}
      <td className="p-2 border border-gray-200 text-right" title="Comisiones">
        <EditableCell value={payroll.comisiones} setter={payroll.setComisiones} isStatic={isStatic} title="Ingresa comisiones" />
      </td>

      {/* Incapacidades */}
      <td className="p-2 border border-gray-200 text-right" title="Días de incapacidad CCSS">
        <EditableCell value={payroll.incCCSS} setter={payroll.setIncCCSS} isStatic={isStatic} title="Días incapacidad CCSS" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Días de incapacidad INS">
        <EditableCell value={payroll.incINS} setter={payroll.setIncINS} isStatic={isStatic} title="Días incapacidad INS" />
      </td>

      {/* Ausencias */}
      <td className="p-2 border border-gray-200 text-right" title="Ausencias">
        <EditableCell value={payroll.ausencias} setter={payroll.setAusencias} isStatic={isStatic} title="Ingresa ausencias" />
      </td>

      {/* Totales */}
      <td className="p-2 border border-gray-200 text-right font-semibold" title="Salario bruto">
        {formatMoney(payroll.salarioBruto)}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Deducción CCSS">
        {formatMoney(payroll.cCSSDeductionAmount)}
      </td>

      {/* Campos ahora editables */}
      <td className="p-2 border border-gray-200 text-right" title="Embargo">
        <EditableCell value={payroll.garnishment} setter={payroll.setGarnishment} isStatic={isStatic} title="Ingresa embargo" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Pensión">
        <EditableCell value={payroll.pension} setter={payroll.setPension} isStatic={isStatic} title="Ingresa pensión" />
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Aporte a asociación">
        <EditableCell value={payroll.associationContribution} setter={payroll.setAssociationContribution} isStatic={isStatic} title="Ingresa aporte asociación" />
      </td>

      <td className="p-2 border border-gray-200 text-right text-red-600" title="Deducciones totales">
        {formatMoney(payroll.deducciones)}
      </td>
      <td className="p-2 border border-gray-200 text-right font-bold text-emerald-600" title="Neto a pagar">
        {formatMoney(payroll.netoPagar)}
      </td>
    </tr>
  );
};

export default PayrollRow;