# Docker deployment (local or server)

## Prerequisites
- Docker Desktop or Docker Engine installed and running.
- Access to this repo.

## Build and start
1. Open a terminal at the repo root.
2. Build and start all services:

```bash
# Docker Compose v2 (recommended)
docker compose up --build -d

# If your system uses legacy compose
# docker-compose up --build -d
```

## Verify
```bash
docker compose ps
```

Expected containers from `docker-compose.yml`:
- `caps_mysql` on `3306`
- `caps_backend` on `8000`
- `caps_frontend` on `3000`

## Logs
```bash
docker compose logs -f --tail=200
```

## Stop
```bash
docker compose down
```

## Notes
- Edit environment variables and ports in `docker-compose.yml` if needed.
- Data is persisted via the `mysql_data` volume.