# Lab 4: Server-Side Caching, Favourites Context, and Review Forms

## Starting Point

This specification is a **delta from the completed Lab 3 solution** in this repository. Lab 3 provides:
- Vite + React + TypeScript foundation with Material-UI
- TMDB API integration via centralized fetch layer (`src/api/tmdb-api.ts`)
- Home page with movie discovery and filtering
- Favourites page (currently reads from localStorage)
- Movie details page with image gallery
- Full review page showing TMDB critic reviews
- Custom hooks for filtering and movie data
- Reusable page templates using component composition
- Routing with React Router v6

Lab 4 **refactors state management and introduces caching** without rewriting existing functionality. Existing Lab 3 behavior must continue to work unless explicitly changed.

---

## Overview

Lab 4 introduces **three core architectural improvements** to the movie app:

1. **Server-State Caching with react-query**: Replace manual `useState` + `useEffect` patterns with react-query to prevent redundant API calls on repeated page visits
2. **Shared Favourites Context**: Move favourites from localStorage into React Context so selections persist across navigation and are accessible globally
3. **Configurable Movie Card Actions**: Refactor MovieCard component to accept configurable action buttons (render-props style) so different pages can use different card behaviors without duplication
4. **Review Form Submission**: Add a new review form page where users can write reviews for favourite movies, with form validation and submission handling

These changes maintain backward compatibility with Lab 3 features while modernizing state management patterns.

---

## Goals

- Eliminate redundant API calls by implementing browser-side caching with react-query for movie lists and details
- Provide a centralized, persistent app-wide favourites store via React Context that survives navigation
- Enable flexible movie card actions through render-props composition so pages can specify their own card behaviors
- Support user review submission with form validation, error handling, and success feedback
- Maintain all Lab 3 functionality (filtering, favourites display, movie details, reviews display) without breaking changes
- Follow repository patterns and conventions (custom hooks, API layer, component composition, Material-UI styling)

---

## Relevant Skills

The following skill files must guide the implementation:

- `skills/server-state-caching/SKILL.md` — react-query patterns for caching server state
- `skills/context-for-shared-state/SKILL.md` — React Context setup and useContext consumption
- `skills/render-props-configurable-actions/SKILL.md` — render-props pattern for composable component actions
- `skills/review-forms-with-react-hook-form/SKILL.md` — form handling with validation
- `skills/api-fetching/SKILL.md` — centralized API layer patterns
- `skills/component-composition/SKILL.md` — template and composition patterns
- `skills/component-hierarchy-and-page-assembly/SKILL.md` — page structure and hierarchy

---

## In Scope

### Functional Changes
1. **Server-state caching**: Wrap API calls in react-query queries so list and detail fetches cache by default
2. **Favourites Context**: Create a new shared Context + Provider for managing favourite movie IDs app-wide
3. **Favourites page refresh**: Modify FavouriteMoviesPage to load movie details through shared context and react-query
4. **Configurable card actions**: Refactor MovieCard to accept a render-props children function for action buttons
5. **Card action variants**: Implement at least three action components:
   - AddToFavourites action (used on home page)
   - RemoveFromFavourites action (used on favourites page)
   - WriteReview action (used on favourites page)
6. **Review form page**: Add `/movies/:id/review` page with review form (title, author, comment)
7. **Review form submission**: Store submitted reviews in app state (temporary in-memory or sessionStorage; not persisted to API)
8. **Form validation**: Use react-hook-form with basic validation (required fields, max length)
9. **Async data safety**: Ensure all pages handle loading/error states gracefully before rendering card data

### Out of Scope (Handled in Lab 3)
- TMDB API integration (already exists)
- Basic routing setup
- Movie filtering logic
- Displaying TMDB critic reviews
- Site navigation header
- Movie details page structure
- Image gallery display

---

## Expected Functional Behaviour

### 1. Server-State Caching

**Objective**: Use react-query to cache API responses and prevent redundant requests.

