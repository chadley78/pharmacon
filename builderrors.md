```markdown
Okay, based on the final state of the Vercel build errors and our understanding of Next.js 14's requirements for `useSearchParams` and Suspense, here's the right solution broken down into very granular tasks.

**The Core Problem Remaining:**

The Vercel build logs consistently show the error:
`⨯ useSearchParams() should be wrapped in a suspense boundary at page "X". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout`
This error occurs for multiple pages, indicating that components using `useSearchParams()` (or other client-side hooks triggering Client-Side Rendering bailouts) are not correctly managed within Suspense boundaries *at the point where they are rendered by a Server Component (typically the page itself)*.

**The Correct Pattern for Next.js App Router:**

1.  **Identify the Client Component:** The component that *actually* uses `useSearchParams()`, `usePathname()`, `useRouter()` (from `next/navigation`), or causes a CSR bailout must be a Client Component (marked with `'use client'`).
2.  **Server Component Renders Client Component:** The Page file (e.g., `src/app/(main)/products/page.tsx`) should, by default, be a Server Component.
3.  **Wrap in Suspense:** When the Server Component (the Page) renders the Client Component (the one using the hook), *that specific instance* of the Client Component must be wrapped in `<Suspense fallback={...}>`.

**Why previous attempts might have seemed to regress or repeat:**

*   Sometimes, the AI correctly wrapped a client component, but the page itself was *also* a client component due to an earlier refactor. The key is the *transition* from Server Component to Client Component.
*   If a shared component like `Navbar` (which contains `SearchBar` using `useSearchParams`) is used in a layout that wraps many pages, then effectively, that part of the layout becomes dynamic for every page. The `Suspense` boundary around `SearchBar` *within* `Navbar.tsx` helps, but Next.js static generation for the page itself can still complain if the page's direct default export isn't structured to handle this potential dynamic part.

**Granular Tasks to Fix the Build Errors Systematically:**

We will go page by page as listed in the Vercel error log. For each page, we will:
1.  Ensure the page file itself (`page.tsx`) is a Server Component (no `'use client'` at the top, can be `async`).
2.  Identify the immediate child component within that page's render tree that is a Client Component and uses `useSearchParams` (or causes the CSR bailout).
3.  Wrap *that child component* in `<Suspense>` within the page file.
4.  Ensure the child component itself is correctly marked `'use client'`.

Let's assume the `SearchBar` in the `Navbar` is the primary culprit triggering `useSearchParams` indirectly for many pages because the `Navbar` is part of a shared layout. The fix for that was to wrap `SearchBar` in `<Suspense>` *within* `Navbar.tsx`. This is good. However, pages themselves might still be marked as `'use client'` unnecessarily, or they might render other client components that use these hooks directly.

**The Plan:**

We'll list the pages from the Vercel error log and apply the pattern.

---

**Phase: Fix Suspense Boundaries for Vercel Build**

**Starting Point:** The `Navbar` component (`src/components/layout/Navbar.tsx`) *already* has its `SearchBar` wrapped in `<Suspense>`. This is correct and should remain. The issue is likely how pages that *use* this Navbar (via a layout) are structured, or if they render *other* client components that use these hooks.

**General Task Structure for each failing page:**

*   **Task ID: VBF-[PageName]-001**
    *   **Description:** Verify/ensure the page file (`src/app/(group)/[pageName]/page.tsx`) is a Server Component (no `'use client'` at the top). If it currently has `'use client'`, refactor its client-side logic into a new child component (e.g., `[PageName]ClientContent.tsx`).
    *   **File(s) to Create/Modify:** `src/app/(group)/[pageName]/page.tsx`, (potentially new) `src/app/(group)/[pageName]/[PageName]ClientContent.tsx`.
    *   **Test Criteria:** The `page.tsx` file does not have `'use client'` at the top. Any client-side logic is moved to a separate component.

*   **Task ID: VBF-[PageName]-002**
    *   **Description:** In the `page.tsx` file, ensure the main content (which might be the newly created `[PageName]ClientContent.tsx` or an existing client component that uses hooks like `useSearchParams`) is wrapped in `<Suspense fallback={...}>`.
    *   **File(s) to Create/Modify:** `src/app/(group)/[pageName]/page.tsx`.
    *   **Test Criteria:** The client-side portion of the page is wrapped in `<Suspense>`.

---

**Applying to Specific Failing Pages from Vercel Log:**

**(A) Page: `/admin/questionnaires`** (`src/app/(admin)/admin/questionnaires/page.tsx`)

*   **Task ID: VBF-AdminQuestionnaires-001**
    *   **Description:** Verify `src/app/(admin)/admin/questionnaires/page.tsx` is a Server Component. We know `QuestionnaireApprovalActions.tsx` is a Client Component using `useSearchParams`.
    *   **File(s) to Create/Modify:** `src/app/(admin)/admin/questionnaires/page.tsx`.
    *   **Test Criteria:** `page.tsx` is a Server Component (should be `async function` and no `'use client'`).
    *   **Note:** We previously wrapped `QuestionnaireApprovalActions` in Suspense *within* `page.tsx` when it was used inside the map. This structure is likely correct already. This task is to *verify* this pattern is maintained.

**(B) Page: `/account/consultations`** (`src/app/(main)/account/consultations/page.tsx`)

*   **Task ID: VBF-AccountConsultations-001**
    *   **Description:** Ensure `src/app/(main)/account/consultations/page.tsx` is a Server Component. Move its client-side logic (previously in `ConsultationsContent.tsx`, which uses `useRouter` and state, making it a client component) into `ConsultationsClient.tsx` (if not already done) or ensure `ConsultationsContent.tsx` is correctly marked `'use client'`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/consultations/page.tsx`, `src/app/(main)/account/consultations/ConsultationsContent.tsx`.
    *   **Test Criteria:** `page.tsx` is a Server Component. `ConsultationsContent.tsx` is a Client Component.

