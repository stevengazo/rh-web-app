import { useState, useMemo } from 'react';

const PayrollRow = ({ data, onChanged, salary }) => {
  if (!salary) {
    return (
      <tr className="bg-red-50 text-red-600">
        <td colSpan={19} className="p-2 text-left">
          ⚠ {data.firstName} {data.lastName} no tiene salario asignado
        </td>
      </tr>
    );
  }

  // ========================
  // Cálculos base
  // ========================
  const salarioMensual =
    salary.type === 'Hora'
      ? salary.salaryAmount * 30 * 8
      : salary.salaryAmount;

  const salarioQuincenal = salarioMensual / 2;
  const salarioHora = salarioMensual / 30 / 8;
  const salarioDia = salarioMensual / 30;

  // ========================
  // Estados editables
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
  const montoExtras = extras * salarioHora * 1.5;
  const montoFeriados = feriados * salarioHora * 8 * 2;
  const montoExtrasFeriado = extrasFeriado * salarioHora * 2.5;

  const deducciones =
    (incCCSS + incINS + ausencias) * salarioDia;

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

  const formatMoney = (v) =>
    `₡${Math.round(v).toLocaleString('es-CR')}`;

  // ========================
  // Render
  // ========================
  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-1 border text-left font-medium">
        {data.firstName} {data.lastName}
      </td>

      <td className="p-1 border text-right">{formatMoney(salarioMensual)}</td>
      <td className="p-1 border text-right">{formatMoney(salarioQuincenal)}</td>
      <td className="p-1 border text-right">{formatMoney(salarioHora)}</td>

      <td className="border">
        <input type="number" value={extras} onChange={e => setExtras(+e.target.value || 0)} className="input" />
      </td>
      <td className="p-1 border text-right">{formatMoney(montoExtras)}</td>

      <td className="border">
        <input type="number" value={feriados} onChange={e => setFeriados(+e.target.value || 0)} className="input" />
      </td>
      <td className="p-1 border text-right">{formatMoney(montoFeriados)}</td>

      <td className="border">
        <input type="number" value={extrasFeriado} onChange={e => setExtrasFeriado(+e.target.value || 0)} className="input" />
      </td>
      <td className="p-1 border text-right">{formatMoney(montoExtrasFeriado)}</td>

      <td className="border">
        <input type="number" value={retroactivo} onChange={e => setRetroactivo(+e.target.value || 0)} className="input" />
      </td>
      <td className="border">
        <input type="number" value={bonos} onChange={e => setBonos(+e.target.value || 0)} className="input" />
      </td>
      <td className="border">
        <input type="number" value={comisiones} onChange={e => setComisiones(+e.target.value || 0)} className="input" />
      </td>

      <td className="border">
        <input type="number" value={incCCSS} onChange={e => setIncCCSS(+e.target.value || 0)} className="input" />
      </td>
      <td className="border">
        <input type="number" value={incINS} onChange={e => setIncINS(+e.target.value || 0)} className="input" />
      </td>
      <td className="border">
        <input type="number" value={ausencias} onChange={e => setAusencias(+e.target.value || 0)} className="input" />
      </td>

      <td className="p-1 border text-right font-semibold">
        {formatMoney(salarioBruto)}
      </td>

      <td className="p-1 border text-right text-red-600">
        {formatMoney(deducciones)}
      </td>

      <td className="p-1 border text-right font-bold text-emerald-600">
        {formatMoney(netoPagar)}
      </td>
    </tr>
  );
};

export default PayrollRow;
