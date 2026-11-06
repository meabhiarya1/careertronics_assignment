# Batch Operations

A **Batch Operations** page for listing, searching, filtering, sorting and paginating training batches.

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Node.js + Express 5 (serves data from an in-memory mock array; no database)

![Batch Operations screenshot](docs/screenshot.png)

---

## Quick start

**Prerequisites:** Node.js **20.19+** (or 22.12+) and npm.

```bash
# 1. Install root, backend and frontend dependencies
npm run setup

# 2. Start the API (port 4000) and the web app (port 5173) together
npm run dev
```

Open **http://localhost:5173**. If that port is taken, Vite prints the next free port it picked.

No `.env` files are needed to run locally. Every setting has a working default.

### Run each app separately

```bash
# Terminal 1 – API
cd backend
npm install
npm run dev          # http://localhost:4000

# Terminal 2 – Web
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Other scripts (run from the repo root)

| Command         | What it does                                 |
| --------------- | -------------------------------------------- |
| `npm test`      | Backend unit + API tests (Jest + Supertest)  |
| `npm run lint`  | ESLint for the frontend                      |
| `npm run build` | Production build of the frontend (`dist/`)   |

---

## Features

- **Server-side pagination** with selectable page size (10 / 20 / 50) and numbered pages with ellipses.
- **Search** across batch name, batch code, course and instructor. It is case-insensitive and debounced by 350 ms.
- **Filters** by status (segmented tabs that show counts) and delivery mode.
- **Column sorting** by batch name, start date and enrollment. Ties are broken by id, so paging stays stable.
- **URL state:** search, filters, sort and page are kept in the query string. A refresh keeps the view, and the link can be shared.
- **Summary stats:** total batches, ongoing, upcoming and learners enrolled.
- **Loading, empty and error states:** skeleton rows on first load, dimmed rows and a progress bar while refetching, "clear filters" when nothing matches, and retry on error.
- **Race-safe fetching:** an outdated in-flight request is aborted when the query changes.
- **Responsive and accessible:** works down to phone width, uses semantic table markup, `aria-sort`, `aria-pressed`, labelled inputs and visible focus rings.

---

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # env-driven config (port, CORS)
│   │   ├── constants/       # enums, defaults, sortable/searchable fields
│   │   ├── data/            # mock batches array (stands in for a DB table)
│   │   ├── repositories/    # BatchRepository – data access (filter/sort/slice)
│   │   ├── services/        # BatchService – business logic, pagination meta
│   │   ├── controllers/     # BatchController – HTTP in/out only
│   │   ├── validators/      # query/param parsing + validation (400 on bad input)
│   │   ├── middlewares/     # validateRequest, notFound, central errorHandler
│   │   ├── routes/          # /api/v1/batches routes
│   │   ├── utils/           # ApiError
│   │   ├── container.js     # composition root (constructor injection)
│   │   ├── app.js           # createApp() – testable Express app factory
│   │   └── server.js        # starts the server, graceful shutdown
│   └── tests/               # service unit tests + API integration tests
│
└── frontend/
    └── src/
        ├── api/             # HttpClient (fetch wrapper) + HttpError
        ├── services/        # BatchApiService – batch endpoints
        ├── hooks/           # useBatchQuery (URL state), useBatches, useAsync, …
        ├── components/
        │   ├── batches/     # table, row, toolbar, status tabs, badges, footer
        │   ├── common/      # Button, SearchInput, SelectField, Pagination, states
        │   ├── layout/      # AppHeader, PageHeader
        │   └── stats/       # StatCard, StatsOverview
        ├── pages/           # BatchOperationsPage – composes everything
        ├── constants/       # status/mode labels, defaults, page sizes
        ├── utils/           # formatting, pagination maths, URL (de)serialisation
        └── styles/          # shared class strings (focus ring, inputs, cards)
```

### Architecture notes

**Backend: layered, using constructor injection.**
`Route → validateRequest → Controller → Service → Repository`. Each layer has a single responsibility, and `container.js` is the only place where the pieces are wired together:

```js
const batchRepository = new BatchRepository(batches);
const batchService = new BatchService(batchRepository);
const batchController = new BatchController(batchService);
```

- The **repository** query API is shaped like a database query (`findMany({ filters, sort, offset, limit })`), so switching to a real database only changes that one class.
- **Validation** turns raw query strings into typed, defaulted values. It reports *every* invalid field in one 400 response.
- **Errors** flow to a single error handler. Known `ApiError`s keep their status code. Unexpected errors are logged and returned as a generic 500, so internals never leak.
- `createApp({ batches })` builds the app without listening on a port, so tests inject a small fixture dataset.