**Functional Requirements**:
- The system shall wrap `getMovies()` calls in a react-query query with a stable query key (e.g., `['movies']`)
- The system shall wrap `getMovie(id)` calls in a react-query query with a query key that includes the movie ID (e.g., `['movie', id]`)
- The system shall wrap `getMovieReviews(id)` calls in a react-query query with a query key that includes the movie ID
- When a cached movie list or details page is revisited within the default cache time window, the system shall use cached data and NOT make a new API request
- The system shall handle loading states while data is being fetched (e.g., display a skeleton or spinner, not null)
- The system shall handle error states gracefully (e.g., display an error message, not crash)
- The system shall refetch stale data when a component unmounts and remounts after the default stale time

**Proof Artifacts**:
- Browser Network tab screenshot: Revisiting home page shows zero network calls for `/discover/movie` endpoint (cache hit)
- Browser Network tab screenshot: Navigating between pages and back shows only one call per unique query key
- React Query DevTools panel screenshot: Shows cached queries with their timestamps and data
- Console logs or test output: Verifies query hooks are called with correct query keys

---

### 2. Favourites Context

**Objective**: Move favourites state from localStorage into a shared React Context.

**Functional Requirements**:
- A new `MoviesContext` shall be created that provides:
  - `favouriteIds: number[]` — array of movie IDs marked as favourite
  - `addToFavourites(movieId: number): void` — adds a movie ID to the favourites array
  - `removeFromFavourites(movieId: number): void` — removes a movie ID from the favourites array
  - `isFavourite(movieId: number): boolean` — returns true if a movie ID is in favourites
- A `MoviesProvider` component shall wrap the app (in `src/index.tsx`) and provide the context
- The system shall persist favourites to localStorage on every add/remove action so favourites survive browser refresh
- The system shall hydrate favourites from localStorage when the app initializes
- All pages that need to check or modify favourites shall use the context via `useContext(MoviesContext)`
- No favourites state shall be managed directly in page components (except reading from context)

**Proof Artifacts**:
- Code inspection: `src/contexts/MoviesContext.tsx` exists and exports context + provider + custom hook
- Code inspection: `src/index.tsx` wraps `<App />` with `<MoviesProvider>`
- Browser DevTools: React Components tab shows MoviesProvider in component tree
- Browser Network tab: Adding/removing favourite triggers localStorage write but no API call
- Functional test: Refresh page after marking favourite, and the favourite state persists

---

### 3. Favourites Page

**Objective**: Load favourite movie details through the shared context and appropriate fetching patterns.

**Functional Requirements**:
- FavouriteMoviesPage shall read the list of favourite movie IDs from MoviesContext
- For each favourite ID, the page shall fetch full movie details using a react-query query (e.g., `useQuery(['movie', id])`)
- The page shall display a loading state while movie details are being fetched
- The page shall display all favourite movies in the same grid layout as HomePage (via TemplateMovieListPage)
- The page shall render RemoveFromFavourites and WriteReview action buttons on each card
- The page shall apply the same filtering logic (title, genre) as HomePage
- If no favourites exist, the page shall display an appropriate message (e.g., "No favourite movies yet")

**Proof Artifacts**:
- FavouriteMoviesPage component: Uses `useContext(MoviesContext)` to read favouriteIds
- React DevTools: Network tab shows one `GET /3/movie/{id}` call per favourite (cached if visited before)
- Browser UI: Favourites page displays movie grid with RemoveFromFavourites action visible
- Browser UI: Removing a favourite from this page updates both the card list and MoviesContext

---

### 4. Configurable Movie Card Actions

**Objective**: Make MovieCard flexible so different pages can render different action buttons without duplicating the card component.

**Functional Requirements**:
- MovieCard component shall accept a new prop: `actions?: React.ReactNode` (or similar pattern for render-props)
- If `actions` is provided, MovieCard shall render it in the CardActions section instead of hardcoded buttons
- If `actions` is not provided, MovieCard shall render no action buttons (or a default placeholder)
- The render-props or children function pattern shall allow parent components to define what buttons appear and their behavior
- MovieCard shall continue to display favourite indicator, release date, vote average, and poster image (unchanged)
- MovieCard shall accept the movie data and favourite status as existing props (unchanged)

