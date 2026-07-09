# Portfolio — AI Orchestration Workspace

This workspace implements the **3-layer AI architecture** described in `agents.md`.

## Architecture

```
directives/        ← Layer 1: SOPs (what to do)
execution/         ← Layer 3: Deterministic Python scripts (doing the work)
.tmp/              ← Intermediate files (always regenerated, never committed)
agents.md          ← Layer 2 instructions (you are here)
```

The AI (Layer 2) sits between human intent and deterministic execution.

## Quick Start

```bash
# 1. Copy and fill in secrets
cp .env.example .env

# 2. Create a virtual environment
python -m venv .venv && source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Smoke-test shared utils
python execution/utils.py
```

## Docker Deployment

Build the production image:

```bash
export VITE_WEB3FORMS_KEY="$(sed -n 's/^VITE_WEB3FORMS_KEY=//p' .env.local)"
docker build --build-arg VITE_WEB3FORMS_KEY="$VITE_WEB3FORMS_KEY" -t ganesh-portfolio .
```

Run it locally:

```bash
docker run --rm -p 3000:3000 ganesh-portfolio
```

Then open `http://localhost:3000`.

With Docker Compose:

```bash
export VITE_WEB3FORMS_KEY="$(sed -n 's/^VITE_WEB3FORMS_KEY=//p' .env.local)"
docker compose up --build
```

Push to Docker Hub:

```bash
docker login
docker tag ganesh-portfolio YOUR_DOCKERHUB_USERNAME/ganesh-portfolio:latest
docker push YOUR_DOCKERHUB_USERNAME/ganesh-portfolio:latest
```

## Adding a new task

1. Create a directive in `directives/<task_name>.md` describing goal, inputs, tools, outputs, and edge cases.
2. Create or reuse a script in `execution/<task_name>.py`.
3. The AI will read the directive and call the script in the right order.

## File conventions

| Path | Purpose |
|------|---------|
| `directives/` | Markdown SOPs — the long-term instruction set |
| `execution/` | Python scripts — deterministic tools |
| `.tmp/` | Scratch/intermediate files — safe to delete |
| `.env` | Secrets — never commit |
| `.env.example` | Template for secrets — safe to commit |
| `requirements.txt` | Python dependencies |
