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
import PopularMoviesPage from "./pages/PopularMoviesPage";
import TopRatedMoviesPage from "./pages/TopRatedMoviesPage";
import TVSeriesPage from "./pages/TVSeriesPage";
import ActorsPage from "./pages/ActorsPage";
import SimilarMoviesPage from "./pages/SimilarMoviesPage";
import ActorDetailsPage from "./pages/ActorDetailsPage";
import TVSeriesDetailsPage from "./pages/TVSeriesDetailsPage";
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/popular" element={<PopularMoviesPage />} />
        <Route path="/movies/top-rated" element={<TopRatedMoviesPage />} />
        <Route path="/movies/:id/similar" element={<SimilarMoviesPage />} />
        <Route path="/movies/:id/review" element={<AddMovieReviewPage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/movies/favourites" element={<FavouriteMoviesPage />} />
        
        <Route path="/tv-series" element={<TVSeriesPage />} />
        <Route path="/tv-series/:id" element={<TVSeriesDetailsPage />} />
        
        <Route path="/actors" element={<ActorsPage />} />
        <Route path="/actors/:id" element={<ActorDetailsPage />} />
        
        <Route path="/reviews/:id" element={<MovieReviewPage/>} />
        
        <Route path="*" element={<Navigate to="/" />} />
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

