/**
 * Webhooks salientes: catálogo de disparadores y del formato del envío.
 *
 * El catálogo vive en el frontend porque describe **eventos del dominio**, no
 * configuración de infraestructura: agregar un disparador es declararlo aquí
 * y publicarlo desde el módulo correspondiente.
 */

/**
 * Eventos que pueden disparar un envío.
 *
 * `campos` es lo que ese evento puede incluir en el cuerpo; el constructor de
 * la consulta se arma con esta lista, así nadie escribe a mano un campo que
 * el evento no trae.
 */
export const DISPARADORES = [
  {
    grupo: 'Planilla',
    eventos: [
      {
        id: 'payroll.approved',
        nombre: 'Planilla aprobada',
        descripcion: 'Al congelarse una planilla y quedar lista para pago.',
        campos: [
          'payrollId', 'payrollDescription', 'payrollType', 'initialDate',
          'finalDate', 'employeeCount', 'totalGross', 'totalDeductions',
          'totalAmount', 'approvedBy', 'approvedAt',
        ],
      },
      {
        id: 'payroll.paid',
        nombre: 'Planilla pagada',
        descripcion: 'Al marcarse como pagada.',
        campos: [
          'payrollId', 'payrollDescription', 'totalAmount', 'paidBy', 'paidAt',
        ],
      },
      {
        id: 'payroll.voided',
        nombre: 'Planilla anulada',
        descripcion: 'Al anularse, con el motivo.',
        campos: ['payrollId', 'payrollDescription', 'voidReason'],
      },
    ],
  },
  {
    grupo: 'Personal',
    eventos: [
      {
        id: 'employee.created',
        nombre: 'Colaborador creado',
        descripcion: 'Al darse de alta en el sistema.',
        campos: [
          'userId', 'firstName', 'lastName', 'email', 'identification',
          'departament', 'position', 'hiredDate',
        ],
      },
      {
        id: 'employee.deactivated',
        nombre: 'Colaborador desactivado',
        descripcion: 'Útil para revocar accesos en otros sistemas.',
        campos: ['userId', 'firstName', 'lastName', 'email', 'deactivatedAt'],
      },
      {
        id: 'action.approved',
        nombre: 'Acción de personal aprobada',
        descripcion: 'Ascensos, traslados y demás movimientos.',
        campos: [
          'actionId', 'userId', 'employeeName', 'actionType', 'description',
          'actionDate', 'approvedBy', 'approvedAt',
        ],
      },
    ],
  },
  {
    grupo: 'Ausencias y vacaciones',
    eventos: [
      {
        id: 'absence.approved',
        nombre: 'Ausencia aprobada',
        descripcion: 'Para avisar a la jefatura o al control de asistencia.',
        campos: [
          'absenceId', 'userId', 'employeeName', 'title', 'startDate',
          'endDate', 'justified', 'amount', 'approvedBy',
        ],
      },
      {
        id: 'vacation.approved',
        nombre: 'Vacaciones aprobadas',
        descripcion: 'Para sincronizar con el calendario del equipo.',
        campos: [
          'vacationId', 'userId', 'employeeName', 'startDate', 'endDate',
          'days', 'approvedBy',
        ],
      },
      {
        id: 'vacation.rejected',
        nombre: 'Vacaciones rechazadas',
        descripcion: 'Incluye el motivo del rechazo.',
        campos: [
          'vacationId', 'userId', 'employeeName', 'startDate', 'endDate',
          'rejectionReason',
        ],
      },
    ],
  },
  {
    grupo: 'Alertas',
    eventos: [
      {
        id: 'certification.expiring',
        nombre: 'Certificación por vencer',
        descripcion: 'Se evalúa a diario, con la antelación configurada.',
        campos: [
          'certificationId', 'userId', 'employeeName', 'name', 'institution',
          'expirationDate', 'daysLeft',
        ],
      },
      {
        id: 'loan.approved',
        nombre: 'Préstamo aprobado',
        descripcion: 'Con el plan de cuotas resultante.',
        campos: [
          'loanId', 'userId', 'employeeName', 'title', 'amount',
          'paymentMonths', 'monthlyFee', 'approvedBy',
        ],
      },
    ],
  },
];

/** Todos los eventos en plano, para buscarlos por id. */
export const EVENTOS = DISPARADORES.flatMap((g) =>
  g.eventos.map((e) => ({ ...e, grupo: g.grupo }))
);

export const buscarEvento = (id) => EVENTOS.find((e) => e.id === id) ?? null;

export const METODOS = ['POST', 'PUT', 'PATCH'];

export const FORMATOS = [
  {
    id: 'json',
    nombre: 'JSON plano',
    descripcion: 'El evento y sus campos, tal cual.',
  },
  {
    id: 'slack',
    nombre: 'Slack / Teams',
    descripcion: 'Un mensaje con texto, para webhooks de chat.',
  },
  {
    id: 'custom',
    nombre: 'Plantilla propia',
    descripcion: 'Tú escribes el cuerpo y usas {{campo}} donde haga falta.',
  },
];

/** Webhook recién creado. */
export const webhookNuevo = () => ({
  id: crypto.randomUUID(),
  nombre: '',
  url: '',
  metodo: 'POST',
  activo: true,
  eventos: [],
  formato: 'json',
  campos: [],
  plantilla: '',
  cabeceras: [],
  secreto: '',
});

/**
 * Construye el cuerpo que se enviaría, para la vista previa.
 *
 * Es la misma función que usaría el emisor: si la vista previa y el envío
 * real se calcularan por separado, acabarían divergiendo.
 */
export const construirCuerpo = (webhook, evento, datos = {}) => {
  const seleccion = webhook.campos?.length
    ? webhook.campos
    : (evento?.campos ?? []);

  const cuerpo = Object.fromEntries(
    seleccion.map((c) => [c, datos[c] ?? `<${c}>`])
  );

  if (webhook.formato === 'slack') {
    return {
      text: `*${evento?.nombre ?? 'Evento'}*\n${seleccion
        .map((c) => `• ${c}: ${datos[c] ?? `<${c}>`}`)
        .join('\n')}`,
    };
  }

  if (webhook.formato === 'custom') {
    return webhook.plantilla || '{}';
  }

  return {
    event: evento?.id ?? 'evento',
    occurredAt: '<fecha ISO del envío>',
    data: cuerpo,
  };
};
