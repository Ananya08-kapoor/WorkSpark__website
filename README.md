# WorkSpark – Online Job Portal & Recruitment Platform

WorkSpark organises hiring from posting to offer:

1. **Employer** posts a job
2. **Admin** approves (or rejects with remarks)
3. **Job seeker** searches and applies
4. **Employer** reviews applicants and updates their status
5. **Job seeker** tracks the application (Applied → Under review → Shortlisted → Interview → Selected / Rejected)

Roles: Job seeker, Employer, Admin. Light and dark themes follow the system setting.

Live demo: https://work-spark-website-weld.vercel.app/

## What is in this repository

| Path | Purpose |
|---|---|
| `index.html` | Front-end demo (single file, in-memory demo data, no backend needed). Deployed on Vercel. |
| `tests/` | Automated front-end tests (Node + jsdom). |
| `scripts/verify-deployment.sh` | Post-deployment smoke test. |
| `.github/workflows/ci.yml` | Runs the tests on every push and pull request. |
| `backend-reference/` | Spring Boot configuration, security, pagination and test examples to copy into the Java backend (see below). |

## Running locally (Windows, macOS, Linux)

Front-end demo: open `index.html` in a browser, or serve it:

```bash
npx serve .
```

Run the tests (requires Node.js 18+):

```bash
npm install
npm test
```

## Automated testing

- **Front-end:** `npm test` runs 9 tests that load the real page in jsdom and check the login screen, pagination (page size, Previous/Next, reset on filter change), that only approved jobs are visible to job seekers, duplicate-application protection, admin approve/reject rules (remarks required to reject), HTML escaping of user input, and applicant status updates.
- **Backend:** `backend-reference/src/test/java/com/workspark/JobFlowTest.java` shows MockMvc tests for paginated listing and role-based access (seeker cannot approve, admin can). Run with `mvn verify`. Add a `prod`-profile test that asserts `/h2-console` returns 403 or 404.
- **CI:** GitHub Actions runs the front-end tests (`.github/workflows/ci.yml`) and, for the backend project, `mvn -B verify` (`backend-reference/.github/workflows/backend-ci.yml`).

## Production database configuration

Local development uses in-memory H2; production uses PostgreSQL. Profiles are in `backend-reference/src/main/resources/`.

| Profile | Database | H2 console | Demo data | Schema |
|---|---|---|---|---|
| `dev` (default) | H2 in-memory | Enabled at `/h2-console`, localhost only | Allowed | `ddl-auto: update` |
| `prod` | PostgreSQL | Disabled and denied | Never loaded | `ddl-auto: validate`, managed by Flyway migrations |

Production environment variables:

| Variable | Example |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `jdbc:postgresql://host:5432/workspark` |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | set in your host's secret manager, never committed |
| `ALLOWED_ORIGINS` | `https://work-spark-website-weld.vercel.app` |

Never commit `.env` files or credentials. Session cookies are `Secure` and `HttpOnly` in production.

## H2 console security

- The console exists **only** in the `dev` profile and only accepts connections from localhost.
- In `prod` it is disabled in `application-prod.yml` **and** denied in `SecurityConfig` (`/h2-console/**` → `denyAll()`), so a misconfiguration in one place does not expose the database.
- Clickjacking protection (`X-Frame-Options: DENY`) is on in production; `sameOrigin` is relaxed only in `dev` because the console uses frames.
- `scripts/verify-deployment.sh` checks that `/h2-console` returns 403 or 404 on the deployed API.

## Pagination

- **Front-end:** job search results, "My applications", the employer's applicants table and the admin approval queue show 5 items per page with Previous / Next and a "Page x of y · n results" indicator. Changing a search filter or switching job resets to page 1.
- **Backend:** list endpoints accept `page` (0-based), `size` (default 10, capped at 50) and `sort`, and return Spring's `Page` shape (`content`, `totalElements`, `totalPages`, `number`, `last`).

  ```
  GET /api/jobs?q=java&page=0&size=10&sort=createdAt,desc
  ```

  See `backend-reference/src/main/java/com/workspark/JobControllerPagination.java`.

## Deployment

### Front-end (Vercel)
1. Import the GitHub repository in Vercel (framework preset: *Other*, no build command needed for the static demo).
2. If you later connect a real API, add `VITE_API_URL` in the Vercel project settings.

### Backend (Render / Railway / any Docker host)
1. Provision a PostgreSQL database and set the environment variables above.
2. Build and run:
   ```bash
   docker build -t workspark .
   docker run --env-file .env -p 8080:8080 workspark
   ```
3. Add the Vercel URL to the backend's allowed CORS origins.

## Deployment verification

After every deployment run:

```bash
# front-end only
./scripts/verify-deployment.sh https://work-spark-website-weld.vercel.app

# front-end + backend
./scripts/verify-deployment.sh https://work-spark-website-weld.vercel.app https://your-api-url
```

It checks that the site returns HTTP 200 with the WorkSpark title and app container, and (when an API URL is given) that `/actuator/health` is UP, the jobs endpoint is paginated, the H2 console is blocked and the admin API rejects anonymous requests. The script exits non-zero if any check fails, so it can also be used as a CI step.

Manual smoke test: log in as Employer → post a job → switch to Admin and approve it → switch to Job seeker, find it and apply → switch to Employer and update the application status → check it under *My applications*.

## Demo mode note

The hosted demo keeps data in browser memory only: refreshing the page resets it, and the login form does not validate credentials. Real authentication and storage are provided by the Spring Boot backend.
