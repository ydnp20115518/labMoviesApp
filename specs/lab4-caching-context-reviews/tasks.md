# Lab 4: Server-State Caching, Favourites Context, and Review Forms

## Planning Assumptions

- **Starting Point**: Lab 3 solution is complete and working (routing, filtering, favourites via localStorage, movie details, reviews display).
- **Incremental Change**: All tasks maintain backward compatibility with Lab 3 features unless explicitly changed.
- **Pattern Reuse**: Existing component composition patterns, custom hooks structure, and page templates are preserved.
- **Architecture Decisions**: 
  - react-query wraps all API calls (getMovies, getMovie, getMovieReviews).
  - React Context (MoviesContext) manages shared favourites state app-wide.
  - Configurable actions use render-props pattern (children/actions prop).
  - Review form uses react-hook-form for validation.
  - Reviews stored in app state (in-memory or sessionStorage), not persisted to API.
- **Repository Standards**: Follow existing ESLint config, TypeScript patterns, Material-UI component usage, and custom hook conventions from Lab 3.

---

## Feature Reference

| Functional Requirement | Mapped to Tasks |
| --- | --- |
| Server-state caching with react-query | 1.0, 2.0, 3.0 |
| Shared favourites context | 1.0, 4.0, 5.0 |
| Configurable movie card actions | 2.0, 3.0 |
| AddToFavourites action | 3.0 |
| RemoveFromFavourites action | 3.0 |
| WriteReview action | 3.0 |
| Review form page and routing | 4.0 |
| Review form with validation | 4.0 |
| Review submission and storage | 4.0 |
| Favourites page refactor | 5.0 |
| Home page refactor | 4.0 |
| All Lab 3 features preserved | 6.0 |

---

## Tasks

### [x] 1.0 Setup react-query Provider and QueryClient

**Goal**: Initialize react-query infrastructure at the app root so all components can use useQuery for caching.

**Spec Sections Covered**: 
- Server-State Caching (setup only)
- Expected Functional Behaviour § 1 (Provider setup)

**Demoable Outcome**: 
- QueryClientProvider wraps the app
- React Query DevTools panel is accessible in browser
- No console errors from missing provider

**Likely Files Affected**:
- `src/index.tsx` (add QueryClientProvider)
- `vite.config.ts` (optional: devtools setup)

#### 1.0 Proof Artifact(s)

- **Browser DevTools React**: Component tree shows `<QueryClientProvider>` wrapping app
- **React Query DevTools panel**: Accessible in browser dev tools or console; shows empty queries initially
- **Console**: No warnings or errors about missing provider or query client setup
- **Code inspection**: `src/index.tsx` initializes QueryClient and wraps App with QueryClientProvider

#### 1.0 Tasks

TBD

---

### [x] 2.0 Create MoviesContext for Shared Favourites State

**Goal**: Replace localStorage-based favourites with a React Context that manages shared favourites state across the app and persists to localStorage.

**Spec Sections Covered**:
- Shared Favourites Context
- Expected Functional Behaviour § 2 (Favourites Context)
- Non-Functional Requirements (accessibility, code quality)

**Demoable Outcome**:
- `MoviesContext` is created and exported
- `MoviesProvider` wraps the app in `src/index.tsx`
- Context provides `favouriteIds`, `addToFavourites`, `removeFromFavourites`, `isFavourite` functions
- localStorage is read on app initialization and written on every add/remove
- Browser refresh preserves favourites

**Likely Files Affected**:
- `src/contexts/MoviesContext.tsx` (new file)
- `src/index.tsx` (add MoviesProvider)
- `src/types/movieAppTypes.ts` (optional: add context types if needed)

#### 2.0 Proof Artifact(s)

- **Code inspection**: `src/contexts/MoviesContext.tsx` exists with context + provider + custom hook (useMoviesContext)
- **Code inspection**: `src/index.tsx` wraps `<App>` with `<MoviesProvider>`
- **Browser DevTools React**: Components tab shows MoviesProvider in tree
- **Functional test**: Add favourite, refresh page, favourite persists (localStorage write + read verified)
- **Console**: No warnings about missing context or provider

