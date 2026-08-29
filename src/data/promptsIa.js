/**
 * Instrucciones de las tareas asistidas por IA.
 *
 * Viven juntas y separadas de las pantallas por dos razones: se afinan
 * leyéndolas una al lado de la otra, y así ninguna pantalla arma su propio
 * prompt por su cuenta con un tono distinto.
 *
 * Regla común a todas: **el modelo no inventa**. Si un dato no está en lo que
 * se le pasa, tiene que decir que no está, no completarlo. Esto es
 * información laboral de personas.
 */

const COMUN = `Escribes en español de Costa Rica, para el área de Recursos Humanos.
Sé concreto y breve; nada de relleno ni de fórmulas de cortesía.
Trabaja SOLO con los datos que se te entregan: si algo no aparece, dilo en
lugar de suponerlo. Nunca inventes montos, fechas ni nombres.
No uses encabezados de markdown; texto corrido y viñetas simples con "-".`;

export const SISTEMA = {
  resumenExpediente: `${COMUN}
Resumes el expediente de un colaborador para que una jefatura se ponga al día
en menos de un minuto: trayectoria, lo que destaca y lo que requiere atención.`,

  clasificarDocumentos: `${COMUN}
Clasificas documentos del expediente. Respondes ÚNICAMENTE con el id de una
categoría de la lista que se te da, sin explicación ni puntuación.`,

  redaccionAcciones: `${COMUN}
Redactas la descripción formal de una acción de personal a partir de notas
sueltas. Tono administrativo, en tercera persona, un solo párrafo.`,

  analisisAusentismo: `${COMUN}
Analizas estadísticas de ausentismo. Señalas patrones, lo que se sale de lo
normal y qué conviene revisar. Distingues lo que el dato muestra de lo que
solo sugiere.`,

  analisisPlanilla: `${COMUN}
Revisas una planilla antes de que se apruebe, como lo haría alguien de
Compensación: buscas montos fuera de lo esperado, datos que faltan y cosas
que conviene confirmar. No apruebas ni rechazas: señalas qué mirar.`,
};

/* ------------------------------------------------------------------
   Constructores de prompt
   ------------------------------------------------------------------ */

const money = (n) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const fecha = (v) => {
  if (!v) return 'sin fecha';
  const f = new Date(v);
  return Number.isNaN(f.getTime())
    ? 'sin fecha'
    : f.toLocaleDateString('es-CR');
};

const lista = (items, formato, vacio) =>
  items?.length ? items.map(formato).join('\n') : `  (${vacio})`;

/** Resumen del expediente de un colaborador. */
export const promptResumenExpediente = ({
  empleado,
  acciones = [],
  salarios = [],
  vacaciones = [],
  ausencias = [],
  cursos = [],
  certificaciones = [],
  reconocimientos = [],
}) => `Resume el expediente de este colaborador en 4 o 5 viñetas y cierra con
una línea de "A revisar" si detectas algo pendiente.

COLABORADOR
  Nombre: ${empleado?.firstName ?? ''} ${empleado?.lastName ?? ''}
  Puesto: ${empleado?.position ?? 'no indicado'}
  Departamento: ${empleado?.departament?.name ?? 'no indicado'}
  Ingreso: ${fecha(empleado?.hiredDate)}
  Jornada: ${empleado?.journey ?? 'no indicada'}

ACCIONES DE PERSONAL (${acciones.length})
${lista(acciones, (a) => `  - ${fecha(a.actionDate)} · ${a.actionType?.name ?? 'acción'} · ${a.status ?? 'Pendiente'} · ${a.description ?? ''}`, 'ninguna')}

HISTORIAL SALARIAL (${salarios.length})
${lista(salarios, (s) => `  - ${fecha(s.effectiveDate)} · ${money(s.salaryAmount)}`, 'sin registros')}

VACACIONES (${vacaciones.length})
${lista(vacaciones, (v) => `  - ${fecha(v.startDate)} a ${fecha(v.endDate)} · ${v.status ?? 'Pendiente'}`, 'ninguna')}

AUSENCIAS (${ausencias.length})
${lista(ausencias, (a) => `  - ${fecha(a.startDate)} · ${a.title ?? 'ausencia'} · ${a.justified ? 'justificada' : 'injustificada'} · ${a.status ?? 'Pendiente'}`, 'ninguna')}

FORMACIÓN
  Cursos (${cursos.length}): ${cursos.map((c) => c.name).join(', ') || 'ninguno'}
  Certificaciones (${certificaciones.length}): ${certificaciones.map((c) => `${c.name} (vence ${fecha(c.expirationDate)})`).join(', ') || 'ninguna'}

RECONOCIMIENTOS (${reconocimientos.length})
${lista(reconocimientos, (r) => `  - ${fecha(r.createdAt)} · ${r.title ?? ''}`, 'ninguno')}`;

