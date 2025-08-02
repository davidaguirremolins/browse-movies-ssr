import type {Movie, MovieDetailsType, ApiResponse, MovieCategory } from '@types';

const API_KEY = 'd99a1a1120d357d19f7d5de65efc9b74';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export class MovieService {
  private static async request<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Prepare headers - prefer Bearer token if available, fallback to API key
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const requestUrl = `${url}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;    
    
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Failed to fetch data from TMDB API');
    }
  }

  public static async getMoviesByCategory(category: MovieCategory, page: number = 1): Promise<ApiResponse<Movie>> {
    const endpoint = `discover/movie?with_genres=${category?.genreId}&page=${page}`;
    return this.request<ApiResponse<Movie>>(`/${endpoint}`);
  }

    static async getMovieDetails(movieId: string): Promise<MovieDetailsType> {
    return this.request<MovieDetailsType>(`/movie/${movieId}`);
  }
}
