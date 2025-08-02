import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import { useWishlist } from '@hooks'
import type { Movie } from '@types'

vi.mock('@hooks', () => ({
    useWishlist: vi.fn()
}))

const mockUseWishlist = vi.mocked(useWishlist)

const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview'
}

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {component}
        </MemoryRouter>
    )
}

describe('Header', () => {
    beforeEach(() => {
        mockUseWishlist.mockReturnValue({
            wishlist: [],
            addToWishlist: vi.fn(),
            removeFromWishlist: vi.fn(),
            isInWishlist: vi.fn().mockReturnValue(false)
        })
    })

    it('renders header with title and navigation links', () => {
        renderWithRouter(<Header />)

        expect(screen.getByText('Browse Films SSR')).toBeInTheDocument()
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Wishlist')).toBeInTheDocument()
    })

    it('Renders title as a link to home page', () => {
        renderWithRouter(<Header />)

        const titleLink = screen.getByRole('link', { name: 'Browse Films SSR' })
        expect(titleLink).toHaveAttribute('href', '/')
    })

    it('highlights Home link when on home page', () => {
        renderWithRouter(<Header />, ['/'])

        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).toHaveClass('active')

        const wishlistLink = screen.getByRole('link', { name: 'Wishlist' })
        expect(wishlistLink).not.toHaveClass('active')
    })

    it('highlights Wishlist link when on wishlist page', () => {
        renderWithRouter(<Header />, ['/wishlist'])

        const wishlistLink = screen.getByRole('link', { name: 'Wishlist' })
        expect(wishlistLink).toHaveClass('active')

        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).not.toHaveClass('active')
    })

    it('does not show wishlist count when wishlist is empty', () => {
        mockUseWishlist.mockReturnValue({
            wishlist: [],
            addToWishlist: vi.fn(),
            removeFromWishlist: vi.fn(),
            isInWishlist: vi.fn().mockReturnValue(false)
        })

        renderWithRouter(<Header />)

        expect(screen.queryByText('0')).not.toBeInTheDocument()
        const wishlistCountElement = screen.queryByTestId('wishlist-count')
        expect(wishlistCountElement).not.toBeInTheDocument()
    })

    it('shows wishlist count when items are in wishlist', () => {
        const mockWishlist = [mockMovie, { ...mockMovie, id: 2, title: 'Movie 2' }]

        mockUseWishlist.mockReturnValue({
            wishlist: mockWishlist,
            addToWishlist: vi.fn(),
            removeFromWishlist: vi.fn(),
            isInWishlist: vi.fn().mockReturnValue(true)
        })

        renderWithRouter(<Header />)

        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('2')).toHaveClass('header-wishlist-count')
    })

    it('updates wishlist count when wishlist changes', () => {
        const { rerender } = renderWithRouter(<Header />)

        expect(screen.queryByText('1')).not.toBeInTheDocument()

        mockUseWishlist.mockReturnValue({
            wishlist: [mockMovie],
            addToWishlist: vi.fn(),
            removeFromWishlist: vi.fn(),
            isInWishlist: vi.fn().mockReturnValue(true)
        })

        rerender(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )

        expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('has correct navigation link hrefs', () => {
        renderWithRouter(<Header />)

        const homeLink = screen.getByRole('link', { name: 'Home' })
        const wishlistLink = screen.getByRole('link', { name: 'Wishlist' })

        expect(homeLink).toHaveAttribute('href', '/')
        expect(wishlistLink).toHaveAttribute('href', '/wishlist')
    })
})
