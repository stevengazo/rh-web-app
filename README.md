# 🧑‍💼 Sistema de Recursos Humanos — Web App

Aplicación web para la **gestión integral de Recursos Humanos**: empleados, planillas, acciones de personal, ausencias, vacaciones, préstamos, comisiones, KPIs, cursos y certificaciones.

Frontend en **React + Vite** conectado a una **API .NET** con **SQL Server**, orquestado con **Docker Compose**. La interfaz sigue un sistema de diseño propio basado en **Fluent 2 (Microsoft)** con soporte de **modo claro/oscuro** y acento azul→violeta.

---

## 🚀 Stack Tecnológico

### Frontend

| Área | Tecnología |
|------|-----------|
| Librería UI | **React 19** |
| Bundler / Dev server | **Vite 7** |
| Estilos | **Tailwind CSS v4** (`@theme` tokens) |
| Diseño | Sistema **Fluent 2** + modo claro/oscuro |
| Routing | **React Router 7** |
| HTTP | **Axios** (cliente con interceptores JWT) |
| Animación | **Framer Motion** |
| Gráficos | **Recharts** |
| Dashboard | **GridStack** (paneles arrastrables) |
| Iconos | **lucide-react** |
| Fechas | **date-fns** / **dayjs** |
| Notificaciones | **react-hot-toast** |
| PDF | **html2pdf.js** |

### Backend / Infraestructura

- 🔷 **.NET Web API** (imagen `stevengazo/rh-api`)
- 🔐 Autenticación **JWT**
- 🗄️ **SQL Server 2022**
- 🐳 **Docker** + **Nginx** (sirve la SPA y hace de proxy a `/api`)

---

## 📂 Módulos del Sistema

- 👤 **Empleados** — alta, edición, ficha de perfil, foto, departamentos.
- 💰 **Nómina / Planillas** — generación por período, cálculo de salario bruto/neto, deducciones (CCSS 10.67%, asociación 3%), horas extra y feriados, detalle por empleado.
- 📄 **Acciones de Personal** — registro y **aprobación** de acciones (sanciones, movimientos, etc.).
- 🏖️ **Vacaciones** — solicitud y seguimiento.
- 🕒 **Ausencias** — registro, calendario y tabla.
- 💵 **Préstamos** — alta, pagos y estado.
- 📈 **KPIs / Desempeño** — objetivos, preguntas, resultados y evaluación.
- 🤝 **Comisiones** — comisiones por empleado y resumen mensual.
- 🎓 **Cursos y Certificaciones** — historial académico del empleado.
- 🛡️ **Roles** — asignación de roles a usuarios.

> 📘 La estructura detallada del código y una hoja de ruta de mejoras están en **[`docs/ESTRUCTURA-Y-MEJORAS.md`](docs/ESTRUCTURA-Y-MEJORAS.md)**.

---

## 🎨 Sistema de Diseño (Fluent 2)

Los tokens viven en [`src/index.css`](src/index.css) como variables de Tailwind v4 (`@theme`):

- **Marca:** Communication Blue `#0F6CBD` (rampa `brand-50..900`).
- **Acento:** Violeta `#7C3AED` (`accent`) — usado en degradados azul→morado (sidebar, banners, modales).
- **Neutrales semánticos:** `canvas`, `surface`, `surface-alt`, `stroke`, `stroke-soft`, `ink`, `ink-secondary`, `ink-muted`.
- **Radios:** 4 px (controles) / 8 px (tarjetas). **Sombras:** elevación Fluent. **Tipografía:** Segoe UI.
- **Modo claro/oscuro:** clase `.dark` en `<html>` que redefine los tokens neutros; el toggle ([`ThemeToggle`](src/Components/ThemeToggle.jsx)) persiste la preferencia en `localStorage` y respeta `prefers-color-scheme`.

Los primitivos compartidos están en `src/Components/` (`PrimaryButton`, `SecondaryButton`, `IconButton`, `TextInput`, `Card`, `Badge`, etc.). Existe además una página viva de la librería de UI en la ruta **`/ui`**.

> 🤖 El repositorio incluye un agente de Claude Code ([`.claude/agents/ui-design.md`](.claude/agents/ui-design.md)) que codifica este sistema de diseño para alinear nuevos componentes de forma consistente.

---

## 🗂️ Estructura del Proyecto (resumen)

