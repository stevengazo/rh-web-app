import { useState, useMemo, useEffect } from 'react';
import { formatMoney } from '../../utils/formatMoney';

const PayrollRow = ({ employee, PayrollData, onChanged, salary }) => {

  if (!PayrollData) {
    return (
      <tr className="bg-red-50 text-red-600">
        <td colSpan={19} className="p-2 text-left">
          ⚠ {employee.firstName} {employee.lastName} no tiene salario asignado
        </td>
      </tr>
    );
  }

  // Cálculos base
  const salarioMensual = PayrollData.monthlySalary;

  const salarioQuincenal = salarioMensual / 2;
  const salarioHora = salarioMensual / 30 / 8;
  const salarioDia = salarioMensual / 30;

  // Estados editables (DECIMALES)
  const [extras, setExtras] = useState(0);
  const [feriados, setFeriados] = useState(0);
  const [extrasFeriado, setExtrasFeriado] = useState(0);
  const [retroactivo, setRetroactivo] = useState(0);
  const [bonos, setBonos] = useState(0);
  const [comisiones, setComisiones] = useState(0);
  const [incCCSS, setIncCCSS] = useState(0);
  const [incINS, setIncINS] = useState(0);
  const [ausencias, setAusencias] = useState(0);

  // Montos calculados
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

  /*
  
  Row Data {
    "userId": "1a56aeff-f7e3-4183-a321-a51a3f4429c8",
    "workShift": null,
    "daysWorked": 15,
    "effectiveness": 100,
    "monthlySalary": 300000,
    "biweeklySalary": 150000,
    "dailySalary": 10000,
    "hourlySalary": 1250,
    "regularHourRate": 1250,
    "overTimeHourRate": 1875,
    "overTimeHours": 0,
    "overtimeAmount": 0,
    "holiDayRate": 2500,
    "holidayDaysWorked": 0,
    "holidayAmount": 0,
    "holidayHourRate": 3125,
    "holidayOvertimeHours": 0,
    "holidayOvertimeAmount": 0,
    "retroactivePay": 0,
    "bonus": 0,
    "comissions": 0,
    "ccssDays": 0,
    "insDays": 0,
    "unPaidLeaveHours": 0,
    "unPaidLeaveAmount": 0,
    "medicalLeaveHours": 0,
    "medicalLeaveAmount": 0,
    "absenseTime": 0,
    "absenceAmount": 0,
    "grossSalary": 300000,
    "totalDeductions": 0,
    "netAmount": 300000
}
  */

  const buildRowData = () => ({
    monthlySalary: salarioMensual,
    biweeklySalary: salarioQuincenal,
    dailySalary: salarioDia,
    hourlySalary: salarioHora,

    overTimeHours: extras,
    overtimeAmount: montoExtras,

    holidayDaysWorked: feriados,
    holidayAmount: montoFeriados,

    holidayOvertimeHours: extrasFeriado,
    holidayOvertimeAmount: montoExtrasFeriado,

    retroactivePay: retroactivo,
    bonus: bonos,
    comissions: comisiones,

    ccssDays: incCCSS,
    insDays: incINS,
    absenseTime: ausencias,

    grossSalary: salarioBruto,
    totalDeductions: deducciones,
    netAmount: netoPagar,
  });

  useEffect(() => {
    onChanged(employee.id, buildRowData());
  }, [
    extras,
    feriados,
    extrasFeriado,
    retroactivo,
    bonos,
    comisiones,
    incCCSS,
    incINS,
    ausencias,
    salarioBruto,
    deducciones,
    netoPagar,
  ]);

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