**Proof Artifacts**:
- Code inspection: `src/components/MovieCard.tsx` accepts `actions` prop
- Code inspection: CardActions section conditionally renders `actions` prop
- Code inspection: HomePage, FavouriteMoviesPage, and other list pages pass action components to MovieCard
- Browser UI: Home page cards show AddToFavourites buttons; Favourites page cards show RemoveFromFavourites and WriteReview buttons

---

### 5. Movie Card Action Components

**Objective**: Create reusable action button components for common card behaviors.

#### AddToFavourites Action
- **Location**: `src/components/CardIcons/AddToFavourites.tsx` (or similar)
- **Functional Requirements**:
  - Component receives `movieId: number` as prop
  - On click, component calls `addToFavourites(movieId)` from MoviesContext
  - Button displays a "heart" or "add" icon and label (e.g., "Add to Favourites")
  - Button is only shown if the movie is not already in favourites

#### RemoveFromFavourites Action
- **Location**: `src/components/CardIcons/RemoveFromFavourites.tsx` (or similar)
- **Functional Requirements**:
  - Component receives `movieId: number` as prop
  - On click, component calls `removeFromFavourites(movieId)` from MoviesContext
  - Button displays a "remove" or "trash" icon and label (e.g., "Remove from Favourites")
  - Button is only shown if the movie is already in favourites

#### WriteReview Action
- **Location**: `src/components/CardIcons/WriteReview.tsx` (or similar)
- **Functional Requirements**:
  - Component receives `movieId: number` as prop
  - On click, component navigates to `/movies/:id/review` page
  - Button displays a "pencil" or "edit" icon and label (e.g., "Write Review")
  - Button is only shown on the Favourites page (not on Home page)

---

### 6. Review Form Page

**Objective**: Allow users to write and submit reviews for favourite movies.

**Functional Requirements**:
- Route `/movies/:id/review` shall render a new AddMovieReviewPage component
- AddMovieReviewPage shall:
  - Fetch the movie details using react-query (e.g., `useQuery(['movie', id])`)
  - Display the movie title, poster, and basic info as context
  - Render a form with the following fields:
    - **Review Author** (text input, required, max 100 chars)
    - **Review Title** (text input, required, max 100 chars)
    - **Review Comment** (textarea, required, max 500 chars)
  - Use react-hook-form for form state and validation
  - Display validation error messages below each field if submission is attempted with invalid data
  - Display a "Submit" button that saves the review
  - Display a "Cancel" button that navigates back
  - Display a success message after submission (e.g., "Review submitted successfully")
  - Redirect to Favourites page after successful submission

**Proof Artifacts**:
- Route in main App/Router: `/movies/:id/review` maps to AddMovieReviewPage component
- AddMovieReviewPage component: Renders form with three fields and react-hook-form integration
- Browser UI: Form displays validation errors when attempting to submit with empty fields
- Browser UI: Form shows success message after valid submission
- Browser UI: After submission, user is redirected to Favourites page

---

### 7. Review Submission Flow

**Objective**: Capture and store user-submitted reviews in app state.

**Functional Requirements**:
- When a review form is submitted, the system shall create a review object:
  ```
  {
    id: unique identifier (e.g., timestamp, uuid, or auto-increment),
    movieId: number,
    author: string,
    title: string,
    comment: string,
    createdAt: ISO 8601 timestamp or similar
  }
  ```
- The system shall store submitted reviews in app state (not in localStorage, not sent to TMDB API)
- The system shall provide a way for other components to query reviews by movieId (e.g., a custom hook or context)
- The system shall allow displaying submitted reviews alongside TMDB critic reviews on the movie detail page (optional for Lab 4, but infrastructure shall be in place)

**Proof Artifacts**:
- Code inspection: Review submission handler stores review in app state
- Console inspection: Submitted reviews appear in component state or context
- Browser UI: After submitting a review, the Favourites page data reflects the new review count or indicator
- Browser DevTools: Local storage does NOT contain reviews (they are in-memory only)

