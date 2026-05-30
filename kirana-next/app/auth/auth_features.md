# Smart Kirana Store — Auth Module Documentation

> **AI CONTEXT DOCUMENT** — This file is the single source of truth for navigating the Auth module.
> When an AI receives a bug report, it should read this file first to identify **exactly one file** to fix.

---

## 📐 Architecture Philosophy

This module follows strict **"One File, One Responsibility"** micro-modularization.

- **No inline logic in UI files** — business logic lives in `AuthContext.tsx`; validation lives in `AuthTypes.ts`.
- **No hardcoded strings in components** — all demo credentials live in `AuthConstants.ts`.
- **No `any` types** — `AuthUser` interface is defined in `AuthTypes.ts` and used throughout.
- **Theme independence** — ZERO Tailwind color classes in JSX. All colors are `var(--auth-*)` CSS variables defined in `auth.css`.
- **Isolated state** — `AuthContext.tsx` is the only shared state; no global store is polluted.
- **Memoized context** — `login` and `signup` actions are `useCallback`-memoized; the context value object is `useMemo`-memoized to prevent re-render cascades across consumer components.

---

## 📂 Complete File Map

### 🟦 Route Files (Next.js App Router)

| File | Purpose |
|------|---------|
| `layout.tsx` | Auth layout shell — centers content, imports `auth.css` **once** for the entire route segment |
| `login/page.tsx` | Login page — Server Component. Wraps `<AuthProvider>` around login micro-components |
| `signup/page.tsx` | Signup page — Server Component. Wraps `<AuthProvider>` around signup micro-components |
| `loading.tsx` | Next.js skeleton shown automatically during page load. Matches the visual shape of the form |
| `error.tsx` | Next.js error boundary (`"use client"` required). Shows a retry button if the segment crashes |
| `auth.css` | **All** CSS color variables for this module (`:root` + `.dark` overrides). Zero colors anywhere else |

---

### 🟩 Data Layer (Single Source of Truth)

| File | Purpose |
|------|---------|
| `types/AuthTypes.ts` | Zod schemas (`loginSchema`, `signupSchema`) and all inferred TypeScript types (`LoginFormValues`, `SignupFormValues`, `AuthUser`). **To change validation rules, only edit this file.** |
| `constants/AuthConstants.ts` | All static/hardcoded data: demo phone numbers and demo password pre-filled in forms. **Tomorrow, when a real API provides defaults, only edit this file.** |

---

### 🟧 State Layer

| File | Purpose |
|------|---------|
| `context/AuthContext.tsx` | React Context Provider. Holds: `jwt`, `user`, `isLoginLoading`, `isSignupLoading`. Exposes `login()` and `signup()` actions (both `useCallback`-memoized). Context value is `useMemo`-memoized. Exposes `useAuth()` hook. **To integrate the real backend API, only edit this file.** |

---

### 🟨 Login View

| File | Purpose |
|------|---------|
| `components/Login/AuthLoginHeader.tsx` | Store logo icon + `<h1>` title + subtitle. Pure presentational, no state |
| `components/Login/AuthLoginForm.tsx` | Phone + password inputs with show/hide toggle. Reads `AUTH_PLACEHOLDERS` from Constants. Calls `login()` from Context |

---

### 🟪 Signup View

| File | Purpose |
|------|---------|
| `components/Signup/AuthSignupHeader.tsx` | Store logo icon + `<h1>` title + subtitle. Pure presentational, no state |
| `components/Signup/AuthSignupForm.tsx` | Shop name + owner name + phone + password inputs. Reads `AUTH_PLACEHOLDERS` from Constants. Calls `signup()` from Context |

---

### 🟫 Shared Components

| File | Purpose |
|------|---------|
| `components/Shared/AuthDemoHint.tsx` | Info banner shown below both login and signup forms. Tells the user any credentials work in demo mode. Pure presentational, no props, no state |

---

## 🗂 Directory Tree

```
app/auth/
├── layout.tsx                        ← CSS import + centering shell
├── loading.tsx                       ← Next.js loading skeleton (auto-shown)
├── error.tsx                         ← Next.js error boundary (auto-shown on crash)
├── auth.css                          ← ALL CSS color variables for this module
├── auth_features.md                  ← (this file)
│
├── login/
│   └── page.tsx                      ← Login entry point (Server Component)
│
├── signup/
│   └── page.tsx                      ← Signup entry point (Server Component)
│
    │  ── DATA LAYER ──────────────────────────────────────────────
    ├── types/
    │   └── AuthTypes.ts              ← Zod schemas + TypeScript types (AuthUser etc.)
    ├── constants/
    │   └── AuthConstants.ts          ← Demo credentials & static placeholder data
    │
    │  ── STATE LAYER ─────────────────────────────────────────────
    ├── context/
    │   └── AuthContext.tsx           ← React Context: jwt, user, login(), signup()
    │
    │  ── COMPONENTS ──────────────────────────────────────────────
    └── components/
        ├── Login/
        │   ├── AuthLoginHeader.tsx   ← Logo + title for login page
        │   └── AuthLoginForm.tsx     ← Phone + password form
        ├── Signup/
        │   ├── AuthSignupHeader.tsx  ← Logo + title for signup page
        │   └── AuthSignupForm.tsx    ← Shop name, owner name, phone, password form
        └── Shared/
            └── AuthDemoHint.tsx      ← Demo mode info banner (shared by both pages)
```

