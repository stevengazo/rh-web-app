/**
 * Contenido del sitio público (marketing).
 *
 * Todo el copy, los módulos y los planes viven aquí para poder ajustarlos
 * sin tocar los componentes. Los precios son una propuesta inicial: cámbialos
 * en `PLANES` y se propagan a la página de precios y al comparativo.
 */
import {
  Award,
  Banknote,
  BarChart3,
  Briefcase,
  CalendarDays,
  Database,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Percent,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Target,
  Upload,
  UserRound,
  Users,
  Workflow,
} from 'lucide-react';

/** Identidad del producto. */
export const PRODUCTO = {
  nombre: 'RH Manager',
  claim: 'Recursos Humanos sin hojas de cálculo',
  /** El claim partido en dos para poder resaltar la segunda mitad en el hero. */
  claimInicio: 'Recursos Humanos',
  claimResaltado: 'sin hojas de cálculo',
  descripcion:
    'Expediente digital, planilla, ausencias, préstamos y desempeño en un solo sistema, pensado para empresas de Costa Rica.',
};

/** Datos de contacto que se muestran en el footer y en la página de contacto. */
export const CONTACTO = {
  email: 'soporte@grupomecsa.net',
  telefono: '+506 0000-0000',
  ubicacion: 'San José, Costa Rica',
  horario: 'Lunes a viernes, 8:00 a.m. – 5:00 p.m.',
};

