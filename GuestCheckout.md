

**Assumptions:**

*   You are using Zustand for client-side cart management as previously discussed (Task P4-002).
*   Products requiring prescriptions (`category = 'questionnaire_prescription'` or `category = 'doctor_consultation'`) are already handled to prevent adding to cart without necessary approvals/login. We will *not* touch this logic for now.
*   The current checkout flow likely forces login before proceeding past the cart page.

---

## Guest Checkout Implementation: Granular Step-by-Step Plan

### Phase GC1: Cart System Modifications for Guest Users

*This phase focuses on allowing guests to use the shopping cart and persisting it locally.*

*   **Task ID: GC1-001: Modify Zustand Cart Store for Local Storage Persistence**
    *   **Description:** Update the Zustand cart store (`stores/cartStore.ts` or similar) to use Zustand's `persist` middleware to save the cart state to `localStorage`.
    *   **File(s) to Create/Modify:** `stores/cartStore.ts`.
    *   **Test Criteria:**
        1.  As a guest (not logged in), add an item to the cart.
        2.  Refresh the page.
        3.  The item should still be in the cart (visible in UI and cart count).
        4.  Check browser's `localStorage` to see a key (e.g., `cart-storage`) with cart data.
    *   **Depends On:** P4-002 (Existing Zustand cart store).
    *   **AI Note:** The `persist` middleware should be configured to only store essential cart item data (e.g., `productId`, `quantity`, `priceAtPurchase`, potentially `approvalId` if applicable for *non-prescription* items that had some pre-check).

*   **Task ID: GC1-002: Ensure Cart Add/Update/Remove Works for Guests**
    *   **Description:** Verify that all existing cart functionalities (add item, update quantity, remove item) work correctly for a guest user using the `localStorage` persisted cart.
    *   **File(s) to Create/Modify:** Primarily testing existing components like `app/(main)/products/[slug]/page.tsx` (Add to Cart button) and `app/(main)/cart/page.tsx`. No direct code changes expected unless bugs are found.
    *   **Test Criteria:**
        1.  Guest can add multiple different products to the cart.
        2.  Guest can update quantities of items in the cart.
        3.  Guest can remove items from the cart.
        4.  All changes persist on page refresh.
    *   **Depends On:** GC1-001.

*   **Task ID: GC1-003: Cart Merging Strategy - Placeholder Function**
    *   **Description:** In the Zustand cart store, create a placeholder function `mergeGuestCartWithUserCart(userId: string)` that currently does nothing but logs that it would merge carts. This function will be called upon user login/signup.
    *   **File(s) to Create/Modify:** `stores/cartStore.ts`.
    *   **Test Criteria:** The function `mergeGuestCartWithUserCart` exists in the store. Calling it logs a message to the console.
    *   **Depends On:** GC1-001.
    *   **AI Note:** The actual merging logic is complex and deferred. For now, we just need the hook point.

*   **Task ID: GC1-004: Call Merge Cart Function on Login/Signup**
    *   **Description:** Modify the existing login and signup success handlers (e.g., in `components/auth/LoginForm.tsx`, `SignupForm.tsx` or where Supabase `onAuthStateChange` is handled for login/signup events) to call the `mergeGuestCartWithUserCart` function from the Zustand store *after* a user successfully logs in or signs up. Pass the `user.id`.
    *   **File(s) to Create/Modify:** `components/auth/LoginForm.tsx`, `components/auth/SignupForm.tsx` (or central auth handler).
    *   **Test Criteria:**
        1.  As a guest, add items to the cart.
        2.  Log in or sign up.
        3.  The console should show the log message from `mergeGuestCartWithUserCart`, including the user ID. The cart state itself won't change yet.
    *   **Depends On:** GC1-003, P2-005, P2-007.

*   **Task ID: GC1-005: Clear Local Cart After Successful Merge (Placeholder)**
    *   **Description:** Modify the `mergeGuestCartWithUserCart` function. After the (placeholder) merge logic, it should clear the `localStorage` cart (e.g., by resetting the Zustand store to its initial empty state, which `persist` should then reflect in `localStorage`).
    *   **File(s) to Create/Modify:** `stores/cartStore.ts`.
    *   **Test Criteria:**
        1.  As a guest, add items to the cart.
        2.  Log in or sign up.
        3.  The console log for merging appears.
        4.  The cart (UI and `localStorage`) becomes empty. (This is temporary; real merge will populate it).
    *   **Depends On:** GC1-004.

---