**Frontend: logic is kept out of components.**
- `useBatchQuery` is the single source of truth for the list view. It syncs with the URL and holds the paging rules, such as resetting to page 1 whenever a filter changes.
- `useAsync` handles fetching, cancellation and retry. Loading state is *derived* from the request key, which avoids stale-response bugs.
- Components are presentational and receive data and callbacks as props.

---

## API reference

Base URL: `http://localhost:4000/api/v1`. Only `GET` endpoints are provided.

### `GET /batches`

| Param    | Type   | Default     | Notes                                                      |
| -------- | ------ | ----------- | ---------------------------------------------------------- |
| `search` | string | –           | Matches name, code, course, instructor (max 100 chars)     |
| `status` | enum   | –           | `upcoming` \| `ongoing` \| `completed` \| `cancelled`      |
| `mode`   | enum   | –           | `online` \| `offline` \| `hybrid`                          |
| `sortBy` | enum   | `startDate` | `batchCode` \| `batchName` \| `startDate` \| `endDate` \| `enrolled` |
| `order`  | enum   | `desc`      | `asc` \| `desc`                                            |
| `page`   | int    | `1`         | ≥ 1                                                        |
| `limit`  | int    | `10`        | 1 – 100                                                    |

```bash
curl "http://localhost:4000/api/v1/batches?search=data&status=ongoing&page=1&limit=2"
```

```json
{
  "success": true,
  "data": [
    {
      "id": 23,
      "batchCode": "DAN-2611-03",
      "batchName": "Data Analytics – Weekend Intensive",
      "course": "Data Analytics",
      "instructor": "Neha Gupta",
      "mode": "offline",
      "startDate": "2026-11-04",
      "endDate": "2027-01-27",
      "enrolled": 41,
      "capacity": 50,
      "status": "ongoing"
    }
  ],
  "meta": { "page": 1, "limit": 2, "total": 3, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false }
}
```

### `GET /batches/stats`

```json
{
  "success": true,
  "data": {
    "totalBatches": 60,
    "totalEnrolled": 2088,
    "byStatus": { "upcoming": 15, "ongoing": 15, "completed": 26, "cancelled": 4 }
  }
}
```

### `GET /batches/:id`

Returns a single batch. Returns `404` if the batch doesn't exist and `400` if the id isn't a positive integer.

### `GET /health`

Liveness check: `{ "status": "ok", "uptime": 12 }`.

### Errors

Every error uses the same shape:

```json
{
  "success": false,
  "error": {
    "message": "Invalid request parameters",
    "details": [{ "field": "page", "message": "page must be an integer >= 1" }]
  }
}
```

---

## Configuration

Both apps work without any configuration. To override a setting, copy the matching `.env.example` to `.env`.

**`backend/.env`**

| Variable       | Default                 | Description                         |
| -------------- | ----------------------- | ----------------------------------- |
| `PORT`         | `4000`                  | API port                            |
| `NODE_ENV`     | `development`           | `production` switches log format    |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins     |

**`frontend/.env`**

| Variable            | Default                 | Description                                          |
| ------------------- | ----------------------- | ---------------------------------------------------- |
| `VITE_API_BASE_URL` | `/api/v1`               | API base URL used by the browser                     |
| `API_PROXY_TARGET`  | `http://localhost:4000` | Where the Vite dev server forwards `/api` requests   |

In development the browser calls `/api/...` on the Vite origin, and Vite forwards those requests to the backend, so CORS never gets in the way locally.

---

## Testing

```bash
npm test
```

There are 28 tests:

- **`BatchService` unit tests:** default sorting, case-insensitive search across fields, combined filters, page boundaries, out-of-range pages, numeric sorting with stable tie-breaks, 404 handling and stats aggregation.
- **API integration tests (Supertest):** response envelope, query-string handling, every validation rule (400s), the stats and by-id endpoints, the health check and the JSON 404 for unknown routes.

---

## Assumptions

- No UI reference was provided, so the record shape (course, instructor, mode, schedule, enrollment, status) and the visual design are my own choices.
- Batch `status` is stored on the record, not computed from today's date, so API responses stay deterministic.
- Status tab counts come from `/batches/stats`. They show overall totals and don't change with the search box.