---

## Non-Functional Requirements

### Performance
- react-query shall reduce redundant API calls by at least 50% on typical usage flows (e.g., navigating between home and movie details and back)
- Initial page load time shall not increase significantly due to react-query overhead
- MovieCard render time shall not increase significantly due to configurable actions prop

### Maintainability
- API layer functions in `src/api/tmdb-api.ts` shall not change signature; only their internal usage pattern changes (they are wrapped by react-query hooks in calling code, not in the API module itself)
- Existing component prop interfaces may be extended but shall not break (backwards-compatible changes only)
- All new Context and custom hooks shall have clear, self-documenting names and JSDoc comments

### Accessibility
- Form inputs shall have associated labels or ARIA labels
- Error messages shall be announced to screen readers
- Action buttons shall have clear button text or title attributes

### Code Quality
- No console errors or warnings in browser DevTools (except controlled user warnings)
- TypeScript compilation shall pass with no errors
- ESLint rules shall pass (per repository configuration)
- No unused imports or variables

---

## Expected Implementation Direction

### Architecture Changes
- **Add react-query setup**: Import `QueryClient` and `QueryClientProvider` in `src/index.tsx`; wrap app with provider
- **Add MoviesContext**: Create `src/contexts/MoviesContext.tsx` with context definition, provider component, and custom hook (e.g., `useMoviesContext()`)
- **Refactor API calls**: Convert existing `useEffect(() => { getMovies() })` patterns to `useQuery()` hooks
- **Extend MovieCard**: Add `actions` prop; refactor CardActions section to render actions prop
- **Add action components**: Create separate files for AddToFavourites, RemoveFromFavourites, WriteReview actions
- **Add review form page**: Create `src/pages/AddMovieReviewPage.tsx` with react-hook-form integration
- **Update routing**: Add route for `/movies/:id/review` in main router

### Reuse Existing Patterns
- Use existing `TemplateMovieListPage` for home and favourites page layouts
- Use existing `TemplateMoviePage` for movie details pages
- Use existing `useFiltering` hook for filtering logic on favourites page
- Use existing `MovieFilterUI` component for filter controls
- Use existing Material-UI components (Button, TextField, etc.) for form elements
- Use existing TMDB API fetch functions (wrap them with react-query, do not modify signatures)

### What Continues to Work
- Filtering on home and favourites pages (same logic, same UI)
- Displaying TMDB reviews on movie detail page
- Movie grid layout and styling
- Navigation and routing
- Site header and footer

### What Changes
- Favourites are now stored in Context (not localStorage, though localStorage is used only for hydration)
- MovieCard action buttons are now configurable (not hardcoded)
- API calls are now cached (pages may show stale data briefly on refresh until cache expires)
- Favourites page now displays fetched movie details (not just stored data)
- New page added for writing reviews

---

## Likely Files To Add

- `src/contexts/MoviesContext.tsx` — Context, Provider, custom hook for favourites state
- `src/components/CardIcons/AddToFavourites.tsx` — Action component for adding to favourites
- `src/components/CardIcons/RemoveFromFavourites.tsx` — Action component for removing from favourites
- `src/components/CardIcons/WriteReview.tsx` — Action component for navigating to review form
- `src/pages/AddMovieReviewPage.tsx` — Page with review form and submission
- `src/hooks/useReviews.ts` — Custom hook for managing/querying submitted reviews (optional)
- `src/components/ReviewForm/ReviewForm.tsx` — Reusable form component (optional, may inline in page)
- `specs/lab4-caching-context-reviews/spec.md` — This specification

---

## Likely Files To Modify

