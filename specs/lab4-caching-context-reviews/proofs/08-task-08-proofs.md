# Task 8.0 Proof Artifacts: Create Review Form Page

**Task**: Create AddMovieReviewPage with react-hook-form for writing movie reviews  
**Status**: ✅ COMPLETE  
**Date**: 16 May 2026

---

## 1. File Changes Summary

### 1.1 src/pages/AddMovieReviewPage.tsx (NEW FILE)

**Purpose**: Page component for users to write and submit reviews for specific movies

**Route**: `/movies/:id/review`

**Key Features**:
- Extracts movie ID from route parameter (`/movies/:id/review`)
- Uses react-hook-form (v7.49.3) for form state and validation
- Three required form fields:
  - Author: max 100 characters
  - Review Title: max 100 characters
  - Review Comment: max 500 characters (multiline textarea)
- Material-UI layout with Container, Paper, TextField, Button
- Form submission handler (placeholder for Task 9.0 storage)
- Cancel button navigates back to previous page
- Form validation with error messages

**Form Fields**:
```typescript
interface ReviewFormData {
  author: string;      // Required, max 100 chars
  title: string;       // Required, max 100 chars
  comment: string;     // Required, max 500 chars
}
```

**Component Structure**:
```typescript
const AddMovieReviewPage = () => {
  // Extract movieId from route: /movies/:id/review
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0', 10);
  
  // Initialize form with validation rules
  const { control, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      author: '',
      title: '',
      comment: '',
    },
  });

  // Form submission handler
  const onSubmit = (data: ReviewFormData) => {
    // TODO: Task 9.0 - Store review in app state
    console.log('Review submitted:', { movieId, ...data });
    navigate('/');
  };

  return (
    // Material-UI layout with form
  );
};
```

### 1.2 src/index.tsx (MODIFIED)

**Changes**:
1. Import AddMovieReviewPage component
2. Add route `/movies/:id/review` → AddMovieReviewPage

**Import Addition**:
```typescript
import AddMovieReviewPage from "./pages/AddMovieReviewPage";
```

**Route Addition**:
```typescript
<Route path="/movies/:id/review" element={<AddMovieReviewPage />} />
```

**Route Order** (important for matching):
```
/movies/favourites     → FavouriteMoviesPage
/movies/:id/review     → AddMovieReviewPage  (NEW)
/movies/:id            → MoviePage
/                      → HomePage
*                      → Navigate to /
/reviews/:id           → MovieReviewPage
```

---

## 2. Form Architecture

### 2.1 React Hook Form Integration