```
src/
├── api/            # Clientes Axios por módulo (employeesApi, payrollApi, …)
├── Components/
│   ├── atoms/      # Piezas mínimas (Input, fieldClasses, …)
│   ├── molecules/  # Combinaciones (SearchEmployee, SideBarItem, …)
│   ├── organisms/  # Tablas, formularios Add/Edit/View, TopbarSearch, …
│   ├── templates/  # Layouts de sección
│   └── *.jsx       # Primitivos de UI (botones, inputs, Card, OffCanvas, …)
├── context/        # AppContext (auth, roles, usuario)
├── hooks/          # Hooks de datos (usePayrollData, useManagerDashboard, …)
├── layouts/        # MainLayout (empleado), ManagerLayout (admin), NavBar, ManagerSideBar
├── pages/          # Páginas por ruta
├── router/         # AppRouter (rutas públicas / empleado / admin)
├── utils/          # Utilidades (formatMoney)
├── App.jsx
├── main.jsx
└── index.css       # Tokens Fluent + dark mode + utilidades
```

---

## ⚙️ Configuración (variables de entorno)

El frontend lee una única variable, consumida por [`src/api/apiClient.js`](src/api/apiClient.js):

```bash
# .env  (copia desde .env.example)
VITE_API_URL=http://localhost:5000/api
```

- En **producción** (servido por Nginx) se deja vacío o como `/api`; el proxy de [`nginx.conf`](nginx.conf) redirige `/api/` al contenedor `rhapi:8080`.
- En **desarrollo local** apunta al puerto publicado de la API (p. ej. `http://localhost:5000/api`).

---

## ▶️ Ejecutar en Desarrollo (solo frontend)

Requisitos: **Node.js 20+** y npm.

```bash
npm install
npm run dev
```

Disponible en **http://localhost:5173**.

### Scripts disponibles

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor de desarrollo (Vite, HMR) |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Linter (ESLint) |
| `npm run format` | Formatea con Prettier |

---

## 🐳 Despliegue con Docker Compose

El stack completo levanta **SQL Server**, **API .NET** y **Web App**.

```yaml
version: "3.9"

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: sql_server_test
    restart: always
    ports:
      - "1433:1433"
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "Your_password123"
    volumes:
      - sql_data1:/var/opt/mssql

  rhapi:
    image: stevengazo/rh-api:latest
    container_name: api_rh_test
    restart: always
    depends_on:
      - sqlserver
    ports:
      - "5000:8080"
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ConnectionStrings__DefaultConnection: >
        Server=sqlserver,1433;
        Database=RH;
        User ID=sa;
        Password=Your_password123;
        TrustServerCertificate=True;
      Jwt__Key: TU_LLAVE_SECRETA_LARGA_DE_MINIMO_32_CARACTERES
      Jwt__Issuer: MyApi
      Jwt__Audience: MyApiUsers
      Jwt__ExpiresInHours: 5

  rh-webapp:
    image: stevengazo/rh-web:latest
    container_name: webapp_rh_test
    restart: always
    depends_on:
      - rhapi
    ports:
      - "3000:80"

volumes:
  sql_data1:
```

Levantar todo:

```bash
docker-compose up -d
```

### Accesos

| Servicio | URL |
|----------|-----|
| 🌐 Web App | http://localhost:3000 |
| 🔷 API .NET | http://localhost:5000 |
| 🗄️ SQL Server | localhost:1433 |

> El [`Dockerfile`](Dockerfile) del frontend usa un build multi-etapa (Node 20 → Nginx alpine).

---

## 🔐 Seguridad

- La API usa **JWT**; configura `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience`.
- El token se guarda en `localStorage` y se adjunta automáticamente vía interceptor de Axios.
- ⚠️ **En producción** cambia: la contraseña de `sa`, la llave JWT, y `ASPNETCORE_ENVIRONMENT=Production`.

> Consulta [`docs/ESTRUCTURA-Y-MEJORAS.md`](docs/ESTRUCTURA-Y-MEJORAS.md) → *Seguridad* para mejoras recomendadas (cookies httpOnly, refresh token, guards de ruta).

---

## 🤝 Convenciones

- **Atomic Design**: `atoms → molecules → organisms → templates → pages`.
- **Estilos**: usar siempre los tokens Fluent (`bg-surface`, `text-ink`, `border-stroke`, `bg-brand`, `accent`…) en lugar de colores hardcodeados, para que el modo oscuro y la marca se propaguen solos.
- **Formato**: Prettier (`npm run format`) antes de commitear.

---

## 📈 Roadmap

La hoja de ruta priorizada de mejoras (arquitectura, calidad, seguridad, rendimiento, UX, testing y DevOps) está documentada en **[`docs/ESTRUCTURA-Y-MEJORAS.md`](docs/ESTRUCTURA-Y-MEJORAS.md)**.
