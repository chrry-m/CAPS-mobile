# Tailscale login and shared database access

## Purpose
Use the backend-provided Tailscale account so everyone connects to the same shared database over the Tailnet.

## Prerequisites
- Tailscale installed on your machine.
- The backend has provided a Tailscale account (email + password) or an invite link.
- The backend has provided the database connection details:
  - Host (Tailnet IP or MagicDNS name) : http://100.91.44.24
  - Port : 8005
  - Database name
  - Username
  - Password

## Login (Windows)
1. Open the Tailscale app.
2. Click Log in.
3. Use the backend-provided account or invite link.
4. Complete the browser login and return to the app.

## Verify you are connected
- In the Tailscale app, confirm the status is Connected.
- Optional command line check:

```bash
# PowerShell
"$env:ProgramFiles\Tailscale\tailscale.exe" status
```

## Use the shared database in Docker
Update your app to point to the shared DB host and port from the backend team.

If you are using `docker-compose.yml` for local services, set these environment values for the backend service:
- `DB_HOST` to the Tailnet IP or MagicDNS name
- `DB_PORT` to the shared DB port
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` to the provided values

Then restart the stack:

```bash
docker compose down
docker compose up --build -d
```

## Notes
- Keep the shared Tailscale account credentials private.
- If you lose access, ask the backend team to re-invite you.