---

## 🛠 Core Features & Workflow

### 1. Login Flow
- User opens `/auth/login` → `loading.tsx` skeleton shows while the Server Component loads.
- `LoginPage` renders `<AuthProvider>` → `<AuthLoginHeader>` + `<AuthLoginForm>` + `<AuthDemoHint>`.
- `AuthLoginForm` reads pre-filled demo values from `AuthConstants.ts`.
- On submit → calls `login()` from `AuthContext` → sets `jwt` + `user` → redirects to `/dashboard`.

### 2. Signup Flow
- User opens `/auth/signup` → `loading.tsx` skeleton shows.
- `SignupPage` renders `<AuthProvider>` → `<AuthSignupHeader>` + `<AuthSignupForm>` + `<AuthDemoHint>`.
- `AuthSignupForm` reads pre-filled demo values from `AuthConstants.ts`.
- On submit → calls `signup()` from `AuthContext` → sets `jwt` + `user` → redirects to `/dashboard`.

### 3. Error Handling
- If any route segment throws a server-side error, Next.js automatically renders `error.tsx`.
- The error boundary logs the error and shows a "Dobara Try Karein" button that calls `reset()`.

---

## 🧠 State Management

```
AuthContext.tsx
├── isLoginLoading: boolean       → shows spinner in AuthLoginForm button
├── isSignupLoading: boolean      → shows spinner in AuthSignupForm button
├── jwt: string | null            → mock token (replace with real JWT from API)
├── user: AuthUser | null         → { phone, name?, shop? } — typed via AuthTypes.ts
├── login(LoginFormValues)        → useCallback-memoized action
└── signup(SignupFormValues)      → useCallback-memoized action

Memoization:
├── login / signup                → useCallback([router]) — stable refs across renders
└── contextValue                  → useMemo([all state + actions]) — consumers only
                                     re-render when actual values change
```

---

## 🎨 Theme Variables (`auth.css`)

| Variable | Usage |
|----------|-------|
| `--auth-card-bg` | Form card background |
| `--auth-muted-bg` | Full-page background |
| `--auth-muted-text` | Placeholder text, secondary labels, back-link |
| `--auth-primary-bg` | Submit button background |
| `--auth-primary-text` | Submit button text |
| `--auth-primary-color` | General primary accent |
| `--auth-border` | Card and input border color |
| `--auth-foreground` | Primary text / labels |
| `--auth-logo-bg` | Logo circle background |
| `--auth-logo-text` | Logo icon color |
| `--auth-link-text` | "Register Karein" / "Login Karein" link color |
| `--auth-back-hover` | "Home pe wapas" hover color |
| `--auth-demo-bg` | Demo hint banner background |
| `--auth-demo-border` | Demo hint banner border |
| `--auth-demo-icon` | Demo hint info icon color |
| `--auth-demo-title` | Demo hint "Demo Mode" title color |

---

## 📌 AI Quick-Reference: Where to Look

| Task | File to Edit |
|------|-------------|
| Change login/signup validation rules (min length etc.) | `types/AuthTypes.ts` |
| Change the pre-filled demo phone/password | `constants/AuthConstants.ts` |
| Integrate real backend API for login | `context/AuthContext.tsx` → `login()` |
| Integrate real backend API for signup | `context/AuthContext.tsx` → `signup()` |
| Add a new field to the user session object | `types/AuthTypes.ts` → `AuthUser` interface |
| Fix login form UI (inputs, button) | `components/Login/AuthLoginForm.tsx` |
| Fix signup form UI (inputs, button) | `components/Signup/AuthSignupForm.tsx` |
| Change the page title / logo on login | `components/Login/AuthLoginHeader.tsx` |
| Change the page title / logo on signup | `components/Signup/AuthSignupHeader.tsx` |
| Change the demo hint banner text | `components/Shared/AuthDemoHint.tsx` |
| Change any color or theme token | `auth.css` |
| Change page centering / outer shell | `layout.tsx` |
| Change the loading skeleton shape | `loading.tsx` |
| Change the error page message or button | `error.tsx` |