- `src/index.tsx` — Wrap app with QueryClientProvider and MoviesProvider
- `src/pages/HomePage.tsx` — Use useQuery for movies, use context for favourites
- `src/pages/FavouriteMoviesPage.tsx` — Use context to read favourite IDs, fetch movie details with useQuery
- `src/pages/MovieDetailsPage.tsx` — Use useQuery for movie data
- `src/pages/MovieReviewPage.tsx` — Use useQuery for reviews (if it exists in Lab 3)
- `src/components/MovieCard.tsx` — Add `actions` prop, refactor CardActions
- `src/components/MovieList.tsx` — Pass action components to MovieCard
- `src/components/TemplateMovieListPage.tsx` — Update prop handling for actions if needed
- `src/api/tmdb-api.ts` — (No changes to function signatures; react-query wraps them)
- `src/types/movieAppTypes.ts` — Add new types for review objects if needed
- `src/hooks/useMovie.ts` — May be refactored or replaced with react-query hooks
- `src/hooks/useFiltering.ts` — No changes expected

---

## Repository Standards

The implementation shall follow these established patterns from the repository:

1. **API Layer**: All TMDB API calls shall use the existing fetch functions in `src/api/tmdb-api.ts`. New API functions are not needed; instead, wrap these functions with react-query hooks in the component/hook layer.

2. **Component Structure**: Components shall be functional components with hooks. Props shall be explicit and typed with TypeScript interfaces.

3. **Material-UI Styling**: Use Material-UI components (Button, Card, TextField, etc.) and the `sx` prop for styling, not inline styles or CSS files.

4. **Custom Hooks**: Extract stateful logic into custom hooks (e.g., `useMoviesContext`, `useMovieQuery`). Hooks shall be located in `src/hooks/` or co-located with their consuming component.

5. **Typing**: All React components and functions shall have explicit TypeScript types. Avoid `any` type unless unavoidable. Use types generated from OpenAPI spec where available.

6. **File Organization**: 
   - Pages in `src/pages/`
   - Components in `src/components/`
   - Hooks in `src/hooks/`
   - Contexts in `src/contexts/`
   - API layer in `src/api/`
   - Types in `src/types/`

7. **Error Handling**: Components that fetch data shall handle loading, error, and success states. Display appropriate UI for each state (loader, error message, data).

8. **Navigation**: Use React Router v6 patterns (`useNavigate`, `Link`, route definitions in App/Router component).

---

## Acceptance Criteria

All of the following must be true for Lab 4 to be considered complete:

### Server-State Caching
- [ ] react-query QueryClientProvider is initialized and wraps the app in `src/index.tsx`
- [ ] At least three react-query `useQuery` hooks are used in the application (e.g., for movies list, movie detail, reviews)
- [ ] Browser Network tab shows zero redundant API calls when revisiting cached pages within cache duration
- [ ] Loading and error states are rendered correctly (no undefined/null crashes)

### Favourites Context
- [ ] `src/contexts/MoviesContext.tsx` exists and exports a context, provider, and custom hook
- [ ] MoviesProvider wraps the app in `src/index.tsx`
- [ ] Favourites state is read and modified exclusively through the context (no direct localStorage writes except for hydration)
- [ ] Favourites persist after browser refresh (via localStorage hydration on app init)

### Favourites Page
- [ ] FavouriteMoviesPage fetches movie details for each favourite ID using react-query
- [ ] Favourites page displays movies in the same grid layout as HomePage
- [ ] Filtering (title, genre) works on the Favourites page
- [ ] "No favourites" message is displayed when no favourite movies exist

### Configurable Card Actions
- [ ] MovieCard component accepts an `actions` prop and renders it in CardActions
- [ ] HomePage passes AddToFavourites action component to MovieCard
- [ ] FavouriteMoviesPage passes RemoveFromFavourites and WriteReview action components to MovieCard
- [ ] Adding/removing a favourite updates the card immediately and persists through context

### Review Form Page
- [ ] `/movies/:id/review` route renders AddMovieReviewPage component
- [ ] AddMovieReviewPage displays a form with three fields (author, title, comment)
- [ ] Form uses react-hook-form for validation
- [ ] Form displays validation errors for required fields
- [ ] Submitting a valid form stores the review in app state and redirects to Favourites page
- [ ] Cancelling the form navigates back without saving

