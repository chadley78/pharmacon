

**Key for Task Fields:**
*   **Task ID:** Unique identifier.
*   **Description:** What needs to be done.
*   **File(s) to Create/Modify:** Main files involved.
*   **Test Criteria:** How to verify the task is complete.
*   **Depends On:** Task IDs that must be completed first.

---

## MVP Build Plan: E-Commerce Pharmacy

### Phase 1: Project Setup & Core Supabase Integration

*   **Task ID: P1-001**
    *   **Description:** Initialize a new Next.js (App Router) project using `create-next-app`.
    *   **File(s) to Create/Modify:** Entire project directory.
    *   **Test Criteria:** Able to run `npm run dev` and see the default Next.js page.
    *   **Depends On:** None.

*   **Task ID: P1-002**
    *   **Description:** Create a new project in Supabase.
    *   **File(s) to Create/Modify:** N/A (Supabase Dashboard).
    *   **Test Criteria:** Supabase project dashboard is accessible. Project URL and `anon` key are available.
    *   **Depends On:** None.

*   **Task ID: P1-003**
    *   **Description:** Install Supabase client libraries: `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs`.
    *   **File(s) to Create/Modify:** `package.json`.
    *   **Test Criteria:** Libraries are listed in `package.json` and `node_modules`.
    *   **Depends On:** P1-001.