*   **Task ID: VBF-AccountConsultations-002**
    *   **Description:** In `src/app/(main)/account/consultations/page.tsx`, wrap the rendering of `<ConsultationsContent />` with `<Suspense fallback={...}>`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/consultations/page.tsx`.
    *   **Test Criteria:** `<ConsultationsContent />` is wrapped in `<Suspense>`.

**(C) Page: `/account/orders`** (`src/app/(main)/account/orders/page.tsx`)

*   **Task ID: VBF-AccountOrders-001**
    *   **Description:** Ensure `src/app/(main)/account/orders/page.tsx` is a Server Component. Move its client-side logic (previously in `OrdersContent.tsx`) into `OrdersClient.tsx` or ensure `OrdersContent.tsx` is `'use client'`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/orders/page.tsx`, `src/app/(main)/account/orders/OrdersContent.tsx`.
    *   **Test Criteria:** `page.tsx` is Server. `OrdersContent.tsx` is Client.

*   **Task ID: VBF-AccountOrders-002**
    *   **Description:** In `src/app/(main)/account/orders/page.tsx`, wrap `<OrdersContent />` with `<Suspense fallback={...}>`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/orders/page.tsx`.
    *   **Test Criteria:** `<OrdersContent />` is wrapped.

**(D) Page: `/account`** (`src/app/(main)/account/page.tsx`)

*   **Task ID: VBF-Account-001**
    *   **Description:** Ensure `src/app/(main)/account/page.tsx` is a Server Component. Move its client-side logic (previously in `AccountContent.tsx`) into `AccountClient.tsx` or ensure `AccountContent.tsx` is `'use client'`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/page.tsx`, `src/app/(main)/account/AccountContent.tsx`.
    *   **Test Criteria:** `page.tsx` is Server. `AccountContent.tsx` is Client.

*   **Task ID: VBF-Account-002**
    *   **Description:** In `src/app/(main)/account/page.tsx`, wrap `<AccountContent />` with `<Suspense fallback={...}>`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/page.tsx`.
    *   **Test Criteria:** `<AccountContent />` is wrapped.

**(E) Page: `/account/questionnaires`** (`src/app/(main)/account/questionnaires/page.tsx`)

*   **Task ID: VBF-AccountQuestionnaires-001**
    *   **Description:** Ensure `src/app/(main)/account/questionnaires/page.tsx` is a Server Component. Move its client-side logic (previously in `QuestionnairesContent.tsx`) into `QuestionnairesClient.tsx` or ensure `QuestionnairesContent.tsx` is `'use client'`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/questionnaires/page.tsx`, `src/app/(main)/account/questionnaires/QuestionnairesContent.tsx`.
    *   **Test Criteria:** `page.tsx` is Server. `QuestionnairesContent.tsx` is Client.

*   **Task ID: VBF-AccountQuestionnaires-002**
    *   **Description:** In `src/app/(main)/account/questionnaires/page.tsx`, wrap `<QuestionnairesContent />` with `<Suspense fallback={...}>`.
    *   **File(s) to Create/Modify:** `src/app/(main)/account/questionnaires/page.tsx`.
    *   **Test Criteria:** `<QuestionnairesContent />` is wrapped.

**(F) Page: `/cart`** (`src/app/(main