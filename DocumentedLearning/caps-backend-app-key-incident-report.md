# CAPS Backend Incident Report

## Issue Summary

This report documents the backend startup problem where the Laravel backend container failed to boot because `APP_KEY` was missing. In the current Docker setup, the backend service is `backend` and the container name is `caps_backend_mobile`. Older project documents still refer to `caps_backend`, which can cause confusion during troubleshooting.

Current status at the time of this report: the backend is running, but the failure mode and recovery process below remain important because the container is now intentionally configured to refuse startup when `APP_KEY` is absent.

## Affected Service

- Docker service: `backend`
- Current container name: `caps_backend_mobile`
- Current backend port: `8005`
- Important note: older documentation still uses `caps_backend`, but the current `docker-compose.yml` uses `caps_backend_mobile`

## Exact Error

When the backend starts without a valid `APP_KEY`, the entrypoint exits with this startup error:

```text
ERROR: APP_KEY is missing.
Refusing to generate a new encryption key against a persistent database.
Set APP_KEY in Backend - Deployment/.env (or pass it via Docker env_file/environment) and restart.
```

## Why The Error Occurred

The error occurs because the backend now fails fast when `APP_KEY` is missing. This is intentional and protects encrypted Laravel data.

The root cause is the combination of these conditions:

1. The backend startup script checks `.env` before Apache starts.
2. `Backend - Deployment/.env.example` contains an empty `APP_KEY=`, so copying the example file alone is not enough.
3. `Backend - Deployment/.dockerignore` excludes `.env` from the image build, so rebuilding the backend image does not carry the host machine's real key into the container.
4. The backend service in `docker-compose.yml` expects runtime values from `env_file: ./Backend - Deployment/.env`.
5. The MariaDB data volume can persist across container rebuilds, and Laravel uses `APP_KEY` to decrypt existing encrypted rows.

Because of that, starting the backend without the original stable key would risk permanent decryption problems for existing data. The project therefore rejects startup instead of silently generating a new key.

## Why This Behavior Is Correct

This failure is safer than automatic recovery.

- A new random `APP_KEY` may let the container start, but it can break access to previously encrypted database content.
- Reused database volumes and backend keys must stay paired.
- A visible startup failure is easier to recover from than silent key drift.

## Complete Steps To Solve The Error

### 1. Confirm the correct backend container name

Run:

```powershell
docker compose -f docker-compose.yml ps
```

Use `caps_backend_mobile` for the current project. Do not rely on the older `caps_backend` name from legacy documents.

### 2. Read the backend startup logs

Run:

```powershell
docker logs caps_backend_mobile
```

If the problem is this incident, the logs will show the `APP_KEY is missing` startup error shown above.

### 3. Open the backend environment file

Check:

```text
Backend - Deployment/.env
```

The backend service is configured to read this file at runtime through `env_file` in `docker-compose.yml`.

### 4. Restore the correct `APP_KEY`

If the database volume contains existing real data, restore the exact same `APP_KEY` that was used by the last working backend.

Update this line in `Backend - Deployment/.env`:

```text
APP_KEY=base64:your-original-stable-key-here
```

Recommended recovery sources:

- the last working backend `.env`
- a secure deployment secret store
- a backup of the previous environment configuration

Do not generate a new key if you are reusing an existing database volume with encrypted records.

### 5. Only for a brand-new disposable database: generate a fresh key

If this is a completely fresh environment and no old encrypted data must be preserved, you can generate a new Laravel key.

Run:

```powershell
docker run --rm --entrypoint php caps-mobile-backend artisan key:generate --show
```

Copy the generated value into:

```text
Backend - Deployment/.env
```

as:

```text
APP_KEY=base64:...
```

This step is safe only for a new or disposable database.

### 6. Restart the backend

After fixing `APP_KEY`, restart the backend service:

```powershell
docker compose -f docker-compose.yml up -d backend
```

If the backend image also needs rebuilding, use:

```powershell
docker compose -f docker-compose.yml up -d --build backend
```

### 7. Verify that the backend is healthy

Run:

```powershell
docker compose -f docker-compose.yml ps
docker logs --tail 50 caps_backend_mobile
```

Then verify the API responds:

```powershell
curl http://localhost:8005/api/app-version
```

Expected result:

- backend container is `Up`
- no `APP_KEY is missing` error appears in logs
- the API returns a normal response from `/api/app-version`

## Prevention Measures

- Keep `Backend - Deployment/.env` backed up securely.
- Treat `APP_KEY` as part of the database recovery package.
- Do not remove or overwrite the backend `.env` file during deployment.
- When reusing a MariaDB volume, always restore the matching `APP_KEY` before starting the backend.
- Update old project documents that still reference `caps_backend` so debugging commands use `caps_backend_mobile`.

## Source Files Used

- `docker-compose.yml`
- `Backend - Deployment/docker-entrypoint.sh`
- `Backend - Deployment/.env.example`
- `Backend - Deployment/.dockerignore`
`
