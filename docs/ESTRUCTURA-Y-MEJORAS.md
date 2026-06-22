# 📐 Estructura del Proyecto y Hoja de Ruta de Mejoras

Documento de referencia técnica del frontend (**React 19 + Vite 7 + Tailwind v4**). Describe la arquitectura actual y propone mejoras priorizadas para hacer el sistema más completo, robusto y mantenible.

> Última revisión: junio 2026.

---

## 1. Arquitectura general

```
┌──────────────┐     HTTP/JSON (JWT)     ┌──────────────┐     SQL      ┌──────────────┐
│  React SPA   │ ───────────────────────▶│  API .NET    │ ────────────▶│ SQL Server   │
│ (Vite/Nginx) │  /api  (proxy Nginx)    │  (rhapi:8080)│              │   2022       │
└──────────────┘                         └──────────────┘              └──────────────┘
```

- **Patrón de UI:** Atomic Design (`atoms → molecules → organisms → templates → pages`).
- **Estado:** `AppContext` (auth/roles/usuario) + estado local por página. Los datos del servidor se piden con `useEffect` + hooks propios.
- **Routing:** `react-router-dom` v7 con tres grupos: público, layout de empleado (`MainLayout`) y layout de administrador (`ManagerLayout`, protegido por rol `Admin`).
- **Capa de datos:** un cliente Axios singleton ([`apiClient.js`](../src/api/apiClient.js)) con interceptores (adjunta el JWT y captura 401) y un archivo `*Api.js` por módulo.
- **Diseño:** sistema Fluent 2 con tokens en [`index.css`](../src/index.css), modo claro/oscuro por clase `.dark` y acento violeta para degradados.

---

## 2. Estructura de carpetas

```
Human-Resources-Web-App/
├── .claude/agents/ui-design.md      # Agente Claude Code con el sistema de diseño
├── docs/                            # 📚 Esta documentación
├── public/
├── Dockerfile                       # Build multi-etapa (Node 20 → Nginx)
├── nginx.conf                       # SPA + proxy /api → rhapi:8080
├── vite.config.js
├── eslint.config.js
├── .env / .env.example              # VITE_API_URL
├── index.html                       # Incluye script anti-flash de tema
└── src/
    ├── api/                 # 31 clientes Axios (uno por entidad)
    │   ├── apiClient.js     # Singleton con interceptores JWT
    │   ├── employeesApi.js, payrollApi.js, actionApi.js, absencesApi.js,
    │   ├── loansApi.js, comissionsApi.js, salaryApi.js, vacationsApi.js,
    │   ├── kpiApi.js, certificationApi.js, courseApi.js, roles.js, …
    │
    ├── Components/
    │   ├── atoms/           # Input, fieldClasses.js, ObjetivesCard, PayrollRow, QuestionsCard
    │   ├── molecules/       # InputField, SearchEmployee, SideBarItem, tablePayrollHeader
    │   ├── organisms/       # ~85 componentes: tablas, formularios Add/Edit/View,
    │   │                    #   TopbarSearch, EmployeeTableInfo, PayrollGenerate, …
    │   ├── templates/       # DashboardTemplate, ObjetiveLayout, QuestionsLayout
    │   └── *.jsx            # Primitivos: PrimaryButton, SecondaryButton, IconButton,
    │                        #   TextInput, SelectInput, CheckBoxInput, RadioInput,
    │                        #   DateInput, TimeInput, Card, Badge, Label, ErrorText,
    │                        #   Divider, PageTitle, SectionTitle, OffCanvas(+Large),
    │                        #   ThemeToggle, KPISChart, CardActions, …
    │
    ├── context/             # AppContext.jsx (login/logout, roles desde JWT)
    ├── hooks/               # useAbsences, useEmployeeView, useLatestSalaryMap,
    │                        #   useManagerDashboard, useOffCanvas,
    │                        #   usePayrollCalculations, usePayrollData
    ├── layouts/             # MainLayout, ManagerLayout, NavBar, ManagerSideBar
    ├── pages/               # 25 páginas (ver mapa de rutas abajo)
    ├── router/              # AppRouter.jsx
    ├── utils/               # formatMoney.js
    ├── App.jsx, main.jsx
    └── index.css            # Tokens Fluent + dark mode + scrollbar + acento de tablas
```

---

