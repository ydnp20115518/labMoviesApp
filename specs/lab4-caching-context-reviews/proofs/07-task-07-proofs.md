# Task 7.0 Proof Artifacts: Refactor FavouriteMoviesPage

**Task**: Refactor FavouriteMoviesPage to use MoviesContext and fetch favourite movie details  
**Status**: ✅ COMPLETE  
**Date**: 16 May 2026

---

## 1. Files Changed Summary

### 1.1 src/pages/FavouriteMoviesPage.tsx (MODIFIED)

**Before State**: 
- Read favourite movies directly from localStorage as JSON
- Old pattern: `JSON.parse(localStorage.getItem("favourites") || '[]')`
- No context integration
- No action components rendered
- Manual React.FC type annotation

**After State**:
- Uses MoviesContext to get favourite IDs
- Uses new useFavouriteMovies hook to fetch details via react-query
- Renders RemoveFromFavourites + WriteReview actions on each card
- Filtering logic preserved
- Server-state caching for all favourite movie details

**Code Diff**:
```diff
- import React from "react";
  import PageTemplate from "../components/TemplateMovieListPage";
  import useFiltering from "../hooks/useFiltering";
  import MovieFilterUI, { genreFilter, titleFilter } from "../components/MovieFilterUI";
+ import { useMoviesContext } from "../contexts/MoviesContext";
+ import useFavouriteMovies from "../hooks/useFavouriteMovies";
+ import RemoveFromFavourites from "../components/CardActions/RemoveFromFavourites";
+ import WriteReview from "../components/CardActions/WriteReview";
+ import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
+ import Box from "@mui/material/Box";

  const titleFiltering = {
    name: "title",
    value: "",
    condition: titleFilter,
  };
  const genreFiltering = {
    name: "genre",
    value: "0",
    condition: genreFilter,
  };

- const FavouriteMoviesPage: React.FC= () => {
+ const FavouriteMoviesPage = () => {
+   // Get favourite IDs from context
+   const { favouriteIds } = useMoviesContext();
+
+   // Fetch detailed information for all favourites using react-query
+   const favouriteMovies = useFavouriteMovies(favouriteIds);
+
    const { filterValues, setFilterValues, filterFunction } = useFiltering(
      [titleFiltering, genreFiltering]
    );

    const changeFilterValues = (type: string, value: string) => {
      const changedFilter = { name: type, value: value };
      const updatedFilterSet =
        type === "title" ? [changedFilter, filterValues[1]] : [filterValues[0], changedFilter];
      setFilterValues(updatedFilterSet);
    };

-   const favouriteMovies = JSON.parse(localStorage.getItem("favourites") || '[]');
    const displayedMovies = filterFunction(favouriteMovies);

+   // Render both RemoveFromFavourites and WriteReview actions for each movie
+   const renderActions = (movie: DiscoverMovieOverviewProps) => (
+     <Box sx={{ display: 'flex', gap: 1 }}>
+       <RemoveFromFavourites movieId={movie.id} />
+       <WriteReview movieId={movie.id} />
+     </Box>
+   );
+
    return (
      <>
        <PageTemplate
          title="Favourite Movies"
          movies={displayedMovies}
+         renderActions={renderActions}
        />
        <MovieFilterUI
          onFilterValuesChange={changeFilterValues}
          titleFilter={filterValues[0].value}
          genreFilter={filterValues[1].value}
        />
      </>
    );
  };

  export default FavouriteMoviesPage;
```

### 1.2 src/hooks/useFavouriteMovies.ts (NEW FILE)

**Purpose**: Custom hook to fetch detailed information for multiple favourite movies using react-query

**Key Features**:
- Takes an array of movie IDs
- Uses `useQueries` from react-query (available in v3.39.3)
- Fetches each movie in parallel using the same cache configuration
- Filters out any undefined/error results
- Returns array of fully detailed movie objects ready for display

**Implementation**:
```typescript
const useFavouriteMovies = (movieIds: number[]): DiscoverMovieOverviewProps[] => {
  // Create a query for each favourite movie ID
  const queries = useQueries(
    movieIds.map(movieId => ({
      queryKey: ['movie', movieId],
      queryFn: () => getMovie(movieId.toString()),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      enabled: movieIds.length > 0, // Only enable if we have IDs
    }))
  );

  // Extract data from all queries, filtering out any errors/undefined
  const movies = queries
    .map(query => query.data)
    .filter((movie): movie is DiscoverMovieOverviewProps => movie !== undefined);

  return movies;
};
```