/** Navegación principal del sitio público. */
export const NAV_PUBLICA = [
  { to: '/caracteristicas', label: 'Características' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/precios', label: 'Precios' },
  { to: '/contacto', label: 'Contacto' },
];

/** Cifras verificables del propio sistema (nada inventado sobre clientes). */
export const CIFRAS = [
  { valor: '30+', label: 'módulos conectados entre sí' },
  { valor: '3', label: 'periodos de planilla: semanal, quincenal y mensual' },
  { valor: '100%', label: 'en la nube o en tus propios servidores' },
  { valor: '24/7', label: 'autoservicio para cada colaborador' },
];

/**
 * Módulos del sistema. `destacado: true` marca los que se muestran en el home.
 */
export const MODULOS = [
  {
    icon: Users,
    grupo: 'personal',
    titulo: 'Expediente digital',
    descripcion:
      'La ficha completa de cada colaborador: datos personales, contactos de emergencia, departamento, jefatura e historial salarial.',
    destacado: true,
    detalles: [
      'Historial de salarios con fecha de vigencia',
      'Contactos de emergencia y datos médicos',
      'Departamentos y jefaturas asignadas',
      'Búsqueda global desde cualquier pantalla',
    ],
  },
  {
    icon: FileText,
    grupo: 'planilla',
    titulo: 'Planilla automatizada',
    descripcion:
      'Genera la planilla del periodo tomando lo que ya registraste durante el mes y emite el comprobante de pago en PDF.',
    destacado: true,
    detalles: [
      'Periodos semanal, quincenal y mensual',
      'Horas extra (1.5x), feriados (2x) y extras en feriado (2.5x)',
      'Deducciones de CCSS, INS, pensión y embargos',
      'Comprobante de pago descargable por colaborador',
    ],
  },
  {
    icon: Briefcase,
    grupo: 'personal',
    titulo: 'Acciones de personal',
    descripcion:
      'Ingresos, ascensos, traslados, aumentos y salidas quedan registrados con su tipo de acción, fecha y responsable.',
    destacado: true,
    detalles: [
      'Tipos de acción configurables',
      'Trazabilidad de quién creó y editó cada movimiento',
      'Vinculadas al expediente del colaborador',
    ],
  },
  {
    icon: CalendarDays,
    grupo: 'personal',
    titulo: 'Ausencias y vacaciones',
    descripcion:
      'Control de días disponibles, solicitudes, incapacidades y ausencias justificadas, con impacto directo en la planilla.',
    destacado: true,
    detalles: [
      'Saldo de vacaciones por colaborador',
      'Registro de incapacidades CCSS e INS',
      'Las ausencias rebajan automáticamente en el periodo',
    ],
  },
  {
    icon: Banknote,
    grupo: 'planilla',
    titulo: 'Préstamos y deducciones',
    descripcion:
      'Préstamos con su plan de pagos, embargos judiciales y rebajos que se aplican solos en cada planilla.',
    destacado: true,
    detalles: [
      'Plan de pagos con saldo pendiente al día',
      'Embargos y pensiones alimentarias',
      'El colaborador consulta su saldo desde su portal',
    ],
  },
  {
    icon: Target,
    grupo: 'desempeno',
    titulo: 'KPIs y desempeño',
    descripcion:
      'Objetivos por categoría, cuestionarios de evaluación, resultados y gráficos para dar seguimiento a cada equipo.',
    destacado: true,
    detalles: [
      'Objetivos por categoría y por colaborador',
      'Cuestionarios de evaluación configurables',
      'Gráficos de resultados por periodo',
    ],
  },
  {
    icon: Percent,
    grupo: 'planilla',
    titulo: 'Comisiones',
    descripcion:
      'Registra y liquida comisiones por colaborador; se suman al bruto del periodo y quedan visibles en su portal.',
    detalles: [
      'Comisiones por colaborador y periodo',
      'Se integran al cálculo de la planilla',
    ],
  },
  {
    icon: GraduationCap,
    grupo: 'personal',
    titulo: 'Cursos y certificaciones',
    descripcion:
      'Capacitaciones, certificaciones y sus fechas de vencimiento, para que ninguna se venza sin que nadie se entere.',
    detalles: [
      'Cursos internos y externos',
      'Certificaciones con fecha de vencimiento',
      'Reconocimientos y premios del colaborador',
    ],
  },
  {
    icon: UserRound,
    grupo: 'portal',
    titulo: 'Portal del colaborador',
    descripcion:
      'Cada persona entra con su usuario y consulta su perfil, comprobantes, préstamos, comisiones y KPIs sin escribirle a RR.HH.',
    destacado: true,
    detalles: [
      'Comprobantes de pago históricos',
      'Saldo de préstamos y comisiones',
      'Sus objetivos y evaluaciones',
    ],
  },
  {
    icon: LayoutDashboard,
    grupo: 'desempeno',
    titulo: 'Dashboard de gestión',
    descripcion:
      'Un panel con la foto del mes: personal activo, movimientos, ausencias y planillas en proceso.',
    detalles: [
      'Indicadores del mes en curso',
      'Accesos directos a lo pendiente',
    ],
  },
  {
    icon: ShieldCheck,
    grupo: 'portal',
    titulo: 'Roles y seguridad',
    descripcion:
      'Autenticación con JWT y roles por módulo: cada quien ve únicamente lo que le corresponde.',
    detalles: [
      'Roles de administrador, RR.HH. y colaborador',
      'Sesión con expiración configurable',
      'Registro de creación y edición por usuario',
    ],
  },
  {
    icon: Award,
    grupo: 'personal',
    titulo: 'Recordatorios',
    descripcion:
      'Avisos de lo que vence: certificaciones, contratos y fechas clave del expediente.',
    detalles: ['Recordatorios por colaborador', 'Notificación por correo'],
  },
];

/**
 * Áreas en las que se agrupan los módulos en la página de características.
 * El `id` se usa como ancla (#personal, #planilla, …).
 */
export const GRUPOS_MODULOS = [
  {
    id: 'personal',
    titulo: 'Gestión de personal',
    descripcion:
      'El expediente y todo lo que le ocurre a una persona mientras trabaja contigo.',
  },
  {
    id: 'planilla',
    titulo: 'Planilla y dinero',
    descripcion:
      'El cálculo del periodo con sus ingresos, deducciones y comprobantes.',
  },
  {
    id: 'desempeno',
    titulo: 'Desempeño y control',
    descripcion:
      'Objetivos, evaluaciones e indicadores para tomar decisiones con datos.',
  },
  {
    id: 'portal',
    titulo: 'Acceso y seguridad',
    descripcion:
      'Quién entra, qué ve y qué puede hacer cada persona dentro del sistema.',
  },
];

/** Pasos del flujo de implementación. */
export const PASOS = [
  {
    icon: Settings2,
    titulo: 'Configura tu empresa',
    descripcion:
      'Definimos departamentos, jefaturas, tipos de acción y categorías de objetivos según cómo trabaja tu organización.',
    duracion: 'Día 1',
  },
  {
    icon: Upload,
    titulo: 'Carga a tus colaboradores',
    descripcion:
      'Importamos el expediente, el salario base y los datos de cada persona. Tú solo revisas y apruebas.',
    duracion: 'Días 2 y 3',
  },
  {
    icon: Workflow,
    titulo: 'Opera el día a día',
    descripcion:
      'Acciones de personal, ausencias, préstamos y comisiones se registran conforme ocurren, no al final del mes.',
    duracion: 'Todo el mes',
  },
  {
    icon: LineChart,
    titulo: 'Cierra y mide',
    descripcion:
      'La planilla se genera con todo lo registrado, se emiten los comprobantes y el dashboard muestra cómo cerró el periodo.',
    duracion: 'Cierre de periodo',
  },
];

/** Bloques técnicos de la página "Cómo funciona". */
export const ARQUITECTURA = [
  {
    icon: Rocket,
    titulo: 'Aplicación web',
    descripcion:
      'React 19 servido por Nginx. Funciona en cualquier navegador moderno, en computadora o celular, sin instalar nada.',
  },
  {
    icon: Server,
    titulo: 'API .NET 9',
    descripcion:
      'Toda la lógica de negocio vive en una API REST documentada con Swagger y protegida con JWT.',
  },
  {
    icon: Database,
    titulo: 'SQL Server 2022',
    descripcion:
      'Tus datos en una base relacional con respaldos. Puede estar en la nube o dentro de tu propia infraestructura.',
  },
  {
    icon: BarChart3,
    titulo: 'Despliegue con Docker',
    descripcion:
      'Todo el sistema se levanta con un solo comando, así que actualizar o migrar de servidor toma minutos.',
  },
];

/**
 * Planes comerciales.
 * ⚠️ Precios de referencia — ajústalos antes de publicar.
 */
export const PLANES = [
  {
    id: 'esencial',
    nombre: 'Esencial',
    resumen: 'Para empresas que están ordenando su información por primera vez.',
    precioMensual: 1500,
    precioAnual: 1250,
    unidad: 'por colaborador / mes',
    minimo: 'Mínimo 10 colaboradores',
    cta: 'Comenzar',
    incluye: [
      'Expediente digital completo',
      'Ausencias y vacaciones',
      'Cursos y certificaciones',
      'Portal del colaborador',
      'Roles y permisos',
      'Soporte por correo',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    resumen: 'El plan completo de RR.HH. y planilla para la operación mensual.',
    precioMensual: 2900,
    precioAnual: 2400,
    unidad: 'por colaborador / mes',
    minimo: 'Hasta 200 colaboradores',
    destacado: true,
    etiqueta: 'Más elegido',
    cta: 'Solicitar demo',
    incluye: [
      'Todo lo del plan Esencial',
      'Planilla semanal, quincenal y mensual',
      'Comprobantes de pago en PDF',
      'Préstamos, embargos y comisiones',
      'Acciones de personal',
      'Dashboard de gestión',
      'Soporte prioritario',
    ],
  },
  {
    id: 'corporativo',
    nombre: 'Corporativo',
    resumen: 'Para grupos empresariales con requisitos propios de TI.',
    precioTexto: 'A la medida',
    unidad: 'según alcance',
    minimo: 'Sin límite de colaboradores',
    cta: 'Hablar con ventas',
    incluye: [
      'Todo lo del plan Profesional',
      'KPIs, objetivos y evaluaciones de desempeño',
      'Instalación en tus servidores (on-premise)',
      'Integraciones con tus sistemas',
      'Migración de datos asistida',
      'Acuerdo de nivel de servicio (SLA)',
    ],
  },
];

/** Comparativo de la página de precios. `true`/`false`/texto. */
export const COMPARATIVO = [
  {
    grupo: 'Personal',
    filas: [
      { label: 'Expediente digital', esencial: true, profesional: true, corporativo: true },
      { label: 'Acciones de personal', esencial: false, profesional: true, corporativo: true },
      { label: 'Ausencias y vacaciones', esencial: true, profesional: true, corporativo: true },
      { label: 'Cursos y certificaciones', esencial: true, profesional: true, corporativo: true },
    ],
  },
  {
    grupo: 'Planilla',
    filas: [
      { label: 'Cálculo de planilla', esencial: false, profesional: true, corporativo: true },
      { label: 'Comprobantes en PDF', esencial: false, profesional: true, corporativo: true },
      { label: 'Préstamos y embargos', esencial: false, profesional: true, corporativo: true },
      { label: 'Comisiones', esencial: false, profesional: true, corporativo: true },
    ],
  },
  {
    grupo: 'Desempeño',
    filas: [
      { label: 'KPIs y objetivos', esencial: false, profesional: false, corporativo: true },
      { label: 'Evaluaciones y cuestionarios', esencial: false, profesional: false, corporativo: true },
      { label: 'Dashboard de gestión', esencial: false, profesional: true, corporativo: true },
    ],
  },
  {
    grupo: 'Plataforma',
    filas: [
      { label: 'Portal del colaborador', esencial: true, profesional: true, corporativo: true },
      { label: 'Roles y permisos', esencial: true, profesional: true, corporativo: true },
      { label: 'Instalación on-premise', esencial: false, profesional: false, corporativo: true },
      { label: 'Soporte', esencial: 'Correo', profesional: 'Prioritario', corporativo: 'Dedicado + SLA' },
    ],
  },
];

/** Preguntas frecuentes. */
export const FAQS = [
  {
    pregunta: '¿El sistema calcula las deducciones de ley de Costa Rica?',
    respuesta:
      'Sí. La planilla contempla CCSS, INS, pensión y embargos judiciales, además de horas extra, feriados y ausencias. Los porcentajes son configurables, así que se ajustan si cambia la normativa.',
  },
  {
    pregunta: '¿Puedo instalarlo en mis propios servidores?',
    respuesta:
      'Sí. El sistema se despliega con Docker (aplicación web, API y SQL Server), por lo que puede vivir en la nube o dentro de tu infraestructura. La instalación on-premise está incluida en el plan Corporativo.',
  },
  {
    pregunta: '¿Qué pasa con la información que ya tengo en Excel?',
    respuesta:
      'La migramos. Durante la implementación cargamos el expediente, los salarios vigentes y los saldos de vacaciones y préstamos a partir de tus archivos actuales.',
  },
  {
    pregunta: '¿Cada colaborador necesita una cuenta?',
    respuesta:
      'Sí, y está incluida en el precio. Cada persona entra con su usuario a consultar sus comprobantes, préstamos, comisiones y objetivos, lo que reduce muchísimo las consultas a RR.HH.',
  },
  {
    pregunta: '¿Cuánto tarda la implementación?',
    respuesta:
      'Para una empresa de hasta 100 colaboradores, una semana es un plazo realista: configuración, carga de datos y una sesión de capacitación con el equipo de RR.HH.',
  },
  {
    pregunta: '¿Hay contrato de permanencia?',
    respuesta:
      'No. El plan mensual se cancela cuando quieras y el plan anual otorga dos meses de descuento a cambio de pago adelantado.',
  },
];

/** Problemas que resuelve — sección "antes / después" del home. */
export const DOLORES = [
  {
    antes: 'La planilla vive en un Excel que solo una persona entiende.',
    despues:
      'El cálculo es del sistema: mismo criterio todos los meses y con historial.',
  },
  {
    antes: 'Nadie sabe cuántas vacaciones le quedan a cada quien.',
    despues: 'El saldo está al día y el colaborador lo consulta solo.',
  },
  {
    antes: 'Los préstamos y rebajos se apuntan aparte y se olvidan.',
    despues: 'Cada deducción se aplica sola en el periodo que corresponde.',
  },
  {
    antes: 'RR.HH. pasa el día reenviando comprobantes de pago.',
    despues: 'Cada persona descarga los suyos desde su portal, cuando quiera.',
  },
];
