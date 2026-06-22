# CLAUDE.md

Guía para Claude Code en este repositorio. Se carga automáticamente en cada sesión
(y viaja con git, así que se recupera en cualquier laptop).

## Proyecto

Frontend **React 19 + Vite 7 + Tailwind v4** de un sistema de Recursos Humanos que
consume una API **.NET** (proxy Nginx en `/api` → `rhapi:8080`).

## Comandos

```bash
npm install        # instalar dependencias (node_modules no está versionado)
npm run dev        # desarrollo, http://localhost:5173
npm run build      # build de producción (usar para verificar compilación)
npm run lint       # ESLint (OJO: tiene errores preexistentes, ver contexto)
npm run format     # Prettier
```

Configura `VITE_API_URL` en `.env` (copia de `.env.example`).

## Reglas de diseño (IMPORTANTES)

Sistema **Fluent 2** con tokens en `src/index.css`. **Usa siempre los tokens, nunca
colores hardcodeados**, para que la marca y el modo claro/oscuro se propaguen solos:

- Marca azul `bg-brand`/`text-brand`; acento violeta `accent` (degradados `from-brand to-accent`).
- Neutrales: `canvas`, `surface`, `surface-alt`, `stroke`, `stroke-soft`, `ink`, `ink-secondary`, `ink-muted`.
- Nav oscura: `bg-nav`. Modo oscuro: clase `.dark` en `<html>` (toggle en `ThemeToggle.jsx`).
- Atomic Design: `atoms → molecules → organisms → templates → pages`.
- Para alinear UI nueva, usa el agente `.claude/agents/ui-design.md`.

## Contexto detallado

@.claude/PROJECT-CONTEXT.md

@docs/ESTRUCTURA-Y-MEJORAS.md