## 3. Mapa de rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | HomePage (landing) | Público |
| `/login`, `/register` | Login / Registro | Público |
| `/ui` | UILibraryPage (showcase de UI) | Público |
| `/my-profile` | Mi perfil | Empleado (`MainLayout`) |
| `/my-kpis` | Mis KPIs | Empleado |
| `/my-comissions` | Mis comisiones | Empleado |
| `/my-payrolls` | Mis comprobantes | Empleado |
| `/my-loans` | Mis préstamos | Empleado |
| `/manager` | Dashboard | Admin (`ManagerLayout`) |
| `/manager/employees` `/manager/employees/:id` | Empleados / ficha | Admin |
| `/manager/payroll` `/manager/payroll/:id` | Planillas / detalle | Admin |
| `/payroll/new/:id` | Edición de planilla | Admin |
| `/manager/actions` | Acciones de personal | Admin |
| `/manager/absences` | Ausencias | Admin |
| `/manager/loans` `/manager/loan/:id` | Préstamos | Admin |
| `/manager/kpis` `/manager/questions` | KPIs / Preguntas | Admin |
| `/manager/perfornance/:id` ⚠️ | Desempeño (typo en la ruta) | Admin |
| `/manager/roles` | Roles | Admin |
| `/settings` | Configuración | Admin |
| `*` | NotFoundPage | — |

---

## 4. Hoja de ruta de mejoras (priorizada)

Leyenda de prioridad: 🔴 alta · 🟡 media · 🟢 baja.

### 4.1 Corrección de bugs e inconsistencias (🔴)

Detectados directamente en el código:

- **Contratos de API inconsistentes.** Varios métodos devuelven a veces el `response` completo de Axios y a veces solo `.data` (p. ej. la corrección reciente en `comissionsApi.getComissionsByUser`, que devolvía `response` en éxito y `[]` en error, rompía la página). **Acción:** definir una convención única (siempre `.data`) y auditar **todos** los `src/api/*.js`.
- **Clave duplicada `userId`** en [`ActionAdd.jsx`](../src/Components/organisms/ActionAdd.jsx) (el objeto `payload` define `userId` dos veces; el segundo sobrescribe con un `string` en vez de `Number`).
- **`number.parse` inexistente** en [`PayrollPage.jsx`](../src/pages/PayrollPage.jsx): se importa `number` desde `framer-motion` (no existe) y se usa en el buscador → el filtro por código falla.
- **Casing de campos.** La tabla de planillas lee `p.Status` (PascalCase) cuando la API usa camelCase → la columna sale vacía. Uniformar nombres de campos.
- **Componentes incompletos / stub.** `ComissionView`, `AddExtra`, `ExtrasTable`, `DesactivateUser` devuelven fragmentos vacíos. Completar o eliminar.
- **Funcionalidad a medias.** La **aprobación de planillas** no está implementada (el icono de aprobar no estaba conectado a ningún endpoint). La pestaña **“Comprobantes de Pago”** del perfil está vacía.
- **Typos** en rutas/props/archivos: `/manager/perfornance/:id`, `OnClose` vs `onClose`, campo `jorney`, archivo `CouseEdit.jsx`.

### 4.2 Calidad de código y tooling (🔴/🟡)

- **`npm run lint` falla (~93 errores).** Limpiar variables sin usar y `react-hooks/set-state-in-effect` (p. ej. en `PayrollPage`, `MyPayrollsPage`).
- **Falta `eslint-plugin-react` y `eslint-plugin-jsx-a11y`.** Sin el primero, el JSX no se valida y aparecen falsos positivos de “`motion` sin usar”. Añadirlos a [`eslint.config.js`](../src/../eslint.config.js).
- **Pre-commit hooks:** `husky` + `lint-staged` + `commitlint` para garantizar lint/format antes de commitear.
- **TypeScript (🟡):** migrar a TS para tipar modelos (Employee, Payroll, Action…) y las respuestas de la API; elimina toda una clase de bugs como los de casing/contratos.

### 4.3 Arquitectura y datos (🟡)

- **TanStack Query (React Query):** reemplazar los `useEffect` + `useState` manuales por queries con caché, estados de carga/error, reintentos e invalidación. Elimina refetches manuales (p. ej. `EmployeesPage` refetcha en cada cierre de drawer).
- **Componente `<DataTable>` reutilizable:** hay ~25 tablas que repiten cabecera/cuerpo/estados vacíos. Centralizar en un solo componente con columnas declarativas, orden y paginación.
- **Capa de servicios tipada** y manejo de errores centralizado (toasts + logging) en `apiClient`.
- **Configuración por entorno** (`.env.development`, `.env.production`) y validación de variables al arrancar.

### 4.4 Rendimiento (🟡)