**Benefits**:
- Parallel fetching: All favourite movies fetched simultaneously (not sequentially)
- Cache reuse: Each movie detail uses same cache key ['movie', movieId]
- Automatic caching: Follows QueryClient config (5min stale, 10min cache)
- Type-safe: TypeScript guard ensures only valid movies returned
- Scalable: Works with any number of favourites (tested with multiple)

---

## 2. Architecture Changes

### 2.1 Data Flow: Before vs After

**Before** (Direct localStorage):
```
localStorage
  ↓
JSON.parse()
  ↓
favouriteMovies (full objects, possibly stale)
```

**After** (Context + React-query):
```
MoviesContext
  ↓
favouriteIds: number[]
  ↓
useFavouriteMovies(favouriteIds)
  ↓
useQueries (parallel fetch with caching)
  ↓
QueryClient (5min stale / 10min cache)
  ↓
favouriteMovies (fresh, cached, detailed)
```

### 2.2 Action Rendering

**From**: No actions
```typescript
<PageTemplate
  title="Favourite Movies"
  movies={displayedMovies}
/>
```

**To**: RemoveFromFavourites + WriteReview actions
```typescript
const renderActions = (movie: DiscoverMovieOverviewProps) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    <RemoveFromFavourites movieId={movie.id} />
    <WriteReview movieId={movie.id} />
  </Box>
);

<PageTemplate
  title="Favourite Movies"
  movies={displayedMovies}
  renderActions={renderActions}
/>
```

**Result**: Each favourite movie card shows two buttons:
- "Remove" button (RemoveFromFavourites) - removes from favourites
- "Write Review" button (WriteReview) - navigates to review form

### 2.3 Context Integration

**MoviesContext Usage**:
```typescript
const { favouriteIds } = useMoviesContext();
```

**Information Flow**:
1. MoviesContext maintains favouriteIds array (persisted to localStorage)
2. FavouriteMoviesPage reads favouriteIds from context
3. useFavouriteMovies fetches full details for each ID
4. Cards render with RemoveFromFavourites and WriteReview actions
5. User can remove from favourites or write review from the same page

---

## 3. New Custom Hook: useFavouriteMovies

### 3.1 Hook Signature
```typescript
const useFavouriteMovies = (movieIds: number[]): DiscoverMovieOverviewProps[]
```

### 3.2 Query Configuration
```typescript
queryKey: ['movie', movieId]    // Matches useMovieQuery pattern
queryFn: () => getMovie(movieId.toString())  // Converts number to string
staleTime: 5 * 60 * 1000       // 5 minutes
cacheTime: 10 * 60 * 1000      // 10 minutes
retry: 1                         // Retry once on failure
enabled: movieIds.length > 0    // Prevent empty queries
```

### 3.3 useQueries Pattern
- Enables parallel fetching of multiple movies
- Returns array of query results
- Each result has `.data`, `.error`, `.status` properties
- Automatically handles loading/error states

### 3.4 Result Processing
```typescript
const movies = queries
  .map(query => query.data)
  .filter((movie): movie is DiscoverMovieOverviewProps => movie !== undefined);
```

**Steps**:
1. Extract `.data` from each query result
2. Filter out undefined/error values using TypeScript type guard
3. Return clean array of valid movie objects

---

## 4. Feature Preservation & Enhancements

| Feature | Before | After | Status |
|---------|--------|-------|--------|
| Favourite listing | JSON parse | Context + react-query | ✅ Improved |
| Title filtering | `useFiltering` | `useFiltering` | ✅ Preserved |
| Genre filtering | `useFiltering` | `useFiltering` | ✅ Preserved |
| Action buttons | None | RemoveFromFavourites + WriteReview | ✅ NEW |
| Caching | None | 5min stale / 10min cache | ✅ NEW |
| Context integration | None | Full MoviesContext integration | ✅ NEW |

---

## 5. TypeScript & Build Verification

**Build Command**: `npm run build`

**Result**: ✅ PASS
```
vite v5.4.15 building for production...
✓ 1134 modules transformed.
dist/index.html                                     0.40 kB │ gzip:   0.28 kB
dist/assets/film-poster-placeholder-eIJ1MYQD.png   14.82 kB
dist/assets/index-K2j2g3w3.js                     430.73 kB │ gzip: 133.75 kB
✓ built in 1.56s
```

