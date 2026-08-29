import { formatMoney } from './formatMoney';

const fechaValida = (v) => {
  if (!v) return null;
  const f = new Date(v);
  return Number.isNaN(f.getTime()) || f.getFullYear() < 1900 ? null : f;
};

const fecha = (v) => {
  const f = fechaValida(v);
  return f
    ? f.toLocaleDateString('es-CR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';
};

/** Escapa el texto que se inyecta en el HTML del documento. */
const esc = (v) =>
  String(v ?? '—').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

const fila = (etiqueta, valor) => `
  <tr>
    <td style="padding:7px 12px;color:#616161;font-size:11px;text-transform:uppercase;
               letter-spacing:.4px;width:38%;border-bottom:1px solid #eee;">${esc(etiqueta)}</td>
    <td style="padding:7px 12px;color:#242424;font-size:13px;font-weight:600;
               border-bottom:1px solid #eee;">${esc(valor)}</td>
  </tr>`;

/**
 * Genera y descarga el expediente del colaborador en PDF.
 *
 * `html2pdf` se importa de forma diferida: pesa bastante y solo hace falta
 * cuando alguien pide la descarga, no en cada carga de la página.
 *
 * @param {object} employee
 * @param {Array} [salaries]
 * @param {object} [conteos] {cursos, certificaciones, acciones}
 */
export const descargarPerfilPdf = async (employee, salaries = [], conteos = {}) => {
  const { default: html2pdf } = await import('html2pdf.js');

  const nombre =
    [employee.firstName, employee.middleName, employee.lastName, employee.secondLastName]
      .filter(Boolean)
      .join(' ')
      .trim() || employee.userName || 'Colaborador';

  const salario = [...salaries]
    .filter((s) => s?.salaryAmount)
    .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0];

  const contenido = document.createElement('div');
  contenido.innerHTML = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;padding:36px 40px;color:#242424;">

      <div style="border-bottom:3px solid #0F6CBD;padding-bottom:14px;margin-bottom:22px;">
        <p style="margin:0;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#0F6CBD;font-weight:700;">
          Expediente del colaborador
        </p>
        <h1 style="margin:6px 0 0;font-size:24px;">${esc(nombre)}</h1>
        <p style="margin:4px 0 0;font-size:13px;color:#616161;">
          ${esc(employee.departament?.name ?? 'Sin departamento')}
          ${employee.journey ? ` &middot; ${esc(employee.journey)}` : ''}
          &middot; ${employee.isActive ? 'Activo' : 'Inactivo'}
        </p>
      </div>

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.6px;color:#0F6CBD;margin:0 0 8px;">
        Datos personales
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
        ${fila('Cédula', employee.dni)}
        ${fila('Correo', employee.email)}
        ${fila('Teléfono', employee.phoneNumber)}
        ${fila('Dirección', employee.address)}
        ${fila('Fecha de nacimiento', fecha(employee.birthDate))}
      </table>

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.6px;color:#0F6CBD;margin:0 0 8px;">
        Información laboral
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
        ${fila('Departamento', employee.departament?.name)}
        ${fila('Jornada', employee.journey)}
        ${fila('Fecha de ingreso', fecha(employee.hiredDate))}
        ${fila('Salario vigente', salario ? formatMoney(salario.salaryAmount) : 'Sin registrar')}
        ${fila('Vigente desde', salario ? fecha(salario.effectiveDate) : '—')}
      </table>

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.6px;color:#0F6CBD;margin:0 0 8px;">
        Resumen del expediente
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        ${fila('Cursos registrados', conteos.cursos ?? 0)}
        ${fila('Certificaciones', conteos.certificaciones ?? 0)}
        ${fila('Acciones de personal', conteos.acciones ?? 0)}
      </table>

      <p style="margin-top:30px;font-size:10px;color:#9e9e9e;border-top:1px solid #eee;padding-top:10px;">
        Documento generado el ${new Date().toLocaleDateString('es-CR', {
          day: '2-digit', month: 'long', year: 'numeric',
        })} &middot; Uso interno de Recursos Humanos
      </p>
    </div>`;

  const archivo = `expediente-${nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`;

  await html2pdf()
    .set({
      margin: 0,
      filename: archivo,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(contenido)
    .save();

  return archivo;
};

export default descargarPerfilPdf;
