# O/L Learning Hub

An O/L exam prep platform for Mathematics, Science and IT — past papers, model
papers and interactive quizzes, all with full answers and worked explanations.
Built with Angular (standalone components) and Firebase (Firestore + Storage).

## What's included

- **Public site**: Home → subject pages (Mathematics / Science / IT), each with
  tabs for Past Papers, Model Papers and Quizzes. Papers expand to show the
  question paper, answers, and a written solution method. Quizzes are fully
  interactive — pick an answer per question, submit, and see a score plus a
  right/wrong breakdown with an explanation for every question.
- **Admin panel** (`/admin-login`, passcode-gated): add past/model papers
  (a link to the question paper + optional answers link + a written solution),
  and build
  quizzes with a dynamic question editor (question text, 4 options, correct
  answer, explanation). Full edit/delete with a confirmation dialog.
- Real-time sync via Firestore — anything an admin adds/edits appears for
  every visitor within a second or two, no refresh needed.

## 1. Set up Firebase (required)

This project runs entirely on Firebase's **free Spark plan** — no billing
account, no card, no cost. It uses Firestore only; PDFs are not uploaded
through the site. Instead, the admin uploads a paper to Google Drive or
Dropbox, sets it to "Anyone with the link can view," and pastes that link
into the admin panel. (Firebase Storage was deliberately left out — as of
2024/2025 it requires the paid Blaze plan even for small usage, which this
setup avoids entirely.)

1. Go to https://console.firebase.google.com → create a free project.
2. **Build → Firestore Database → Create database** → start in test mode.
3. **Project settings → General → Your apps →** click the web icon (`</>`)
   → register an app → copy the `firebaseConfig` object.
4. Paste those values into
   `src/app/core/services/firebase.service.ts` (replace the `PASTE_YOUR_...`
   placeholders).
5. Firestore → Rules → paste (use this instead of the default rule, which
   expires after 30 days):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /ol_platform_papers/{doc=**} { allow read, write: if true; }
       match /ol_platform_quizzes/{doc=**} { allow read, write: if true; }
       match /ol_platform_special_questions/{doc=**} { allow read, write: if true; }
       match /ol_platform_users/{doc=**} { allow read, write: if true; }
     }
   }
   ```
   (This rule is open — fine for a small study site, not for anything
   sensitive. Nothing outside these collections is exposed. **See the
   "Known limitation" note below about `ol_platform_users` specifically.**)
6. **Build → Authentication → Get started → Sign-in method** → enable
   **Email/Password**. This powers student sign up/login.

## Student login & manual payment approval

- Anyone can create an account at `/signup`. Their account is created but
  **locked** (`isPaid: false`) until an admin approves it.
- After signup they see your payment instructions (bank transfer / PayHere
  link / WhatsApp — configure these in
  `src/app/core/config/payment-info.ts`).
- Once they've paid outside the app, go to **Admin → Manage Users**, find
  their email, and click **"Approve access."** Their session unlocks
  automatically within a second or two — they don't need to log out/in again.
- `/subject/:subject` and `/quiz/:id` (i.e. papers, quizzes, special
  questions) all require login + approval. The home page itself stays public
  so visitors can see what's on offer before signing up.

### ⚠️ Known limitation — please read

Because there's no paid backend (Cloud Functions require the Blaze plan,
which this setup deliberately avoids), the `ol_platform_users` collection
uses the same open rule as everything else. In practice that means:

- A technically savvy student *could* open their browser's developer console
  and call the Firestore SDK directly to set their own `isPaid` to `true`,
  bypassing payment entirely.
- Anyone could also read the full list of registered emails.

For a small tuition-class-style audience this is a reasonable, low risk to
accept — most people won't do this. But if the platform grows and this
becomes a real concern, the proper fix is having the **admin** also
authenticate via Firebase Auth (a dedicated admin account) and tightening
the rules so only that identity can write `isPaid`. That's a further,
slightly bigger change — ask if you'd like it built.

## 2. Change the admin passcode

Open `src/app/core/services/auth.service.ts` and change:
```ts
const ADMIN_PASSWORD = 'OLHUB2026';
```
This is a basic client-side gate, not full authentication — enough to keep
casual visitors out of the admin panel, not a substitute for real auth.

## 3. Run locally

```bash
npm install
npm start
```
Opens at http://localhost:4200

## 4. Deploy to Netlify

**Option A — drag and drop (fastest):**
```bash
npm run build -- --configuration production
```
Then drag the folder `dist/ol-edu-platform/browser` onto
https://app.netlify.com/drop

**Option B — connect your Git repo:**
Push this project to GitHub/GitLab, then in Netlify: **Add new site → Import
an existing project**, and set:
- Build command: `npm run build -- --configuration production`
- Publish directory: `dist/ol-edu-platform/browser`

`netlify.toml` in this repo already has these settings, plus the redirect
rule Angular's router needs (`/*` → `/index.html`) so refreshing a page like
`/subject/Mathematics` doesn't 404.

## Project structure

```
src/app/
  core/
    models/        Paper, Quiz, QuizQuestion interfaces
    services/       Firebase init, auth, papers, quizzes, toast, confirm dialog
  shared/components/  header, footer, toast, confirm modal
  features/
    home/                  landing page with 3 subject cards
    subject/               subject page — Past Papers / Model Papers / Quizzes tabs
    quiz-take/             interactive quiz runner
    admin/
      admin-login/          passcode gate
      admin-dashboard/      stats + nav
      manage-papers/        upload/edit/delete papers
      manage-quizzes/       build/edit/delete quizzes
```
