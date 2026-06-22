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
