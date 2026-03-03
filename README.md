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