### General
- [ ] No TypeScript compilation errors
- [ ] No ESLint errors
- [ ] No console errors in browser DevTools
- [ ] All Lab 3 features continue to work (filtering, TMDB reviews display, movie details, home page)

---

## Evidence Required

To validate that Lab 4 is complete, the following evidence must be gathered and presented:

### Network & Performance
1. **Cache Hit Screenshot**: Browser DevTools Network tab showing a revisited page with zero API calls to `/discover/movie` endpoint
2. **React Query DevTools**: Screenshot showing cached queries, their data, and timestamps
3. **Multiple Page Navigation**: Recorded browser session showing:
   - Navigate to Home (first load: API call)
   - Navigate to Movie Details (API call)
   - Navigate back to Home (second load: no API call, uses cache)

### Favourites Context
4. **Context File**: Code inspection of `src/contexts/MoviesContext.tsx` showing context definition, provider, and hook
5. **Provider Integration**: Code inspection of `src/index.tsx` showing MoviesProvider wrapping the app
6. **Context Usage**: Code inspection of HomePage and FavouriteMoviesPage showing `useContext(MoviesContext)` calls
7. **Persistence Test**: Browser UI showing:
   - Add a favourite on Home page
   - Refresh the page
   - Verify the favourite still exists (localStorage persisted and context hydrated it)

### Favourites Page
8. **Favourites Page UI**: Screenshot showing Favourites page with:
   - Movie grid layout (same as Home)
   - Filtering controls (title, genre)
   - "No favourites" message when empty
   - Movies displayed when favourites exist
9. **Loading State**: Screenshot showing loading indicator while movie details are fetched

### Configurable Actions
10. **Home Page Actions**: Screenshot showing AddToFavourites button on each card
11. **Favourites Page Actions**: Screenshot showing RemoveFromFavourites and WriteReview buttons on each card
12. **Action Code**: Code inspection of `src/components/CardIcons/` showing action component files

### Review Form
13. **Route Definition**: Code inspection showing `/movies/:id/review` route in router configuration
14. **Form UI**: Screenshot of AddMovieReviewPage form with:
    - Author input field
    - Title input field
    - Comment textarea
    - Submit and Cancel buttons
15. **Validation Error**: Screenshot showing form with validation errors (e.g., required field empty)
16. **Successful Submission**: Screenshot showing success message after valid form submission
17. **Redirect**: Screenshot showing redirect to Favourites page after submission

### Integration
18. **End-to-End Flow**: Recorded browser session demonstrating:
    - Discover a movie on Home page
    - Add it to Favourites
    - Navigate to Favourites page
    - Click "Write Review" on a movie card
    - Fill in the form with valid data
    - Submit the form
    - See success message
    - Verify redirected to Favourites page

### Code Quality
19. **TypeScript Build**: Terminal output showing `tsc` compilation passes with no errors
20. **ESLint Output**: Terminal output showing `eslint` passes with no errors
21. **Browser Console**: Screenshot of browser console showing no errors or warnings

---

## Open Questions

1. **react-query cache duration**: Should the default cache duration (5 minutes) be kept, or should it be customized per query type (e.g., shorter for favourite IDs, longer for movie details)?
   
2. **Review storage**: Should submitted reviews be stored in app-level state (e.g., in a reviews reducer in the MoviesContext), or in a separate ReviewsContext? Recommend: separate ReviewsContext for clarity.

3. **Optimistic updates**: Should adding/removing a favourite show immediate UI feedback (optimistic update) or wait for the context state to update? Recommend: immediate UI feedback via local state transitions.

4. **Stale-while-revalidate**: Should pages show stale cached data while refetching, or wait for fresh data? Recommend: show stale data briefly, then update when fresh data arrives (react-query default behavior).

---

## Next Steps

Once this spec is approved, proceed to **SDD-2-generate-task-list-from-spec** to:
1. Generate parent tasks and subtasks based on each functional requirement
2. Create a baseline planning commit (spec + tasks)
3. Run a planning audit to identify missing details or misalignments
4. Present audit findings for review before implementation begins

