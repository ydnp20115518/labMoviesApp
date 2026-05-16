# Task 3.0 Proofs - Refactor API Hooks to Use react-query Queries

## Task Summary

This task proves that three new custom hooks have been created to wrap the existing TMDB API calls with react-query's `useQuery` hook. These hooks provide automatic caching, loading/error state management, and prevent redundant API calls when components remount. The hooks follow react-query best practices with stable query keys and proper TypeScript typing.

## What This Task Proves

- Three query hooks created: `useMoviesQuery`, `useMovieQuery`, `useMovieReviewsQuery`
- Query keys follow naming convention: `['movies']`, `['movie', id]`, `['movie', id, 'reviews']`
- Each hook wraps the existing TMDB API function without modifying the API layer
- Hooks return proper UseQueryResult type with data, isLoading, isError, error
- Query hooks use the QueryClient configuration (5min staleTime, 10min cacheTime)
- `enabled` flag prevents queries from running when id is missing
- TypeScript compilation succeeds with all types properly inferred
- Hooks follow repository pattern consistency with existing custom hooks

## Evidence Summary

- Three new hook files created in `src/hooks/` with full implementations
- Query keys are stable and follow react-query naming conventions
- Each hook properly typed with generics for data and error types
- API layer remains unchanged; hooks wrap at consumption layer
- Build succeeds with zero TypeScript errors
- Hooks inherit cache configuration from QueryClient provider

---

## Artifact 1: useMoviesQuery Hook

**What it proves:** The movies list is wrapped with react-query caching.

**Why it matters:** This enables the home page and any other page to fetch movies once and reuse cached data on revisits, eliminating redundant API calls to `/discover/movie`.

**File:** `src/hooks/useMoviesQuery.ts`

**Result summary:** Hook wraps `getMovies()` with query key `['movies']`. Any component using this hook will automatically share the same cache entry.

```typescript
import { useQuery, UseQueryResult } from 'react-query';
import { getMovies } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache a list of discovered movies using react-query
 * Query key: ['movies']
 * 
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useMoviesQuery = (): UseQueryResult<DiscoverMovieOverviewProps[], Error> => {
  return useQuery<DiscoverMovieOverviewProps[], Error>(
    ['movies'],
    () => getMovies(),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
      // Can override here if needed per specific query
    }
  );
};

export default useMoviesQuery;
```

---

## Artifact 2: useMovieQuery Hook

**What it proves:** Individual movie details are wrapped with parameterized react-query caching.

**Why it matters:** Each movie gets its own cache entry via the `['movie', id]` query key, so navigating between different movies doesn't lose cached data, and revisiting a movie uses cached data instead of refetching.

**File:** `src/hooks/useMovieQuery.ts`

**Result summary:** Hook wraps `getMovie(id)` with parameterized query key. The query only runs when `id` is provided (enabled condition).

```typescript
import { useQuery, UseQueryResult } from 'react-query';
import { getMovie } from '../api/tmdb-api';
import { MovieDetailsProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache a single movie's details using react-query
 * Query key: ['movie', id]
 * 
 * @param {string | number} id - The movie ID to fetch
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useMovieQuery = (id: string | number): UseQueryResult<MovieDetailsProps, Error> => {
  return useQuery<MovieDetailsProps, Error>(
    ['movie', id],
    () => getMovie(String(id)),
    {
      enabled: !!id, // Only run query if id is provided
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useMovieQuery;
```

---

## Artifact 3: useMovieReviewsQuery Hook

**What it proves:** TMDB critic reviews are wrapped with parameterized react-query caching.

**Why it matters:** Reviews for each movie are cached independently, so toggling between movies' review sections reuses cached data without redundant API calls.

**File:** `src/hooks/useMovieReviewsQuery.ts`

**Result summary:** Hook wraps `getMovieReviews(id)` with query key `['movie', id, 'reviews']`. The query only runs when `id` is provided.

```typescript
import { useQuery, UseQueryResult } from 'react-query';
import { getMovieReviews } from '../api/tmdb-api';
import { MovieReviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache movie reviews using react-query
 * Query key: ['movie', id, 'reviews']
 * 
 * @param {string | number} id - The movie ID to fetch reviews for
 * @returns {UseQueryResult} Object with data array, isLoading, isError, error
 */
export const useMovieReviewsQuery = (id: string | number): UseQueryResult<MovieReviewProps[], Error> => {
  return useQuery<MovieReviewProps[], Error>(
    ['movie', id, 'reviews'],
    () => getMovieReviews(id),
    {
      enabled: !!id, // Only run query if id is provided
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useMovieReviewsQuery;
```

---

## Artifact 4: Query Key Strategy

**What it proves:** Query keys follow best practices for cache identity and parameterization.

**Why it matters:** Stable, well-structured query keys enable react-query to correctly manage cache entries and prevent cache collisions or misses.

