import { formatMoney } from '../../utils/formatMoney';
import { usePayrollCalculations } from '../../hooks/usePayrollCalculations';

const PayrollRow = ({ employee, PayrollData, onChanged, isStatic , type }) => {
  // Usamos el hook para todos los cálculos y estados
  const payroll = usePayrollCalculations({
    employee,
    payrollData: PayrollData,
    onChanged,
    isStatic,
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
      <td className="p-2 border border-gray-200 text-left font-medium" title="Nombre del empleado">
        {employee.firstName} {employee.lastName}
      </td>

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
      <td className="border border-gray-200 text-right" title="Cantidad de horas extras">
        {isStatic ? payroll.montoExtras : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.extras}
            onChange={e => payroll.setExtras(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa las horas extras"
          />
        )}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total por horas extras">
        {formatMoney(payroll.montoExtras)}
      </td>

      {/* Días Feriados */}
      <td className="border border-gray-200 text-right" title="Cantidad de días feriados trabajados">
        {isStatic ? payroll.montoFeriados : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.feriados}
            onChange={e => payroll.setFeriados(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa los días feriados trabajados"
          />
        )}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total por días feriados">
        {formatMoney(payroll.montoFeriados)}
      </td>

      {/* Extras Feriado */}
      <td className="border border-gray-200 text-right" title="Cantidad de horas extras en feriado">
        {isStatic ? payroll.montoExtrasFeriado : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.extrasFeriado}
            onChange={e => payroll.setExtrasFeriado(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa las horas extras en feriado"
          />
        )}
      </td>
      <td className="p-2 border border-gray-200 text-right" title="Monto total de horas extras en feriado">
        {formatMoney(payroll.montoExtrasFeriado)}
      </td>

      {/* Retroactivo */}
      <td className="border border-gray-200 text-right" title="Monto de pago retroactivo">
        {isStatic ? payroll.retroactivo : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.retroactivo}
            onChange={e => payroll.setRetroactivo(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa el monto retroactivo"
          />
        )}
      </td>

      {/* Bonos */}
      <td className="border border-gray-200 text-right" title="Monto de bonos">
        {isStatic ? payroll.bonos : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.bonos}
            onChange={e => payroll.setBonos(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa el monto de bonos"
          />
        )}
      </td>

      {/* Comisiones */}
      <td className="border border-gray-200 text-right" title="Monto de comisiones">
        {isStatic ? payroll.comisiones : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.comisiones}
            onChange={e => payroll.setComisiones(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa el monto de comisiones"
          />
        )}
      </td>

      {/* Incapacidades CCSS */}
      <td className="border border-gray-200 text-right" title="Cantidad de días de incapacidad CCSS">
        {isStatic ? payroll.incCCSS : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.incCCSS}
            onChange={e => payroll.setIncCCSS(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa los días de incapacidad CCSS"
          />
        )}
      </td>

      {/* Incapacidades INS */}
      <td className="border border-gray-200 text-right" title="Cantidad de días de incapacidad INS">
        {isStatic ? payroll.incINS : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.incINS}
            onChange={e => payroll.setIncINS(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa los días de incapacidad INS"
          />
        )}
      </td>

      {/* Ausencias */}
      <td className="border border-gray-200 text-right" title="Cantidad de ausencias">
        {isStatic ? payroll.ausencias : (
          <input
            type="number"
            step="0.01"
            min={0}
            value={payroll.ausencias}
            onChange={e => payroll.setAusencias(parseFloat(e.target.value) || 0)}
            className="input"
            title="Ingresa las ausencias"
          />
        )}
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