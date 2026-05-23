# Frontend

This workspace contains the React user interface for the application workflow tracker.

## Overview

- Framework: React
- Language: TypeScript
- Build tool: Vite
- Entry point: `src/main.tsx`
- App shell: `src/App.tsx`
- Styling: `src/App.css` and `src/main.css`

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
- The UI can be extended to support the application list, detail, form, and reviewer decision screens described in the assignment brief
