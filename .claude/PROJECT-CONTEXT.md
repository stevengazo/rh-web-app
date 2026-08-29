# Contexto del proyecto (para retomar en otra máquina)

> Este archivo resume el estado del trabajo y las decisiones de diseño para que
> cualquier sesión futura de Claude Code continúe con contexto completo.
> Se carga automáticamente vía `CLAUDE.md` (raíz). Viaja con git.

## 1. Qué es

Frontend **React 19 + Vite 7 + Tailwind v4** de un sistema de RR.HH. que consume
una API **.NET** (`rhapi:8080`, proxy Nginx en `/api`). Ver `README.md` y
`docs/ESTRUCTURA-Y-MEJORAS.md` para detalle.

## 2. Puesta en marcha en una laptop nueva

```bash
npm install            # node_modules NO está versionado
cp .env.example .env   # ajustar VITE_API_URL si hace falta
npm run dev            # http://localhost:5173
npm run build          # validar compilación
```

- **Node 20+**. La API se levanta aparte con el `docker-compose` del README.
- `.env` está en `.gitignore`; usar `.env.example` como plantilla.

## 3. Sistema de diseño (Fluent 2) — REGLA CLAVE

Todo el sistema usa **tokens semánticos** definidos en `src/index.css` (`@theme`).
**Siempre usar tokens, nunca colores hardcodeados**, para que la marca y el modo
oscuro se propaguen solos.

- **Marca:** azul `#0F6CBD` → `bg-brand`, `text-brand`, `hover:bg-brand-hover`, rampa `brand-50..900`, tinte `brand-tint`.
- **Acento:** violeta `#7C3AED` → `accent` (+`accent-strong`, `accent-tint`). Se usa en degradados **azul→morado** (`bg-linear-to-r from-brand to-accent`) en sidebar, banners, navbar, footer y franja superior de modales.
- **Neutrales:** `canvas` (fondo página), `surface`/`surface-alt` (tarjetas), `stroke`/`stroke-soft` (bordes), `ink`/`ink-secondary`/`ink-muted` (texto).
- **Nav oscura:** token `nav` (se mantiene oscuro en ambos temas). El shell usa `bg-nav` (+ degradado a `violet-950`).
- **Radios:** 4px controles / 8px tarjetas. **Tipografía:** Segoe UI.
- **Modo claro/oscuro:** clase `.dark` en `<html>`; el bloque `.dark { … }` en `index.css` redefine los tokens neutros. Toggle: `src/Components/ThemeToggle.jsx` (persiste en `localStorage`; script anti-flash en `index.html`).
- Hay un agente reutilizable con todas estas reglas en `.claude/agents/ui-design.md`.
- Showcase de UI en la ruta `/ui`.

## 4. Trabajo ya realizado en esta línea de trabajo

- **Fundación Fluent**: tokens, primitivos reescritos (botones/inputs/Card/Badge/…), inputs vacíos implementados (`SelectInput`, `CheckBoxInput`, `RadioInput`), helper `atoms/fieldClasses.js`.
- **Barrido completo**: ~70 archivos migrados de colores hardcodeados a tokens; acentos no-marca unificados a `brand`.
- **Shell** (NavBar, ManagerSideBar, layouts, Header) unificado.
- **Modo claro/oscuro** en todo el sistema (tokens + toggle).
- **Acento violeta** (degradados azul→morado) en sidebar, navbar, layout de empleado, banners, modales; línea de acento violeta bajo la cabecera de **todas** las tablas (regla global `thead th` en `index.css`).
- **Drawers**: `OffCanvas`/`OffCanvasLarge` pasados a superficie clara Fluent y todos los formularios que se abren dentro convertidos de tema oscuro a claro (antes el texto quedaba invisible).
- **Tablas unificadas** al estándar: `thead` = `bg-surface-alt text-ink-secondary`, cuerpo `divide-stroke-soft`, filas `hover:bg-canvas`.
- **Buscador global** en el top bar de admin (`src/Components/organisms/TopbarSearch.jsx`): busca empleados y planillas, navega al detalle.
- **Páginas modernizadas**: `ActionsPage`, `EmployeesPage`, `MyProfilePage`/`EmployeeTableInfo`, dashboard `ManagerPage`.
- **Bug corregido**: `MyComissionsPage` no cargaba por contrato inconsistente de `comissionsApi.getComissionsByUser` (ahora siempre devuelve array).
- **Docs**: `README.md` reescrito + `docs/ESTRUCTURA-Y-MEJORAS.md`.
- **Sitio público (marketing)**: nuevo `PublicLayout` (navbar + footer) con las rutas
  `/`, `/caracteristicas`, `/como-funciona`, `/precios` y `/contacto`. Todo el copy,
  los módulos, los planes y las FAQ viven en `src/data/marketing.js` (un solo lugar
  para editarlos). Componentes en `Components/molecules/marketing/` y
  `Components/organisms/marketing/`. Sustituye a la antigua `pages/HomePage.jsx`.
  ⚠️ Los **precios son de referencia** y el formulario de contacto **no está
  conectado a la API** (falta endpoint de prospectos; ver `ContactForm.jsx`).

