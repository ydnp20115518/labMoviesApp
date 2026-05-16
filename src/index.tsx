import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Navigate, Routes , Link} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { MoviesProvider } from './contexts/MoviesContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MovieDetailsPage";
import FavouriteMoviesPage from "./pages/FavouriteMoviesPage";
import MovieReviewPage from "./pages/MovieReviewPage";
import AddMovieReviewPage from "./pages/AddMovieReviewPage";
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
        <Route path="/movies/:id/review" element={<AddMovieReviewPage />} />
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
      <MoviesProvider>
        <ReviewsProvider>
          <App />
        </ReviewsProvider>
      </MoviesProvider>
    </QueryClientProvider>
  )