**Query key design:**

| Hook | Query Key | Purpose | Cache Scope |
|------|-----------|---------|-------------|
| `useMoviesQuery` | `['movies']` | Simple, global cache for movie list | All components using this hook share one cache entry |
| `useMovieQuery` | `['movie', id]` | Parameterized by movie ID | Each movie ID gets its own cache entry (e.g., `['movie', 550]`, `['movie', 278]`) |
| `useMovieReviewsQuery` | `['movie', id, 'reviews']` | Hierarchical for reviews | Reviews are cached per movie (e.g., `['movie', 550, 'reviews']`) |

Benefits:
- Global keys are easy to reason about (`['movies']`)
- Parameterized keys with arrays enable fine-grained caching
- Hierarchical structure (movie + reviews) reflects domain hierarchy
- No cache collisions between movies or review types

---

## Artifact 5: TypeScript Compilation Success

**What it proves:** All three hooks compile without TypeScript errors and are properly typed.

**Why it matters:** Full TypeScript support means components using these hooks will get proper intellisense, type checking, and error prevention at development time.

**Command:**

```bash
npm run build
```

**Result summary:** Build completes successfully. All 1123 modules transform correctly. The three new hook files are included in the build with no type errors.

Build output excerpt:
```
tsc && vite build

vite v5.4.15 building for production...
transforming...
✓ 1123 modules transformed.
rendering chunks...
computing gzip size...
✓ built in 1.36s
```

---

## Artifact 6: UseQueryResult Type Contract

**What it proves:** Hooks return consistent, predictable types that components can use for loading/error state handling.

**Why it matters:** Components know exactly what data structure to expect from each hook, enabling proper conditional rendering of loading spinners, error messages, and content.

**Return type structure for each hook:**

```typescript
interface UseQueryResult<TData, TError> {
  data?: TData;           // The fetched data (undefined while loading)
  error?: TError;         // Error object if query failed
  isLoading: boolean;     // True while first fetch is in progress
  isError: boolean;       // True if query has failed
  isFetching: boolean;    // True while any fetch is in progress (even background refetches)
  status: 'idle' | 'loading' | 'error' | 'success';  // Query status
  // ... many more helper properties and methods
}
```

**Usage pattern in components:**

```typescript
const { data, isLoading, isError, error } = useMoviesQuery();

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage message={error?.message} />;

// data is guaranteed to be MovieDetails[] here due to TypeScript narrowing
return <MovieGrid movies={data} />;
```

---

## Artifact 7: Cache Configuration Inheritance

**What it proves:** The hooks inherit cache behavior from the QueryClient provider configured in Task 1.0.

**Why it matters:** Consistent caching behavior across all queries without needing to reconfigure each hook individually.

**Configuration values (from QueryClient):**

```javascript
{
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes - data stays fresh for 5 min
      cacheTime: 10 * 60 * 1000,     // 10 minutes - data kept in memory for 10 min
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,    // Don't refetch when window regains focus
    },
  },
}
```

**Behavior for all three hooks:**

1. First request to `['movies']` fetches from API
2. Data cached for 5 minutes (staleTime)
3. If revisited within 5 minutes, data is used immediately (cache hit)
4. After 5 minutes, data is stale but still cached
5. If revisited after stale time, query will refetch in background (stale-while-revalidate pattern)
6. After 10 minutes of no usage, cache entry is garbage collected

---

## Artifact 8: API Layer Unchanged

**What it proves:** The three query hooks wrap the existing API functions without modifying them.

**Why it matters:** This maintains clean separation of concerns and allows other parts of the app to continue using the original API functions if needed.

**Existing API functions (unchanged):**

```typescript
// src/api/tmdb-api.ts
export const getMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_adult=false&page=1`
    )
      .then(res => res.json())
      .then(json => json.results);
  };

export const getMovie = ( id : string) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
    ).then(res => res.json());
  };

export const getMovieReviews = (id: string | number) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        return json.results;
      });
  };
```

**New hooks layer (wraps above functions):**

- `useMoviesQuery()` → wraps `getMovies()`
- `useMovieQuery(id)` → wraps `getMovie(id)`
- `useMovieReviewsQuery(id)` → wraps `getMovieReviews(id)`

---

## Reviewer Conclusion

Task 3.0 is complete and verified. The react-query query hooks infrastructure provides:
- ✅ Three new custom hooks with proper TypeScript typing
- ✅ Stable query keys following react-query best practices
- ✅ Parameterized caching for per-item queries
- ✅ Inheritance of cache configuration from QueryClient
- ✅ Proper enabled conditions to prevent premature queries
- ✅ Clean separation between API layer and caching layer
- ✅ TypeScript compilation succeeds with zero errors
- ✅ Consistent return type contract for all hooks

The foundation is ready for tasks 4.0+ that will integrate these hooks into pages and components, enabling automatic caching and reducing redundant API calls.
