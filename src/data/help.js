/**
 * Contenido de la ayuda en pantalla.
 *
 * Cada área describe para qué sirve el módulo, cómo se usa paso a paso y qué
 * dudas suelen aparecer. Se muestra en un panel lateral desde el botón "?" de
 * cada pantalla y desde el menú de ayuda del sidebar.
 *
 * Para agregar ayuda a una pantalla nueva: añade una entrada aquí y pon
 * `<HelpButton area="tu-clave" />` en el encabezado de la página.
 */

export const AYUDA = {
  dashboard: {
    titulo: 'Dashboard',
    icono: 'LayoutDashboard',
    resumen:
      'La foto del mes: cuánta gente hay activa, qué movimientos ocurrieron y qué quedó pendiente.',
    pasos: [
      'Revisa los indicadores de la parte superior para ver el estado general.',
      'Usa los accesos directos para ir a lo que requiere tu atención.',
    ],
    tips: [
      'Los números consideran únicamente colaboradores activos y no eliminados.',
    ],
  },

  empleados: {
    titulo: 'Empleados',
    icono: 'Users',
    resumen:
      'El expediente de cada colaborador: datos personales, departamento, salario, cursos y certificaciones.',
    pasos: [
      'Usa el buscador para encontrar a alguien por nombre, cédula o departamento.',
      'Haz clic en una tarjeta para ver un resumen rápido en el panel lateral.',
      '"Ver perfil completo" abre el expediente con todas sus pestañas.',
      'Para dar de alta a alguien, usa "Agregar empleado" y completa el formulario.',
    ],
    tips: [
      'Un colaborador sin salario vigente no aparecerá al armar una planilla. Regístraselo desde su perfil, pestaña de salarios.',
      'Los colaboradores creados desde el registro público no tienen nombre: complétalo antes de generarles comprobantes.',
    ],
    faq: [
      {
        p: '¿Por qué un empleado aparece como "Sin nombre registrado"?',
        r: 'Porque su cuenta se creó sin nombre ni apellidos. Edita su expediente y complétalos.',
      },
      {
        p: '¿Qué pasa si desactivo a alguien?',
        r: 'Deja de aparecer en la selección de planilla y en la de acciones, pero su historial se conserva.',
      },
    ],
  },

  planilla: {
    titulo: 'Planilla',
    icono: 'FileText',
    resumen:
      'Generación, cálculo y aprobación de la planilla del periodo, con su comprobante por colaborador.',
    pasos: [
      'Pulsa "Generar Nueva Planilla" y define tipo (semanal, quincenal o mensual), fecha de inicio y descripción.',
      'La planilla nace vacía y en estado Borrador. Agrega a los colaboradores con "Agregar empleados" o incorpóralos a todos de una vez.',
      'Captura horas extra, feriados, bonos, comisiones, incapacidades y deducciones en la tabla. Los totales se recalculan solos.',
      'Pulsa "Guardar planilla" para enviar los cambios al servidor.',
      'Cuando todo esté correcto, pulsa "Aprobar". La planilla se congela y ya no admite cambios.',
      'Una vez pagada, márcala como "Pagada" desde el listado.',
    ],
    tips: [
      'Guardar y aprobar son pasos distintos: se aprueba solo cuando no quedan cambios pendientes.',
      'Si te equivocaste en una planilla aprobada, usa "Reabrir como borrador". Una planilla ya pagada no se puede reabrir: hay que anularla.',
      'Quitar a alguien de la planilla no lo elimina del sistema, solo lo deja fuera de ese periodo.',
    ],
    faq: [
      {
        p: '¿Por qué no aparece un colaborador al agregar empleados?',
        r: 'Porque ya está incluido, está inactivo, o no tiene un salario vigente registrado. La pantalla avisa cuántos quedaron fuera por falta de salario.',
      },
      {
        p: '¿Qué diferencia hay entre Aprobada y Pagada?',
        r: 'Aprobada significa que los montos están en firme y la planilla quedó congelada. Pagada indica que el dinero ya se transfirió.',
      },
      {
        p: '¿Puedo editar una planilla aprobada?',
        r: 'No directamente. Reábrela como borrador, corrige y vuelve a aprobarla; queda registro de quién hizo cada cosa.',
      },
    ],
  },

  acciones: {
    titulo: 'Acciones de personal',
    icono: 'Briefcase',
    resumen:
      'Ingresos, ascensos, traslados, aumentos y salidas: todo movimiento del colaborador queda registrado y aprobado.',
    pasos: [
      'Pulsa "Agregar Acción", elige al colaborador, el tipo de acción y describe el movimiento.',
      'La acción queda en estado Pendiente.',
      'Desde la tarjeta puedes aprobarla o rechazarla sin abrir el detalle.',
      'Al rechazar se pide un motivo, que queda visible en la tarjeta y en el detalle.',
    ],
    tips: [
      'Los recuadros de arriba filtran: pulsa "Pendientes" para ver solo lo que falta revisar.',
      'Una acción ya revisada se puede devolver a pendiente con "Volver a pendiente".',
      'Solo las acciones pendientes son editables.',
    ],
    faq: [
      {
        p: '¿Quién queda registrado como aprobador?',
        r: 'El usuario con el que iniciaste sesión, junto con la fecha y hora de la aprobación.',
      },
    ],
  },

  ausencias: {
    titulo: 'Ausencias',
    icono: 'CalendarDays',
    resumen:
      'Ausencias, permisos e incapacidades del personal, con aprobación y vista de calendario.',
    pasos: [
      'Pulsa "Agregar registro" e indica colaborador, fechas, título y motivo.',
      'Marca si la ausencia es justificada.',
      'La solicitud queda Pendiente hasta que alguien la apruebe o la rechace.',
      'Cambia entre vista de Tabla y Calendario según lo que necesites revisar.',
    ],
    tips: [
      'Los recuadros superiores funcionan como filtro por estado.',
      'El conteo de días es en días naturales: incluye fines de semana y feriados.',
      'Las ausencias aprobadas son las que deben rebajarse en la planilla del periodo.',
    ],
    faq: [
      {
        p: '¿El rechazo requiere motivo?',
        r: 'Sí, es obligatorio, y queda guardado junto con quién rechazó y cuándo.',
      },
    ],
  },

  prestamos: {
    titulo: 'Préstamos',
    icono: 'Banknote',
    resumen:
      'Préstamos al personal con su aprobación, plan de pagos y saldo pendiente.',
    pasos: [
      'Pulsa "Agregar Préstamo" e indica colaborador, monto, plazo en meses y motivo.',
      'El préstamo queda Pendiente hasta que se apruebe. Mientras esté pendiente puedes editar monto, plazo, título y descripción.',
      'Al aprobarlo, entra en cobro y su saldo aparece en el listado.',
      'Registra los abonos desde el detalle del préstamo (icono del ojo).',
      'Cuando los abonos cubran el monto, márcalo como Pagado.',
    ],
    tips: [
      'El saldo se calcula solo: monto menos la suma de abonos no eliminados.',
      'Solo se puede abonar a préstamos aprobados, y nunca por encima del saldo pendiente.',
      'Cuando un abono cancela el saldo, el préstamo pasa a Pagado automáticamente.',
      'La cuota mensual mostrada es el monto dividido entre el plazo, sin intereses.',
      'Cada abono se puede corregir o eliminar desde el detalle; si el préstamo estaba saldado y deja de cubrirse, vuelve a Aprobado.',
      'Un préstamo ya aprobado o rechazado no se puede editar: primero devuélvelo a pendiente.',
    ],
    faq: [
      {
        p: '¿Se puede rechazar un préstamo ya aprobado?',
        r: 'Sí, mientras no esté pagado. Se pide el motivo y se limpia la aprobación anterior.',
      },
      {
        p: '¿Por qué no puedo eliminar un préstamo saldado?',
        r: 'Porque forma parte del historial del colaborador. Los préstamos pendientes, aprobados o rechazados sí se pueden eliminar, y se borran junto con sus abonos.',
      },
      {
        p: '¿Puedo abonar más de lo que se debe?',
        r: 'No. El formulario y el servidor rechazan cualquier abono que supere el saldo, e indican cuánto queda pendiente.',
      },
      {
        p: '¿Puedo corregir un abono mal registrado?',
        r: 'Sí. Desde el detalle del préstamo cada abono tiene botones para editarlo o eliminarlo. El eliminado es un borrado lógico y el estado del préstamo se recalcula solo.',
      },
    ],
  },

  psicometria: {
    titulo: 'Psicometría',
    icono: 'Brain',
    resumen:
      'Cuestionarios psicométricos: se arman con dimensiones e ítems, se asignan al personal y el sistema califica el perfil.',
    pasos: [
      'En la pestaña "Pruebas" crea una prueba y ábrela para editarla.',
      'Agrega las dimensiones (rasgos o escalas) y luego los ítems: Likert 1–5 u opción múltiple, cada uno mapeado a una dimensión.',
      'Marca como "invertido" el ítem cuyo acuerdo resta en vez de sumar; puntúa 6 − valor.',
      'Cuando tenga al menos una dimensión y un ítem, actívala.',
      'En "Aplicaciones" pulsa "Asignar prueba", elige la prueba y uno o varios colaboradores.',
      'El colaborador la responde desde su portal ("Evaluaciones"); al enviarla se calcula el perfil.',
      'Abre la aplicación para ver el radar y los puntajes por dimensión, escribe la conclusión y márcala como revisada.',
    ],
    tips: [
      'El colaborador solo ve que completó la prueba; los puntajes son visibles únicamente para Recursos Humanos.',
      'Mientras la prueba no tenga respuestas puedes cambiar toda su estructura; después solo el texto de los ítems.',
      'Cada dimensión reporta puntaje bruto, promedio por ítem y porcentaje; el radar usa el porcentaje.',
      '"Reabrir" borra el resultado y deja que el colaborador vuelva a responder.',
      'La prueba y sus dimensiones son borrado lógico; una prueba con aplicaciones no se elimina, se desactiva.',
    ],
    faq: [
      {
        p: '¿Puedo asignar la misma prueba dos veces a la misma persona?',
        r: 'Sí, cada asignación es un intento independiente con su propio resultado.',
      },
      {
        p: '¿Qué pasa con los ítems sin dimensión?',
        r: 'Se responden pero no entran en ningún puntaje. Sirven para preguntas de control.',
      },
    ],
  },

  organigrama: {
    titulo: 'Organigrama',
    icono: 'Network',
    resumen:
      'La estructura de la empresa: qué departamentos existen, de quién dependen y quién los dirige.',
    pasos: [
      'Crea los departamentos que falten con "Nuevo departamento"; nacen en el nivel más alto.',
      'Haz clic en un departamento del diagrama para abrir su panel de edición.',
      'En "Depende de" elige el departamento superior: así se arma la jerarquía.',
      'Asigna una o varias jefaturas desde el mismo panel.',
      'Usa el zoom, el minimapa y "Ajustar a la vista" para moverte por el diagrama.',
    ],
    tips: [
      'Un departamento sin superior aparece como raíz; puede haber varias raíces.',
      'Al elegir el superior no se listan sus propios subdepartamentos, para que no se formen ciclos.',
      '"Orden entre hermanos" controla de izquierda a derecha cómo se dibujan los departamentos del mismo nivel.',
    ],
    faq: [
      {
        p: '¿Por qué un departamento muestra 0 colaboradores?',
        r: 'Se cuentan solo los colaboradores activos asignados a ese departamento en su expediente.',
      },
    ],
  },

  kpis: {
    titulo: 'Indicadores de Rendimiento',
    icono: 'Target',
    resumen:
      'Objetivos (KPIs) por categoría, a quién están asignados y sus resultados por periodo.',
    pasos: [
      'En la pestaña "Categorías" crea las categorías que agrupan los objetivos.',
      'En "Objetivos" crea cada objetivo, con su categoría y si está activo.',
      'Con el icono de diana asignas un objetivo a uno o varios colaboradores.',
      'En "Por colaborador" ves quién tiene qué; el enlace abre su ficha de desempeño con los gráficos.',
    ],
    tips: [
      'Solo los objetivos activos aparecen al asignar.',
      'Quitar una asignación es un borrado lógico: los resultados históricos se conservan.',
      'Las preguntas de evaluación se administran en la pantalla de Preguntas.',
    ],
  },

  preguntas: {
    titulo: 'Preguntas',
    icono: 'ListChecks',
    resumen:
      'Banco de preguntas para la evaluación de desempeño, agrupadas por categoría y asignadas por colaborador.',
    pasos: [
      'Crea las categorías en su pestaña.',
      'En "Preguntas" agrega cada pregunta con su categoría y estado.',
      'Con el icono de asignar la vinculas a uno o varios colaboradores.',
      'En "Por colaborador" revisas quién tiene qué preguntas asignadas.',
    ],
    tips: [
      'Solo las preguntas activas se pueden asignar.',
      'Las respuestas se registran desde la ficha de desempeño del colaborador.',
      'Quitar una asignación conserva las respuestas ya registradas.',
    ],
  },

  roles: {
    titulo: 'Roles y permisos',
    icono: 'Settings',
    resumen:
      'Qué puede ver y hacer cada persona dentro del sistema.',
    pasos: [
      'Selecciona al colaborador y asígnale el rol que le corresponde.',
      'El rol Admin da acceso a todo el área de Recursos Humanos.',
    ],
    tips: [
      'Los cambios de rol se aplican la próxima vez que la persona inicie sesión.',
    ],
  },

  mensajes: {
    titulo: 'Mensajes',
    icono: 'MessagesSquare',
    resumen:
      'Mensajería interna entre colaboradores: conversaciones directas y grupos.',
    pasos: [
      'Con el botón + eliges "Directo" para escribirle a una persona, o "Grupo" para varias.',
      'Escribe en la caja de abajo y pulsa Enter (Shift+Enter para salto de línea).',
      'Pasa el cursor sobre tus mensajes para editarlos o eliminarlos.',
      'El distintivo de la barra muestra cuántos mensajes sin leer tienes.',
    ],
    tips: [
      'No es tiempo real: la bandeja y el hilo se actualizan cada pocos segundos.',
      'Al abrir una conversación se marca como leída.',
      'De un grupo puedes salir; una conversación directa no se abandona.',
    ],
  },

  perfil: {
    titulo: 'Mi perfil',
    icono: 'User',
    resumen:
      'Tu expediente: datos personales, cursos, certificaciones, salarios, acciones, vacaciones y comprobantes.',
    pasos: [
      'Con "Editar mis datos" completas o corriges tu nombre, cédula, teléfono y fecha de nacimiento.',
      'Registra tus contactos de emergencia en la pestaña Perfil.',
      'En Vacaciones puedes solicitar días y ver tu saldo.',
      'En Comprobantes descargas tus comprobantes de pago.',
    ],
    tips: [
      'El correo, el departamento, la jornada y la fecha de ingreso los administra Recursos Humanos.',
    ],
  },
};

/** Orden en que se listan las áreas en el índice de ayuda. */
export const ORDEN_AYUDA = [
  'dashboard',
  'empleados',
  'planilla',
  'acciones',
  'ausencias',
  'prestamos',
  'organigrama',
  'kpis',
  'preguntas',
  'psicometria',
  'mensajes',
  'roles',
  'perfil',
];
