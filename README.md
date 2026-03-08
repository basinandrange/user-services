## Local API implementation

A Node.js/Express implementation for `index.yaml` now exists under `app/`.

### Run locally

```bash
npm install
npm start
```

The server runs on `http://localhost:3001` by default.

### User Manager UI

Open `http://localhost:3001/` to use the browser-based User Manager dashboard.

### Implemented endpoints

- `GET /accounts/{accountNumber}/statement/latest`
- `GET /accounts/{accountNumber}/statement/date`
- `GET /accounts/{accountNumber}/overview`
- `POST /accounts/create`
- `GET /payments/{accountNumber}/payees`
- `POST /payments/{accountNumber}/payees/add`
- `GET /payments/{accountNumber}/limits`
- `PUT /payments/{accountNumber}/limits`
- `POST /payments/{accountNumber}/transfer`
- `POST /create`
- `GET /get`
- `PUT /update`
- `PATCH /update`
- `DELETE /delete`

### Notes

- The service uses an in-memory data store (`app/services/data/store.js`).
- Some payments endpoints intentionally return HTTP `500` with example payloads because that is how they are defined in `index.yaml`.

## CI: Postman collection tests

This repo runs the Postman collection **NOVA New User Onboarding** on every `push` and `pull_request` using Postman CLI.

### Required GitHub Secret

Create a repository secret named `POSTMAN_API_KEY` containing a Postman API key with access to the workspace and any required resources.

### What the workflow runs

- Workflow: `.github/workflows/postman-tests.yml`
- Collection source (filesystem mode): `postman/collections/NOVA New User Onboarding`
- Environment: none (no files found under `postman/environments/`)

To add an environment later, commit an environment file under `postman/environments/` and update the workflow to pass it, e.g.:

```bash
postman collection run "postman/collections/NOVA New User Onboarding" -e "postman/environments/<your-environment>.yaml"
```