#### 2.0 Tasks

TBD

---

### [x] 3.0 Refactor API Hooks to Use react-query Queries

**Goal**: Convert manual `useState` + `useEffect` patterns to react-query useQuery hooks for getMovies, getMovie, and getMovieReviews.

**Spec Sections Covered**:
- Server-State Caching (queries and query keys)
- Expected Functional Behaviour § 1 (caching behaviour, loading/error states)

**Demoable Outcome**:
- `useMoviesQuery` hook wraps getMovies with ['movies'] query key
- `useMovieQuery` hook wraps getMovie with ['movie', id] query key
- `useMovieReviewsQuery` hook wraps getMovieReviews with ['movie', id, 'reviews'] query key
- All hooks return `{ data, isLoading, isError, error }` (or similar)
- Components using these hooks display appropriate loading and error states
- Network tab shows zero redundant requests when revisiting cached pages

**Likely Files Affected**:
- `src/hooks/useMoviesQuery.ts` (new: wraps getMovies)
- `src/hooks/useMovieQuery.ts` (new: wraps getMovie)
- `src/hooks/useMovieReviewsQuery.ts` (new: wraps getMovieReviews)
- `src/api/tmdb-api.ts` (no changes; functions remain as-is)

#### 3.0 Proof Artifact(s)

- **Code inspection**: Three query hooks exist with appropriate query keys and return types
- **Browser Network tab**: Revisiting home page shows zero `/discover/movie` calls (cache hit)
- **Browser Network tab**: Revisiting movie details page shows zero `/movie/{id}` calls (cache hit)
- **React Query DevTools**: Shows cached query entries with timestamps and data
- **Console**: No warnings about unstable query keys or missing dependencies

#### 3.0 Tasks

TBD

---

### [ ] 4.0 Refactor MovieCard to Support Configurable Actions

**Goal**: Convert MovieCard to accept a configurable `actions` prop (render-props style) so different pages can render different action buttons without duplicating the component.

**Spec Sections Covered**:
- Configurable Movie Card Actions
- Expected Functional Behaviour § 4 (flexible actions, render-props pattern)

**Demoable Outcome**:
- MovieCard accepts `actions?: React.ReactNode` prop
- If `actions` provided, CardActions section renders the actions node
- If `actions` not provided, CardActions section is empty (no hardcoded buttons)
- MovieCard still displays poster, title, release date, vote average, favourite indicator
- Card favourite indicator remains independent of actions prop

**Likely Files Affected**:
- `src/components/MovieCard.tsx` (refactor CardActions section and prop interface)
- `src/types/movieAppTypes.ts` (update MovieCardProps type)

#### 4.0 Proof Artifact(s)

- **Code inspection**: MovieCard.tsx accepts `actions?: React.ReactNode` prop
- **Code inspection**: CardActions conditionally renders actions prop
- **Code inspection**: Favourite indicator (avatar with FavoriteIcon) remains unchanged
- **Browser UI**: MovieCard renders correctly without crashes when actions not provided
- **TypeScript**: No errors in component prop types

#### 4.0 Tasks

TBD

---

### [ ] 5.0 Implement Card Action Components

**Goal**: Create reusable action button components for common card behaviours (AddToFavourites, RemoveFromFavourites, WriteReview).

**Spec Sections Covered**:
- Movie Card Action Components (all three variants)
- Expected Functional Behaviour § 5 (action buttons, conditional visibility)

**Demoable Outcome**:
- `AddToFavourites` component: receives movieId, calls addToFavourites from context, displays "Add to Favourites" button, only shown if not already favourite
- `RemoveFromFavourites` component: receives movieId, calls removeFromFavourites from context, displays "Remove from Favourites" button, only shown if already favourite
- `WriteReview` component: receives movieId, navigates to `/movies/:id/review` on click, displays "Write Review" button
- All components use Material-UI Button and Icon components
- All components integrate with MoviesContext for favourite status

**Likely Files Affected**:
- `src/components/CardActions/AddToFavourites.tsx` (new)
- `src/components/CardActions/RemoveFromFavourites.tsx` (new)
- `src/components/CardActions/WriteReview.tsx` (new)
- `src/types/movieAppTypes.ts` (optional: action component prop types)

