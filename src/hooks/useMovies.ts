import { useState, useEffect } from 'react';
import { MovieService } from '@services/movieService';
import type { MovieCategory, Movie, ApiResponse } from '@types';

interface UseMoviesState {
    movies: Movie[];
    loading: boolean;
    error: string | null;
}

export const useMovies = (movieCategory: MovieCategory) => {
    const [state, setState] = useState<UseMoviesState>({
        movies: [],
        loading: true,
        error: null
    });
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response: ApiResponse<Movie> = await MovieService.getMoviesByCategory(movieCategory);
                setState({
                    movies: response.results,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching movies:', error);
                setState({
                    movies: [],
                    loading: false,
                    error: error instanceof Error ? error.message : 'An error occurred'
                });
            }
        };

        fetchMovies();
    }, [movieCategory]);

    return state;
};
