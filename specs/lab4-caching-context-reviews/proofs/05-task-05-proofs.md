# Task 5.0 Proof Artifacts: Implement Card Action Components

**Task**: Implement three configurable action button components for use in movie cards  
**Status**: ✅ COMPLETE  
**Date**: 16 May 2026

---

## 1. Component Files Created

### 1.1 AddToFavourites.tsx
**Location**: `src/components/CardActions/AddToFavourites.tsx`  
**Purpose**: Display "Add to Favourites" button on movie cards

**Key Features**:
- Accepts `movieId: number` prop
- Uses `useMoviesContext` hook to access `isFavourite()` and `addToFavourites()` functions
- Conditionally renders: only shows if `!isFavourite(movieId)`
- Material-UI Button with `FavoriteBorderIcon` (outline heart)
- Integrates with MoviesContext favourites state and localStorage persistence
- Calls `addToFavourites()` on button click

**Code Structure**:
```typescript
interface AddToFavouritesProps {
  movieId: number;
}

const AddToFavourites = ({ movieId }: AddToFavouritesProps) => {
  const { isFavourite, addToFavourites } = useMoviesContext();

  if (isFavourite(movieId)) {
    return null;
  }

  const handleClick = () => {
    addToFavourites(movieId);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<FavoriteBorderIcon />}
      onClick={handleClick}
    >
      Add to Favourites
    </Button>
  );
};
```

### 1.2 RemoveFromFavourites.tsx
**Location**: `src/components/CardActions/RemoveFromFavourites.tsx`  
**Purpose**: Display "Remove" button on movie cards (favourites page)

**Key Features**:
- Accepts `movieId: number` prop
- Uses `useMoviesContext` hook to access `isFavourite()` and `removeFromFavourites()` functions
- Conditionally renders: only shows if `isFavourite(movieId)` is true
- Material-UI Button with `DeleteIcon`
- Calls `removeFromFavourites()` on button click
- Updates context state and localStorage

**Code Structure**:
```typescript
interface RemoveFromFavouritesProps {
  movieId: number;
}

const RemoveFromFavourites = ({ movieId }: RemoveFromFavouritesProps) => {
  const { isFavourite, removeFromFavourites } = useMoviesContext();

  if (!isFavourite(movieId)) {
    return null;
  }

  const handleClick = () => {
    removeFromFavourites(movieId);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<DeleteIcon />}
      onClick={handleClick}
    >
      Remove
    </Button>
  );
};
```

### 1.3 WriteReview.tsx
**Location**: `src/components/CardActions/WriteReview.tsx`  
**Purpose**: Display "Write Review" button for favourite movies

**Key Features**:
- Accepts `movieId: number` prop
- Uses `useNavigate` hook from react-router-dom
- Always renders (no conditional logic)
- Material-UI Button with `EditIcon`
- Navigates to `/movies/:id/review` route on click
- Integrates with routing system for review page

**Code Structure**:
```typescript
interface WriteReviewProps {
  movieId: number;
}

const WriteReview = ({ movieId }: WriteReviewProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movieId}/review`);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<EditIcon />}
      onClick={handleClick}
    >
      Write Review
    </Button>
  );
};
```

---

## 2. Directory Structure

**New directory created**:
```
src/components/
├── CardActions/           ← NEW
│   ├── AddToFavourites.tsx
│   ├── RemoveFromFavourites.tsx
│   └── WriteReview.tsx
```

---

## 3. Architecture Integration

### Action Component Usage Pattern
Components are designed to be passed as `ReactNode` via the `actions` prop of MovieCard:

```typescript
// Example from HomePage (will be implemented in Task 6.0)
const renderActions = (movie: DiscoverMovieOverviewProps) => (
  <AddToFavourites movieId={movie.id} />
);

