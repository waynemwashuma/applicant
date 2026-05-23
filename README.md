# Mini Application Workflow Tracker

This repository contains a Django backend and a React frontend for an application workflow tracker. The workflow described in the brief is:

`Draft -> Submitted -> Under Review -> Need More Information / Approved / Rejected`

## What’s In The Repo

- `backend/` - Django project for the API, database, and workflow logic
- `frontend/` - React + TypeScript + Vite UI
- `package.json` - root workspace scripts for running both apps together

## Quick Start

Install the JavaScript dependencies from the repository root:

```bash
npm install
```

Start both workspaces together:

```bash
npm start
```

This runs:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`

## Run Each Workspace Separately

Run only the frontend:

```bash
npm run start:frontend
```

Run only the backend:

```bash
npm run start:backend
```

You can also use the workspace-specific commands documented here:

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## Migrations

The backend uses SQLite (`backend/db.sqlite3`). If you change models or need to rebuild the schema, run migrations from inside the backend workspace using the same Python environment that powers the app.

The backend README includes the exact commands.

## Assumptions

- The project is being run locally for review, not deployed to production.
- The backend currently expects the checked-in virtual environment under `backend/venv` or `backend/.venv`.
- The root workspace commands assume Node.js and npm are available.
- The assignment brief calls for a Django Ninja API and workflow-specific screens and actions. This repository should be updated to match the brief as features are implemented.

## What Could Be Improved With More Time

- Add a committed dependency file for the backend, such as `requirements.txt` or `pyproject.toml`
- Add automated backend and frontend tests for the workflow rules
- Document the API endpoints in more detail
- Add screenshots or a short walkthrough video
- Add deployment instructions for a hosted demo environment

## Notes

- The backend launch script is `backend/start.sh`
- The frontend app uses Vite, React, TypeScript, and plain CSS styling in `frontend/src`
