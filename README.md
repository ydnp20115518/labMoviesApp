# Movies App

A modern, responsive web application for discovering movies, TV series, and actors. Built with React, TypeScript, and Material-UI, featuring advanced filtering, sorting, and caching capabilities.

## Features

### Movie Discovery
- **Browse Movies**: Discover, explore popular, and view top-rated movies
- **Movie Details**: View comprehensive movie information including cast, reviews, and similar movies
- **Pagination**: Navigate through large movie lists with easy-to-use pagination controls

### Advanced Filtering & Sorting
- **Filter by Title**: Search movies by title across all movie pages
- **Filter by Genre**: Browse movies by specific genres
- **Sort Options**: 
  - Popularity (High to Low)
  - Title (A to Z)
  - Rating (High to Low / Low to High)
- **Sticky Controls**: Filter and sort controls remain visible while scrolling through content

### TV Series & Actors
- **TV Series Browse**: Explore popular TV series with filtering and sorting
- **TV Series Details**: View series information, episodes, networks, and production companies
- **Actor Browse**: Discover popular actors with their profiles
- **Actor Details**: View actor biography, filmography, and career information

### User Interactions
- **Favorites**: Mark and manage your favorite movies
- **Reviews**: Read and submit reviews for movies
- **Navigation**: Easy-to-use navigation bar with links to all major sections

### Performance Optimization
- **Server-Side Caching**: React Query caches data with:
  - 30-minute stale time for movie/series data
  - 24-hour cache for genres (rarely changes)
  - 60-minute cache retention in memory
- **No Unnecessary Refetches**: Prevents automatic refetching on window focus or component remount
- **Efficient Pagination**: Per-page caching prevents duplicate API calls

## Main Pages

### Home Page (`/`)
- Discover movies with filtering and sorting
- Sticky filter/sort controls that remain visible while scrolling
- Pagination for browsing multiple pages
- Add movies to favorites

### Popular Movies (`/movies/popular`)
- Browse the most popular movies currently
- Filter and sort capabilities
- Per-page pagination

### Top Rated Movies (`/movies/top-rated`)
- View the highest-rated movies of all time
- Advanced filtering and sorting options

### TV Series (`/tv-series`)
- Explore popular TV series
- Filter by series name
- Sort by popularity, name, or rating

### Actors (`/actors`)
- Discover popular actors
- View actor profiles and popularity metrics

### Movie Details (`/movies/:id`)
- View complete movie information
- See cast and crew
- Read and write reviews
- Explore similar movies

## Caching Strategy

The app implements intelligent server-state caching:

| Data Type | Stale Time | Cache Time | Purpose |
|-----------|-----------|-----------|---------|
| Movies/Series | 30 min | 60 min | Fresh data, prevent repeated API calls |
| Genres | 24 hours | 24 hours | Rarely changes, minimize API load |

**Result**: Navigating between pages uses cached data instead of making new API calls.

## Navigation Menu

- **Home** - Main discovery page
- **Popular** - Most popular movies
- **Top Rated** - Highest-rated movies
- **TV Series** - TV series browser
- **Actors** - Actor directory
- **Favorites** - Your bookmarked movies

## User Tips

1. **Use Filters**: Narrow down content by title or genre for faster browsing
2. **Sort Strategically**: Use different sort options to find what interests you
3. **Sticky Controls**: Controls stay visible when scrolling—no need to scroll back up
4. **Favorites**: Click the heart icon on any movie card to save to favorites
5. **Similar Movies**: On any movie detail page, explore similar movies to discover new content

## Performance Notes

- First load may take a moment to fetch initial data
- Subsequent navigation between pages is instant (using cache)
- No additional API calls when returning to previously visited pages (within 30 minutes)
- Responsive design works on mobile, tablet, and desktop

## Future Enhancements

- User authentication and accounts
- Advanced search with autocomplete
- Watchlist and ratings
- Social sharing features
- Mobile app version
- Offline mode


