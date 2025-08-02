import { renderHook, waitFor } from '@testing-library/react'
import { useMovieDetails } from './useMovieDetails'
import { MovieService } from '@services/movieService'
import type { MovieDetailsType, Genre } from '@types'

// Mock the MovieService
vi.mock('@services/movieService')
const mockMovieService = vi.mocked(MovieService)

const mockGenres: Genre[] = [
  { id: 37, name: 'Western' },
  { id: 18, name: 'Drama' }
]

const mockMovieDetails: MovieDetailsType = {
  id: 123,
  title: 'The Good, The Bad and The Ugly',
  overview: 'A classic western movie about three gunslingers.',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  genres: mockGenres,
  runtime: 178,
  budget: 1200000,
  revenue: 25100000,
  status: 'Released',
  tagline: 'The man with no name',
  homepage: 'https://example.com',
  release_date: '1966-12-23',
  vote_average: 8.8
}

describe('useMovieDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state when movieId is null', () => {
    const { result } = renderHook(() => useMovieDetails(null))

    expect(result.current.movie).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch movie details successfully', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)

    const { result } = renderHook(() => useMovieDetails('123'))

    // Should start loading
    expect(result.current.loading).toBe(true)
    expect(result.current.movie).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual(mockMovieDetails)
    expect(result.current.error).toBeNull()
    expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith('123')
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Movie not found'
    mockMovieService.getMovieDetails.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useMovieDetails('999'))

    // Should start loading
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toBeNull()
    expect(result.current.error).toBe(errorMessage)
  })

  it('should handle non-Error exceptions', async () => {
    mockMovieService.getMovieDetails.mockRejectedValue('String error')

    const { result } = renderHook(() => useMovieDetails('123'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toBeNull()
    expect(result.current.error).toBe('Failed to fetch movie details')
  })

  it('should handle null movie response', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue({} as MovieDetailsType)

    const { result } = renderHook(() => useMovieDetails('123'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual({})
    expect(result.current.error).toBeNull()
  })

  it('should refetch when movieId changes', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)

    const { result, rerender } = renderHook(
      ({ movieId }: { movieId: string | null }) => useMovieDetails(movieId),
      { initialProps: { movieId: '123' as string | null } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockMovieService.getMovieDetails).toHaveBeenCalledTimes(1)
    expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith('123')

    // Change movieId
    const newMovieDetails = { ...mockMovieDetails, id: 456, title: 'The Good, The Bad and The Ugly' }
    mockMovieService.getMovieDetails.mockResolvedValue(newMovieDetails)

    rerender({ movieId: '456' })

    await waitFor(() => {
      expect(mockMovieService.getMovieDetails).toHaveBeenCalledTimes(2)
    })

    expect(mockMovieService.getMovieDetails).toHaveBeenLastCalledWith('456')
    expect(result.current.movie).toEqual(newMovieDetails)
  })

  it('should reset state when movieId changes to null', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)

    const { result, rerender } = renderHook(
      ({ movieId }: { movieId: string | null }) => useMovieDetails(movieId),
      { initialProps: { movieId: '123' as string | null } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual(mockMovieDetails)

    // Change movieId to null
    rerender({ movieId: null })

    expect(result.current.movie).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should not make API call when movieId is empty string', () => {
    const { result } = renderHook(() => useMovieDetails(''))

    expect(result.current.movie).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockMovieService.getMovieDetails).not.toHaveBeenCalled()
  })

  it('should handle loading state correctly during fetch', async () => {
    let resolvePromise: (value: MovieDetailsType) => void
    const promise = new Promise<MovieDetailsType>((resolve) => {
      resolvePromise = resolve
    })

    mockMovieService.getMovieDetails.mockReturnValue(promise)

    const { result } = renderHook(() => useMovieDetails('123'))

    // Should be loading initially
    expect(result.current.loading).toBe(true)
    expect(result.current.movie).toBeNull()
    expect(result.current.error).toBeNull()

    // Resolve the promise
    resolvePromise!(mockMovieDetails)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual(mockMovieDetails)
    expect(result.current.error).toBeNull()
  })

  it('should preserve previous movie when switching to null movieId', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)

    const { result, rerender } = renderHook(
      ({ movieId }: { movieId: string | null }) => useMovieDetails(movieId),
      { initialProps: { movieId: '123' as string | null } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual(mockMovieDetails)

    // Switch to null - should reset everything
    rerender({ movieId: null })

    expect(result.current.movie).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle rapid movieId changes', async () => {
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)

    const { result, rerender } = renderHook(
      ({ movieId }: { movieId: string | null }) => useMovieDetails(movieId),
      { initialProps: { movieId: '123' as string | null } }
    )

    // Quickly change movieId multiple times
    rerender({ movieId: '456' })
    rerender({ movieId: '789' })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have called the API for the latest movieId
    expect(mockMovieService.getMovieDetails).toHaveBeenLastCalledWith('789')
  })

  it('should clear error state when starting new fetch', async () => {
    // First call fails
    mockMovieService.getMovieDetails.mockRejectedValueOnce(new Error('Network error'))

    const { result, rerender } = renderHook(
      ({ movieId }: { movieId: string | null }) => useMovieDetails(movieId),
      { initialProps: { movieId: '123' as string | null } }
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    // Second call succeeds
    mockMovieService.getMovieDetails.mockResolvedValue(mockMovieDetails)
    rerender({ movieId: '456' })

    // Error should be cleared while loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie).toEqual(mockMovieDetails)
    expect(result.current.error).toBeNull()
  })
})
