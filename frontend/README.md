# Frontend

This workspace contains the React user interface for the application workflow tracker.
The UI now talks to the Django API through `/api` requests and uses a service
worker as an offline mock fallback when the backend is unavailable.

## Overview

- Framework: React
- Language: TypeScript
- Build tool: Vite
- Entry point: `src/main.tsx`
- App shell: `src/App.tsx`
- Styling: `src/App.css` and `src/main.css`
- Shared workflow logic: `src/common/`
- Data layer: fetch-driven API client with a service worker mock fallback
- Routes: applications list, create/edit form, and application detail screens

## Run The Frontend

From the repository root:

```bash
npm run start:frontend
```

Or from inside the frontend folder:

```bash
cd frontend
npm run start
```

The app runs on:

```text
http://localhost:5173
```

## Build And Check

From inside `frontend/`, create a production build:

```bash
npm run build
```

From inside `frontend/`, run linting:

```bash
npm run lint
```

From inside `frontend/`, preview the production build locally:

```bash
npm run preview
```

## Notes

- The frontend workspace is wired for a local development flow with Vite HMR
- Root `npm install` installs the workspace dependencies for both frontend and backend tooling support at the repository level
- The UI already includes the application list, detail, create/edit form, and reviewer decision screens described in the assignment brief
- The routed pages live under `src/pages/`
- The shared workflow rules, validation, and mock store live under `src/common/`
- The service worker keeps the offline mock application data in Cache Storage; clearing site data will restore the seeded examples
