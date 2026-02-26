# 🎮 Rankup

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-RTL-E33332?logo=testinglibrary&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.27-009639?logo=nginx&logoColor=white)

![Preview](public/videos/Preview.gif)

Frontend de Rankup para visualizar el feed de videos con UI arcade retro 80s.
Librerias clave: `react`, `react-dom`, `react-howler`, `@testing-library/react`, `jest`.

## 🚀 Objetivo

Renderizar un feed de videos rankeados con:

- Home arcade con grilla asimetrica.
- Modal de detalle con logica de ranking consumiendola del backend.
- i18n dinamico (ES/EN).
- Feedback sonoro opcional con `react-howler`.
- Fallback local de datos cuando la API no responde.

## 📍 Requisitos

- Node.js 20+ (recomendado 22)
- npm 10+

## ✅ Scripts

```bash
npm run dev            # desarrollo
npm run build          # build produccion
npm run preview        # preview del build
npm run lint           # calidad estatica
npm run test           # pruebas
npm run test:coverage  # cobertura
```

## 🌳 Variables de entorno

Archivo de referencia: `.env.example`

Variables relevantes (No Necesarias para el funcionamiento del proyecto):

- `VITE_RANKUP_API_URL`: URL base del backend. Si no se define, se usa ruta relativa.
- `RANKUP_PORT`: puerto expuesto por docker-compose (default `8080`).

Ejemplo:

```bash
VITE_RANKUP_API_URL=http://localhost:3000
RANKUP_PORT=8080
```

## 💉 Integracion con backend

- backend (NestJS): https://github.com/Asimpl3-Hero/rankup-api

Endpoint consumido por frontend:

- `GET /api/videos`

Flujo:

1. Se intenta cargar videos desde API.
2. Si falla la peticion, se usa dataset local fallback (`CARTRIDGES`).
3. La UI sigue operativa y marca estado offline.

## 🏗️ Estructura del modulo rankup

```text
src/features/rankup
|- components/      # componentes principales, ui, ux
|- hooks/           # estado y logica de interaccion
|- services/        # consumo API
|- constants/       # constantes de dominio/UI
|- i18n/            # diccionarios y helpers de idioma
|- styles/          # tokens, base, layout, components, utilities
|- utils/           # utilidades de ranking/formateo
|- config/          # configuracion del modulo
`- types/           # typedefs JSDoc
```

## 🐳 Levantar contenedor

> Backend en Docker: `http://localhost:3000`
>
> Frontend en Docker: `http://localhost:8080`

```bash
docker compose build
docker compose up -d
docker compose ps
```

Detener contenedor:

```bash
docker compose down
```

## Notas

- El proyecto esta orientado a una SPA.
- El estilo visual prioriza coherencia arcade retro en toda la experiencia.