**Benefits**:
- Zero-dependency form state management
- Minimal re-renders (form updates don't trigger page re-renders)
- Automatic field tracking and error state
- Built-in validation
- TypeScript support with FormData interface

### 2.2 Validation Rules

**Author Field**:
```typescript
rules={{
  required: 'Author is required',
  maxLength: {
    value: 100,
    message: 'Author must be 100 characters or less',
  },
}}
```

**Title Field**:
```typescript
rules={{
  required: 'Title is required',
  maxLength: {
    value: 100,
    message: 'Title must be 100 characters or less',
  },
}}
```

**Comment Field**:
```typescript
rules={{
  required: 'Comment is required',
  maxLength: {
    value: 500,
    message: 'Comment must be 500 characters or less',
  },
}}
```

### 2.3 Field Rendering

Each field uses Material-UI TextField with:
- `fullWidth`: Spans container width
- `label`: Field label
- `placeholder`: Hint text
- `error`: Boolean from validation
- `helperText`: Error message from validation
- `variant="outlined"`: Material Design style
- `inputProps={{ maxLength: n }}`: Client-side character limit
- `multiline` + `rows={5}`: For comment textarea

---

## 3. User Flow

### 3.1 Navigation Flow

```
FavouriteMoviesPage
  ↓
WriteReview button (for each movie card)
  ↓
onClick → navigate(`/movies/${movieId}/review`)
  ↓
AddMovieReviewPage
  ↓
User fills form (Author, Title, Comment)
  ↓
Click "Submit Review"
  ↓
onSubmit handler (TODO: Task 9.0)
  ↓
navigate('/') → Back to HomePage
```

### 3.2 Cancel Button

- `Cancel` button: `navigate(-1)` → Goes back to previous page
- Allows user to discard form without submission

---

## 4. Material-UI Layout Components

**Container**:
- `maxWidth="sm"`: Small container (600px max)
- Centered on page with padding

**Paper**:
- Elevation 3: Shadow depth for card appearance
- Padding 4: 32px internal spacing

**Box (Form Container)**:
- `component="form"`: Semantic HTML
- `onSubmit={handleSubmit(onSubmit)}`: Form submission
- `mt: 3`: Margin-top spacing

**Box (Action Buttons)**:
- `display: 'flex'`: Horizontal layout
- `gap: 2`: Spacing between buttons
- `justifyContent: 'flex-end'`: Right-align buttons
- `mt: 4`: Large top margin before buttons

---

## 5. Integration Points

### 5.1 Route Registration

**Parent**: `src/index.tsx` (App component)
**Route**: `/movies/:id/review`
**Component**: `AddMovieReviewPage`
**Source**: WriteReview component in CardActions

### 5.2 WriteReview Button Link

```typescript
// In CardActions/WriteReview.tsx
const handleClick = () => {
  navigate(`/movies/${movieId}/review`);
};
```

**Result**: Navigates to `/movies/550/review` (example with movieId=550)

### 5.3 Future: Task 9.0 Integration

Current placeholder:
```typescript
const onSubmit = (data: ReviewFormData) => {
  console.log('Review submitted:', { movieId, ...data });
  navigate('/');  // Temporary: go home
};
```

Task 9.0 will replace with:
```typescript
const onSubmit = (data: ReviewFormData) => {
  // Add review to app state
  addReview(movieId, data);
  // Persist review storage
  navigate('/');
};
```

---

## 6. TypeScript & Build Verification

**Build Command**: `npm run build`

**Result**: ✅ PASS
```
vite v5.4.15 building for production...
✓ 1136 modules transformed.
dist/index.html                                     0.40 kB │ gzip:   0.28 kB
dist/assets/film-poster-placeholder-eIJ1MYQD.png   14.82 kB
dist/assets/index-BSWvWUeZ.js                     458.03 kB │ gzip: 143.71 kB
✓ built in 1.53s
```

**TypeScript Errors**: 0
**Module Count**: 1136 (increased from 1134 due to react-hook-form integration)

---

## 7. File Statistics

**New files**: 1
- `src/pages/AddMovieReviewPage.tsx` (128 lines)

**Modified files**: 1
- `src/index.tsx` (2 changes: import + route)

**Total additions**: ~130 lines

---

## 8. Component Props & Interfaces

### AddMovieReviewPage Props
- No props (component is route-based)
- Receives movieId from URL parameter: `/movies/:id/review`

### ReviewFormData Interface
```typescript
interface ReviewFormData {
  author: string;   // Review author name
  title: string;    // Review headline
  comment: string;  // Detailed review text
}
```

---

## 9. Validation Summary

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|-----------|------------|
| Author | string | Yes | 100 | Required + MaxLength |
| Title | string | Yes | 100 | Required + MaxLength |
| Comment | string | Yes | 500 | Required + MaxLength |

**Client-side validation**:
- React Hook Form: Real-time validation feedback
- Material-UI TextField: Error highlighting + helperText
- HTML input: maxLength attribute prevents over-typing

---

## 10. Next Steps

**Task 8.0 Deliverable**: ✅ AddMovieReviewPage created with react-hook-form validation

**Blocking on**: None (Task 8.0 complete)

**Task 9.0 Action**: Implement review storage
- Create review state management (could use context or reducer)
- Store reviews in app state (not localStorage, per spec)
- Create custom hook `useReviewsByMovieId` to retrieve reviews
- Implement onSubmit handler to save reviews
- Display reviews on MovieDetailsPage

**Task 9.0 Prerequisites Met**:
- ✅ AddMovieReviewPage exists and validates form
- ✅ Route `/movies/:id/review` active
- ✅ WriteReview navigation works
- ✅ Build passes

---

## 11. Code Quality Checks

- [x] TypeScript strict mode: No errors
- [x] React Hook Form: Proper Controller wrapper usage
- [x] Material-UI: Consistent theming and spacing
- [x] Accessibility: Labels on all form fields
- [x] Error handling: Validation messages displayed
- [x] Navigation: Cancel button and submit action both navigate
- [x] Placeholder: TODO comment for Task 9.0 integration

---

## Verification Checklist

- [x] AddMovieReviewPage component created
- [x] Route `/movies/:id/review` added to index.tsx
- [x] react-hook-form integrated with Controller pattern
- [x] Form fields: author, title, comment
- [x] Validation: required + maxLength on all fields
- [x] Material-UI layout (Container, Paper, TextField, Button)
- [x] Cancel button navigates back
- [x] Submit button triggers form submission
- [x] movieId extracted from route parameter
- [x] onSubmit placeholder with console.log
- [x] TypeScript compilation: 0 errors
- [x] Build successful: 1136 modules
- [x] No unused imports