## 4.b Flujos de aprobación y organigrama (agosto 2026)

Se trabajó **en los dos repos**. En `Human-Resources-API` hay tres migraciones EF
nuevas: `PayrollLifecycle`, `ActionApprovalAndOrgChart` y `AbsenceAndLoanApproval`.

- **Planilla**: `Payroll` ganó `Status/CreatedBy/CreatedAt/ApprovedBy/ApprovedAt/PaidBy/PaidAt/VoidReason`.
  Ciclo **Borrador → Aprobada → Pagada** (+ Anulada con motivo), con endpoints
  `/api/Payrolls/{id}/approve|pay|reopen|void`. Aprobada = congelada: el
  `Employee_PayrollController` rechaza cambios en sus detalles con 409.
  El listado devuelve `status`, `employeeCount` y totales ya calculados.
  En el front, `usePayrollData` ahora **carga las filas guardadas**, permite
  **agregar y quitar empleados** y guarda por diferencias (crea / actualiza /
  borra) en vez de hacer siempre POST.
- **Acciones**: `Status` + `RejectedBy/RejectedAt/RejectionReason`;
  `ApprovedDate` dejó de tener setter privado. Endpoints `approve|reject|reopen`.
- **Ausencias**: mismos campos y endpoints que acciones.
- **Préstamos**: se usa `State` como estado (Pendiente → Aprobado → Pagado /
  Rechazado) + endpoints `approve|reject|settle|reopen`. El listado calcula
  `paidAmount`, `balance` y `monthlyFee`; `settle` exige que los abonos cubran el monto.
- **Organigrama**: `Departament` ganó `ParentDepartamentId` y `DisplayOrder`;
  endpoint `GET /api/Departaments/orgchart`. En el front, página
  `/manager/organigrama` con **React Flow** (`@xyflow/react`), layout tipo árbol
  calculado en `OrgChart.jsx` (tolera ciclos y padres inexistentes) y edición de
  dependencia y jefaturas.
- **Ayuda en pantalla**: contenido en `src/data/help.js`, panel `HelpDrawer` y
  botón `HelpButton` (`<HelpButton area="planilla" />`). El sidebar se reorganizó
  por áreas (Resumen / Personal / Compensación / Desempeño / Mi cuenta /
  Configuración) e incluye el Centro de ayuda.
- **Semilla determinista**: los roles de `AppDbContext` llevaban `ConcurrencyStamp`
  aleatorio, lo que hacía que EF viera siempre "pending model changes" y
  `Database.Migrate()` fallara al aplicar cualquier migración nueva. Ya está fijo.

## 4.c Saneamiento del esquema (agosto 2026)

Migración `SchemaIntegrityFixes` en `Human-Resources-API`. Se corrigió lo siguiente:

