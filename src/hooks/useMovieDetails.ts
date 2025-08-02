import { useState, useEffect } from 'react';
import { MovieService } from '@services/movieService';
import type { MovieDetailsType  } from '@types';

interface UseMovieDetailsState {
  movie: MovieDetailsType | null;
  loading: boolean;
  error: string | null;
}

export const useMovieDetails = (movieId: string | null) => {
  const [state, setState] = useState<UseMovieDetailsState>({
    movie: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!movieId) {
      setState({ movie: null, loading: false, error: null });
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const movie = await MovieService.getMovieDetails(movieId);
        
        if (!movie) {
          throw new Error('Movie not found');
        }
        
        setState({
          movie,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setState({
          movie: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch movie details'
        });
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return state;
};