### Phase GC2: Checkout Flow Updates for Guest Users

*This phase allows guests to reach and use the checkout form.*

*   **Task ID: GC2-001: Allow Guests to Access Checkout Page**
    *   **Description:** Review the current checkout page (`app/(main)/checkout/page.tsx`) and any route guards or redirects. Modify them to allow unauthenticated (guest) users to access the checkout page *if their cart is not empty and contains only guest-purchasable items*.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx`, potentially `middleware.ts` if it has strict auth guards for checkout.
    *   **Test Criteria:**
        1.  As a guest with eligible items in the cart, navigating to `/checkout` (e.g., from the cart page) is successful.
        2.  As a guest with an empty cart, attempting to navigate to `/checkout` should redirect (e.g., to cart page or products page).
        3.  (Important) As a guest, if the cart *only* contains prescription items, they should *not* be able to proceed to checkout (this logic might already exist or needs to be reinforced on the cart page).
    *   **Depends On:** GC1-002, P5-008.

*   **Task ID: GC2-002: Guest Checkout Form - Email Field**
    *   **Description:** On the checkout page (`app/(main)/checkout/page.tsx`), if the user is a guest, display an "Email address" input field. This will be the primary identifier for the guest order.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx` (or a child form component like `ShippingForm.tsx`).
    *   **Test Criteria:**
        1.  When a logged-in user visits checkout, the email field is not shown (or pre-filled and read-only).
        2.  When a guest user visits checkout, an email input field is visible and editable.
    *   **Depends On:** GC2-001.

*   **Task ID: GC2-003: Guest Checkout Form - Shipping & Billing Information**
    *   **Description:** Ensure the existing shipping and billing address forms on the checkout page are usable by guest users. The data entered will be collected along with their email.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx` (or `ShippingForm.tsx`, `BillingForm.tsx`). No major changes expected unless forms are currently tied to user profiles.
    *   **Test Criteria:** A guest user can fill out shipping and billing address details on the checkout page.
    *   **Depends On:** GC2-002.

*   **Task ID: GC2-004: "Create an Account?" Option (UI Only)**
    *   **Description:** On the checkout page, for guest users, display a checkbox or a small section with text like "Want to create an account to save your details for next time?" and a password input field. For MVP, this will just be a UI element; functionality is deferred.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx`.
    *   **Test Criteria:**
        1.  Guests see the "Create an account?" checkbox/option and a password field (initially hidden or shown upon checking the box).
        2.  Logged-in users do not see this option.
    *   **Depends On:** GC2-003.

*   **Task ID: GC2-005: Modify `/api/create-payment-intent` for Guests**
    *   **Description:** Update the `/api/create-payment-intent/route.ts` API route handler:
        1.  If the request comes from an authenticated user, proceed as before (linking order to `user_id`).
        2.  If the request comes from a guest, it must include the guest's email (and other checkout details). The order created in Supabase will initially have a `NULL` `user_id` but will store the guest's email in a new dedicated column (to be added in DB schema phase).
    *   **File(s) to Create/Modify:** `app/api/create-payment-intent/route.ts`.
    *   **Test Criteria:**
        1.  When a guest submits the checkout form data (including email) to this API:
            *   An `orders` record is created in Supabase with `user_id = NULL` and the guest's email (test this after DB change).
            *   A Stripe PaymentIntent is created.
            *   The API returns a `client_secret`.
        2.  Authenticated user checkout still works as before.
    *   **Depends On:** GC2-003, P5-010. (DB schema change for guest email on orders is pending).

*   **Task ID: GC2-006: Frontend Guest Checkout Submission**
    *   **Description:** Update the frontend checkout form submission logic (`components/checkout/CheckoutForm.tsx` or similar) to:
        1.  If user is a guest, include the guest's email (and collected shipping/billing info) in the payload to `/api/create-payment-intent`.
        2.  Proceed with Stripe payment confirmation as usual.
    *   **File(s) to Create/Modify:** `components/checkout/CheckoutForm.tsx` (or main checkout page client component).
    *   **Test Criteria:** A guest can complete the checkout form, the `/api/create-payment-intent` is called with guest email, and they can proceed to the Stripe payment step.
    *   **Depends On:** GC2-005, P5-013.

