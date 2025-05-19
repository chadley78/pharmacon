
## 5. What Each Part Does

### `app/` Directory (Next.js App Router)
*   **`(auth)` group**: Handles user sign-up, login, password reset pages. Uses Supabase Auth.
*   **`(main)` group**: Contains the core e-commerce functionality.
    *   `layout.tsx`: Provides the main site structure (nav, footer) for pages within this group.
    *   `page.tsx` (Homepage): Displays featured products, categories, etc. Fetches data using Server Components from Supabase.
    *   `products/page.tsx`: Lists products, allows filtering/sorting. Server Components fetch data.
    *   `products/[slug]/page.tsx`: Displays detailed information for a single product.
        *   If `category` is 'direct_purchase': "Add to Cart" button.
        *   If `category` is 'doctor_consultation': "Request Consultation" button/form.
        *   If `category` is 'questionnaire_prescription': "Answer Questions" button, leading to questionnaire.
    *   `cart/page.tsx`: Shows items in the cart. Allows quantity updates, removal.
    *   `checkout/page.tsx`: Multi-step form for shipping, billing, payment. Integrates Stripe Elements.
    *   `checkout/success/page.tsx`: Order confirmation page shown after successful payment.
    *   `account/`: User-specific pages like order history, profile management.
    *   `consultations/[productId]/page.tsx`: Page with the form to capture customer details for remote doctor consultation.
    *   `questionnaire/[productId]/page.tsx`: Page with the questionnaire for SmartScripts.
*   **`api/` (Route Handlers)**: Server-side logic.
    *   `stripe-webhook/route.ts`: Listens for events from Stripe (e.g., `payment_intent.succeeded`) to update order status in Supabase.
    *   `create-payment-intent/route.ts`: Takes cart details, creates an order in Supabase (status 'pending_payment'), and creates a Stripe PaymentIntent. Returns `client_secret` to the frontend.
    *   `submit-consultation/route.ts`: Receives form data for doctor consultation, saves it to `consultation_requests` in Supabase, and forwards data to the 3rd party doctor consultation service.
    *   `submit-questionnaire/route.ts`: Receives questionnaire answers, saves to `questionnaire_approvals` in Supabase (status `pending_approval`), and submits to SmartScripts.ie API.
    *   `smartscripts-webhook/route.ts`: (If SmartScripts supports it) Listens for approval/rejection updates from SmartScripts and updates `questionnaire_approvals` table.

### `components/`
*   Reusable UI elements. `ui/` for primitives, others for more complex, feature-specific components.
*   Example: `ProductCard.tsx` displays a product summary, `ConsultationRequestForm.tsx` is the form for type (b) products.

### `lib/`
*   **`supabase/`**: Initializes and exports Supabase client instances. `client.ts` for browser, `server.ts` for Server Components/Route Handlers, `admin.ts` if privileged operations are needed (e.g., in Edge Functions directly, though usually service_role key is used in Route Handlers).
*   **`stripe/`**: Initializes Stripe SDK (server-side) and utility functions (e.g., `formatAmountForStripe`).
*   **`smartscripts.ts` / `thirdparty-consultation.ts`**: Abstractions for interacting with external APIs. They handle API calls, authentication with those services, and data transformation.
*   **`utils.ts`**: General helper functions (formatting, validation, etc.).
*   **`types.ts`**: Centralized TypeScript definitions for data structures (Products, Orders, etc.).

### `hooks/`
*   Custom React hooks to encapsulate and reuse stateful logic or side effects.
    *   `useCart()`: Manages cart state, interacts with `CartContext` or Zustand store.
    *   `useUser()`: Accesses user session data from Supabase.

### `context/` (or Zustand/Jotai stores)
*   **`CartContext.tsx`**: Manages the global shopping cart state (items, total). Could be replaced/augmented by Zustand for easier state management and persistence (e.g., to `localStorage`).
*   **`AuthContext.tsx`**: While Supabase provides its own auth state management, you might wrap it or expose parts of it via a context if needed across many components. Supabase's `onAuthStateChange` is often used directly.

### `public/`
*   Static assets like images, fonts, `favicon.ico`.

### `styles/`
*   Global CSS or CSS Modules setup.

## 6. State Management

*   **Global State (Zustand/Jotai recommended over Context API for complex state like cart):**
    *   **Shopping Cart:**
        *   Items, quantities, subtotal.
        *   Actions: add item, remove item, update quantity, clear cart.
        *   State could be persisted to `localStorage` for non-logged-in users and synced with a `user_carts` table in Supabase for logged-in users if desired (for cart persistence across devices).
    *   **User Session/Authentication:**
        *   Primarily handled by Supabase's JavaScript client library (`@supabase/auth-helpers-nextjs`). It manages tokens and session state.
        *   You'll use Supabase hooks/methods to get current user and auth status.
*   **Local Component State (`useState`, `useReducer`):**
    *   Form inputs and validation state.
    *   UI toggles (modal visibility, dropdown open/closed).
    *   Loading/error states for specific async operations within a component.
*   **Server-Side State (Supabase Database):**
    *   The definitive source of truth for products, orders, user profiles, consultation requests, and questionnaire approvals.
*   **URL State:**
    *   Filters, search queries, pagination parameters on product listing pages.

## 7. Services Connection and Data Flow

### a) Products - Direct Purchase (Type A)

1.  **Browse & Add to Cart:**
    *   User views `products/[slug]/page.tsx`. Product data fetched via Server Component from Supabase.
    *   Clicks "Add to Cart". Client-side action updates Zustand/Context cart state.