#### 5.0 Proof Artifact(s)

- **Code inspection**: Three action components exist in `src/components/CardActions/`
- **Code inspection**: Each component reads/calls appropriate context methods
- **Code inspection**: Conditional rendering logic prevents both Add and Remove from showing on same card
- **Browser UI**: Home page cards show AddToFavourites button
- **Browser UI**: Favourites page cards show RemoveFromFavourites and WriteReview buttons
- **Browser interaction**: Adding/removing favourite updates button visibility immediately

#### 5.0 Tasks

TBD

---

### [ ] 6.0 Refactor HomePage to Use Context + react-query + Configurable Actions

**Goal**: Update HomePage to fetch movies via react-query, consume shared favourites context, and render cards with configurable AddToFavourites actions.

**Spec Sections Covered**:
- Server-State Caching § Home page usage
- Favourites Context § Shared state consumption
- Configurable Movie Card Actions § Home page variant

**Demoable Outcome**:
- HomePage uses `useMoviesQuery` hook (replaces direct `getMovies()` call)
- HomePage displays loading state while fetching
- HomePage displays error state gracefully if API fails
- HomePage calls `addToFavourites` from MoviesContext (no local state for favourites)
- HomePage renders AddToFavourites action component on each card
- Filtering (title, genre) still works as in Lab 3
- No favourite indicator shows on home page cards (indicator only on Favourites page)

**Likely Files Affected**:
- `src/pages/HomePage.tsx` (refactor to use hooks)
- `src/components/TemplateMovieListPage.tsx` (optional: extend for action prop passing)

#### 6.0 Proof Artifact(s)

- **Code inspection**: HomePage imports and uses `useMoviesQuery` hook
- **Code inspection**: HomePage reads favouriteIds from `useMoviesContext()`
- **Code inspection**: HomePage passes AddToFavourites action to card rendering
- **Browser UI**: Home page displays loading state while fetching
- **Browser UI**: Filtering still works; title and genre filters display correct results
- **Browser UI**: Adding favourite updates both context and removes card from home page (or shows updated state)
- **React Query DevTools**: Shows ['movies'] query with data and cache hit on revisit

#### 6.0 Tasks

TBD

---

### [ ] 7.0 Refactor FavouriteMoviesPage to Use Context + react-query + Configurable Actions

**Goal**: Update FavouriteMoviesPage to read favourite IDs from shared context, fetch movie details via react-query, and render cards with RemoveFromFavourites and WriteReview actions.

**Spec Sections Covered**:
- Favourites Context § Shared state consumption
- Favourites Page
- Server-State Caching § Favourites page usage
- Expected Functional Behaviour § 3 (Favourites page)

**Demoable Outcome**:
- FavouriteMoviesPage reads favouriteIds from MoviesContext (no localStorage)
- For each favouriteId, page fetches movie details using `useMovieQuery` (or similar)
- Page displays loading state while fetching movie details
- Page displays RemoveFromFavourites and WriteReview actions on each card
- Filtering (title, genre) works as in Lab 3
- Removing a favourite removes it from page immediately and updates context
- If no favourites, page displays "No favourite movies yet" message

**Likely Files Affected**:
- `src/pages/FavouriteMoviesPage.tsx` (major refactor)
- `src/hooks/` (optional: new hook for fetching multiple movies in parallel)

#### 7.0 Proof Artifact(s)

- **Code inspection**: FavouriteMoviesPage imports and uses `useMoviesContext()`
- **Code inspection**: FavouriteMoviesPage uses `useMovieQuery` or similar to fetch each favourite movie
- **Browser UI**: Favourites page displays movie grid with RemoveFromFavourites and WriteReview buttons
- **Browser UI**: Removing a favourite removes it from page immediately
- **Browser UI**: Empty state message displays when no favourites
- **Browser UI**: Filtering works correctly on favourites page
- **Network tab**: Multiple `GET /movie/{id}` requests (one per favourite) with caching on revisit

#### 7.0 Tasks

TBD

---

### [ ] 8.0 Create AddMovieReviewPage with Form and Routing