- **Code-splitting:** el bundle es ~2.3 MB (gzip ~660 KB) en **un solo chunk**. Aplicar `React.lazy` + `Suspense` por ruta y `build.rollupOptions.output.manualChunks` para separar `recharts`, `gridstack` y `framer-motion`.
- **Búsqueda server-side:** el buscador global y varias páginas traen *todos* los registros y filtran en cliente. Migrar a endpoints de búsqueda con paginación y `debounce`.
- **Virtualización** de tablas largas (`@tanstack/react-virtual`).

### 4.5 Seguridad (🔴)

- **JWT en `localStorage`** es vulnerable a XSS. Evaluar **cookies httpOnly** o, como mínimo, endurecer CSP y sanitización.
- **Sin refresh token ni manejo de expiración:** el interceptor de 401 está vacío. Implementar **logout automático** y, si la API lo soporta, *refresh*.
- **Guard de rutas incompleto:** `ManagerLayout` valida auth+rol, pero `MainLayout` (rutas de empleado) **no verifica autenticación**. Crear un `<ProtectedRoute>` reutilizable.
- **Roles hardcodeados** (`'Admin'`): centralizar permisos.

### 4.6 UX y accesibilidad (🟡/🟢)

- **Validación de formularios** con `react-hook-form` + `zod` (hoy es manual y dispersa).
- **Accesibilidad:** asociar `label htmlFor`/`id`, *focus trap* y restauración de foco en `OffCanvas`, roles ARIA, contraste verificado en modo oscuro.
- **Estados vacíos/carga/error consistentes** (ya se añadieron en varias páginas; extender al resto) y *skeletons*.
- **i18n** (`react-i18next`): los textos están hardcodeados en español.
- **Confirmaciones** para acciones destructivas (eliminar) con un diálogo reutilizable.

### 4.7 Testing (🔴)

- **No hay pruebas.** Añadir:
  - **Unitarias/componentes:** Vitest + React Testing Library.
  - **E2E:** Playwright o Cypress (flujos de login, alta de empleado, generación de planilla).
- Cobertura mínima en la lógica crítica (cálculos de nómina en `usePayrollData`/`usePayrollCalculations`).

### 4.8 DevOps / CI (🟡)

- **Incluir `docker-compose.yml`** en el repo (hoy solo vive en el README).
- **CI con GitHub Actions:** `lint` + `test` + `build` en cada PR; publicar imagen.
- **Healthchecks** en los servicios de Docker y `depends_on: condition: service_healthy`.
- **Dependabot/renovate** para dependencias.

### 4.9 Funcionalidad para “sistema más completo” (🟢)

- **Aprobación de planillas** con estados (`Pendiente`/`Aprobada`) y auditoría.
- **Reportes y exportación** (PDF/Excel) más allá del recibo actual con `html2pdf`.
- **Notificaciones** (vencimientos de certificaciones, vacaciones pendientes de aprobar).
- **Panel de auditoría** (quién creó/editó qué y cuándo — ya hay campos `createdBy`/`lastEditedDate`).
- **Carga de documentos** del empleado y galería de archivos.
- **Dashboard del empleado** (hoy el dashboard rico es solo para admin).

---

## 5. Resumen de prioridades

| # | Mejora | Prioridad | Esfuerzo |
|---|--------|-----------|----------|
| 1 | Auditar y uniformar contratos de la capa `api/` | 🔴 | Medio |
| 2 | Corregir bugs detectados (userId, `number.parse`, casing) | 🔴 | Bajo |
| 3 | Arreglar lint + añadir `eslint-plugin-react`/a11y | 🔴 | Bajo |
| 4 | `<ProtectedRoute>` + endurecer auth/JWT | 🔴 | Medio |
| 5 | Tests (Vitest + RTL, E2E) | 🔴 | Alto |
| 6 | TanStack Query + `<DataTable>` reutilizable | 🟡 | Alto |
| 7 | Code-splitting / manualChunks | 🟡 | Bajo |
| 8 | Migración a TypeScript | 🟡 | Alto |
| 9 | Validación de formularios (RHF + zod) | 🟡 | Medio |
| 10 | CI/CD + `docker-compose.yml` en repo | 🟡 | Bajo |
| 11 | i18n, a11y, notificaciones, reportes | 🟢 | Variable |

---

> Mantén este documento actualizado conforme avance el proyecto. Para cambios de UI, apóyate en el sistema de diseño descrito en el `README` y en el agente [`.claude/agents/ui-design.md`](../.claude/agents/ui-design.md).
