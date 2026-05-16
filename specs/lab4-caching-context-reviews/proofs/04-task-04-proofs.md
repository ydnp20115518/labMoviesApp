# Task 4.0 Proofs - Refactor MovieCard to Support Configurable Actions

## Task Summary

This task proves that MovieCard has been successfully refactored to accept configurable action components via a render-props style `actions` prop. The card now renders action buttons provided by parent components instead of hardcoded buttons, enabling different pages to use different actions without duplicating the component. The favourite indicator, release date, vote average, and poster image remain unchanged.

## What This Task Proves

- MovieCard interface updated to accept `actions?: ReactNode` prop instead of `selectFavourite` callback
- CardActions section conditionally renders actions only when provided
- MovieCard structure unchanged: favourite indicator, poster, title, release date, vote average all preserved
- BaseMovieListProps type updated to use `renderActions` function instead of `selectFavourite`
- MovieList component refactored to call renderActions for each movie and pass actions to MovieCard
- TemplateMovieListPage updated to pass renderActions to MovieList
- Pages updated to remove selectFavourite prop (will be fully refactored in Tasks 6.0 and 7.0)
- TypeScript compilation succeeds with zero errors
- No breaking changes to card display or UX (cards still render with same visual structure)

## Evidence Summary

- MovieCard.tsx refactored with new actions prop and conditional CardActions rendering
- MovieCardProps interface simplified by removing selectFavourite callback
- BaseMovieListProps type updated with renderActions function
- MovieList component maps movies and calls renderActions for each
- TemplateMovieListPage passes renderActions through to MovieList
- HomePage and FavouriteMoviesPage temporarily updated to not pass removed selectFavourite prop
- Build succeeds with no TypeScript errors
- Import statements cleaned up (removed unused Button, IconButton, Link imports from MovieCard)

---

## Artifact 1: MovieCard Component Refactored

**What it proves:** MovieCard now accepts configurable actions via props instead of hardcoding button behavior.

**Why it matters:** This enables different pages to render different action buttons (e.g., home page with "Add to Favourites", favourites page with "Remove" and "Write Review") without duplicating or forking the card component.

**File:** `src/components/MovieCard.tsx`

**Result summary:** The component now accepts an optional `actions` prop (ReactNode) and renders it in the CardActions section if provided. All card display logic remains unchanged.

```typescript
import { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from '../images/film-poster-placeholder.png';
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import Avatar from "@mui/material/Avatar";

const styles = {
  card: { maxWidth: 345 },
  media: { height: 500 },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

interface MovieCardProps {
  movie: DiscoverMovieOverviewProps;
  actions?: ReactNode;
}

const MovieCard = ({ movie, actions }: MovieCardProps) => {
  return (
    <Card sx={styles.card}>
      <CardHeader
        avatar={
          movie.favourite ? (
            <Avatar sx={styles.avatar}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        title={
          <Typography variant="h5" component="p">
            {movie.title}{" "}
          </Typography>
        }
      />

      <CardMedia
        sx={styles.media}
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : img
        }
      />
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <CalendarIcon fontSize="small" />
              {movie.release_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <StarRateIcon fontSize="small" />
              {"  "} {movie.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {actions && (
        <CardActions disableSpacing>
          {actions}
        </CardActions>
      )}
    </Card>
  );
}

export default MovieCard;
```

---

## Artifact 2: MovieCardProps Type Update

**What it proves:** The component prop interface now reflects the new render-props architecture.

**Why it matters:** Type safety ensures consuming components pass the correct prop shape.

**Old interface:**
```typescript
interface MovieCardProps {
  movie: DiscoverMovieOverviewProps;
  selectFavourite: (movieId: number) => void;
}
```

**New interface:**
```typescript
interface MovieCardProps {
  movie: DiscoverMovieOverviewProps;
  actions?: ReactNode;
}
```

**Benefits:**
- Actions prop is optional (renderActions can be undefined)
- Actions can be any React node (buttons, fragments, custom components)
- No callback complexity; parent component controls what renders

---

## Artifact 3: BaseMovieListProps Type Update

**What it proves:** The list-level props now support render-props pattern for actions.

**Why it matters:** This propagates the new architecture from MovieList up to pages that use TemplateMovieListPage.

**File:** `src/types/movieAppTypes.ts`

**Old type:**
```typescript
export type BaseMovieListProps = {
  movies: NonNullable<DiscoverMovieOverviewProps[]>;
  selectFavourite: (movieId: number) => void;
}
```

**New type:**
```typescript
export type BaseMovieListProps = {
  movies: NonNullable<DiscoverMovieOverviewProps[]>;
  renderActions?: (movie: DiscoverMovieOverviewProps) => React.ReactNode;
}
```

**Benefits:**
- renderActions receives the movie object, enabling per-movie action customization
- Pages can render different actions for different movies (e.g., no "Add" button if already favourite)
- Optional prop enables gradual migration

---

## Artifact 4: MovieList Component Refactored

