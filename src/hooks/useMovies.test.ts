import { renderHook, waitFor } from '@testing-library/react'
import { useMovies } from './useMovies'
import { MovieService } from '@services/movieService'
import type { MovieCategory, Movie, ApiResponse } from '@types'

// Mock the MovieService
vi.mock('@services/movieService')
const mockMovieService = vi.mocked(MovieService)

const mockCategory: MovieCategory = {
  id: 'western',
  name: 'Western',
  genreId: 37,
  theme: {
    color: '#ffaa17ff',
    font: 'var(--font-western)'
  }
}

const mockMovies: Movie[] = [
  { id: 1, title: 'The Good, The Bad and The Ugly', poster_path: '/poster1.jpg', overview: 'A western classic.' },
  { id: 2, title: 'Django Unchained', poster_path: '/poster2.jpg', overview: 'A modern western.' }
]

const mockApiResponse: ApiResponse<Movie> = {
  results: mockMovies,
  page: 1,
  total_pages: 10,
  total_results: 200
}

describe('useMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with loading state', () => {
    mockMovieService.getMoviesByCategory.mockImplementation(() => 
      new Promise(() => {}) // Never resolves, keeps loading
    )

    const { result } = renderHook(() => useMovies(mockCategory))

    expect(result.current.movies).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch movies successfully', async () => {
    mockMovieService.getMoviesByCategory.mockResolvedValue(mockApiResponse)

    const { result } = renderHook(() => useMovies(mockCategory))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual(mockMovies)
    expect(result.current.error).toBeNull()
    expect(mockMovieService.getMoviesByCategory).toHaveBeenCalledWith(mockCategory)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'API request failed'
    mockMovieService.getMoviesByCategory.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useMovies(mockCategory))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual([])
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.loading).toBe(false)
  })

  it('should handle non-Error exceptions', async () => {
    mockMovieService.getMoviesByCategory.mockRejectedValue('String error')

    const { result } = renderHook(() => useMovies(mockCategory))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual([])
    expect(result.current.error).toBe('An error occurred')
    expect(result.current.loading).toBe(false)
  })

  it('should refetch when category changes', async () => {
    mockMovieService.getMoviesByCategory.mockResolvedValue(mockApiResponse)

    const { result, rerender } = renderHook(
      ({ category }) => useMovies(category),
      { initialProps: { category: mockCategory } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockMovieService.getMoviesByCategory).toHaveBeenCalledTimes(1)

    // Change category
    const newCategory: MovieCategory = {
      id: 'sci-fi',
      name: 'Science Fiction',
      genreId: 878,
      theme: {
        color: '#0984e3',
        font: 'var(--font-sci-fi)'
      }
    }

    rerender({ category: newCategory })

    await waitFor(() => {
      expect(mockMovieService.getMoviesByCategory).toHaveBeenCalledTimes(2)
    })

    expect(mockMovieService.getMoviesByCategory).toHaveBeenLastCalledWith(newCategory)
  })

  it('should return empty results when API returns empty results', async () => {
    const emptyResponse: ApiResponse<Movie> = {
      results: [],
      page: 1,
      total_pages: 0,
      total_results: 0
    }

    mockMovieService.getMoviesByCategory.mockResolvedValue(emptyResponse)

    const { result } = renderHook(() => useMovies(mockCategory))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movies).toEqual([])
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle category with different genreId', async () => {
    const documentaryCategory: MovieCategory = {
      id: 'documentary',
      name: 'Documentary',
      genreId: 99,
      theme: {
        color: '#105615ff',
        font: 'var(--font-documentary)'
      }
    }

    mockMovieService.getMoviesByCategory.mockResolvedValue(mockApiResponse)

    renderHook(() => useMovies(documentaryCategory))

    await waitFor(() => {
      expect(mockMovieService.getMoviesByCategory).toHaveBeenCalledWith(documentaryCategory)
    })
  })
})
