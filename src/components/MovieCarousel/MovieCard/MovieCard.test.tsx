import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MovieCard from './MovieCard'
import type { Movie } from '@types'


vi.mock('@services/movieService', () => ({
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p'
}))

const mockMovie: Movie = {
    id: 123,
    title: 'The Matrix',
    poster_path: '/matrix.jpg',
    overview: 'A computer hacker learns about the true nature of reality.'
}

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('MovieCard', () => {
    it('renders movie title and overview', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} />
        )

        expect(screen.getByText('The Matrix')).toBeInTheDocument()
        expect(screen.getByText('A computer hacker learns about the true nature of reality.')).toBeInTheDocument()
    })

    it('renders movie poster with correct src and alt', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} />
        )

        const image = screen.getByAltText('The Matrix')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/matrix.jpg')
    })

    it('creates correct link to movie detail page', () => {
        renderWithRouter(
            <MovieCard movie={mockMovie} />
        )

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/movie/123')
    })

    it('does not render overview when movie has no overview', () => {
        const movieWithoutOverview = { ...mockMovie, overview: '' }

        renderWithRouter(
            <MovieCard movie={movieWithoutOverview} />
        )

        expect(screen.queryByText('A computer hacker learns about the true nature of reality.')).not.toBeInTheDocument()
    })
})
