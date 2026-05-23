# Frontend

This folder contains the React user interface for the application workflow tracker.

## What It Does

- Shows the application list
- Lets you create and edit applications
- Shows application details
- Lets reviewers move applications through the workflow

The frontend talks to the backend through `/api` requests. If the backend is not available, a service worker can provide an offline mock fallback.

## How To Start It

From the repository root:

```bash
npm run start:frontend
```

Or from inside this folder:

```bash
cd frontend
npm run start
```

The app runs at:

```text
http://localhost:5173
```

## First-Time Setup

If you have not already done so, install the workspace dependencies from the repository root:

```bash
npm install
```

## Other Useful Commands

Build the app for production:

```bash
npm run build
```

Check the code with ESLint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## Troubleshooting

- If the page is blank, check that the backend is running at `http://127.0.0.1:8000`
- If the app still shows old offline data, clear the browser site data or do a hard refresh
- If the dev server will not start, make sure `npm install` finished successfully