**What it proves:** MovieList maps movies and calls renderActions to provide actions for each card.

**Why it matters:** This bridges the page-level action factory to individual cards.

**File:** `src/components/MovieList.tsx`

**Result summary:** MovieList maps over movies, calling renderActions for each movie to generate the actions node, then passes that to MovieCard.

```typescript
import Movie from "./MovieCard";
import Grid from "@mui/material/Grid";
import { BaseMovieListProps } from "../types/movieAppTypes";

const MovieList = ({ movies, renderActions }: BaseMovieListProps) => {
  const movieCards = movies.map((m) => (
    <Grid key={m.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Movie key={m.id} movie={m} actions={renderActions?.(m)} />
    </Grid>
  ));
  return movieCards;
}

export default MovieList;
```

---

## Artifact 5: TemplateMovieListPage Updated

**What it proves:** The page template passes renderActions through to MovieList.

**Why it matters:** This enables pages to provide the action factory without needing to understand MovieList/MovieCard internals.

**File:** `src/components/TemplateMovieListPage.tsx`

**Result summary:** TemplateMovieListPage destructures renderActions from props and passes it to MovieList.

```typescript
const MovieListPageTemplate = ({ movies, title, renderActions }: MovieListPageTemplateProps) => {
  return (
    <Grid container sx={styles.root}>
      <Grid item xs={12}>
        <Header title={title} />
      </Grid>
      <Grid item container spacing={5}>
        <MovieList
          renderActions={renderActions}
          movies={movies}
        ></MovieList>
      </Grid>
    </Grid>
  );
}
```

---

## Artifact 6: Pages Updated (Temporary)

**What it proves:** Pages have been updated to remove the deprecated selectFavourite prop.

**Why it matters:** Prevents TypeScript errors. Pages will be fully refactored in Tasks 6.0 (HomePage) and 7.0 (FavouriteMoviesPage).

**Changes:**
- HomePage.tsx: Removed selectFavourite prop and related addToFavourites function
- FavouriteMoviesPage.tsx: Removed selectFavourite prop and toDo placeholder function
- Both pages now pass only movies and title to TemplateMovieListPage

**Temporary state:**
Pages currently render with no action components (renderActions is undefined). This is temporary and will be fixed when pages are fully refactored to use the new context and action component patterns.

---

## Artifact 7: TypeScript Compilation Success

**What it proves:** All type changes compile without errors.

**Why it matters:** Full TypeScript support ensures the new architecture is type-safe and catches errors at development time.

**Command:**

```bash
npm run build
```

**Result summary:** Build completes successfully with no TypeScript errors. All 1123 modules compile correctly.

Build output excerpt:
```
tsc && vite build

vite v5.4.15 building for production...
transforming...
✓ 1123 modules transformed.
rendering chunks...
computing gzip size...
✓ built in 1.45s
```

---

## Artifact 8: Render-Props Pattern Benefits

**What it proves:** The architecture now supports flexible, page-specific action customization.

**Why it matters:** This enables the key Lab 4 requirement: different pages can render different card actions without code duplication.

**Pattern demonstration:**

```typescript
// Page 1 (Home): renders Add to Favourites for each movie
<TemplateMovieListPage
  movies={homeMovies}
  title="Discover"
  renderActions={(movie) => <AddToFavourites movieId={movie.id} />}
/>

// Page 2 (Favourites): renders Remove + Write Review for each movie
<TemplateMovieListPage
  movies={favouriteMovies}
  title="My Favourites"
  renderActions={(movie) => (
    <>
      <RemoveFromFavourites movieId={movie.id} />
      <WriteReview movieId={movie.id} />
    </>
  )}
/>
```

---

## Artifact 9: Card Display Preserved

**What it proves:** The visual and functional structure of the card remains unchanged.

**Why it matters:** Card rendering logic (poster, title, release date, vote average, favourite indicator) is untouched, ensuring backward compatibility with Lab 3 display behavior.

**Unchanged elements:**
- Poster image from TMDB or placeholder
- Title display
- Release date with calendar icon
- Vote average with star icon
- Red heart avatar indicator when movie is favourite
- Card styling (maxWidth: 345px, media height 500px)
- Grid layout for date and rating

**Changed elements:**
- CardActions section now conditional (only renders if actions provided)
- No hardcoded buttons in card itself
- Parent component controls action buttons

---

## Reviewer Conclusion

Task 4.0 is complete and verified. The MovieCard refactoring enables:
- ✅ Configurable actions via render-props pattern
- ✅ Page-specific action customization without component duplication
- ✅ Conditional CardActions rendering (no actions = no CardActions)
- ✅ Type-safe action passing through props
- ✅ Backward compatibility with card display
- ✅ Clean separation of concerns (card displays data, parent provides actions)
- ✅ TypeScript compilation succeeds with zero errors
- ✅ Ready for Task 5.0 to create specific action components

The foundation is ready for tasks 5.0+ to create action button components that will be passed via this new renderActions architecture.
