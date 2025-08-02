import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Wishlist from './Wishlist'
import type { Movie, WishlistItem } from '@types'

// Mock the hooks
vi.mock('@hooks/useWishlist')

// Mock child components
vi.mock('../components/MovieCarousel/MovieCarousel', () => ({
    default: ({ movies }: { movies: Movie[] }) => (
        <div data-testid="movie-carousel">
            <span>Carousel with {movies.length} movies</span>
            {movies.map(movie => (
                <div key={movie.id} data-testid={`carousel-movie-${movie.id}`}>
                    {movie.title}
                </div>
            ))}
        </div>
    )
}))

vi.mock('../components/UI/Button/Button', () => ({
    default: ({ text, onClick }: { text: string; onClick: () => void }) => (
        <button data-testid="clear-button" onClick={onClick}>
            {text}
        </button>
    )
}))

import { useWishlist } from '@hooks/useWishlist'
const mockUseWishlist = vi.mocked(useWishlist)

const mockMovies: Movie[] = [
    { id: 1, title: 'The Matrix', poster_path: '/matrix.jpg', overview: 'A hacker discovers reality.' },
    { id: 2, title: 'Inception', poster_path: '/inception.jpg', overview: 'Dreams within dreams.' },
    { id: 3, title: 'Interstellar', poster_path: '/interstellar.jpg', overview: 'Space exploration.' }
]

const mockWishlistItems: WishlistItem[] = mockMovies.map(movie => ({
    movie,
    addedAt: new Date('2023-01-01')
}))

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Wishlist', () => {
    beforeEach(() => {
        mockUseWishlist.mockClear()
    })

    it('renders empty wishlist message when no items', () => {
        mockUseWishlist.mockReturnValue([])

        renderWithRouter(<Wishlist />)

        expect(screen.getByText('Your Wishlist is Empty')).toBeInTheDocument()
        expect(screen.getByText('Start exploring movies and add your favorites to your wishlist!')).toBeInTheDocument()
    })

    it('applies correct CSS classes for empty wishlist', () => {
        mockUseWishlist.mockReturnValue([])

        const { container } = renderWithRouter(<Wishlist />)

        expect(container.querySelector('.wishlist')).toBeInTheDocument()
        expect(container.querySelector('.wishlist-empty')).toBeInTheDocument()
        expect(container.querySelector('.wishlist-empty-content')).toBeInTheDocument()
    })

    it('renders wishlist with items when items exist', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems) // First call for wishlistItems
            .mockReturnValueOnce(vi.fn()) // Second call for clearWishlist

        renderWithRouter(<Wishlist />)

        expect(screen.getByText('My Wishlist')).toBeInTheDocument()
        expect(screen.getByText('(3)')).toBeInTheDocument()
        expect(screen.getByTestId('movie-carousel')).toBeInTheDocument()
        expect(screen.getByTestId('clear-button')).toBeInTheDocument()
    })

    it('displays correct wishlist count', () => {
        const singleItemWishlist = [mockWishlistItems[0]]

        mockUseWishlist
            .mockReturnValueOnce(singleItemWishlist)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        expect(screen.getByText('(1)')).toBeInTheDocument()
    })

    it('passes correct movies to MovieCarousel', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        expect(screen.getByText('Carousel with 3 movies')).toBeInTheDocument()
        expect(screen.getByTestId('carousel-movie-1')).toHaveTextContent('The Matrix')
        expect(screen.getByTestId('carousel-movie-2')).toHaveTextContent('Inception')
        expect(screen.getByTestId('carousel-movie-3')).toHaveTextContent('Interstellar')
    })

    it('renders clear all button with correct text', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        const clearButton = screen.getByTestId('clear-button')
        expect(clearButton).toHaveTextContent('Clear All')
    })

    it('calls clearWishlist when clear button is clicked', () => {
        const mockClearWishlist = vi.fn()

        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(mockClearWishlist)

        renderWithRouter(<Wishlist />)

        const clearButton = screen.getByTestId('clear-button')
        fireEvent.click(clearButton)

        expect(mockClearWishlist).toHaveBeenCalledTimes(1)
    })

    it('has correct structure for wishlist with items', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(vi.fn())

        const { container } = renderWithRouter(<Wishlist />)

        expect(container.querySelector('.wishlist')).toBeInTheDocument()
        expect(container.querySelector('.container')).toBeInTheDocument()
        expect(container.querySelector('.wishlist-header')).toBeInTheDocument()
        expect(container.querySelector('.wishlist-title')).toBeInTheDocument()
        expect(container.querySelector('.wishlist-count')).toBeInTheDocument()
    })

    it('handles single movie in wishlist', () => {
        const singleMovie = [mockWishlistItems[0]]

        mockUseWishlist
            .mockReturnValueOnce(singleMovie)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        expect(screen.getByText('Carousel with 1 movies')).toBeInTheDocument()
        expect(screen.getByTestId('carousel-movie-1')).toHaveTextContent('The Matrix')
        expect(screen.queryByTestId('carousel-movie-2')).not.toBeInTheDocument()
    })

    it('extracts movies correctly from wishlist items', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        // Verify that the component correctly extracts movie objects from wishlist items
        expect(screen.getByTestId('carousel-movie-1')).toBeInTheDocument()
        expect(screen.getByTestId('carousel-movie-2')).toBeInTheDocument()
        expect(screen.getByTestId('carousel-movie-3')).toBeInTheDocument()
    })

    it('does not render carousel when wishlist is empty', () => {
        mockUseWishlist.mockReturnValue([])

        renderWithRouter(<Wishlist />)

        expect(screen.queryByTestId('movie-carousel')).not.toBeInTheDocument()
        expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument()
    })

    it('does not render empty state when wishlist has items', () => {
        mockUseWishlist
            .mockReturnValueOnce(mockWishlistItems)
            .mockReturnValueOnce(vi.fn())

        renderWithRouter(<Wishlist />)

        expect(screen.queryByText('Your Wishlist is Empty')).not.toBeInTheDocument()
        expect(screen.queryByText('Start exploring movies and add your favorites to your wishlist!')).not.toBeInTheDocument()
    })
})
