# QuickHire — Backend Service

**A production-style NestJS REST API for a job board: authentication, role-based access control (RBAC), jobs, and applications.**

This document introduces the backend to reviewers. For environment setup and run instructions, see the separate setup guide.

---

## Purpose

QuickHire is a job-posting and application backend built as a task for **Qtec Solution Limited**. It provides:

- User registration and JWT-based auth (access + refresh tokens)
- Role-based access: **user**, **admin**, **super-admin**
- Job CRUD (admin) and public-style listing/detail (authenticated user)
- Job application submission (authenticated user)
- User management and role updates (super-admin only)
- Rate limiting with per-route limits and optional IP penalty
- OpenAPI (Swagger) documentation

---

## Tech Stack

| Layer        | Choice |
|-------------|--------|
| Runtime     | Node.js |
| Framework   | NestJS 11 (Express) |
| Language    | TypeScript 5.x |
| Database    | MongoDB (Mongoose 9) |
| Auth        | JWT (access + refresh), Passport, bcrypt |
| Validation  | class-validator + ValidationPipe |
| API docs    | Swagger/OpenAPI 3 |
| Rate limit  | @nestjs/throttler (in-memory, per-route) |

---

## Architecture

### High-level

- **REST API** under global prefix `/api`.
- **Bearer token** auth: client sends `Authorization: Bearer <accessToken>`.
- **Modular structure**: Auth, Users, Job, Application; shared `common` (guards, decorators, base repository).

### Folder structure

```
src/
├── auth/                 # Register, login, refresh, logout; JWT strategy
│   ├── dto/              # register, login, refresh-token
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── users/                # User CRUD + role update (super-admin)
│   ├── entities/
│   ├── dto/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.repository.ts
├── job/                  # Job listing, detail, create, delete
│   ├── entities/
│   ├── dto/
│   ├── job.module.ts
│   ├── job.controller.ts
│   ├── job.service.ts
│   └── job.repository.ts
├── application/          # Submit job application
│   ├── entities/
│   ├── dto/
│   ├── application.module.ts
│   ├── application.controller.ts
│   ├── application.service.ts
│   └── application.repository.ts
├── common/
│   ├── base/
│   │   └── base.repository.ts   # Generic MongoDB CRUD
│   ├── decorators/
│   │   └── roles.decorator.ts   # @Roles('admin', ...)
│   └── guards/
│       └── roles.guard.ts       # Role hierarchy check
├── app.module.ts
└── main.ts
```

### Data layer

- **MongoDB** with **Mongoose**.
- **BaseRepository** in `common/base`: generic `findAll`, `findById`, `create`, `update`, `delete`; Job, Application, and Users repositories extend it.
- **Entities**: User (email, hashed password, role), Job (title, company, location, category, description), Application (job_id ref, name, email, resume_link, cover_note). All use `timestamps: true`.

### Authentication and RBAC

- **Access token**: short-lived JWT (e.g. 15m), signed with `JWT_ACCESS_SECRET`, used as Bearer in `Authorization` header.
- **Refresh token**: long-lived JWT (e.g. 7d), signed with `JWT_REFRESH_SECRET`; sent in request body to `POST /api/auth/refresh` to get a new access + refresh pair.
- **Passport JWT strategy** reads the access token from `Authorization: Bearer <token>` and validates it; on success, attaches `user` (id, email, role) to the request.
- **RolesGuard** plus **@Roles()** enforce role hierarchy: `user` &lt; `admin` &lt; `super-admin`. For example, `@Roles('admin')` allows admin and super-admin.

---

## API Overview

| Area | Endpoints | Auth / Role |
|------|-----------|--------------|
| **Auth** | `POST /api/auth/register` | Public |
| | `POST /api/auth/login` | Public |
| | `POST /api/auth/refresh` | Body: `refreshToken` |
| | `POST /api/auth/logout` | Public (client discards tokens) |
| **Users** | `GET /api/users` | Bearer, super-admin |
| | `GET /api/users/:id` | Bearer, super-admin |
| | `PATCH /api/users/:id/role` | Bearer, super-admin |
| | `DELETE /api/users/:id` | Bearer, super-admin |
| **Jobs** | `GET /api/jobs` | Bearer, user+ |
| | `GET /api/jobs/:id` | Bearer, user+ |
| | `POST /api/jobs` | Bearer, admin+ |
| | `DELETE /api/jobs/:id` | Bearer, admin+ |
| **Applications** | `POST /api/applications` | Bearer, user+ |

- **Swagger UI**: `GET /api/docs` (Bearer auth can be set in the UI).

---

## Security and Behaviour

- **Passwords**: bcrypt (salt rounds 10).
- **JWT**: Access and refresh use separate secrets and payload `type` to avoid misuse.
- **Validation**: Global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform).
- **Rate limiting**: Global throttler with named limiters; per-route overrides (e.g. stricter limits + optional block duration for auth, job create/delete, application submit). Tracked by IP; 429 and optional “IP temporarily blocked” message when exceeded.

---

## Configuration (conceptual)

Backend expects at least:

- `MONGODB_URI` — MongoDB connection string.
- `JWT_ACCESS_SECRET` — Access token signing secret.
- `JWT_REFRESH_SECRET` — Refresh token signing secret.
- Optional: `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES` (e.g. `15m`, `7d`), `PORT`, `NODE_ENV` (e.g. production).

Exact setup (env files, Docker, etc.) is described in the separate setup document.

---

## Summary

QuickHire is a NestJS backend that implements a full auth + RBAC flow with Bearer JWTs, a reusable repository layer, and guarded routes for jobs and applications. It is structured for clarity and maintainability and is suitable as a base for a production job-board API.
