import { useState, useMemo } from 'react';

const PayrollRow = ({ employee, PayrollData, onChanged, salary }) => {
  /// Print in console
  console.table(PayrollData);

  if (!PayrollData) {
    return (
      <tr className="bg-red-50 text-red-600">
        <td colSpan={19} className="p-2 text-left">
          ⚠ {employee.firstName} {employee.lastName} no tiene salario asignado
        </td>
      </tr>
    );
  }

  // ========================
  // Cálculos base
  // ========================
  const salarioMensual = PayrollData.monthlySalary;

  const salarioQuincenal = salarioMensual / 2;
  const salarioHora = salarioMensual / 30 / 8;
  const salarioDia = salarioMensual / 30;

  // ========================
  // Estados editables (DECIMALES)
  // ========================
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);

  // ========================
  // Montos calculados
  // ========================
  const montoExtras = extras * (salarioHora * 1.5);
  const montoFeriados = feriados * (salarioHora * 8 * 2);
  const montoExtrasFeriado = extrasFeriado * salarioHora * 2.5;
  const deducciones = (incCCSS + incINS + ausencias) * salarioDia;

  const salarioBruto = useMemo(
    () =>
      salarioMensual +
      montoExtras +
      montoFeriados +
      montoExtrasFeriado +
      retroactivo +
      bonos +
      comisiones,
    [
      salarioMensual,
      montoExtras,
      montoFeriados,
      montoExtrasFeriado,
      retroactivo,
      bonos,
      comisiones,
    ]
  );

  const netoPagar = salarioBruto - deducciones;

  // ========================
  // FORMATO CON DECIMALES
  // ========================
  const formatMoney = (v) =>
    `₡${Number(v || 0).toLocaleString('es-CR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // ========================
  // Render (MISMAS FILAS)
  // ========================
  return (
    <tr className="hover:bg-slate-50 transition">
      {/* Empleado */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-left font-medium">
        {employee.firstName} {employee.lastName}
      </td>

      {/* Salario Mensual */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(salarioMensual)}
      </td>
      {/* Salario Quincenal */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(salarioQuincenal)}
      </td>
      {/* Salario Hora */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(salarioHora)}
      </td>
      {/* Cantidad Horas Extras */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={extras}
          onChange={(e) => setExtras(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto Horas Extras */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(montoExtras)}
      </td>
      {/* Dias Feriados */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={feriados}
          onChange={(e) => setFeriados(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto de Feriados */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(montoFeriados)}
      </td>
      {/* Cantidad Extras Feriado */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={extrasFeriado}
          onChange={(e) => setExtrasFeriado(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto Extras Feriado */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right">
        {formatMoney(montoExtrasFeriado)}
      </td>
      {/* Monto Retroactivo */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={retroactivo}
          onChange={(e) => setRetroactivo(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto Feriado */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={bonos}
          onChange={(e) => setBonos(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto Comisiones */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={comisiones}
          onChange={(e) => setComisiones(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Cantidad Incapacidad CCSS */}

      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={incCCSS}
          onChange={(e) => setIncCCSS(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Cantidad Incapacidad INS */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={incINS}
          onChange={(e) => setIncINS(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Cantidad Ausencias */}
      <td className="border border-gray-200 hover:bg-blue-100 text-right">
        <input
          type="number"
          step="0.01"
          min={0}
          value={ausencias}
          onChange={(e) => setAusencias(parseFloat(e.target.value) || 0)}
          className="input"
        />
      </td>
      {/* Monto Salario Bruto */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right font-semibold">
        {formatMoney(salarioBruto)}
      </td>
      {/* Monto Deducciones */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right text-red-600">
        {formatMoney(deducciones)}
      </td>
      {/* Monto A Pagar */}
      <td className="p-2 border hover:bg-blue-100 border-gray-200 text-right font-bold text-emerald-600">
        {formatMoney(netoPagar)}
      </td>
    </tr>
  );
};

export default PayrollRow;
