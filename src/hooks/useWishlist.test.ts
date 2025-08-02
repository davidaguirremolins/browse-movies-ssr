import { renderHook, act } from '@testing-library/react'
import { useWishlist } from './useWishlist'
import type { Movie } from '@types'

const mockMovie1: Movie = {
  id: 1,
  title: 'The Matrix',
  poster_path: '/matrix.jpg',
  overview: 'A computer hacker learns about reality.'
}

const mockMovie2: Movie = {
  id: 2,
  title: 'Inception',
  poster_path: '/inception.jpg',
  overview: 'Dreams within dreams.'
}

const mockMovie3: Movie = {
  id: 3,
  title: 'Interstellar',
  poster_path: '/interstellar.jpg',
  overview: 'Space exploration saga.'
}

describe('useWishlist', () => {
  beforeEach(() => {
    // Reset the store before each test
    useWishlist.getState().clearWishlist()
  })

  it('should initialize with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist())

    expect(result.current.wishlist).toEqual([])
  })

  it('should add movie to wishlist', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
    })

    expect(result.current.wishlist).toHaveLength(1)
    expect(result.current.wishlist[0].movie).toEqual(mockMovie1)
    expect(result.current.wishlist[0].addedAt).toBeInstanceOf(Date)
  })

  it('should add multiple movies to wishlist', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
      result.current.addToWishlist(mockMovie2)
      result.current.addToWishlist(mockMovie3)
    })

    expect(result.current.wishlist).toHaveLength(3)
    expect(result.current.wishlist[0].movie).toEqual(mockMovie1)
    expect(result.current.wishlist[1].movie).toEqual(mockMovie2)
    expect(result.current.wishlist[2].movie).toEqual(mockMovie3)
  })

  it('should remove movie from wishlist by id', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
      result.current.addToWishlist(mockMovie2)
      result.current.addToWishlist(mockMovie3)
    })

    expect(result.current.wishlist).toHaveLength(3)

    act(() => {
      result.current.removeFromWishlist(2) // Remove Inception
    })

    expect(result.current.wishlist).toHaveLength(2)
    expect(result.current.wishlist[0].movie).toEqual(mockMovie1)
    expect(result.current.wishlist[1].movie).toEqual(mockMovie3)
    expect(result.current.wishlist.find(item => item.movie.id === 2)).toBeUndefined()
  })

  it('should check if movie is in wishlist', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
      result.current.addToWishlist(mockMovie3)
    })

    expect(result.current.isInWishlist(1)).toBe(true)  // The Matrix
    expect(result.current.isInWishlist(2)).toBe(false) // Inception (not added)
    expect(result.current.isInWishlist(3)).toBe(true)  // Interstellar
    expect(result.current.isInWishlist(999)).toBe(false) // Non-existent movie
  })

  it('should clear entire wishlist', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
      result.current.addToWishlist(mockMovie2)
      result.current.addToWishlist(mockMovie3)
    })

    expect(result.current.wishlist).toHaveLength(3)

    act(() => {
      result.current.clearWishlist()
    })

    expect(result.current.wishlist).toEqual([])
    expect(result.current.isInWishlist(1)).toBe(false)
    expect(result.current.isInWishlist(2)).toBe(false)
    expect(result.current.isInWishlist(3)).toBe(false)
  })

  it('should handle removing non-existent movie', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
    })

    expect(result.current.wishlist).toHaveLength(1)

    act(() => {
      result.current.removeFromWishlist(999) // Non-existent ID
    })

    expect(result.current.wishlist).toHaveLength(1)
    expect(result.current.wishlist[0].movie).toEqual(mockMovie1)
  })

  it('should allow adding same movie multiple times (duplicate handling)', () => {
    const { result } = renderHook(() => useWishlist())

    act(() => {
      result.current.addToWishlist(mockMovie1)
      result.current.addToWishlist(mockMovie1) // Add same movie again
    })

    // Since there's no duplicate prevention in the current implementation,
    // it should add the same movie twice
    expect(result.current.wishlist).toHaveLength(2)
    expect(result.current.wishlist[0].movie).toEqual(mockMovie1)
    expect(result.current.wishlist[1].movie).toEqual(mockMovie1)
  })

  it('should persist state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useWishlist())
    
    act(() => {
      result1.current.addToWishlist(mockMovie1)
    })

    // Create a second hook instance
    const { result: result2 } = renderHook(() => useWishlist())

    // Both instances should see the same wishlist
    expect(result1.current.wishlist).toHaveLength(1)
    expect(result2.current.wishlist).toHaveLength(1)
    expect(result1.current.wishlist[0].movie).toEqual(mockMovie1)
    expect(result2.current.wishlist[0].movie).toEqual(mockMovie1)

    // Changes in one instance should be reflected in the other
    act(() => {
      result2.current.addToWishlist(mockMovie2)
    })

    expect(result1.current.wishlist).toHaveLength(2)
    expect(result2.current.wishlist).toHaveLength(2)
  })

  it('should handle edge case with empty operations', () => {
    const { result } = renderHook(() => useWishlist())

    // Clear empty wishlist
    act(() => {
      result.current.clearWishlist()
    })

    expect(result.current.wishlist).toEqual([])

    // Check non-existent movie in empty wishlist
    expect(result.current.isInWishlist(1)).toBe(false)
  })
})