*   **Task ID: P1-004**
    *   **Description:** Create `.env.local` file and add Supabase URL and Anon Key (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    *   **File(s) to Create/Modify:** `.env.local`.
    *   **Test Criteria:** Variables are present in the file.
    *   **Depends On:** P1-002.

*   **Task ID: P1-005**
    *   **Description:** Create Supabase client for client-side usage.
    *   **File(s) to Create/Modify:** `lib/supabase/client.ts`.
    *   **Test Criteria:** `createBrowserClient` from `@supabase/ssr` (or `createClient` from `@supabase/supabase-js` if not using SSR helpers initially for simplicity, then refactor) is initialized with environment variables. No runtime errors on import.
    *   **Depends On:** P1-003, P1-004.

*   **Task ID: P1-006**
    *   **Description:** Create Supabase client for server-side usage (Route Handlers, Server Components).
    *   **File(s) to Create/Modify:** `lib/supabase/server.ts`.
    *   **Test Criteria:** `createServerClient` from `@supabase/ssr` is initialized. No runtime errors on import.
    *   **Depends On:** P1-003, P1-004. (Note: For full SSR helper usage, middleware setup will be needed later.)

*   **Task ID: P1-007**
    *   **Description:** Create the `profiles` table in Supabase. Fields: `id` (UUID, references `auth.users.id`, PK), `full_name` (TEXT), `created_at` (TIMESTAMPTZ).
    *   **File(s) to Create/Modify:** Supabase SQL Editor or Table Editor.
    *   **Test Criteria:** `profiles` table exists in Supabase schema with specified columns and primary key linked to `auth.users`.
    *   **Depends On:** P1-002.

*   **Task ID: P1-008**
    *   **Description:** Create a Supabase database function to automatically create a profile when a new user signs up.
    *   **File(s) to Create/Modify:** Supabase SQL Editor (for trigger and function).
        ```sql
        -- Function to create a profile for a new user
        create function public.handle_new_user()
        returns trigger
        language plpgsql
        security definer set search_path = public
        as $$
        begin
          insert into public.profiles (id, full_name) -- Add other default fields if necessary
          values (new.id, new.raw_user_meta_data->>'full_name'); -- Assuming full_name is passed in metadata
          return new;
        end;
        $$;

        -- Trigger to call the function after a new user is inserted into auth.users
        create trigger on_auth_user_created
          after insert on auth.users
          for each row execute procedure public.handle_new_user();
        ```
    *   **Test Criteria:** Trigger and function are created in Supabase. (Manual test after signup is implemented).
    *   **Depends On:** P1-007.

*   **Task ID: P1-009**
    *   **Description:** Enable Row Level Security (RLS) on the `profiles` table.
    *   **File(s) to Create/Modify:** Supabase SQL Editor or Table Editor.
    *   **Test Criteria:** RLS is enabled for the `profiles` table.
    *   **Depends On:** P1-007.

*   **Task ID: P1-010**
    *   **Description:** Create RLS policy for `profiles`: Users can view their own profile.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        CREATE POLICY "Users can view their own profile."
        ON public.profiles FOR SELECT
        USING ( auth.uid() = id );
        ```
    *   **Test Criteria:** Policy is created. (Tested after auth implementation).
    *   **Depends On:** P1-009.

*   **Task ID: P1-011**
    *   **Description:** Create RLS policy for `profiles`: Users can update their own profile.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        CREATE POLICY "Users can update their own profile."
        ON public.profiles FOR UPDATE
        USING ( auth.uid() = id );
        ```
    *   **Test Criteria:** Policy is created. (Tested after auth implementation).
    *   **Depends On:** P1-009.

### Phase 2: User Authentication

*   **Task ID: P2-001**
    *   **Description:** Create a basic root layout file.
    *   **File(s) to Create/Modify:** `app/layout.tsx`.
    *   **Test Criteria:** A simple HTML structure (html, body tags) is present. App still runs.
    *   **Depends On:** P1-001.

*   **Task ID: P2-002**
    *   **Description:** Create a basic Navbar component (placeholder, no links yet).
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`.
    *   **Test Criteria:** Component renders a simple div with "Navbar".
    *   **Depends On:** P1-001.

*   **Task ID: P2-003**
    *   **Description:** Add Navbar to the main application layout.
    *   **File(s) to Create/Modify:** `app/(main)/layout.tsx` (create if not existing, wrap children).
    *   **Test Criteria:** "Navbar" text appears on the homepage (`app/page.tsx`).
    *   **Depends On:** P2-001, P2-002.

*   **Task ID: P2-004**
    *   **Description:** Create Signup page UI.
    *   **File(s) to Create/Modify:** `app/(auth)/signup/page.tsx`, `components/auth/SignupForm.tsx`.
    *   **Test Criteria:** Page renders with email, password, and full name input fields and a submit button. No functionality yet.
    *   **Depends On:** P1-001.

*   **Task ID: P2-005**
    *   **Description:** Implement client-side Signup functionality.
    *   **File(s) to Create/Modify:** `components/auth/SignupForm.tsx`.
    *   **Test Criteria:** User can enter details, click submit. A new user is created in `auth.users` in Supabase. Profile is created in `profiles` table (verify P1-008). User is redirected to a success page or homepage.
    *   **Depends On:** P1-005, P1-008, P2-004. (Ensure `full_name` is passed in `options.data` for the trigger P1-008).

*   **Task ID: P2-006**
    *   **Description:** Create Login page UI.
    *   **File(s) to Create/Modify:** `app/(auth)/login/page.tsx`, `components/auth/LoginForm.tsx`.
    *   **Test Criteria:** Page renders with email and password input fields and a submit button. No functionality yet.
    *   **Depends On:** P1-001.

*   **Task ID: P2-007**
    *   **Description:** Implement client-side Login functionality.
    *   **File(s) to Create/Modify:** `components/auth/LoginForm.tsx`.
    *   **Test Criteria:** Existing user can log in. User is redirected to homepage.
    *   **Depends On:** P1-005, P2-006.

*   **Task ID: P2-008**
    *   **Description:** Implement Logout functionality (simple button in Navbar for now).
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`.
    *   **Test Criteria:** Logged-in user clicks "Logout", session is cleared, user is effectively logged out (e.g., redirected to login or state changes).
    *   **Depends On:** P1-005, P2-003, P2-007.

*   **Task ID: P2-009**
    *   **Description:** Conditionally show Login/Signup or Logout/Account links in Navbar based on auth state.
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`.
    *   **Test Criteria:** Navbar displays correct links depending on whether a user is logged in or not. (Use Supabase `onAuthStateChange` or a hook wrapping it).
    *   **Depends On:** P2-008.

*   **Task ID: P2-010**
    *   **Description:** Set up middleware for Supabase SSR auth helpers to manage session cookies.
    *   **File(s) to Create/Modify:** `middleware.ts` (at the root of the project or inside `src/` if you use it).
    *   **Test Criteria:** User session persists across page reloads and navigation. Server Components can access user session.
    *   **Depends On:** P1-003 (`@supabase/auth-helpers-nextjs` or `@supabase/ssr`).

### Phase 3: Product Display (Type A - Direct Purchase)

*   **Task ID: P3-001**
    *   **Description:** Create `products` table in Supabase. MVP fields: `id` (UUID, PK), `name` (TEXT), `slug` (TEXT, UNIQUE), `description` (TEXT), `price` (DECIMAL), `image_url` (TEXT), `category` (ENUM: 'direct_purchase', 'doctor_consultation', 'questionnaire_prescription'), `is_active` (BOOLEAN).
    *   **File(s) to Create/Modify:** Supabase SQL Editor or Table Editor.
    *   **Test Criteria:** `products` table exists with specified columns.
    *   **Depends On:** P1-002.

*   **Task ID: P3-002**
    *   **Description:** Add RLS policy: Allow public read access to active products.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public can read active products."
        ON public.products FOR SELECT
        USING ( is_active = TRUE );
        ```
    *   **Test Criteria:** Policy created. Unauthenticated users can fetch active products (tested later).
    *   **Depends On:** P3-001.

*   **Task ID: P3-003**
    *   **Description:** Manually insert 2-3 sample 'direct_purchase' products into the `products` table via Supabase UI.
    *   **File(s) to Create/Modify:** N/A (Supabase Table Editor).
    *   **Test Criteria:** Sample products exist in the table with `category = 'direct_purchase'` and `is_active = TRUE`.
    *   **Depends On:** P3-001.

*   **Task ID: P3-004**
    *   **Description:** Create a Product List page that fetches and displays all active 'direct_purchase' products.
    *   **File(s) to Create/Modify:** `app/(main)/products/page.tsx`.
    *   **Test Criteria:** Page renders a list of product names and prices fetched from Supabase. Use Server Component for data fetching.
    *   **Depends On:** P1-006, P3-002, P3-003.

*   **Task ID: P3-005**
    *   **Description:** Create a basic Product Card component.
    *   **File(s) to Create/Modify:** `components/products/ProductCard.tsx`.
    *   **Test Criteria:** Component takes product data as props and displays name, image (placeholder if `image_url` is null), and price.
    *   **Depends On:** P1-001.

*   **Task ID: P3-006**
    *   **Description:** Use `ProductCard` component in the Product List page.
    *   **File(s) to Create/Modify:** `app/(main)/products/page.tsx`.
    *   **Test Criteria:** Product List page displays products using the `ProductCard` component.
    *   **Depends On:** P3-004, P3-005.

*   **Task ID: P3-007**
    *   **Description:** Create dynamic route for single product page `app/(main)/products/[slug]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** Navigating to `/products/your-product-slug` attempts to render this page.
    *   **Depends On:** P1-001.

*   **Task ID: P3-008**
    *   **Description:** Fetch and display single product details on `products/[slug]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** Page displays name, description, price, image of the product matching the slug. Use Server Component. If product category is 'direct_purchase', show an "Add to Cart" button (no functionality yet).
    *   **Depends On:** P1-006, P3-003, P3-007.

### Phase 4: Shopping Cart (Client-Side State - Zustand)

*   **Task ID: P4-001**
    *   **Description:** Install Zustand for client-side state management.
    *   **File(s) to Create/Modify:** `package.json`.
    *   **Test Criteria:** Zustand is listed in `package.json`.
    *   **Depends On:** P1-001.

*   **Task ID: P4-002**
    *   **Description:** Create a Zustand store for the cart (`useCartStore`). Initial state: `items: []`. Basic actions: `addItem`.
    *   **File(s) to Create/Modify:** `stores/cartStore.ts` (or `hooks/useCartStore.ts`).
    *   **Test Criteria:** Store can be imported and `addItem` action exists.
    *   **Depends On:** P4-001.

*   **Task ID: P4-003**
    *   **Description:** Implement "Add to Cart" button functionality on the single product page for 'direct_purchase' products.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx` (button will be in a client component), `stores/cartStore.ts`.
    *   **Test Criteria:** Clicking "Add to Cart" adds the product (ID, name, price, quantity: 1) to the Zustand cart store. Verify with React DevTools or logging.
    *   **Depends On:** P3-008, P4-002.

*   **Task ID: P4-004**
    *   **Description:** Display cart item count in Navbar.
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`, `stores/cartStore.ts`.
    *   **Test Criteria:** Navbar shows the correct number of unique items (or total quantity) in the cart, updating dynamically.
    *   **Depends On:** P2-009, P4-002.

*   **Task ID: P4-005**
    *   **Description:** Create Cart page UI `app/(main)/cart/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/cart/page.tsx`.
    *   **Test Criteria:** Page renders, ready to display cart items.
    *   **Depends On:** P1-001.

*   **Task ID: P4-006**
    *   **Description:** Display cart items on the Cart page from Zustand store.
    *   **File(s) to Create/Modify:** `app/(main)/cart/page.tsx`, `stores/cartStore.ts`.
    *   **Test Criteria:** Items added to the cart are listed on this page with name, price, quantity.
    *   **Depends On:** P4-003, P4-005.

*   **Task ID: P4-007**
    *   **Description:** Implement "Remove from Cart" functionality on Cart page.
    *   **File(s) to Create/Modify:** `app/(main)/cart/page.tsx`, `stores/cartStore.ts` (add `removeItem` action).
    *   **Test Criteria:** Clicking "Remove" next to an item removes it from the cart display and Zustand store.
    *   **Depends On:** P4-006.

*   **Task ID: P4-008**
    *   **Description:** Implement "Update Quantity" functionality on Cart page.
    *   **File(s) to Create/Modify:** `app/(main)/cart/page.tsx`, `stores/cartStore.ts` (add `updateQuantity` action).
    *   **Test Criteria:** Changing item quantity updates its display and the Zustand store.
    *   **Depends On:** P4-006.

*   **Task ID: P4-009**
    *   **Description:** Display cart total on Cart page.
    *   **File(s) to Create/Modify:** `app/(main)/cart/page.tsx`, `stores/cartStore.ts` (add a selector or derived state for total).
    *   **Test Criteria:** Correct total price is calculated and displayed.
    *   **Depends On:** P4-006.

### Phase 5: Checkout & Stripe Integration (Type A Products)

*   **Task ID: P5-001**
    *   **Description:** Install Stripe libraries: `stripe` (server-side) and `@stripe/stripe-js` (client-side).
    *   **File(s) to Create/Modify:** `package.json`.
    *   **Test Criteria:** Libraries are in `package.json`.
    *   **Depends On:** P1-001.

*   **Task ID: P5-002**
    *   **Description:** Add Stripe secret key and publishable key to `.env.local`.
    *   **File(s) to Create/Modify:** `.env.local` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
    *   **Test Criteria:** Variables are present.
    *   **Depends On:** (Stripe account setup).

*   **Task ID: P5-003**
    *   **Description:** Create Stripe server-side client instance.
    *   **File(s) to Create/Modify:** `lib/stripe/client.ts`.
    *   **Test Criteria:** Stripe SDK initialized with secret key.
    *   **Depends On:** P5-001, P5-002.

*   **Task ID: P5-004**
    *   **Description:** Create `orders` table in Supabase. MVP fields: `id` (UUID, PK), `user_id` (UUID, FK to `profiles.id`), `total_amount` (DECIMAL), `status` (ENUM: 'pending_payment', 'paid', 'failed'), `stripe_payment_intent_id` (TEXT, UNIQUE), `created_at` (TIMESTAMPTZ).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
    *   **Test Criteria:** `orders` table exists.
    *   **Depends On:** P1-007.

*   **Task ID: P5-005**
    *   **Description:** Create `order_items` table in Supabase. MVP fields: `id` (UUID, PK), `order_id` (UUID, FK to `orders.id`), `product_id` (UUID, FK to `products.id`), `quantity` (INTEGER), `price_at_purchase` (DECIMAL).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
    *   **Test Criteria:** `order_items` table exists.
    *   **Depends On:** P3-001, P5-004.

*   **Task ID: P5-006**
    *   **Description:** Add RLS for `orders`: Users can see their own orders.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view their own orders."
        ON public.orders FOR SELECT
        USING ( auth.uid() = user_id );
        -- (Allow insert for authenticated users if orders are created by them)
        CREATE POLICY "Users can create their own orders."
        ON public.orders FOR INSERT
        WITH CHECK ( auth.uid() = user_id );
        ```
    *   **Test Criteria:** Policies created.
    *   **Depends On:** P5-004.

*   **Task ID: P5-007**
    *   **Description:** Add RLS for `order_items`: Users can see items belonging to their orders (via join).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view items of their own orders."
        ON public.order_items FOR SELECT
        USING ( EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        ));
        -- (Allow insert based on linked order)
        CREATE POLICY "Users can create items for their own orders."
        ON public.order_items FOR INSERT
        WITH CHECK ( EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        ));
        ```
    *   **Test Criteria:** Policies created.
    *   **Depends On:** P5-005, P5-006.

*   **Task ID: P5-008**
    *   **Description:** Create Checkout page UI `app/(main)/checkout/page.tsx`. Placeholder for address, shows cart summary.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx`.
    *   **Test Criteria:** Page renders, displays cart items and total from Zustand store. Contains a "Proceed to Payment" button.
    *   **Depends On:** P4-009.

*   **Task ID: P5-009**
    *   **Description:** Create API Route Handler `/api/create-payment-intent/route.ts`.
    *   **File(s) to Create/Modify:** `app/api/create-payment-intent/route.ts`.
    *   **Test Criteria:** Route handler file exists.
    *   **Depends On:** P1-001.

*   **Task ID: P5-010**
    *   **Description:** Implement `/api/create-payment-intent` logic:
        1.  Receive cart items from request body.
        2.  Get current user ID (Supabase server client).
        3.  Calculate total amount (server-side, fetch product prices from DB to verify).
        4.  Create `orders` record in Supabase (status `pending_payment`).
        5.  Create `order_items` records in Supabase.
        6.  Create Stripe PaymentIntent.
        7.  Return `client_secret` from PaymentIntent.
    *   **File(s) to Create/Modify:** `app/api/create-payment-intent/route.ts`.
    *   **Test Criteria:**
        *   Calling this endpoint with cart data successfully creates records in `orders` and `order_items`.
        *   A Stripe PaymentIntent is created (visible in Stripe Dashboard).
        *   The endpoint returns a `client_secret`.
    *   **Depends On:** P1-006, P2-007, P4-002, P5-003, P5-004, P5-005, P5-009.

*   **Task ID: P5-011**
    *   **Description:** Create `CheckoutForm` component to integrate Stripe Elements.
    *   **File(s) to Create/Modify:** `components/checkout/CheckoutForm.tsx`.
    *   **Test Criteria:** Component exists, ready to load Stripe.js.
    *   **Depends On:** P1-001.

*   **Task ID: P5-012**
    *   **Description:** On Checkout page, fetch `client_secret` and load Stripe Elements into `CheckoutForm`.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/page.tsx`, `components/checkout/CheckoutForm.tsx`.
    *   **Test Criteria:** Stripe payment form (CardElement) renders on the checkout page.
    *   **Depends On:** P5-001 (`@stripe/stripe-js`), P5-002, P5-008, P5-010, P5-011.

*   **Task ID: P5-013**
    *   **Description:** Implement payment submission in `CheckoutForm` using `stripe.confirmCardPayment`.
    *   **File(s) to Create/Modify:** `components/checkout/CheckoutForm.tsx`.
    *   **Test Criteria:** User can enter test card details, submit. PaymentIntent status updates in Stripe dashboard. On success, redirect to a success page. On failure, show an error.
    *   **Depends On:** P5-012.

*   **Task ID: P5-014**
    *   **Description:** Create Checkout Success page `app/(main)/checkout/success/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/checkout/success/page.tsx`.
    *   **Test Criteria:** Basic success message page renders.
    *   **Depends On:** P1-001.

*   **Task ID: P5-015**
    *   **Description:** Create API Route Handler `/api/stripe-webhook/route.ts`.
    *   **File(s) to Create/Modify:** `app/api/stripe-webhook/route.ts`.
    *   **Test Criteria:** Route handler file exists.
    *   **Depends On:** P1-001.

*   **Task ID: P5-016**
    *   **Description:** Implement `/api/stripe-webhook` logic:
        1.  Verify Stripe webhook signature.
        2.  Handle `payment_intent.succeeded` event.
        3.  Retrieve order using `stripe_payment_intent_id`.
        4.  Update order status in Supabase to `paid`.
        5.  (MVP: Clear client-side cart after successful payment on client, webhook is for DB consistency).
    *   **File(s) to Create/Modify:** `app/api/stripe-webhook/route.ts`.
    *   **Test Criteria:** When a payment succeeds in Stripe, the webhook is called. The corresponding order in Supabase DB is updated to `paid`.
    *   **Depends On:** P1-006, P5-003, P5-004, P5-015. (Requires configuring webhook endpoint in Stripe dashboard).

*   **Task ID: P5-017**
    *   **Description:** Clear cart from Zustand store after successful payment redirection on client.
    *   **File(s) to Create/Modify:** `components/checkout/CheckoutForm.tsx` (on successful `confirmCardPayment`), `stores/cartStore.ts` (add `clearCart` action).
    *   **Test Criteria:** Cart is empty after a successful payment and redirect to success page.
    *   **Depends On:** P4-002, P5-013, P5-014.


### Phase 6: Product Type (b) - Doctor Consultation (MVP Stub)

*   **Task ID: P6-001** (Already defined, for completeness)
    *   **Description:** Manually insert 1 sample 'doctor_consultation' product into `products` table.
    *   **File(s) to Create/Modify:** N/A (Supabase Table Editor).
    *   **Test Criteria:** Sample product exists with `category = 'doctor_consultation'`.
    *   **Depends On:** P3-001.

*   **Task ID: P6-002**
    *   **Description:** Modify single product page (`products/[slug]/page.tsx`) to display a "Request Consultation" button if `product.category` is 'doctor_consultation'.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** When viewing a 'doctor_consultation' product, the "Request Consultation" button appears instead of "Add to Cart".
    *   **Depends On:** P3-008, P6-001.

*   **Task ID: P6-003**
    *   **Description:** Create the `consultation_requests` table in Supabase. MVP fields: `id` (UUID, PK), `user_id` (UUID, FK to `profiles.id`), `product_id` (UUID, FK to `products.id`), `customer_details` (JSONB for form data), `status` (ENUM: 'submitted', 'pending'), `created_at` (TIMESTAMPTZ).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
    *   **Test Criteria:** `consultation_requests` table exists with specified columns.
    *   **Depends On:** P1-007, P3-001.

*   **Task ID: P6-004**
    *   **Description:** Add RLS for `consultation_requests`: Users can see their own requests and create new ones.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own consultation requests."
        ON public.consultation_requests FOR SELECT
        USING ( auth.uid() = user_id );

        CREATE POLICY "Users can create their own consultation requests."
        ON public.consultation_requests FOR INSERT
        WITH CHECK ( auth.uid() = user_id );
        ```
    *   **Test Criteria:** Policies created.
    *   **Depends On:** P6-003.

*   **Task ID: P6-005**
    *   **Description:** Create Consultation Request Form page `app/(main)/consultations/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/consultations/[productId]/page.tsx`.
    *   **Test Criteria:** Page renders, ready for a form. Displays the name of the product for which consultation is being requested (fetched via `productId` param).
    *   **Depends On:** P3-001 (for product lookup).

*   **Task ID: P6-006**
    *   **Description:** Create `ConsultationRequestForm.tsx` component with basic input fields (e.g., Name, Email, Phone, Reason for consultation - as a textarea).
    *   **File(s) to Create/Modify:** `components/forms/ConsultationRequestForm.tsx`.
    *   **Test Criteria:** Form component renders with specified fields. No submission logic yet.
    *   **Depends On:** P1-001.

*   **Task ID: P6-007**
    *   **Description:** Integrate `ConsultationRequestForm.tsx` into `app/(main)/consultations/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/consultations/[productId]/page.tsx`.
    *   **Test Criteria:** The consultation form is visible on the consultation request page.
    *   **Depends On:** P6-005, P6-006.

*   **Task ID: P6-008**
    *   **Description:** Link "Request Consultation" button on product page to `consultations/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** Clicking the button navigates to the correct consultation form page, passing the product ID.
    *   **Depends On:** P6-002, P6-005.

*   **Task ID: P6-009**
    *   **Description:** Create API Route Handler `/api/submit-consultation/route.ts`.
    *   **File(s) to Create/Modify:** `app/api/submit-consultation/route.ts`.
    *   **Test Criteria:** Route handler file exists.
    *   **Depends On:** P1-001.

*   **Task ID: P6-010**
    *   **Description:** Implement `/api/submit-consultation` logic:
        1.  Receive form data (`customer_details`, `productId`) from request body.
        2.  Get current user ID.
        3.  Save data to `consultation_requests` table in Supabase (status `submitted`).
        4.  (MVP Stub: Log "Would send to 3rd party doctor service" to console).
        5.  Return success/error to frontend.
    *   **File(s) to Create/Modify:** `app/api/submit-consultation/route.ts`.
    *   **Test Criteria:** Submitting the form creates a record in `consultation_requests` table. Console log appears on the server. Frontend receives a success response.
    *   **Depends On:** P1-006, P2-007, P6-003, P6-009.

*   **Task ID: P6-011**
    *   **Description:** Implement form submission logic in `ConsultationRequestForm.tsx` to call `/api/submit-consultation`.
    *   **File(s) to Create/Modify:** `components/forms/ConsultationRequestForm.tsx`.
    *   **Test Criteria:** User can fill and submit the form. Data is saved (verified by P6-010). User sees a success message or redirect.
    *   **Depends On:** P6-007, P6-010.

### Phase 7: Product Type (c) - Questionnaire & Purchase (MVP Stub)

*   **Task ID: P7-001**
    *   **Description:** Manually insert 1 sample 'questionnaire_prescription' product into `products` table.
    *   **File(s) to Create/Modify:** N/A (Supabase Table Editor).
    *   **Test Criteria:** Sample product exists with `category = 'questionnaire_prescription'`.
    *   **Depends On:** P3-001.

*   **Task ID: P7-002**
    *   **Description:** Modify single product page (`products/[slug]/page.tsx`) to display an "Answer Questions" button if `product.category` is 'questionnaire_prescription'.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** When viewing a 'questionnaire_prescription' product, the "Answer Questions" button appears.
    *   **Depends On:** P3-008, P7-001.

*   **Task ID: P7-003**
    *   **Description:** Create `questionnaire_approvals` table in Supabase. MVP fields: `id` (UUID, PK), `user_id` (UUID, FK to `profiles.id`), `product_id` (UUID, FK to `products.id`), `questionnaire_answers` (JSONB), `status` (ENUM: 'pending_approval', 'approved', 'rejected'), `created_at` (TIMESTAMPTZ).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
    *   **Test Criteria:** `questionnaire_approvals` table exists.
    *   **Depends On:** P1-007, P3-001.

*   **Task ID: P7-004**
    *   **Description:** Add RLS for `questionnaire_approvals`: Users can see their own approvals and create new ones.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.questionnaire_approvals ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own questionnaire approvals."
        ON public.questionnaire_approvals FOR SELECT
        USING ( auth.uid() = user_id );

        CREATE POLICY "Users can create their own questionnaire approvals."
        ON public.questionnaire_approvals FOR INSERT
        WITH CHECK ( auth.uid() = user_id );
        ```
    *   **Test Criteria:** Policies created.
    *   **Depends On:** P7-003.

*   **Task ID: P7-005**
    *   **Description:** Create Questionnaire page `app/(main)/questionnaire/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/questionnaire/[productId]/page.tsx`.
    *   **Test Criteria:** Page renders, ready for a form. Displays product name.
    *   **Depends On:** P3-001.

*   **Task ID: P7-006**
    *   **Description:** Create `QuestionnaireForm.tsx` component with 2-3 sample static questions (e.g., "Do you have any allergies? (text input)", "Are you over 18? (checkbox)").
    *   **File(s) to Create/Modify:** `components/forms/QuestionnaireForm.tsx`.
    *   **Test Criteria:** Form component renders with sample questions. No submission logic yet.
    *   **Depends On:** P1-001.

*   **Task ID: P7-007**
    *   **Description:** Integrate `QuestionnaireForm.tsx` into `app/(main)/questionnaire/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/questionnaire/[productId]/page.tsx`.
    *   **Test Criteria:** The questionnaire form is visible on the questionnaire page.
    *   **Depends On:** P7-005, P7-006.

*   **Task ID: P7-008**
    *   **Description:** Link "Answer Questions" button on product page to `questionnaire/[productId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/products/[slug]/page.tsx`.
    *   **Test Criteria:** Clicking button navigates to the correct questionnaire form page for the product.
    *   **Depends On:** P7-002, P7-005.

*   **Task ID: P7-009**
    *   **Description:** Create API Route Handler `/api/submit-questionnaire/route.ts`.
    *   **File(s) to Create/Modify:** `app/api/submit-questionnaire/route.ts`.
    *   **Test Criteria:** Route handler file exists.
    *   **Depends On:** P1-001.

*   **Task ID: P7-010**
    *   **Description:** Implement `/api/submit-questionnaire` logic:
        1.  Receive form data (`questionnaire_answers`, `productId`) from request body.
        2.  Get current user ID.
        3.  Save data to `questionnaire_approvals` table (status `pending_approval`).
        4.  (MVP Stub: Log "Would send to SmartScripts.ie" to console).
        5.  (MVP Stub: For testing, immediately update status to `approved` after a short delay OR based on a simple condition like "Are you over 18? == true").
        6.  Return success (and approval status) to frontend.
    *   **File(s) to Create/Modify:** `app/api/submit-questionnaire/route.ts`.
    *   **Test Criteria:** Submitting form creates a record in `questionnaire_approvals`. Console log appears. Status is (stub) 'approved'. Frontend receives success.
    *   **Depends On:** P1-006, P2-007, P7-003, P7-009.

*   **Task ID: P7-011**
    *   **Description:** Implement form submission logic in `QuestionnaireForm.tsx` to call `/api/submit-questionnaire`.
    *   **File(s) to Create/Modify:** `components/forms/QuestionnaireForm.tsx`.
    *   **Test Criteria:** User can fill and submit the form. Data is saved and (stub) approved. User sees a success message indicating approval status.
    *   **Depends On:** P7-007, P7-010.

*   **Task ID: P7-012**
    *   **Description:** If questionnaire is approved (via API response), allow adding the 'questionnaire_prescription' product to cart.
    *   **File(s) to Create/Modify:** `app/(main)/questionnaire/[productId]/page.tsx` (or client component within), `stores/cartStore.ts`.
    *   **Test Criteria:** After successful and (stub) approved questionnaire submission, an "Add to Cart" button appears. Clicking it adds the product to the cart. The `questionnaire_approval_id` should be stored with the cart item.
    *   **Depends On:** P4-003, P7-003 (for `id` of approval), P7-011.

*   **Task ID: P7-013**
    *   **Description:** Modify `/api/create-payment-intent` to include `questionnaire_approval_id` in `order_items` if present for an item.
    *   **File(s) to Create/Modify:** `app/api/create-payment-intent/route.ts`, `order_items` table (ensure `questionnaire_approval_id` column is nullable FK to `questionnaire_approvals.id`).
    *   **Test Criteria:** When checking out with an approved questionnaire product, the `order_items` record for that product in Supabase has the correct `questionnaire_approval_id`.
    *   **Depends On:** P5-005, P5-010, P7-012.

### Phase 8: Basic Account Management (View Orders & Requests)

*   **Task ID: P8-001**
    *   **Description:** Create Account page layout `app/(main)/account/layout.tsx` with basic sidebar navigation (Orders, Consultations, Prescriptions).
    *   **File(s) to Create/Modify:** `app/(main)/account/layout.tsx`, `app/(main)/account/page.tsx` (dashboard placeholder).
    *   **Test Criteria:** Account section has a persistent sidebar. `/account` shows a placeholder.
    *   **Depends On:** P2-003.

*   **Task ID: P8-002**
    *   **Description:** Create User Orders page `app/(main)/account/orders/page.tsx` to list user's past orders.
    *   **File(s) to Create/Modify:** `app/(main)/account/orders/page.tsx`.
    *   **Test Criteria:** Logged-in user can see a list of their orders (ID, date, total, status) fetched from Supabase.
    *   **Depends On:** P1-006, P5-004, P5-006, P8-001.

*   **Task ID: P8-003**
    *   **Description:** (Optional for MVP, good to have) Create Order Detail page `app/(main)/account/orders/[orderId]/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/account/orders/[orderId]/page.tsx`.
    *   **Test Criteria:** User can click an order and see its details, including order items.
    *   **Depends On:** P5-005, P5-007, P8-002.

*   **Task ID: P8-004**
    *   **Description:** Create User Consultations page `app/(main)/account/consultations/page.tsx` to list user's consultation requests.
    *   **File(s) to Create/Modify:** `app/(main)/account/consultations/page.tsx`.
    *   **Test Criteria:** Logged-in user can see a list of their consultation requests (product name, date, status).
    *   **Depends On:** P1-006, P6-003, P6-004, P8-001.

*   **Task ID: P8-005**
    *   **Description:** Create User Prescriptions page `app/(main)/account/prescriptions/page.tsx` to list user's questionnaire approvals.
    *   **File(s) to Create/Modify:** `app/(main)/account/prescriptions/page.tsx`.
    *   **Test Criteria:** Logged-in user can see a list of their questionnaire approvals (product name, date, status).
    *   **Depends On:** P1-006, P7-003, P7-004, P8-001.

### Phase 9: Basic Styling & Polish (MVP Level)

*   **Task ID: P9-001**
    *   **Description:** Apply very basic global styling for readability.
    *   **File(s) to Create/Modify:** `styles/globals.css`.
    *   **Test Criteria:** Site is visually clean enough for testing (e.g., consistent font, basic spacing).
    *   **Depends On:** P1-001.

*   **Task ID: P9-002**
    *   **Description:** Ensure basic responsive behavior for key pages (Product List, Product Detail, Cart).
    *   **File(s) to Create/Modify:** `styles/globals.css` or component-specific styles.
    *   **Test Criteria:** Pages are usable on a mobile-sized viewport.
    *   **Depends On:** P9-001.

*   **Task ID: P9-003**
    *   **Description:** Add simple loading indicators for page navigations or major data fetches (e.g., using Next.js `loading.tsx`).
    *   **File(s) to Create/Modify:** `app/loading.tsx`, `app/(main)/products/loading.tsx`, etc.
    *   **Test Criteria:** A loading state is visible during data fetching or route transitions.
    *   **Depends On:** P1-001.

*   **Task ID: P9-004**
    *   **Description:** Add basic error handling display for API call failures (e.g., show a message if payment intent creation fails).
    *   **File(s) to Create/Modify:** Relevant components making API calls (e.g., `CheckoutForm.tsx`, `ConsultationRequestForm.tsx`).
    *   **Test Criteria:** If an API call fails, a user-friendly error message is shown.
    *   **Depends On:** P5-013, P6-011, P7-011.

---