- **Columnas de usuario duplicadas.** `Certification`, `Reminder` y `User_Objetive`
  tenían `UserId` (la que usa el código, *sin* FK) y `AppUserId` (FK en sombra que
  nadie escribía). La causa: la navegación se llamaba `AppUser` y EF no la
  emparejaba con `UserId`. Se renombró a `User`, se borró `AppUserId` y ahora
  `UserId` sí tiene integridad referencial.
  ⚠️ Al agregar una navegación a `AppUser`, **nómbrala `User`** o pon
  `[ForeignKey(nameof(UserId))]`, o se repetirá el problema.
- **Relación fantasma** `User_Objetive.QuestionId → Question`, creada por una
  colección `User_Objetive` sobrante en `Question`. Eliminada.
- **`chief_By_Departament` sin FKs.** Ahora tiene FK a `Departament` (cascada) y a
  `AspNetUsers`, más índice único `(DepartamentId, UserId)`.
- **Índices únicos** (el esquema no tenía ninguno): `Employee_Payroll(PayrollId,UserId)`,
  `chief_By_Departament(DepartamentId,UserId)`, `User_Question(UserId,QuestionId)`,
  `User_Objetive(UserId,ObjetiveId)`, y los nombres de `Departament`, `ActionType`
  y `ExtraType`. Van **filtrados**: SQL Server trata los NULL como iguales en un
  índice único, y donde hay borrado lógico la regla solo aplica a lo vigente.
- **Errores de restricción legibles.** `Middleware/DbConstraintExceptionMiddleware.cs`
  traduce las SqlException 2601/2627 (único) y 547 (FK) a **409 con un mensaje en
  español** listo para mostrar. Antes salía un 500 con el volcado. En el front,
  `src/utils/apiError.js` (`mensajeDeError`) recupera ese texto.

### Migración `MoneyDecimalAndNullableDates`

- **Dinero de `float` a `decimal(18,2)`.** Ya no queda ninguna columna `float`
  en el esquema de negocio (52 en `decimal(18,2)`). `Employee_Payroll` pasó
  entero a `decimal` —incluidas horas y días— para no tener que castear al
  multiplicar cantidad por tarifa. La precisión se fija por convención en
  `OnModelCreating`, así que **una propiedad `decimal` nueva ya nace en 18,2**;
  las que declaran su propio `[Column(TypeName=…)]` (como `Result.Evalution`,
  que sigue en 5,2) se respetan.
  Al ser exacto, se quitaron las tolerancias de `0.01` que compensaban el float
  en `PaymentsController` y `LoansController`.
- **14 fechas opcionales ahora nulables** (`ApprovedAt`, `UpdatedAt`, `EditedAt`,
  `AppUser.BirthDate/HiredDate/LastEditedDate`…). La migración además **convierte
  a NULL** los `0001-01-01` que ya estaban guardados. El front dejó de enviar ese
  centinela (`MyProfileEdit`); los formateadores que lo filtran al leer se dejaron
  por si quedara dato viejo.

### Migración `DeleteRulesAndOptionalFields`

- **Reglas de borrado con un solo criterio.** Antes estaban repartidas sin
  patrón, con una cadena rota: borrar una `QuestionCategory` cascadeaba hasta
  `User_Question` pero `Answer` no, y la operación fallaba a medio camino.
  Ahora:
  - **Composición → cascada**: `Payment→Loan`, `Answer→User_Question`,
    `Result→User_Objetive`, `Employee_Payroll→Payroll`, `chief_By_Departament→Departament`.
  - **Catálogo → restringir**: `Extra→ExtraType`, `Question→QuestionCategory`,
    `User_Question→Question`, `Action→ActionType`, `Objetive→ObjetiveCategory`,
    `User_Objetive→Objetive`, y el padre de `Departament`.
  - Las referencias a `AspNetUsers` siguen sin acción: a las personas se las
    desactiva, no se las borra.
  Gracias a la cascada, `DeleteLoan` dejó de borrar los abonos a mano.
- **Campos que ya no son obligatorios**: `Absence.Title`, `Absence.CreatedBy` y
  `Employee_Payroll.WorkShift` eran `NOT NULL` y hacían fallar el POST con 400 si
  faltaban. Ahora son nulables, como sus equivalentes en el resto de entidades.
- **`Files`**: sigue asociando por `(TableName, ReferenceId)` en texto —no admite
  FK— pero ese par ya está indexado, que es como se consulta siempre.
