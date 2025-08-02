import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import WishlistButton from './WishlistButton'
import type { Movie } from '@types'

// Create mock functions that we can control
const mockAddToWishlist = vi.fn()
const mockRemoveFromWishlist = vi.fn()
const mockIsInWishlist = vi.fn()

// Mock the useWishlist hook
vi.mock('@hooks/useWishlist', () => ({
    useWishlist: () => ({
        addToWishlist: mockAddToWishlist,
        removeFromWishlist: mockRemoveFromWishlist,
        isInWishlist: mockIsInWishlist,
    })
}))

const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview'
}

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('WishlistButton', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsInWishlist.mockReturnValue(false) // Default: not in wishlist
    })

    it('renders add to wishlist button when movie is not in wishlist', () => {
        mockIsInWishlist.mockReturnValue(false)

        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        expect(screen.getByText('Add to Wishlist')).toBeInTheDocument()
    })

    it('renders remove from wishlist button when movie is in wishlist', () => {
        mockIsInWishlist.mockReturnValue(true)

        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        expect(screen.getByText('Remove from Wishlist')).toBeInTheDocument()
    })

    it('applies custom font family and color styles', () => {
        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Georgia"
                color="rgb(255, 0, 0)"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveStyle({ fontFamily: 'Georgia', color: 'rgb(255, 0, 0)' })
    })

    it('calls addToWishlist when movie is not in wishlist and button is clicked', async () => {
        const user = userEvent.setup()
        mockIsInWishlist.mockReturnValue(false)

        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        const button = screen.getByRole('button')
        await user.click(button)

        expect(mockAddToWishlist).toHaveBeenCalledWith(mockMovie)
        expect(mockAddToWishlist).toHaveBeenCalledTimes(1)
        expect(mockRemoveFromWishlist).not.toHaveBeenCalled()
    })

    it('calls removeFromWishlist when movie is in wishlist and button is clicked', async () => {
        const user = userEvent.setup()
        mockIsInWishlist.mockReturnValue(true)

        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        const button = screen.getByRole('button')
        await user.click(button)

        expect(mockRemoveFromWishlist).toHaveBeenCalledWith(mockMovie.id)
        expect(mockRemoveFromWishlist).toHaveBeenCalledTimes(1)
        expect(mockAddToWishlist).not.toHaveBeenCalled()
    })

    it('applies the correct CSS class', () => {
        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveClass('movie-detail-wishlist-button')
    })

    it('handles multiple clicks correctly', async () => {
        const user = userEvent.setup()
        mockIsInWishlist.mockReturnValue(false)

        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        const button = screen.getByRole('button')

        // Click multiple times
        await user.click(button)
        await user.click(button)
        await user.click(button)

        expect(mockAddToWishlist).toHaveBeenCalledTimes(3)
        expect(mockAddToWishlist).toHaveBeenCalledWith(mockMovie)
    })

    it('calls isInWishlist with correct movie id on render', () => {
        renderWithRouter(
            <WishlistButton
                movie={mockMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        expect(mockIsInWishlist).toHaveBeenCalledWith(mockMovie.id)
    })

    it('works with different movie objects', async () => {
        const user = userEvent.setup()
        const differentMovie: Movie = {
            id: 999,
            title: 'Different Movie',
            poster_path: '/different.jpg',
            overview: 'Different overview'
        }

        mockIsInWishlist.mockReturnValue(false)

        renderWithRouter(
            <WishlistButton
                movie={differentMovie}
                fontFamily="Arial"
                color="blue"
            />
        )

        const button = screen.getByRole('button')
        await user.click(button)

        expect(mockIsInWishlist).toHaveBeenCalledWith(differentMovie.id)
        expect(mockAddToWishlist).toHaveBeenCalledWith(differentMovie)
    })
})
