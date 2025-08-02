import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieDetails from './MovieDetails'
import type { MovieDetailsType, Genre, Movie } from '@types'

// Mock all the hooks and services
vi.mock('@hooks/useMovieDetails')
vi.mock('@services/movieService', () => ({
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p'
}))

// Mock child components
vi.mock('../components/UI/Loading/Loading', () => ({
    default: () => <div data-testid="loading">Loading...</div>
}))

vi.mock('../components/WishlistButton/WishlistButton', () => ({
    default: ({ movie, fontFamily, color }: { movie: Movie; fontFamily: string; color: string }) => (
        <button data-testid="wishlist-button" style={{ fontFamily, color }}>
            Add to Wishlist: {movie.title}
        </button>
    )
}))

vi.mock('../components/MovieAdditionalInfo/MovieAdditionalInfo', () => ({
    default: ({ movie, year, runtime, revenue }: { movie: MovieDetailsType; year: string; runtime: string; revenue: string }) => (
        <div data-testid="movie-additional-info">
            {movie.title} - {year} - {runtime} - {revenue}
        </div>
    )
}))

// Mock constants
vi.mock('@constants', () => ({
    MOVIE_CATEGORIES: [
        {
            id: 'western',
            name: 'Western',
            genreId: 37,
            theme: {
                color: '#ffaa17ff',
                font: 'var(--font-western)',
            }
        },
        {
            id: 'science_fiction',
            name: 'Science Fiction',
            genreId: 878,
            theme: {
                color: '#0984e3',
                font: 'var(--font-science-fiction)',
            }
        }
    ]
}))

import { useMovieDetails } from '@hooks/useMovieDetails'
const mockUseMovieDetails = vi.mocked(useMovieDetails)

const mockGenres: Genre[] = [
    { id: 37, name: 'Western' },
    { id: 18, name: 'Drama' }
]

const mockMovie: MovieDetailsType = {
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

const renderWithRouter = (component: React.ReactElement, route = '/movie/123') => {
    return render(
        <MemoryRouter initialEntries={[route]}>
            {component}
        </MemoryRouter>
    )
}

describe('MovieDetails', () => {
    beforeEach(() => {
        mockUseMovieDetails.mockClear()
    })

    it('renders loading state', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: null,
            loading: true,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        expect(screen.getByTestId('loading')).toBeInTheDocument()
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders error state when movie not found', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: null,
            loading: false,
            error: 'Movie not found'
        })

        renderWithRouter(<MovieDetails />)

        expect(screen.getByText('Movie not found')).toBeInTheDocument()
    })

    it('renders category not included message when no matching category', () => {
        const movieWithoutMatchingGenre = {
            ...mockMovie,
            genres: [{ id: 999, name: 'Unknown Genre' }]
        }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithoutMatchingGenre,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        expect(screen.getByText('Category not included')).toBeInTheDocument()
    })

    it('renders movie details correctly', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        expect(screen.getByText('The Good, The Bad and The Ugly')).toBeInTheDocument()
        expect(screen.getByText('A classic western movie about three gunslingers.')).toBeInTheDocument()
    })

    it('applies correct theme styling to title', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        const title = screen.getByText('The Good, The Bad and The Ugly')
        expect(title).toHaveStyle({
            fontFamily: 'var(--font-western)',
            color: '#ffaa17ff'
        })
    })

    it('renders movie poster with correct src', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        const { container } = renderWithRouter(<MovieDetails />)

        const poster = container.querySelector('.movie-detail-poster')
        expect(poster).toBeInTheDocument()
        expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/poster.jpg')
        expect(poster).toHaveAttribute('alt', 'The Good, The Bad and The Ugly')
    })

    it('renders backdrop image correctly', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        const { container } = renderWithRouter(<MovieDetails />)

        const backdrop = container.querySelector('.movie-detail-backdrop-image')
        expect(backdrop).toBeInTheDocument()
        expect(backdrop).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/backdrop.jpg')
        expect(backdrop).toHaveAttribute('alt', 'The Good, The Bad and The Ugly')
    })

    it('renders wishlist button with correct props', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        const wishlistButton = screen.getByTestId('wishlist-button')
        expect(wishlistButton).toHaveTextContent('Add to Wishlist: The Good, The Bad and The Ugly')
        expect(wishlistButton).toHaveStyle({
            fontFamily: 'var(--font-western)',
            color: '#ffaa17ff'
        })
    })

    it('renders movie additional info with formatted data', () => {
        mockUseMovieDetails.mockReturnValue({
            movie: mockMovie,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        const additionalInfo = screen.getByTestId('movie-additional-info')
        expect(additionalInfo).toHaveTextContent('The Good, The Bad and The Ugly - 1966 - 2h 58m - $25,100,000')
    })

    it('handles missing overview gracefully', () => {
        const movieWithoutOverview = { ...mockMovie, overview: '' }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithoutOverview,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        expect(screen.getByText('No description available.')).toBeInTheDocument()
    })

    it('handles missing poster path', () => {
        const movieWithoutPoster = { ...mockMovie, poster_path: '' }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithoutPoster,
            loading: false,
            error: null
        })

        const { container } = renderWithRouter(<MovieDetails />)

        const poster = container.querySelector('.movie-detail-poster')
        expect(poster).toBeInTheDocument()
        // When poster_path is empty, the src might be empty string or not present
        const srcAttr = poster?.getAttribute('src')
        expect(srcAttr).toBeFalsy() // Could be '', null, or undefined
    })

    it('handles missing backdrop path', () => {
        const movieWithoutBackdrop = { ...mockMovie, backdrop_path: '' }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithoutBackdrop,
            loading: false,
            error: null
        })

        const { container } = renderWithRouter(<MovieDetails />)

        const backdrop = container.querySelector('.movie-detail-backdrop-image')
        expect(backdrop).toBeInTheDocument()
        // When backdrop_path is empty, the src might be empty string or not present
        const srcAttr = backdrop?.getAttribute('src')
        expect(srcAttr).toBeFalsy() // Could be '', null, or undefined
    })

    it('formats runtime correctly for different values', () => {
        const movieWithDifferentRuntime = { ...mockMovie, runtime: 90 }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithDifferentRuntime,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        const additionalInfo = screen.getByTestId('movie-additional-info')
        expect(additionalInfo).toHaveTextContent('1h 30m')
    })

    it('handles zero revenue', () => {
        const movieWithZeroRevenue = { ...mockMovie, revenue: 0 }

        mockUseMovieDetails.mockReturnValue({
            movie: movieWithZeroRevenue,
            loading: false,
            error: null
        })

        renderWithRouter(<MovieDetails />)

        const additionalInfo = screen.getByTestId('movie-additional-info')
        expect(additionalInfo).toHaveTextContent('Revenue unknown')
    })
})
