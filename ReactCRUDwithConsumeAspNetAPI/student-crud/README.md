# React CRUD for ASP.NET Core Students API

This project is a React SPA that consumes the ASP.NET Core Web API exposed at `https://localhost:7088/api/Students`. It supports full CRUD:

- View all students
- Create a new student
- Update an existing student
- Delete a student

The UI is built with Vite + React and talks to the API via `fetch`.

## Getting Started

```bash
cd student-crud
npm install
npm run dev
```

By default the app calls `/api` so it works with the included Vite dev proxy (see `vite.config.js`). If the ASP.NET API is running on `https://localhost:7088`, the proxy will forward calls automatically.

## Configuration

- `VITE_API_BASE_URL` &mdash; set this env var if you want to override the default `/api` base path (for example when deploying the React app separately from the API). You can create `.env.development` and/or `.env.production` files at the project root:

  ```
  VITE_API_BASE_URL=https://localhost:7088/api
  ```

## Build for Production

```bash
npm run build
npm run preview
```

Deploy the contents of `dist/` to your static hosting of choice. Ensure `VITE_API_BASE_URL` points to the live API endpoint (or configure reverse proxy routing) in the runtime environment.