*   **Task ID: GC2-007: Guest Order Success Page**
    *   **Description:** Ensure the order success page (`app/(main)/checkout/success/page.tsx`) can display a generic success message for guest users (e.g., "Your order has been placed! A confirmation will be sent to your_guest_email@example.com").
    *   **File(s) to Create/Modify:** `app/(main)/checkout/success/page.tsx`.
    *   **Test Criteria:** After a successful guest payment, the success page displays an appropriate message including the guest's email (passed via state or query param after payment).
    *   **Depends On:** GC2-006, P5-014.

*   **Task ID: GC2-008: Clear Local Cart After Guest Order Success**
    *   **Description:** After a successful guest payment and redirection to the success page, clear the cart from Zustand store / `localStorage`.
    *   **File(s) to Create/Modify:** `components/checkout/CheckoutForm.tsx` (or where payment confirmation redirect happens), `stores/cartStore.ts`.
    *   **Test Criteria:** Guest's cart is empty (UI and `localStorage`) after a successful order.
    *   **Depends On:** GC2-007, P5-017.

---

### Phase GC3: Database Schema Modifications for Guest Orders

*This phase adds DB support for guest orders.*

*   **Task ID: GC3-001: Add `guest_email` Column to `orders` Table**
    *   **Description:** Add a nullable `guest_email` (TEXT) column to the `orders` table in Supabase. This column will store the email address for orders placed by guests.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.orders
        ADD COLUMN guest_email TEXT;
        ```
    *   **Test Criteria:** The `orders` table has a new `guest_email` column.
    *   **Depends On:** P5-004.

*   **Task ID: GC3-002: Modify `user_id` in `orders` Table to be Nullable**
    *   **Description:** Ensure the `user_id` column in the `orders` table is nullable (it likely already is if it's a standard FK that doesn't have `NOT NULL`). If it has a `NOT NULL` constraint, remove it.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        -- Only if user_id currently has a NOT NULL constraint
        -- ALTER TABLE public.orders
        -- ALTER COLUMN user_id DROP NOT NULL;
        ```
    *   **Test Criteria:** The `user_id` column in the `orders` table allows NULL values.
    *   **Depends On:** P5-004.

*   **Task ID: GC3-003: Update RLS on `orders` for Guest Order Retrieval (Admin Only)**
    *   **Description:** Review RLS policies on the `orders` table. Guest users cannot view their past orders directly (as they have no account). Admins, however, should be able to see orders, including guest orders (perhaps filtered by `guest_email`). For MVP, ensure existing admin policies (if any) don't break. Specific guest order lookup by guest is out of MVP scope.
    *   **File(s) to Create/Modify:** Supabase SQL Editor (review RLS).
    *   **Test Criteria:** Existing admin functionality for viewing orders is not broken by the schema changes. Guest orders are visible to admins.
    *   **Depends On:** GC3-001, GC3-002, P5-006.

---

### Phase GC4: Linking Guest Orders to Accounts (Post-Signup/Login) - Deferred

*This phase is more complex and involves linking past guest orders to a newly created or logged-in user account. For MVP, we're deferring the actual data linking but have the placeholder from GC1-003.*

*   **Task ID: GC4-001: (Placeholder - Future) Implement Logic for `mergeGuestCartWithUserCart`**
    *   **Description:** (This is a larger future task, not for initial guest checkout MVP) Design and implement the actual logic within `mergeGuestCartWithUserCart` to:
        1.  Fetch any existing cart for the `userId` from the database (if you implement server-side carts).
        2.  Merge items from the guest's `localStorage` cart with the user's database cart (handle duplicates, update quantities).
        3.  Save the merged cart to the database for the user.
        4.  Update the client-side Zustand store with the merged cart.
    *   **File(s) to Create/Modify:** `stores/cartStore.ts`, potentially new API routes for cart management.
    *   **Test Criteria:** (Future) When a guest with items logs in/signs up, their local cart items are merged with any existing server-side cart for that user.
    *   **Depends On:** GC1-005.

*   **Task ID: GC4-002: (Placeholder - Future) Implement Logic to Link Past Guest Orders**
    *   **Description:** (This is a larger future task) Upon account creation (especially if the "Create Account" option during guest checkout is used with the same email), or upon first login with an email that matches `guest_email` on past orders:
        1.  Find `orders` in the database where `guest_email` matches the user's email and `user_id` is `NULL`.
        2.  Update these orders to set their `user_id` to the current user's ID.
    *   **File(s) to Create/Modify:** Supabase Edge Function or API route triggered on signup/login.
    *   **Test Criteria:** (Future) Past orders made by a guest using a specific email are associated with their account after they sign up/log in with that email.
    *   **Depends On:** GC2-004 (full implementation), GC3-001.

---