- **Columnas derivadas de `Employee_Payroll`** (quincenal, diario, por hora,
  tarifas de extra y feriado): **se conservan a propósito**. Son la foto de las
  tarifas con las que se calculó el periodo; si el salario cambia después, la
  planilla emitida no debe recalcularse sola. Es válido porque la fila es
  inmutable una vez aprobada. Está documentado en el propio modelo.

⚠️ **Los índices únicos son filtrados**, y SQL Server exige `SET QUOTED_IDENTIFIER ON`
para insertar o actualizar en esas tablas. EF lo hace solo; si corres un script
con `sqlcmd`, ponlo al inicio o el INSERT falla con el error 1934.

### Migración `NamingCleanup`

- **Banderas unificadas**: ya no existen `IsDeleted`, `IsActived`, `IsAproved` ni
  `Draft`. Ahora es siempre `Deleted`, `IsActive`, `IsApproved` e `IsDraft`.
- **`AppUser.State` eliminada**: se escribía una sola vez al crear el empleado y
  no la leía nadie. El estado queda en `IsActive` + `Deleted`.
- **Ortografía**: tabla `Absense` → `Absence`, `AppUser.Jorney` → `Journey`,
  `Result.Evalution` → `Evaluation`, `Employee_Payroll.AbsenseRate/AbsenseTime`
  → `AbsenceRate/AbsenceTime`. También el DTO `CreateEmployeeDto.Jorney`.
  En el front se renombraron los mismos campos JSON en 15 archivos.

⚠️ **Al generar esta migración, EF emparejó columnas por posición y produjo dos
mapeos peligrosos que hubo que corregir a mano**: cruzaba las banderas de `Extra`
(`IsDeleted → IsApproved` y `IsAproved → Deleted`, intercambiando los valores) y
proponía borrar `Jorney` renombrando la columna muerta `State` como `Journey`,
perdiendo la jornada. Si vuelves a renombrar varias columnas de una misma tabla
en un solo paso, **revisa el `RenameColumn` generado antes de aplicarlo**.

**Renames deliberadamente NO hechos**: `Departament` → `Department`,
`Comission` → `Commission` y `Objetive` → `Objective`. Cada uno toca entre 30 y
40 archivos entre los dos repos y cambia las rutas públicas de la API
(`/api/Departaments`, `/api/Comissions`). El beneficio es ortográfico y el riesgo
alto; conviene hacerlos en un cambio dedicado y con la app parada.

**Tampoco se añadió borrado lógico** a las tablas que no lo tienen (`Action`,
`Award`, `ContactEmergency`, `Salary`, `Employee_Payroll`): agregar la columna sin
filtrar en todas las consultas sería peor que no tenerla.

**Pendiente del saneamiento**: las 99 columnas `nvarchar(max)` sin longitud
declarada, y los tres renames profundos listados arriba.

## 5. Pendiente / a verificar

- ⚠️ **Build sin re-verificar tras los últimos cambios** (dark mode, `@custom-variant`,
  regla global de tablas, degradados). Ejecutar `npm run build` al retomar.
- **Lint roto de base**: `npm run lint` arroja ~93 errores **preexistentes**
  (falta `eslint-plugin-react`; variables sin usar; `set-state-in-effect`). No todos
  son del trabajo de UI.

## 6. Bugs conocidos a corregir (detalle en docs/ESTRUCTURA-Y-MEJORAS.md §4.1)

- Contratos de `src/api/*.js` inconsistentes (a veces `response`, a veces `.data`). Auditar todos.
- Clave duplicada `userId` en `ActionAdd.jsx`.
- `number.parse` inexistente en `PayrollPage.jsx` (importa `number` de framer-motion) → buscador roto.
- Casing `p.Status` vs camelCase de la API.
- Aprobación de planilla sin implementar; pestaña “Comprobantes de Pago” vacía.
- Componentes stub: `ComissionView`, `AddExtra`, `ExtrasTable`, `DesactivateUser`.
- `MainLayout` (rutas de empleado) no protege autenticación; solo `ManagerLayout` lo hace.