**Goal**: Create a new route `/movies/:id/review` that renders a review form page allowing users to write reviews for favourite movies with validation and submission.

**Spec Sections Covered**:
- Review Form Page
- Review Submission Flow
- Expected Functional Behaviour § 6 & 7 (form, submission, routing)
- Non-Functional Requirements (accessibility, code quality)

**Demoable Outcome**:
- Route `/movies/:id/review` exists and renders AddMovieReviewPage
- AddMovieReviewPage fetches movie details using `useMovieQuery`
- AddMovieReviewPage displays movie title, poster, and basic info as context
- AddMovieReviewPage renders form with three fields (author, title, comment) using react-hook-form
- Form validates required fields and max length (author 100 chars, title 100 chars, comment 500 chars)
- Form displays validation error messages below each field
- Form Submit button saves review to app state (in-memory or sessionStorage)
- Form displays success message after submission
- Form Cancel button navigates back to previous page
- After successful submission, user is redirected to Favourites page

**Likely Files Affected**:
- `src/pages/AddMovieReviewPage.tsx` (new)
- `src/index.tsx` (add new route)
- `src/contexts/MoviesContext.tsx` (optional: add review submission handler)
- `src/types/movieAppTypes.ts` (add Review type)

#### 8.0 Proof Artifact(s)

- **Code inspection**: AddMovieReviewPage.tsx exists with react-hook-form integration
- **Code inspection**: Form fields have validation rules (required, maxLength)
- **Route in App**: `/movies/:id/review` route exists and renders AddMovieReviewPage
- **Browser UI**: Navigating to `/movies/550/review` displays movie poster and form
- **Browser UI**: Submitting empty form shows validation error messages
- **Browser UI**: Submitting valid form shows success message and redirects to Favourites page
- **Browser DevTools**: localStorage/sessionStorage shows no review data (in-memory only)

#### 8.0 Tasks

TBD

---

### [ ] 9.0 Implement Review Submission and App-State Storage

**Goal**: Build infrastructure for storing submitted reviews in app state and provide query mechanism for other components to retrieve reviews by movie ID.

**Spec Sections Covered**:
- Review Submission Flow
- Expected Functional Behaviour § 7 (review storage and querying)

**Demoable Outcome**:
- Review submission handler creates review object with id, movieId, author, title, comment, createdAt
- Reviews stored in app state (not localStorage, not API)
- Custom hook `useReviewsByMovieId(movieId)` returns reviews for a given movie
- After form submission, review appears in app state (console-verifiable)
- Optional: Movie detail page shows indicator that a review was submitted

**Likely Files Affected**:
- `src/contexts/MoviesContext.tsx` (add review state and submission handler)
- `src/hooks/useReviewsByMovieId.ts` (new: query reviews by movieId)
- `src/types/movieAppTypes.ts` (add Review type definition)

#### 9.0 Proof Artifact(s)

- **Code inspection**: MoviesContext has review state and submission handler
- **Code inspection**: Custom hook useReviewsByMovieId exists and returns reviews for a movieId
- **Console inspection**: After form submission, review appears in context/app state
- **Browser DevTools**: localStorage/sessionStorage does NOT contain reviews
- **Functional test**: Submit review for movie A, then submit review for movie B; querying reviews for A returns only movie A's review

#### 9.0 Tasks

TBD

---

### [ ] 10.0 Verify All Lab 3 Features Still Work

**Goal**: Ensure that all existing Lab 3 functionality (filtering, favourites, movie details, reviews display) continues to work correctly after Lab 4 refactoring.

**Spec Sections Covered**:
- Expected Functional Behaviour (all sections)
- Non-Functional Requirements (no breaking changes)

**Demoable Outcome**:
- Home page filtering (title, genre) works correctly
- Favourites page filtering works correctly
- Movie details page loads and displays correctly
- Movie reviews drawer/section displays TMDB critic reviews correctly
- Adding/removing favourites updates UI immediately
- Page navigation works without errors or console warnings
- TypeScript compilation passes with no errors
- ESLint validation passes with no errors

