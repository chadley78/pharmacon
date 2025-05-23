

---

## Codebase Preparation for Restyling (AI-Executable Tasks)

**Branching (Manual Prerequisite):**
*   **User Action:** Ensure you are on a new Git branch dedicated to restyling (e.g., `feature/website-restyle`) and that all previous work is committed. The AI will work on this branch.

---

**Task Group 1: Tailwind Configuration Refinement**

*   **Task ID: AIT-PRE-TW-001**
    *   **Description:** Review `tailwind.config.js`. If any color definitions under `theme.extend.colors` use names that are highly specific to the *current* design (e.g., `brightBlue`, `oldMutedGreen`), rename them to more semantic or generic role-based names (e.g., `primary`, `secondary`, `accent`, `neutral-100`, `brand-main`). If a direct semantic mapping isn't obvious, use generic names like `custom-color-1`, `custom-color-2`. Provide a mapping of old names to new names in the commit message.
    *   **File(s) to Create/Modify:** `tailwind.config.js`.
    *   **Test Criteria:** The `theme.extend.colors` section in `tailwind.config.js` uses more abstract/semantic color names. The website should still render (colors will be the same, just accessed via new class names after the next step).
    *   **Depends On:** None (after branching).

*   **Task ID: AIT-PRE-TW-002**
    *   **Description:** Search the entire codebase (`src` directory) for usages of the old Tailwind color class names (identified in AIT-PRE-TW-001) and replace them with the new semantic/generic class names. For example, if `bg-brightBlue` was renamed to `bg-primary`, update all instances.
    *   **File(s) to Create/Modify:** Various `.tsx` files within the `src` directory.
    *   **Test Criteria:** All old color class names are replaced with new ones. The website's visual appearance regarding these colors should remain unchanged. A global search for an old color class (e.g., `bg-brightBlue`) should yield no results.
    *   **Depends On:** AIT-PRE-TW-001.

*   **Task ID: AIT-PRE-TW-003**
    *   **Description:** Review `tailwind.config.js` for `theme.extend.spacing`, `theme.extend.fontSize`, `theme.extend.borderRadius`, etc. If there are many arbitrary, one-off values (e.g., `spacing: { '3.75': '0.9375rem' }`), try to map them to Tailwind's default scale or a more systematic custom scale if a clear pattern exists (e.g., if `0.9375rem` is close to `theme.spacing[3.5]`, consider if it can be standardized). If no clear system is apparent, leave them but make a note. *Focus on obvious consolidations only.*
    *   **File(s) to Create/Modify:** `tailwind.config.js`.
    *   **Test Criteria:** `tailwind.config.js` has potentially fewer, more systematic custom theme values for spacing, font sizes, etc. Minor visual shifts are acceptable if they are due to standardization, but no major layout breaks.
    *   **Depends On:** None.

---

**Task Group 2: Global Styles and CSS Reset**

*   **Task ID: AIT-PRE-GS-001**
    *   **Description:** Open `styles/globals.css`. Ensure that Tailwind CSS's `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` directives are present and are typically at the top of the file. Verify that Tailwind's Preflight (base styles) is active.
    *   **File(s) to Create/Modify:** `styles/globals.css`.
    *   **Test Criteria:** The three `@tailwind` directives are present. No visual change expected if already correct. If they were missing, adding them might introduce Preflight styles, causing minor visual resets across the site (which is good).
    *   **Depends On:** None.

*   **Task ID: AIT-PRE-GS-002**
    *   **Description:** In `styles/globals.css`, review any custom global styles applied to base HTML elements like `body`, `html`, `h1-h6`, `p`, `a`. If these styles define highly specific visual properties (e.g., `body { font-family: 'OldSpecificFont'; color: '#333333'; }`) that will be replaced by the new design system, comment them out or make them very generic (e.g., ensure `body` allows font inheritance). *Do not remove structural global styles (e.g., box-sizing).*
    *   **File(s) to Create/Modify:** `styles/globals.css`.
    *   **Test Criteria:** Specific visual global styles are neutralized. The site might look "unstyled" in some aspects (e.g., default browser fonts might appear), which is acceptable for this step. Functionality should remain.
    *   **Depends On:** AIT-PRE-GS-001.

---

**Task Group 3: Component Styling Decoupling (Light Touch for AI)**

*This is harder for an AI to do perfectly without deep design understanding. We'll aim for simple, identifiable cases.*

*   **Task ID: AIT-PRE-COMP-001**
    *   **Description:** Search for common UI components (e.g., `Button.tsx`, `Input.tsx`, `Card.tsx` - you may need to provide specific file paths to the AI if they are not in standard locations like `components/ui/`). In these components, look for inline styles (`style={{ ... }}`) that define colors, fonts, or complex spacing/borders that are tied to the *current* design. If found, attempt to replace these inline styles with Tailwind classes using the (newly semantic) theme colors/spacing from `tailwind.config.js`. If a direct mapping is not possible, add a `TODO: Restyle this inline style` comment.
    *   **File(s) to Create/Modify:** Specific component files (e.g., `src/components/ui/Button.tsx`).
    *   **Test Criteria:** Fewer visual inline styles in key UI components. Components should still render correctly, possibly with slight visual changes if Tailwind classes are now used.
    *   **Depends On:** AIT-PRE-TW-001, AIT-PRE-TW-002.

*   **Task ID: AIT-PRE-COMP-002**
    *   **Description:** In the same common UI components, look for hardcoded Tailwind classes that are *highly specific and non-semantic* for layout or appearance (e.g., `px-3.5 py-1.25 rounded-md.lg border-blue-550`). If such a complex, non-reusable combination exists and it's clearly tied to the old design's pixel-perfection, try to simplify it to more general classes (e.g., `px-4 py-2 rounded-lg border`) or add a `TODO: Review these specific classes during restyle` comment. *Prioritize removal of extremely precise, non-standard fractional values if they aren't part of your defined theme.*
    *   **File(s) to Create/Modify:** Specific component files.
    *   **Test Criteria:** Some overly specific Tailwind class combinations in key UI components are simplified or marked for review. Minor visual shifts are acceptable.
    *   **Depends On:** AIT-PRE-COMP-001.

---

**Task Group 4: Final Checks (Manual and AI-Assisted)**

*   **Task ID: AIT-PRE-FC-001**
    *   **Description:** Run the linter (e.g., `npm run lint` or `eslint .`) and TypeScript checker (`npm run typecheck` or `tsc --noEmit`) to catch any syntax errors or type issues introduced by the above changes. Instruct the AI to attempt to fix any reported auto-fixable linting/type errors.
    *   **File(s) to Create/Modify:** Various files based on linter/TSC output.
    *   **Test Criteria:** Linter and TypeScript checker pass without errors related to the changes made.
    *   **Depends On:** All previous AIT-PRE-* tasks.

*   **Task ID: AIT-PRE-FC-002 (User Action + AI Build)**
    *   **Description:** User will manually browse key pages of the website to ensure no major functionality is broken and that the site is still generally usable, even if some styling looks "off" or more basic. AI will then run a local production build (`npm run build`).
    *   **File(s) to Create/Modify:** None by AI directly, unless build fails and AI can identify a fix.
    *   **Test Criteria:** User confirms basic site functionality. `npm run build` completes successfully.
    *   **Depends On:** AIT-PRE-FC-001.

---