2.  **Checkout:**
    *   User navigates to `cart/page.tsx`, then `checkout/page.tsx`.
    *   Fills shipping/billing info.
    *   Frontend calls `/api/create-payment-intent` (Next.js Route Handler).
    *   **Route Handler:**
        *   Validates cart items and quantities against Supabase DB (stock check).
        *   Creates an `orders` record in Supabase (status: `pending_payment`).
        *   Creates `order_items` records.
        *   Calls Stripe API to create a PaymentIntent with the order total.
        *   Returns `client_secret` from Stripe to the frontend.
    *   Frontend uses Stripe.js Elements and the `client_secret` to mount the payment form and confirm the payment.
3.  **Payment Confirmation:**
    *   Stripe processes payment.
    *   Stripe sends a webhook event (e.g., `payment_intent.succeeded`) to `/api/stripe-webhook`.
    *   **`/api/stripe-webhook` Route Handler:**
        *   Verifies webhook signature.
        *   Retrieves order from Supabase using `stripe_payment_intent_id`.
        *   Updates order status to `paid` (or `processing`).
        *   (Optional) Decrement product stock.
        *   (Optional) Send order confirmation email (e.g., via Supabase Edge Function + Resend/Postmark).
    *   Frontend shows `checkout/success/page.tsx`.

### b) Products - Doctor Consultation (Type B)

1.  **View Product & Request Consultation:**
    *   User views `products/[slug]/page.tsx`. Product data fetched.
    *   Clicks "Request Consultation", navigates to `consultations/[productId]/page.tsx`.
    *   Fills out `ConsultationRequestForm.tsx` with necessary details.
2.  **Submit Form:**
    *   Frontend calls `/api/submit-consultation` with form data and `productId`.
    *   **Route Handler:**
        *   Authenticates user.
        *   Validates data.
        *   Saves data to `consultation_requests` table in Supabase (status `submitted`).
        *   Makes an API call to the 3rd party doctor consultation service (using `lib/thirdparty-consultation.ts`), passing necessary user and product info. Stores any reference ID from the service.
        *   Updates `consultation_requests.status` (e.g., to `pending_consultation`).
        *   Returns success/error to frontend.
3.  **Follow-up:**
    *   The 3rd party service handles scheduling and the consultation.
    *   Manual updates or (if the service offers webhooks) an API endpoint could update the `consultation_requests.status` in Supabase.
    *   User can view status in `account/consultations/page.tsx`.

### c) Products - Questionnaire & Purchase (Type C)

1.  **View Product & Answer Questions:**
    *   User views `products/[slug]/page.tsx`.
    *   Clicks "Answer Questions", navigates to `questionnaire/[productId]/page.tsx`.
    *   Fills out `QuestionnaireForm.tsx`. Questions could be dynamic (fetched from DB per product) or static.
2.  **Submit Questionnaire:**
    *   Frontend calls `/api/submit-questionnaire` with answers and `productId`.
    *   **Route Handler:**
        *   Authenticates user.
        *   Validates answers.
        *   Saves answers to `questionnaire_approvals` table in Supabase (status `pending_approval`).
        *   Makes an API call to SmartScripts.ie API (using `lib/smartscripts.ts`) with the questionnaire data. Stores SmartScripts reference ID.
        *   Returns success/error to frontend.
3.  **Approval & Purchase:**
    *   **Scenario 1: SmartScripts API returns approval status synchronously.**
        *   The `/api/submit-questionnaire` handler updates `questionnaire_approvals.status` to `approved` or `rejected`.
    *   **Scenario 2: SmartScripts uses a webhook.**
        *   SmartScripts calls `/api/smartscripts-webhook` (or similar).
        *   This webhook handler updates `questionnaire_approvals.status` in Supabase.
    *   **If Approved:**
        *   User is notified (e.g., on page, email).
        *   The product can now be added to the cart. The "Add to Cart" button for this product (for this user and this approval) becomes active.
        *   When adding to cart, the `questionnaire_approval_id` is associated with the cart item and subsequently the `order_item`.
        *   Checkout proceeds as per Type (A), but the system knows this item has a valid prescription approval.
    *   **If Rejected:**
        *   User is notified. Product cannot be purchased.
    *   User can view approval status in `account/prescriptions/page.tsx`.

### Supabase Edge Functions (Optional but Recommended for some tasks)

*   **Securely calling 3rd party APIs:** If you need to hide API keys for SmartScripts or the doctor service and want logic closer to the DB. Route Handlers are also server-side and can do this.
*   **Background tasks:** E.g., sending emails after order confirmation (triggered by DB webhooks or direct call).
*   **Complex data transformations/validations** that benefit from being close to the database.

## 8. Security Considerations

*   **Environment Variables:** Store all secret keys (Supabase service role, Stripe secret, 3rd party API keys) in `.env.local` and configure them on Vercel/hosting. ONLY `NEXT_PUBLIC_` variables are exposed to the client.
*   **RLS (Row Level Security) in Supabase:** Essential to ensure users can only access their own data.
*   **Input Validation:** Validate all inputs on the client-side (for UX) AND server-side (Route Handlers) to prevent malicious data.
*   **API Route Protection:** Ensure API routes that modify data or access sensitive info require authentication.
*   **Stripe Webhook Security:** Verify Stripe webhook signatures.
*   **CSRF Protection:** Next.js has some built-in protections, but be mindful, especially with form submissions handled by Route Handlers.
*   **XSS Protection:** React helps, but sanitize any user-generated content if directly rendering HTML.
*   **Rate Limiting:** Consider for sensitive endpoints if abuse is a concern.

This comprehensive structure should provide a solid foundation for your e-commerce pharmacy website. Remember to iterate and adapt as you build and encounter specific challenges. Good luck!