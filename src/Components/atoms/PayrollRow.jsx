import { Calculator, UserMinus } from 'lucide-react';
import { formatMoney } from '../../utils/formatMoney';
import { usePayrollCalculations } from '../../hooks/usePayrollCalculations';

/** Nombre presentable aunque el expediente esté incompleto. */
const nombreDe = (e) =>
  [e?.firstName, e?.lastName].filter(Boolean).join(' ').trim() ||
  e?.userName ||
  e?.email ||
  'Sin nombre';

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
      className="input w-full text-right p-1 border border-stroke rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
      title={title}
    />
  );
};

const PayrollRow = ({
  employee,
  PayrollData,
  onChanged,
  isStatic,
  typePayroll,
  StartDate,
  EndDate,
  onRemove,
  liquidables,
  desdeRegistros = true,
  onVerLiquidables,
}) => {
  const payroll = usePayrollCalculations({
    employee,
    payrollData: PayrollData,
    onChanged,
    isStatic,
    typePayroll,
    StartDate,
    EndDate,
    liquidables,
    desdeRegistros,
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
    <tr className="hover:bg-canvas transition">
      {/* Nombre del empleado */}
      <td className="p-2 border border-stroke-soft text-left font-medium whitespace-nowrap" title="Nombre del empleado">
        {nombreDe(employee)}

        {/* Hay horas extra o ausencias que liquidar: se ofrece el detalle y
            el cálculo, en vez de dejar que alguien los teclee a ojo. */}
        {payroll.hayRegistros && (
          <button
            type="button"
            onClick={() => onVerLiquidables?.(employee.id)}
            title={
              payroll.desdeRegistros
                ? 'Ver el detalle de las horas extra y ausencias que se están liquidando'
                : 'Hay horas extra o ausencias sin aplicar. Ver el detalle y calcular.'
            }
            className={`ml-2 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold
              transition-colors hover:brightness-95
              ${
                payroll.desdeRegistros
                  ? 'border-brand-200 bg-brand-tint text-brand-700'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
          >
            <Calculator size={10} />
            {payroll.desdeRegistros ? 'calculado' : 'sin aplicar'}
          </button>
        )}
      </td>

      {/* Quitar de la planilla */}
      {onRemove && (
        <td className="p-2 border border-stroke-soft text-center">
          <button
            type="button"
            onClick={() => onRemove(employee.id)}
            title={`Quitar a ${nombreDe(employee)} de la planilla`}
            aria-label={`Quitar a ${nombreDe(employee)} de la planilla`}
            className="grid h-7 w-7 place-items-center rounded-md text-ink-muted transition-colors
                       hover:bg-red-50 hover:text-red-600
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <UserMinus size={15} />
          </button>
        </td>
      )}

      {/* Salarios */}
      <td className="p-2 border border-stroke-soft text-right" title="Salario mensual">
        {formatMoney(payroll.salarioMensual)}
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Salario quincenal">
        {formatMoney(payroll.salarioMensual / 2)}
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Salario por hora">
        {formatMoney(payroll.salarioHora)}
      </td>

      {/* Horas Extras */}
      <td className="p-2 border border-stroke-soft text-right" title="Horas extras">
        <EditableCell value={payroll.extras} setter={payroll.setExtras} isStatic={isStatic} title="Ingresa horas extras" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Monto por horas extras">
        {formatMoney(payroll.montoExtras)}
      </td>

      {/* Días Feriados */}
      <td className="p-2 border border-stroke-soft text-right" title="Días feriados trabajados">
        <EditableCell value={payroll.feriados} setter={payroll.setFeriados} isStatic={isStatic} title="Ingresa días feriados" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Monto por feriados">
        {formatMoney(payroll.montoFeriados)}
      </td>

      {/* Extras Feriado */}
      <td className="p-2 border border-stroke-soft text-right" title="Horas extras en feriado">
        <EditableCell value={payroll.extrasFeriado} setter={payroll.setExtrasFeriado} isStatic={isStatic} title="Ingresa horas extras feriado" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Monto extras feriado">
        {formatMoney(payroll.montoExtrasFeriado)}
      </td>

      {/* Retroactivo */}
      <td className="p-2 border border-stroke-soft text-right" title="Retroactivo">
        <EditableCell value={payroll.retroactivo} setter={payroll.setRetroactivo} isStatic={isStatic} title="Ingresa retroactivo" />
      </td>

      {/* Bonos */}
      <td className="p-2 border border-stroke-soft text-right" title="Bonos">
        <EditableCell value={payroll.bonos} setter={payroll.setBonos} isStatic={isStatic} title="Ingresa bonos" />
      </td>

      {/* Comisiones */}
      <td className="p-2 border border-stroke-soft text-right" title="Comisiones">
        <EditableCell value={payroll.comisiones} setter={payroll.setComisiones} isStatic={isStatic} title="Ingresa comisiones" />
      </td>

      {/* Incapacidades */}
      <td className="p-2 border border-stroke-soft text-right" title="Días de incapacidad CCSS">
        <EditableCell value={payroll.incCCSS} setter={payroll.setIncCCSS} isStatic={isStatic} title="Días incapacidad CCSS" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Días de incapacidad INS">
        <EditableCell value={payroll.incINS} setter={payroll.setIncINS} isStatic={isStatic} title="Días incapacidad INS" />
      </td>

      {/* Ausencias */}
      <td className="p-2 border border-stroke-soft text-right" title="Ausencias">
        <EditableCell value={payroll.ausencias} setter={payroll.setAusencias} isStatic={isStatic} title="Ingresa ausencias" />
      </td>

      {/* Totales */}
      <td className="p-2 border border-stroke-soft text-right font-semibold" title="Salario bruto">
        {formatMoney(payroll.salarioBruto)}
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Deducción CCSS">
        {formatMoney(payroll.cCSSDeductionAmount)}
      </td>

      {/* Campos ahora editables */}
      <td className="p-2 border border-stroke-soft text-right" title="Embargo">
        <EditableCell value={payroll.garnishment} setter={payroll.setGarnishment} isStatic={isStatic} title="Ingresa embargo" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Pensión">
        <EditableCell value={payroll.pension} setter={payroll.setPension} isStatic={isStatic} title="Ingresa pensión" />
      </td>
      <td className="p-2 border border-stroke-soft text-right" title="Aporte a asociación">
        <EditableCell value={payroll.associationContribution} setter={payroll.setAssociationContribution} isStatic={isStatic} title="Ingresa aporte asociación" />
      </td>

      <td className="p-2 border border-stroke-soft text-right text-red-600" title="Deducciones totales">
        {formatMoney(payroll.deducciones)}
      </td>
      <td className="p-2 border border-stroke-soft text-right font-bold text-emerald-600" title="Neto a pagar">
        {formatMoney(payroll.netoPagar)}
      </td>
    </tr>
  );
};

export default PayrollRow;