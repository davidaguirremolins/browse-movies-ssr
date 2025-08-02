import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MovieCarousel from './MovieCarousel'
import type { Movie } from '@types'

// Mock child components
vi.mock('../UI/IconButton/IconButton', () => ({
    default: ({ onClick, ariaLabel, text }: { onClick: () => void; ariaLabel: string; text: string }) => (
        <button onClick={onClick} aria-label={ariaLabel} data-testid={`icon-button-${ariaLabel.toLowerCase().replace(' ', '-')}`}>
            {text}
        </button>
    )
}))

vi.mock('./MovieCard/MovieCard', () => ({
    default: ({ movie }: { movie: Movie }) => (
        <div data-testid={`movie-card-${movie.id}`}>
            {movie.title}
        </div>
    )
}))

const mockMovies: Movie[] = [
    { id: 1, title: 'Movie 1', poster_path: '/path1.jpg', overview: 'Overview 1' },
    { id: 2, title: 'Movie 2', poster_path: '/path2.jpg', overview: 'Overview 2' },
    { id: 3, title: 'Movie 3', poster_path: '/path3.jpg', overview: 'Overview 3' }
]

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('MovieCarousel', () => {
    beforeEach(() => {
        // Mock scrollTo method
        Element.prototype.scrollTo = vi.fn()
    })

    it('renders all movies', () => {
        renderWithRouter(<MovieCarousel movies={mockMovies} />)

        expect(screen.getByTestId('movie-card-1')).toBeInTheDocument()
        expect(screen.getByTestId('movie-card-2')).toBeInTheDocument()
        expect(screen.getByTestId('movie-card-3')).toBeInTheDocument()
    })

    it('renders navigation buttons', () => {
        renderWithRouter(<MovieCarousel movies={mockMovies} />)

        expect(screen.getByTestId('icon-button-previous-movies')).toBeInTheDocument()
        expect(screen.getByTestId('icon-button-next-movies')).toBeInTheDocument()
        expect(screen.getByText('‹')).toBeInTheDocument()
        expect(screen.getByText('›')).toBeInTheDocument()
    })

    it('handles next button click', () => {
        const scrollToSpy = vi.fn()
        Element.prototype.scrollTo = scrollToSpy

        renderWithRouter(<MovieCarousel movies={mockMovies} />)

        const nextButton = screen.getByTestId('icon-button-next-movies')
        fireEvent.click(nextButton)

        expect(scrollToSpy).toHaveBeenCalledWith({
            left: 0, // Index 1 * container width (0 in test environment)
            behavior: 'smooth'
        })
    })

    it('handles previous button click', () => {
        const scrollToSpy = vi.fn()
        Element.prototype.scrollTo = scrollToSpy

        renderWithRouter(<MovieCarousel movies={mockMovies} />)

        const prevButton = screen.getByTestId('icon-button-previous-movies')
        fireEvent.click(prevButton)

        expect(scrollToSpy).toHaveBeenCalledWith({
            left: 0, // Last index * container width (0 in test environment)
            behavior: 'smooth'
        })
    })

    it('handles empty movies array', () => {
        renderWithRouter(<MovieCarousel movies={[]} />)

        expect(screen.getByTestId('icon-button-previous-movies')).toBeInTheDocument()
        expect(screen.getByTestId('icon-button-next-movies')).toBeInTheDocument()
        expect(screen.queryByTestId(/movie-card-/)).not.toBeInTheDocument()
    })

    it('handles undefined movies prop', () => {
        // @ts-expect-error Testing undefined movies prop
        renderWithRouter(<MovieCarousel movies={undefined} />)

        expect(screen.getByTestId('icon-button-previous-movies')).toBeInTheDocument()
        expect(screen.getByTestId('icon-button-next-movies')).toBeInTheDocument()
        expect(screen.queryByTestId(/movie-card-/)).not.toBeInTheDocument()
    })

    it('has correct carousel structure', () => {
        const { container } = renderWithRouter(<MovieCarousel movies={mockMovies} />)

        expect(container.querySelector('.movie-carousel')).toBeInTheDocument()
        expect(container.querySelector('.movie-carousel-wrapper')).toBeInTheDocument()
        expect(container.querySelector('.movie-carousel-container')).toBeInTheDocument()
        expect(container.querySelector('.movie-carousel-scroll-container')).toBeInTheDocument()
    })

    it('wraps navigation correctly (next from last to first)', () => {
        const scrollToSpy = vi.fn()
        Element.prototype.scrollTo = scrollToSpy

        renderWithRouter(<MovieCarousel movies={mockMovies} />)

        const nextButton = screen.getByTestId('icon-button-next-movies')

        //(it goes from th first one to last button)
        fireEvent.click(nextButton)
        fireEvent.click(nextButton)
        fireEvent.click(nextButton)

        expect(scrollToSpy).toHaveBeenCalledTimes(3)
    })

    it('renders single movie correctly', () => {
        const singleMovie = [mockMovies[0]]
        renderWithRouter(<MovieCarousel movies={singleMovie} />)

        expect(screen.getByTestId('movie-card-1')).toBeInTheDocument()
        expect(screen.queryByTestId('movie-card-2')).not.toBeInTheDocument()
    })
})
