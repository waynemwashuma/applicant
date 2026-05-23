# Backend

This folder contains the Django backend for the application workflow tracker.

## What It Does

- Stores application data in SQLite
- Exposes the API used by the frontend
- Handles the workflow actions such as submit, review, and decision updates

## Set It Up From Scratch

Use these steps on a fresh machine:

1. Make sure Python 3.12 is installed.
2. Open a terminal in the repository root.
3. Create a virtual environment inside `backend/`:

```bash
python3.12 -m venv backend/venv
```

4. Activate it:

```bash
source backend/venv/bin/activate
```

5. Upgrade pip:

```bash
python -m pip install --upgrade pip
```

6. Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

7. Apply the database migrations:

```bash
python backend/manage.py migrate
```

8. Start the backend server:

```bash
python backend/manage.py runserver --noreload
```

The backend runs at:

```text
http://127.0.0.1:8000
```

## Easier Local Start

Once `backend/venv` exists, you can also start the backend from the repository root with:

```bash
npm run start:backend
```

Or from inside this folder:

```bash
bash start.sh
```

## Database

The backend uses SQLite and stores its data in `backend/db.sqlite3`.

If you change models or need to refresh the database schema, run migrations with the Python interpreter from the active backend environment:

```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

If your environment is in `.venv` instead of `venv`, use this command:

```bash
source .venv/bin/activate
python manage.py migrate
```

## Useful Commands

Create an admin user:

```bash
python manage.py createsuperuser
```

Open the Django shell:

```bash
python manage.py shell
```

## API Routes

The API is mounted under `/api/`.

- `GET /api/applications`
- `POST /api/applications`
- `GET /api/applications/{id}`
- `PATCH /api/applications/{id}`
- `POST /api/applications/{id}/submit`
- `POST /api/applications/{id}/start-review`
- `POST /api/applications/{id}/decision`

## Troubleshooting

- If `python3.12` is not available, use whichever Python 3 command points to Python 3.12 or newer, then create the venv with that command instead.
- If the backend does not start, confirm that `backend/venv/bin/python` exists.
- If you see a port error, make sure nothing else is using port `8000`.
- If you reset the database, rerun migrations before starting the app again.
