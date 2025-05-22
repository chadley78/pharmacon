```markdown


We'll assume "Option A: Supabase Full-Text Search" is chosen, as recommended for MVP.

---

## Search Feature Implementation (Based on Provided Plan & Our Architecture)

**Prerequisites:**
*   `products` table exists in Supabase with relevant text fields like `name`, `description`, and potentially a `category_name` or similar if you want to search by category text.
*   Basic understanding of SQL and Supabase client usage.

---

### Phase S1-ALT: Database Setup for Full-Text Search (Supabase FTS)

*   **Task ID: S1-ALT-001**
    *   **Description:** Add a `tsvector` column to the `products` table to store the document vectors. Name it `fts_document_vector`. (This aligns with our previous search plan's S1-001).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        ALTER TABLE public.products
        ADD COLUMN fts_document_vector tsvector;
        ```
    *   **Test Criteria:** The `products` table has a new column named `fts_document_vector` of type `tsvector`.
    *   **Depends On:** P3-001 (Products table creation).

*   **Task ID: S1-ALT-002**
    *   **Description:** Populate the `fts_document_vector` column for existing products. Combine `name` and `description`. (Consider other text fields like category name if applicable and stored directly on the product, or keywords from `meta_data`). Use `english` configuration.
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        UPDATE public.products
        SET fts_document_vector =
            to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''));
        -- Example if you have a text category field:
        -- SET fts_document_vector =
        --     to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category_display_name, ''));
        ```
    *   **Test Criteria:** Existing rows in the `products` table have their `fts_document_vector` column populated. Verify by selecting a few rows.
    *   **Depends On:** S1-ALT-001.

*   **Task ID: S1-ALT-003**
    *   **Description:** Create a SQL function to automatically update the `fts_document_vector` when a product's searchable fields change. (Aligns with S1-003).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        CREATE OR REPLACE FUNCTION public.update_product_fts_document_vector()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.fts_document_vector :=
                to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
                -- Add other NEW fields here if they contribute to the vector
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        ```
    *   **Test Criteria:** The SQL function `update_product_fts_document_vector` is created in Supabase.
    *   **Depends On:** S1-ALT-001.

