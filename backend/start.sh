#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR"

VENV_PYTHON=""
for candidate in "$BACKEND_DIR/venv/bin/python" "$BACKEND_DIR/.venv/bin/python" ; do
  if [[ -x "$candidate" ]]; then
    VENV_PYTHON="$candidate"
    break
  fi
done

if [[ -z "$VENV_PYTHON" ]]; then
  echo "Could not find a backend virtual environment at backend/venv or backend/.venv." >&2
  echo "Expected a Python interpreter such as backend/venv/bin/python." >&2
  exit 1
fi

cd "$BACKEND_DIR"
exec "$VENV_PYTHON" manage.py runserver --noreload
