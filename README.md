# Login + MFA Demo

Frontend authentication exercise: login, mock MFA, form validation, and role-based access control. There is no backend; users, passwords, and the MFA code live in the client.

## Technologies

- React 19
- Vite
- React Router
- Ant Design
- Vitest and Testing Library

## Setup

Requires Node.js 18 or later.

```bash
git clone <repository-url>
cd login-app
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The app starts at `/login`.

Other commands:

```bash
npm test          # run the test suite once
npm run test:watch
npm run build
npm run preview   # serve the production build
```

## Mock users and roles

| Email | Password | Role | Dashboard access |
| --- | --- | --- | --- |
| `reader@example.com` | `password123` | read-only | Edit / Delete disabled; Create hidden |
| `editor@example.com` | `password123` | read-write | Create / Edit / Delete enabled |

Mock MFA code: **`121316`** (also shown on the MFA screen).

Sign up is a separate screen only. It does not create accounts; use the demo users above.

## How to test the login / MFA flow

### Manual

1. Open `/login`.
2. Submit empty fields — you should see “Email is required” and “Password is required”.
3. Enter an unknown email with `password123` — you should see “Invalid Email or Password” and stay on login.
4. Sign in as `reader@example.com` / `password123`. You should land on MFA, not the dashboard.
5. Enter `000000` — you should see “Invalid verification code”.
6. Enter `121316`. You should reach the protected dashboard as a read-only user (Edit/Delete disabled).
7. Sign out. Repeat with `editor@example.com` / `password123` and the same MFA code. Create / Edit / Delete should be enabled.
8. Use **Create an account** to open `/signup`, then return to sign in.

Clicking **Back to login** on MFA clears the pending session and returns you to `/login`.

### Automated

```bash
npm test
```

The suite covers field validation, invalid credentials, the login → MFA → dashboard path, route guards, and read-only vs read-write actions.

## Design decisions and assumptions

- **Client-only auth.** The brief does not require a backend, so credentials and MFA are mocked in `src/auth/mockUser.js` and session state lives in React context.
- **Two-step session.** Successful login sets `pendingUser`. MFA must succeed before `user` is set. The dashboard requires `user`, so a password alone is not enough.
- **Route guards.** `GuestRoute`, `MfaRoute`, and `ProtectedRoute` keep login, MFA, and the dashboard aligned with that session state. In-app navigation to `/login` during MFA pending returns you to `/mfa`.
- **In-memory session.** Auth is not written to `sessionStorage` or `localStorage`. That matches a frontend mock and avoids implying a real persisted session. A full page reload returns you to login.
- **RBAC in the UI.** `useRoleAccess` drives whether Create / Edit / Delete are shown or enabled. A real API would still need to enforce this on the server.
- **Ant Design for forms.** Field-level validation (required, email format, password length, 6-digit MFA) is handled with Ant Design `rules` so error messages sit next to the inputs.
- **Modular layout.** Shared chrome is in `AuthPageLayout`; documents and role tags are separate components so pages stay thin.
- **Sign up is navigation only.** The assignment asks for a separate sign-up screen, not full registration.

## Known limitations

- Passwords and the MFA code are in the client bundle. This is not secure and is only for the demo.
- Refreshing or typing a new URL remounts the app and clears the session.
- Create / Edit / Delete do not save data; they exist to show role differences.
- Sign up does not create a user.
- MFA is a single shared mock code, not a per-user or time-based code.
- There is no password reset, lockout, or remember-me behavior.