**Likely Files Affected**:
- All modified files from tasks 1.0-9.0 (integration testing)

#### 10.0 Proof Artifact(s)

- **TypeScript compilation**: `npm run build` passes with no errors
- **ESLint check**: `npm run lint` passes with no errors
- **Console**: Browser console shows no errors or warnings
- **Browser UI - Home page**: Title filter works; genre filter works; cards display; favourite button works
- **Browser UI - Favourites page**: Displays only favourite movies; filters work; remove button works; favourite counter or indicator updated
- **Browser UI - Movie details**: Movie details load; reviews section displays TMDB critic reviews correctly
- **Browser UI - Navigation**: All navigation links work; no broken routes
- **Functional test**: Complete user flow: home → filter → add favourite → navigate to favourites → view movie details → back to home → remove favourite

#### 10.0 Tasks

TBD

---

## Task Dependencies

```
1.0 (Provider Setup)
 ↓
2.0 (Context Creation) ← must come after 1.0 (provider runs before context)
 ↓
3.0 (Query Hooks) ← must come after 1.0 (needs provider)
 ↓
4.0 (MovieCard Refactor) ← independent but needed before action components
 ↓
5.0 (Action Components) ← needs 2.0 (context) and 4.0 (actions prop)
 ↓
6.0 (HomePage Refactor) ← needs 2.0, 3.0, 4.0, 5.0
7.0 (FavouriteMoviesPage Refactor) ← needs 2.0, 3.0, 4.0, 5.0
 ↓ ↓
8.0 (Review Form Page) ← needs 2.0, 3.0
 ↓
9.0 (Review Storage) ← needs 8.0 to define form structure
 ↓
10.0 (Verification) ← depends on all others being complete
```

---

## Planning Audit Considerations

1. **Requirement-to-Test Traceability**: Every functional requirement in the spec maps to at least one proof artifact in the parent tasks.
2. **Caching Verification**: Network tab and React Query DevTools screenshots demonstrate cache hits and no redundant requests.
3. **Context Integration**: MoviesContext is used consistently across HomePage, FavouriteMoviesPage, and action components with no prop drilling.
4. **Backward Compatibility**: All Lab 3 features (filtering, navigation, reviews display) are validated in Task 10.0.
5. **Validation Coverage**: Task 8.0 includes form validation tests; Task 10.0 includes full workflow validation.
6. **Configuration Consistency**: All uses of react-query follow the same query key naming convention ([entity] or [entity, id]).

---

## Validation Coverage Map

| Feature | Validation Task | Proof Artifact | Priority |
| --- | --- | --- | --- |
| Server-state caching (movies list) | 3.0, 10.0 | Network tab cache hit; React Query DevTools | CRITICAL |
| Server-state caching (movie details) | 3.0, 10.0 | Network tab cache hit; React Query DevTools | CRITICAL |
| Server-state caching (reviews) | 3.0, 10.0 | Network tab cache hit; React Query DevTools | CRITICAL |
| Favourites Context persistence | 2.0, 10.0 | localStorage read/write; refresh test | CRITICAL |
| Favourites Context shared state | 2.0, 6.0, 7.0 | AddToFavourites updates Favourites page immediately | CRITICAL |
| Configurable card actions | 4.0, 5.0, 6.0, 7.0 | Home page shows AddTo; Favourites shows RemoveFrom + WriteReview | CRITICAL |
| Review form validation | 8.0 | Form error messages displayed for invalid inputs | CRITICAL |
| Review submission | 8.0, 9.0 | Success message + redirect; review in app state | CRITICAL |
| Home page filtering | 6.0, 10.0 | Title and genre filters return correct results | MAJOR |
| Favourites page filtering | 7.0, 10.0 | Title and genre filters on favourites | MAJOR |
| Movie details display | 10.0 | Movie info loads and displays | MAJOR |
| TMDB reviews display | 10.0 | Critic reviews show in details page | MAJOR |
| Navigation | 10.0 | All routes accessible without errors | MAJOR |
| TypeScript compilation | 10.0 | `npm run build` succeeds | BLOCKING |
| ESLint validation | 10.0 | `npm run lint` succeeds | BLOCKING |

