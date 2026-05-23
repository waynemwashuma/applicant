# Backend

This workspace contains the Django project for the application workflow tracker.

## Overview

- Framework: Django + Django Ninja
- Database: SQLite (`db.sqlite3`)
- App code: `api/`
- Project config: `config/`
- Launch script: `start.sh`

The backend is set up to be run locally with the virtual environment stored in `backend/venv` or `backend/.venv`.

## Run The Backend

From the repository root:

```bash
npm run start:backend
```

Or run the script directly from the backend folder:

```bash
cd backend
bash start.sh
```

The server starts on:

```text
http://127.0.0.1:8000
```

## Run Migrations

If you change models or need to recreate the database schema, run migrations using the same Python interpreter from the active virtual environment.

Example:

```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

If your environment lives at `.venv`, activate that instead:

```bash
source .venv/bin/activate
python manage.py migrate
```

## Useful Commands

Create a Django admin user:

```bash
python manage.py createsuperuser
```

Run the Django shell:

```bash
python manage.py shell
```

## API Endpoints

The workflow API is mounted under `/api/`:

- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/{id}`
- `PATCH /api/applications/{id}`
- `POST /api/applications/{id}/submit`
- `POST /api/applications/{id}/start-review`
- `POST /api/applications/{id}/decision`

## Notes

- `start.sh` automatically looks for `backend/venv/bin/python` first, then `backend/.venv/bin/python`
- There is no committed `requirements.txt` in the repo yet, so the checked-in environment is the fastest way to run the project locally
- If you add Django Ninja endpoints, wire them through `config/urls.py`