*   **Task ID: S1-ALT-004**
    *   **Description:** Create a trigger on the `products` table to call `update_product_fts_document_vector()` before any `INSERT` or `UPDATE` operation. (Aligns with S1-004).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        CREATE TRIGGER product_fts_vector_update
        BEFORE INSERT OR UPDATE ON public.products
        FOR EACH ROW EXECUTE FUNCTION public.update_product_fts_document_vector();
        ```
    *   **Test Criteria:** The trigger `product_fts_vector_update` is created. Test by manually updating a product in Supabase UI; `fts_document_vector` should update.
    *   **Depends On:** S1-ALT-003.

*   **Task ID: S1-ALT-005**
    *   **Description:** Create a GIN index on the `fts_document_vector` column for performant searching. (Aligns with S1-005).
    *   **File(s) to Create/Modify:** Supabase SQL Editor.
        ```sql
        CREATE INDEX idx_gin_product_fts_document_vector
        ON public.products
        USING GIN (fts_document_vector);
        ```
    *   **Test Criteria:** A GIN index `idx_gin_product_fts_document_vector` exists on `products` for `fts_document_vector`.
    *   **Depends On:** S1-ALT-001.

### Phase S2-ALT: API Route for Search (Instead of RPC for this plan)

*   **Task ID: S2-ALT-001**
    *   **Description:** Create the API Route Handler file `app/api/search-products/route.ts`.
    *   **File(s) to Create/Modify:** `app/api/search-products/route.ts`.
    *   **Test Criteria:** File exists and is set up for a GET request handler.
    *   **Depends On:** P1-001.

*   **Task ID: S2-ALT-002**
    *   **Description:** In `/api/search-products/route.ts`, implement logic to accept a `query` string parameter from the URL (e.g., `/api/search-products?query=term`).
    *   **File(s) to Create/Modify:** `app/api/search-products/route.ts`.
    *   **Test Criteria:** Calling the API route with a `?query=test` parameter allows the handler to access "test". Log the received query.
    *   **Depends On:** S2-ALT-001.

*   **Task ID: S2-ALT-003**
    *   **Description:** In the API route, use the Supabase server client to query the `products` table using the `fts_document_vector` and `plainto_tsquery`.
        *   Filter by `is_active = TRUE`.
        *   Order by `ts_rank_cd` if a query term is present.
        *   Return a limited set of product fields (id, name, slug, image_url, price) as JSON.
    *   **File(s) to Create/Modify:** `app/api/search-products/route.ts`.
        ```typescript
        // Example snippet for the route handler
        // import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Or your server client setup
        // import { cookies } from 'next/headers';
        // import { NextRequest, NextResponse } from 'next/server';

        // export async function GET(request: NextRequest) {
        //   const supabase = createRouteHandlerClient({ cookies }); // Or your server client
        //   const searchParams = request.nextUrl.searchParams;
        //   const query = searchParams.get('query');

        //   if (!query || query.trim() === '') {
        //     return NextResponse.json({ products: [] });
        //   }

        //   const { data: products, error } = await supabase
        //     .from('products')
        //     .select('id, name, slug, image_url, price') // Add other fields you need
        //     .eq('is_active', true)
        //     .textSearch('fts_document_vector', query, {
        //       type: 'plain', // or 'websearch' for more complex queries
        //       config: 'english',
        //       // Add ranking if desired:
        //       // query: `${query}:*`, // for prefix matching with plainto_tsquery, might need an RPC for ts_rank
        //     })
        //     // For ranking, you might still prefer an RPC and call it here.
        //     // Supabase .textSearch() has limited direct ranking options in the JS client.
        //     // If using RPC:
        //     // .rpc('search_products_with_rank', { search_term: query })
        //     .limit(20); // Add a limit

        //   if (error) {
        //     console.error('Search error:', error);
        //     return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
        //   }
        //   return NextResponse.json({ products });
        // }
        ```
    *   **Test Criteria:** Calling `/api/search-products?query=someproductname` returns a JSON array of matching active products with selected fields.
    *   **Depends On:** S1-ALT-005, S2-ALT-002, P1-006 (Supabase server client).
    *   *Self-correction/Refinement:* The JS client's `.textSearch` is convenient but for proper `ts_rank_cd` based ordering, using an RPC function (like `search_products_with_rank` from the previous plan's S2-002) called from this API route is generally better. For this task, start with basic `.textSearch`. A later task can refine with RPC for ranking.

*   **Task ID: S2-ALT-004** (Refinement for Ranking - Optional for first pass, but good)
    *   **Description:** Create/reuse a Supabase RPC function (e.g., `search_products_with_rank` from previous plan S2-002) that takes a search term, performs FTS, and orders by `ts_rank_cd`.
    *   **File(s) to Create/Modify:** Supabase SQL Editor (if not already done from previous search plan).
    *   **Test Criteria:** RPC function exists and can be called from SQL with a search term, returning ranked results.
    *   **Depends On:** S1-ALT-005.

*   **Task ID: S2-ALT-005** (Refinement for Ranking)
    *   **Description:** Modify `/api/search-products/route.ts` to call the RPC function (e.g., `search_products_with_rank`) instead of a direct table query with `.textSearch()` if ranking is desired.
    *   **File(s) to Create/Modify:** `app/api/search-products/route.ts`.
    *   **Test Criteria:** API route now uses the RPC for searching, and results are implicitly ranked.
    *   **Depends On:** S2-ALT-003, S2-ALT-004.

### Phase S3-ALT: Frontend Integration (Dedicated Search Page)

*   **Task ID: S3-ALT-001**
    *   **Description:** Add a search input field to the Navbar component (`components/layout/Navbar.tsx`).
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`.
    *   **Test Criteria:** A search input field is visible in the Navbar. No functionality yet.
    *   **Depends On:** P2-003.

*   **Task ID: S3-ALT-002**
    *   **Description:** Create a new page for displaying search results: `app/(main)/search/page.tsx`.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** The `/search` route exists and renders a placeholder.
    *   **Depends On:** P1-001.

*   **Task ID: S3-ALT-003**
    *   **Description:** Implement client-side state for the search query in the Navbar input.
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx` (will need to be a Client Component or have a child Client Component for the form).
    *   **Test Criteria:** Typing in the search input updates its state.
    *   **Depends On:** S3-ALT-001.

*   **Task ID: S3-ALT-004**
    *   **Description:** When the user submits the search form in the Navbar (e.g., presses Enter), navigate to `/search`, passing the search query as a URL query parameter (e.g., `/search?q=myquery`).
    *   **File(s) to Create/Modify:** `components/layout/Navbar.tsx`.
    *   **Test Criteria:** Submitting the search form redirects to `/search?q=...` with the correct query.
    *   **Depends On:** S3-ALT-002, S3-ALT-003.

*   **Task ID: S3-ALT-005**
    *   **Description:** On `/search/page.tsx`, read the search query (`q`) from URL query parameters using `useSearchParams`.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx` (this page will need to be a Client Component or use one to read search params and fetch data client-side if not using Server Component data fetching based on params).
    *   **Test Criteria:** The search page can access and display the search term from the URL.
    *   **Depends On:** S3-ALT-002.

