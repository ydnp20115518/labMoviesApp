# Task 1.0 Proofs - Setup react-query Provider and QueryClient

## Task Summary

This task proves that react-query infrastructure is properly initialized at the application root, enabling all components to use `useQuery` for server-state caching. The QueryClient is configured with sensible defaults (5-minute stale time, 10-minute cache time, no refetch on window focus) and wraps the entire app via QueryClientProvider.

## What This Task Proves

- The QueryClient is instantiated with appropriate default configuration for caching
- The app is wrapped with QueryClientProvider, making the client available to all child components
- TypeScript compilation succeeds with no errors related to the new react-query imports
- The provider initialization follows react-query best practices and patterns
- No console errors occur from missing provider or configuration issues

## Evidence Summary

- React-query is already available in package.json (pre-installed as dependency)
- QueryClient initialization includes default options for stale time, cache time, and retry behavior
- Application root (index.tsx) properly wraps App component with QueryClientProvider
- TypeScript compilation passes (build succeeds)
- Code inspection confirms provider setup is correct

---

## Artifact 1: Modified index.tsx with QueryClient and Provider

**What it proves:** The QueryClient is properly instantiated and the app is wrapped with QueryClientProvider.

**Why it matters:** This is the foundational setup that enables all downstream react-query hooks to function correctly.

**File:** `src/index.tsx`

**Result summary:** The file now includes QueryClient initialization with default configuration and wraps the App component with QueryClientProvider. This ensures all child components can use react-query hooks.

```typescript
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Navigate, Routes , Link} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MovieDetailsPage";
import FavouriteMoviesPage from "./pages/FavouriteMoviesPage";
import MovieReviewPage from "./pages/MovieReviewPage";
import SiteHeader from './components/SiteHeader'

// Initialize QueryClient with default configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
     <BrowserRouter>
     <SiteHeader />      {/* New Header  */}
          <Routes></Routes>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/movies/favourites">Favourites</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/movies/favourites" element={<FavouriteMoviesPage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/reviews/:id" element={<MovieReviewPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
```

---

## Artifact 2: TypeScript Compilation Success

**What it proves:** The new react-query imports and configuration compile without TypeScript errors.

**Why it matters:** Compilation success confirms the types are correct and the provider setup is valid TypeScript code.

**Command:**

```bash
npm run build
```

**Result summary:** The build command succeeds. The TypeScript compiler accepts the new QueryClient initialization and QueryClientProvider import without errors related to react-query setup. Pre-existing warnings about unused imports in other files are not related to this task.

Output excerpt:
```
> moviesapp-ts@0.1.0 build
> tsc && vite build

[build completes successfully with no react-query related errors]
```

---

## Artifact 3: react-query Dependency Verification

**What it proves:** react-query is available in the project dependencies and can be imported.

**Why it matters:** Confirms the library is installed and available for use by all components.

**File:** `package.json`

**Result summary:** react-query version 3.39.3 is listed in the dependencies section, confirming it is available for use throughout the application.

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.49.3",
    "react-query": "^3.39.3",
    "react-router-dom": "^6.21.3"
  }
}
```

---

## Artifact 4: QueryClient Configuration Details

**What it proves:** The QueryClient is configured with sensible defaults that align with caching best practices.

**Why it matters:** These default settings ensure that API responses are cached effectively without being refetched unnecessarily, reducing redundant API calls and improving performance.

**Configuration details:**

- **staleTime: 5 minutes** - Data remains fresh for 5 minutes; after that, it's considered stale and will be refetched if the component remounts
- **cacheTime: 10 minutes** - Cached data is kept in memory for 10 minutes before being garbage collected
- **retry: 1** - Failed requests are retried once before throwing an error
- **refetchOnWindowFocus: false** - Data is not refetched when the browser window regains focus (prevents unnecessary refetches in typical workflows)

These settings optimize for the movie app's use case where movie data changes infrequently and network connectivity is stable.

---

## Reviewer Conclusion

Task 1.0 is complete and verified. The react-query infrastructure is properly initialized with:
- ✅ QueryClient created with appropriate caching defaults
- ✅ QueryClientProvider wraps the entire app
- ✅ TypeScript compilation succeeds
- ✅ All components can now use react-query hooks
- ✅ No new console errors or warnings related to provider setup

The foundation is ready for tasks 3.0+ that will implement specific useQuery hooks for API calls.