/** Clasificación de un documento que se está subiendo. */
export const promptClasificarDocumento = ({ nombreArchivo, tipo, categorias }) =>
  `Elige la categoría que corresponde a este documento.

Archivo: ${nombreArchivo}
Tipo: ${tipo}

Categorías disponibles (responde solo con el id):
${categorias.map((c) => `  ${c.id} — ${c.label}: ${c.descripcion}`).join('\n')}

Si el nombre no da información suficiente, responde: Otro`;

/** Redacción de la descripción de una acción de personal. */
export const promptRedaccionAccion = ({ tipo, colaborador, fechaAccion, notas }) =>
  `Redacta la descripción de esta acción de personal en un párrafo de 2 a 4
oraciones, listo para el expediente.

Tipo de acción: ${tipo ?? 'no indicado'}
Colaborador: ${colaborador ?? 'no indicado'}
Fecha: ${fecha(fechaAccion)}

Notas de quien la registra:
${notas || '(sin notas)'}

Devuelve únicamente el párrafo, sin comillas ni encabezado.`;

/** Análisis de las estadísticas de ausentismo. */
export const promptAnalisisAusentismo = ({ resumen, porMes, porDia, topEmpleados }) =>
  `Analiza estas cifras de ausentismo. Da 3 o 4 observaciones y cierra con una
recomendación concreta.

TOTALES
  Registros: ${resumen.total}
  Días de ausencia: ${resumen.dias}
  Duración promedio: ${resumen.promedio} días
  Justificadas: ${resumen.justificadas} de ${resumen.total}
  Costo registrado: ${money(resumen.costo)}

POR MES (últimos 12)
${porMes.map((m) => `  ${m.mes}: ${m.ausencias} ausencias, ${m.dias} días`).join('\n')}

POR DÍA DE LA SEMANA
${porDia.map((d) => `  ${d.dia}: ${d.ausencias}`).join('\n')}

COLABORADORES CON MÁS DÍAS
${lista(topEmpleados, (e) => `  - ${e.nombre}: ${e.dias} días en ${e.ausencias} ausencias`, 'sin datos')}`;

/** Revisión de una planilla antes de aprobarla. */
export const promptAnalisisPlanilla = ({ planilla, resumen, filas }) =>
  `Revisa esta planilla antes de aprobarla. Señala en viñetas lo que convenga
verificar: montos que se salen del patrón, netos negativos o desproporcionados,
personas sin datos, deducciones inusuales. Si todo se ve consistente, dilo.
Cierra con una línea de veredicto: "Sin observaciones" o "Revisar antes de aprobar".

PLANILLA
  Descripción: ${planilla?.payrollDescription || 'sin descripción'}
  Tipo: ${planilla?.payrollType ?? 'no indicado'}
  Periodo: ${fecha(planilla?.initialDate)} a ${fecha(planilla?.finalDate)}
  Estado: ${planilla?.status ?? 'Borrador'}

TOTALES
  Empleados: ${resumen.empleados}
  Bruto: ${money(resumen.totalBruto)}
  Extras: ${money(resumen.totalExtras)}
  Deducciones: ${money(resumen.totalDeductions)}
  Neto a pagar: ${money(resumen.totalToPay)}

DETALLE POR PERSONA
${lista(
  filas,
  (f) =>
    `  - ${f.nombre}: mensual ${money(f.monthlySalary)} · bruto ${money(f.grossSalary)} · ` +
    `extras ${f.overTimeHours}h (${money(f.overtimeAmount)}) · ` +
    `ausencia ${f.absenceTime}d (${money(f.absenceAmount)}) · ` +
    `deducciones ${money(f.totalDeductions)} · neto ${money(f.netAmount)}`,
  'la planilla está vacía'
)}`;
