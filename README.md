# VidyaVista

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind (`frontend/`) → **Vercel** |
| Backend | Django 5 + Django REST Framework + PostgreSQL (`backend/`) → **Railway** |
| Admin panel | **Django admin** (auto-generated from the models), branded with the logo colours |
| Cache / queue | Redis + Celery |
| Search | Meilisearch (falls back to PostgreSQL search if it is not configured) |
| Auth (API) | JWT with SimpleJWT, refresh-token rotation + blacklist |
| School types | 3 types: **Day**, **Day Boarding**, **Full Boarding** |

## Run locally

### Option A: Docker (easiest, everything included)
```bash
cd backend
docker compose up --build
```
- API: http://localhost:8000/api/schools
- **Admin panel: http://localhost:8000/admin/**  (login `admin` / `ChangeMe@12345`)
- The first start creates the migration files in `backend/schools/migrations` and `backend/enquiries/migrations`. **Commit them.**
- Sample schools are added automatically.

### Option B: without Docker
```bash
cd backend
python -m venv .venv && source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # set DATABASE_URL (PostgreSQL). Clear REDIS_URL / MEILISEARCH_URL to run without them
python manage.py makemigrations # first time only, then commit the generated files
python manage.py migrate
python manage.py createsuperuser        # or set DJANGO_SUPERUSER_* in .env and run: python manage.py ensure_superuser
python manage.py seed_schools           # optional sample schools (safe to re-run, use --reset to wipe first)
python manage.py reindex_schools        # only if Meilisearch is configured
python manage.py runserver              # http://localhost:8000/admin/
celery -A config worker -l info         # only if REDIS_URL is set (otherwise tasks run inline)
```
Without `REDIS_URL` Celery runs tasks inline and the cache is in-memory. Without `MEILISEARCH_URL` search uses PostgreSQL.

### Frontend
```bash
cd frontend
cp .env.example .env.local      # NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev                     # http://localhost:3000
```

## Admin panel (Django admin, `/admin/`)
| Where | What you get |
|---|---|
| Home | Dashboard: KPIs, 14-day enquiry chart, pipeline donut, most enquired schools, schools by city / board / type, "needs attention" list, recent enquiries |
| Schools | Thumbnail list, search, filters (board, type, gender, state, city, live, top rated, data quality), **Live / Top-rated switches right in the list**, bulk actions (make live, hide, top rated, export CSV), enquiry count per school |
| Add / edit school | Sectioned form, cover image upload or link with preview, facilities as comma separated list, link to the public page |
| **Import CSV** button | Bulk add schools from a sheet (template download, duplicates skipped, per-row errors) |
| Enquiries | Status badges, call / WhatsApp buttons, search, date filter + hierarchy, internal notes, bulk "Mark contacted / converted / closed", export CSV |
| Users | Add more admins / staff and set permissions |

Saving a school automatically refreshes the Meilisearch index (Celery task) and the API cache. New enquiries trigger an email to `ENQUIRY_NOTIFY_EMAILS`.

## API (same shape as before, so the frontend did not change)
- `GET  /api/schools?type=Day,Full Boarding&city=Mumbai&state=&board=&gender=&minFee=&maxFee=&q=&sort=&page=&limit=`
- `GET  /api/schools/meta` · `GET /api/schools/sitemap` · `GET /api/schools/<id or slug>`
- `POST /api/enquiries` (10 per hour per IP)
- `POST /api/auth/token` (login) · `/api/auth/token/refresh` (rotates the refresh token) · `/api/auth/token/verify` · `/api/auth/logout` (blacklists the refresh token) · `GET /api/auth/me`
- `GET  /api/health`

## Deploy
**Backend on Railway**
1. New project → Deploy from GitHub → root directory `backend`.
2. Add plugins: **PostgreSQL** and **Redis** (they provide `DATABASE_URL` and `REDIS_URL`). Add a **Meilisearch** service (template) and use its URL + master key.
3. Variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `CLIENT_URL=https://<your-vercel-domain>`, `MEILISEARCH_URL`, `MEILISEARCH_API_KEY`, `DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD`, `ENQUIRY_NOTIFY_EMAILS`, `EMAIL_HOST…` (optional).
4. Create a **second service** from the same repo with start command `celery -A config worker -l info` (same variables).
5. For uploaded photos attach a **Volume** and set `MEDIA_ROOT` to its path (or just paste image links).
6. One time after the first deploy: `python manage.py seed_schools` and `python manage.py reindex_schools` (Railway shell).

**Frontend on Vercel:** root directory `frontend`, env `NEXT_PUBLIC_API_URL=https://<railway-domain>/api` and `NEXT_PUBLIC_SITE_URL`.

## Cookie behaviour (`frontend/src/app/lib/preferences.ts`)
Cookie `vv_pref` = `{ "type": "Day Schools", "location": "Mumbai" }`, 1 year. The hero labels (Day Schools / Boarding Schools / Day - Boarding) map to the stored types Day / Full Boarding / Day Boarding.
