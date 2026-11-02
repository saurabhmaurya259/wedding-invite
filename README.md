# Wedding Invitation

A responsive wedding invitation built with React and Vite. The current visual design and artwork live in `src/App.jsx`, `src/index.css`, `src/App.css`, and `public/wedding-art/`.

## Local development

Use Node.js 24 (the same major version used by CI).

```bash
npm ci
npm run dev
```

Vite prints the local URL after startup.

## Project commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the wedding data and calendar tests |
| `npm run lint` | Run ESLint |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Invitation content

The sample wedding information is centralized in `src/data/weddingDetails.js`. It contains the couple and family names, date/countdown target, venue, event details, calendar links, RSVP defaults, contact details, and asset URLs.

Keep the existing event labels and displayed times consistent with their calendar timestamps. The venue time zone is configured as `Asia/Kolkata`; the `icsStart` and `icsEnd` values are UTC timestamps ending in `Z`, representing the same moments as the displayed Indian local times.

The current names, dates, venue and contact fields are sample values. Replace them only with confirmed details.

## RSVP storage status

The current RSVP form performs client-side required-field validation and displays its existing confirmation state. It does **not** yet persist submissions to Google Sheets or a database. Durable RSVP storage requires a server-side API and deployment configuration. Credentials must remain in the backend's secret store or environment and must never be placed in browser code or a `VITE_*` variable.

## Continuous integration

The workflow at `.github/workflows/ci.yml` runs on pushes and pull requests targeting `preferred-design-work`. It installs locked dependencies, audits production dependencies, runs the data tests, runs ESLint, and builds the production assets.

This workflow validates the branch; it does not deploy the website.