// Example from FavouritesPage (will be implemented in Task 7.0)
const renderActions = (movie: DiscoverMovieOverviewProps) => (
  <>
    <RemoveFromFavourites movieId={movie.id} />
    <WriteReview movieId={movie.id} />
  </>
);
```

### Conditional Rendering Strategy
- `AddToFavourites`: Returns `null` if already favourite → safe to render on all pages
- `RemoveFromFavourites`: Returns `null` if not favourite → safe to render on all pages
- `WriteReview`: Always renders → only used where appropriate (favourites page)

This allows components to be flexible in where they're used without page-level logic.

---

## 4. Dependencies

### Imports
- `@mui/material/Button`: Material-UI button component
- `@mui/icons-material/FavoriteBorderIcon`: Outline heart icon
- `@mui/icons-material/DeleteIcon`: Trash/delete icon
- `@mui/icons-material/EditIcon`: Pencil/edit icon
- `react-router-dom/useNavigate`: Hook for programmatic navigation
- `useMoviesContext`: Custom hook from `src/contexts/MoviesContext`

### Context Integration
- `AddToFavourites` and `RemoveFromFavourites` depend on `MoviesContext` for:
  - `isFavourite(movieId): boolean`
  - `addToFavourites(movieId): void`
  - `removeFromFavourites(movieId): void`

### Context State Flow
1. User clicks "Add to Favourites" button in AddToFavourites component
2. Component calls `addToFavourites(movieId)` from context
3. Context updates internal state and localStorage
4. MoviesProvider triggers re-render
5. Both AddToFavourites (now hides) and RemoveFromFavourites (now shows) respond to state change

---

## 5. TypeScript & Build Verification

**Build Command**: `npm run build`

**Result**: ✅ PASS
```
vite v5.4.15 building for production...
✓ 1123 modules transformed.
✓ built in 1.53s
```

**TypeScript Errors**: 0
**Import Path Resolution**: Fixed (corrected from `../contexts/` to `../../contexts/`)

---

## 6. File Diff Summary

**New files**: 3
- `src/components/CardActions/AddToFavourites.tsx` (32 lines)
- `src/components/CardActions/RemoveFromFavourites.tsx` (32 lines)
- `src/components/CardActions/WriteReview.tsx` (28 lines)

**Modified files**: 0

**Total lines added**: ~92

---

## 7. Component API Reference

### AddToFavourites Props
```typescript
interface AddToFavouritesProps {
  movieId: number;  // ID of the movie to add to favourites
}
```

### RemoveFromFavourites Props
```typescript
interface RemoveFromFavouritesProps {
  movieId: number;  // ID of the movie to remove from favourites
}
```

### WriteReview Props
```typescript
interface WriteReviewProps {
  movieId: number;  // ID of the movie to review
}
```

---

## 8. Next Steps

**Task 5.0 Deliverable**: ✅ Three action button components created and type-safe

**Blocking on**: None (Task 5.0 unblocked Tasks 6.0 and 7.0)

**Task 6.0 Prerequisites Met**:
- ✅ AddToFavourites component exists
- ✅ MoviesContext provides favourites functions
- ✅ Build passes

**Task 7.0 Prerequisites Met**:
- ✅ RemoveFromFavourites component exists
- ✅ WriteReview component exists
- ✅ react-router-dom available for navigation
- ✅ Build passes

**Task 6.0 Action**: Refactor HomePage to use `renderActions` with AddToFavourites

**Task 7.0 Action**: Refactor FavouriteMoviesPage to use `renderActions` with RemoveFromFavourites + WriteReview

---

## 9. Context Flow Diagram

```
Action Component     MoviesContext        Storage
─────────────────    ────────────────     ─────────
AddToFavourites
  └─> click
      └─> addToFavourites(id) ──> Update state ──> localStorage
          
RemoveFromFavourites
  └─> click
      └─> removeFromFavourites(id) ──> Update state ──> localStorage

WriteReview
  └─> click
      └─> useNavigate() → /movies/:id/review
```

---

## Verification Checklist

- [x] All three action components created
- [x] TypeScript interfaces defined
- [x] Context methods integrated correctly
- [x] Import paths resolve correctly
- [x] Build passes with 0 errors
- [x] Conditional rendering logic implemented
- [x] Material-UI components used consistently
- [x] JSDoc comments added
- [x] Component props documented
- [x] Architecture supports flexible action composition