*   **Task ID: S3-ALT-006**
    *   **Description:** On `/search/page.tsx` (Client Component part), when the `q` parameter changes, fetch data from `/api/search-products` using `fetch`. Manage loading and error states.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** When the search page loads with a `q` param, it makes an API call to `/api/search-products`. Log results or errors.
    *   **Depends On:** S2-ALT-003 (or S2-ALT-005), S3-ALT-005.

*   **Task ID: S3-ALT-007**
    *   **Description:** Display the fetched search results on `/search/page.tsx`. Reuse `ProductCard.tsx` for each product.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** Search results (product names, images, prices) are displayed using `ProductCard`.
    *   **Depends On:** S3-ALT-006, P3-005 (ProductCard).

*   **Task ID: S3-ALT-008**
    *   **Description:** Display a "No results found for '[query]'" message on `/search/page.tsx` if the API returns an empty product list.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** If a search yields no matches, an appropriate message including the search term is shown.
    *   **Depends On:** S3-ALT-007.

*   **Task ID: S3-ALT-009**
    *   **Description:** Display a loading state (e.g., "Searching...") on `/search/page.tsx` while results are being fetched from the API.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** A loading indicator is shown while search results are loading.
    *   **Depends On:** S3-ALT-006.

*   **Task ID: S3-ALT-010**
    *   **Description:** (Debouncing for API call) If implementing as-you-type later, this is where debouncing the `fetch` call in `S3-ALT-006` would go. For submit-based search, this is less critical but good practice if the input could trigger multiple submits rapidly. For now, assume submit-based search.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx` or `components/layout/Navbar.tsx` if search is triggered from there on type.
    *   **Test Criteria:** (If as-you-type) API calls are debounced. (For submit-based) Not directly testable in this step without as-you-type.
    *   **Depends On:** S3-ALT-006.

### Phase S4-ALT: (Optional) Advanced Features & Polish

*   **Task ID: S4-ALT-001** (Category Filters - UI)
    *   **Description:** Add UI elements (e.g., dropdown, checkboxes) to the search page or near the search bar for selecting product categories to filter by. State for selected filters will be needed.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx` or `components/layout/Navbar.tsx`.
    *   **Test Criteria:** Category filter UI elements are visible. Selecting a filter updates local state.
    *   **Depends On:** S3-ALT-007, (Product categories defined and accessible).

*   **Task ID: S4-ALT-002** (Category Filters - API)
    *   **Description:** Modify `/api/search-products/route.ts` (and potentially the RPC S2-ALT-004) to accept category filter parameters and include them in the Supabase query.
    *   **File(s) to Create/Modify:** `app/api/search-products/route.ts`, Supabase SQL Editor (for RPC if used).
    *   **Test Criteria:** API can filter search results by category when category parameters are passed.
    *   **Depends On:** S2-ALT-003 (or S2-ALT-005), S4-ALT-001.

*   **Task ID: S4-ALT-003** (Category Filters - Frontend Logic)
    *   **Description:** Update the frontend data fetching logic on `/search/page.tsx` to pass selected category filters to the `/api/search-products` API call.
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx`.
    *   **Test Criteria:** Selecting a category filter on the frontend correctly filters the displayed search results.
    *   **Depends On:** S3-ALT-006, S4-ALT-001, S4-ALT-002.

*   **Task ID: S4-ALT-004** (Highlighting Matches - Basic)
    *   **Description:** Implement basic client-side highlighting of the search query term within the displayed product names or descriptions on the search results page. (Can use string manipulation or a simple regex replace to wrap matches in `<mark>` tags).
    *   **File(s) to Create/Modify:** `app/(main)/search/page.tsx` or `components/products/ProductCard.tsx` (if highlighting is done there).
    *   **Test Criteria:** Search query terms are visually highlighted (e.g., bold or yellow background) in the results.
    *   **Depends On:** S3-ALT-007.
    *   *Note:* Server-side highlighting using `ts_headline` is more robust but more complex to integrate here.

*   **Task ID: S4-ALT-005** (Testing & Mobile Polish)
    *   **Description:** Thoroughly test the search functionality with various queries, typos (FTS handles some fuzziness), and edge cases. Ensure the search bar and results page are responsive and mobile-friendly.
    *   **File(s) to Create/Modify:** All search-related files.
    *   **Test Criteria:** Search is robust, performs well, and looks good on all devices.
    *   **Depends On:** All previous S-ALT tasks.

---


```