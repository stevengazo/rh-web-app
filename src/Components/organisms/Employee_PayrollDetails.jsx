import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { formatMoney } from '../../utils/formatMoney';

/* =========================
   Colores seguros (HEX)
========================= */
const colors = {
  bg: '#ffffff',
  sectionBg: '#f8fafc', // slate-50
  border: '#e5e7eb', // gray-200
  label: '#64748b', // slate-500
  text: '#1f2937', // slate-800
  title: '#334155', // slate-700
};

/* =========================
   Info row (PDF safe)
========================= */
const Info = ({ label, value, tooltip, money = false }) => (
  <div
    title={tooltip}
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      padding: '6px 0',
      borderBottom: `1px solid ${colors.border}`,
      fontSize: '12px',
    }}
  >
    <span style={{ color: colors.label }}>{label}</span>

    <span
      style={{
        color: colors.text,
        fontWeight: 500,
        textAlign: 'right',
      }}
    >
      {value !== null && value !== undefined
        ? money
          ? formatMoney(value)
          : value.toString()
        : '-'}
    </span>
  </div>
);

/* =========================
   Section (PDF safe)
========================= */
const Section = ({ title, children }) => (
  <section
    style={{
      backgroundColor: colors.sectionBg,
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}
  >
    <h3
      style={{
        marginBottom: '8px',
        paddingBottom: '4px',
        borderBottom: `1px solid ${colors.border}`,
        fontSize: '14px',
        fontWeight: 600,
        color: colors.title,
      }}
    >
      {title}
    </h3>

    {children}
  </section>
);

/* =========================
   Main component
========================= */
const Employee_PayrollDetails = ({ data }) => {
  const pdfRef = useRef(null);

  console.log(data);

  if (!data) {
    return (
      <div className="p-4 text-sm text-red-600">
        ⚠ No hay información de planilla para este empleado
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const options = {
      margin: 10,
      filename: `planilla_${data.userId || 'empleado'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    html2pdf().set(options).from(pdfRef.current).save();
  };

  return (
    <div className="space-y-4">
      {/* Header UI (normal Tailwind, no PDF) */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Acciones</h2>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 text-sm rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
        >
          Descargar PDF
        </button>
      </div>

      {/* =========================
          Contenido PDF
      ========================= */}
      <div
        ref={pdfRef}
        style={{
          backgroundColor: colors.bg,
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Informaciòn Basica */}

        <Section title={'Datos'}>
          <Info label={'Tipo'} value={data.payrollData.payrollType} />
          <Info label={'Final'} value={data.payrollData.finalDate} />
          <Info label={'Inicio'} value={data.payrollData.initialDate} />
          <Info label={'ID de Planilla'} value={data.payrollData.payrollId} />
          
          <Info label={'Registro'} value={data.employee_PayrollId} />
        </Section>
        {/* SALARIOS BASE */}
        <Section title="Salarios base">
          <Info label="Salario mensual" value={data.monthlySalary} money />
          <Info label="Salario quincenal" value={data.biweeklySalary} money />
          <Info label="Salario diario" value={data.dailySalary} money />
          <Info label="Salario por hora" value={data.hourlySalary} money />
        </Section>

        {/* HORAS Y DÍAS */}
        <Section title="Horas y días trabajados">
          <Info label="Horas extra" value={data.overTimeHours} />
          <Info
            label="Días feriados trabajados"
            value={data.holidayDaysWorked}
          />
          <Info
            label="Horas extra en feriado"
            value={data.holidayOvertimeHours}
          />
        </Section>

        {/* INGRESOS ADICIONALES */}
        <Section title="Ingresos adicionales">
          <Info label="Monto horas extra" value={data.overtimeAmount} money />
          <Info label="Monto feriados" value={data.holidayAmount} money />
          <Info
            label="Horas extra feriado"
            value={data.holidayOvertimeAmount}
            money
          />
          <Info label="Retroactivo" value={data.retroactivePay} money />
          <Info label="Bonos" value={data.bonus} money />
          <Info label="Comisiones" value={data.comissions} money />
        </Section>

        {/* DEDUCCIONES */}
        <Section title="Deducciones">
          <Info label="Días incapacidad CCSS" value={data.ccssDays} />
          <Info label="Días incapacidad INS" value={data.insDays} />
          <Info label="Ausencias" value={data.absenseTime} />
        </Section>

        {/* TOTALES */}
        <Section title="Totales">
          <Info label="Salario bruto" value={data.grossSalary} money />
          <Info label="Total deducciones" value={data.totalDeductions} money />

          <div style={{ paddingTop: '8px' }}>
            <Info label="Neto a pagar" value={data.netAmount} money />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Employee_PayrollDetails;