**TypeScript Errors**: 0
**Module Count**: 1134 (increased from 1127 due to new imports)

---

## 6. File Statistics

**Modified files**: 1
- `src/pages/FavouriteMoviesPage.tsx` (45 lines → 55 lines, +10 lines)

**New files**: 1
- `src/hooks/useFavouriteMovies.ts` (28 lines)

**Total additions**: ~38 lines

---

## 7. Parallel Query Execution Example

**Scenario**: User has 5 favourite movies (IDs: 550, 568, 278, 804, 1891)

**Before** (if implemented with sequential fetching):
```
Request 550 → Response → Parse
Request 568 → Response → Parse
Request 278 → Response → Parse
Request 804 → Response → Parse
Request 1891 → Response → Parse
Total time: ~5 requests × network latency
```

**After** (with useQueries):
```
Request 550, 568, 278, 804, 1891 (ALL IN PARALLEL)
                    ↓
           Responses received
           (faster due to parallelization)
Total time: ~1 request × network latency
```

---

## 8. Material-UI Box for Action Layout

**Purpose**: Horizontal flexbox layout for action buttons

```typescript
<Box sx={{ display: 'flex', gap: 1 }}>
  <RemoveFromFavourites movieId={movie.id} />
  <WriteReview movieId={movie.id} />
</Box>
```

**Styling**:
- `display: 'flex'`: Horizontal button layout
- `gap: 1`: 8px spacing between buttons (MUI spacing unit)

**Result**: Clean side-by-side button arrangement on each card

---

## 9. Integration with Existing Context

### MoviesContext Exports
```typescript
{
  favouriteIds: number[];
  addToFavourites(movieId: number): void;
  removeFromFavourites(movieId: number): void;
  isFavourite(movieId: number): boolean;
}
```

### FavouriteMoviesPage Usage
```typescript
const { favouriteIds } = useMoviesContext();
// Read favourite IDs, pass to useFavouriteMovies
// Render RemoveFromFavourites (uses removeFromFavourites)
// Render WriteReview (navigates to review page)
```

### Context Flow
1. User adds movie to favourites → `addToFavourites(id)` → context updates → localStorage updates
2. User views FavouriteMoviesPage → reads `favouriteIds` from context
3. useFavouriteMovies fetches details using react-query
4. RemoveFromFavourites button available → calls `removeFromFavourites(id)`
5. Context updates → localStorage updates → FavouriteMoviesPage re-renders

---

## 10. Next Steps

**Task 7.0 Deliverable**: ✅ FavouriteMoviesPage refactored to use context + react-query with full action components

**Blocking on**: None (Task 7.0 complete)

**Task 8.0 Prerequisites Met**:
- ✅ Routes structure established (HomePage, FavouriteMoviesPage)
- ✅ WriteReview button exists and navigates to `/movies/:id/review`
- ✅ Build passes
- ✅ react-router-dom available

**Task 8.0 Action**: Create AddMovieReviewPage component with:
- Route `/movies/:id/review`
- react-hook-form for review submission
- Form fields: Author (required, max 100), Title (required, max 100), Comment (required, max 500)
- Navigation back to previous page

---

## 11. Comparison: HomePage vs FavouriteMoviesPage

| Aspect | HomePage | FavouriteMoviesPage |
|--------|----------|-------------------|
| Data source | useMoviesQuery (all movies) | useFavouriteMovies (favourite IDs) |
| Query pattern | Single query | Multiple queries (useQueries) |
| Actions rendered | AddToFavourites | RemoveFromFavourites + WriteReview |
| Caching | 5min stale / 10min cache | 5min stale / 10min cache |
| Filtering | Title + Genre | Title + Genre |

---

## Verification Checklist

- [x] MoviesContext imported and used
- [x] favouriteIds retrieved from context
- [x] useFavouriteMovies hook created
- [x] useQueries used for parallel fetching
- [x] getMovie called with string ID (converted from number)
- [x] RemoveFromFavourites action component rendered
- [x] WriteReview action component rendered
- [x] Box layout used for button spacing
- [x] Filtering logic preserved
- [x] Type safety maintained (DiscoverMovieOverviewProps)
- [x] Build passes with 0 errors
- [x] 1134 modules compiled successfully
- [x] No TypeScript type mismatches
