import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CategorySection from './CategorySection'
import type { MovieCategory, Movie } from '@types'
import { useMovies } from '@hooks/useMovies'

vi.mock('@hooks/useMovies')
const mockUseMovies = vi.mocked(useMovies)

vi.mock('../UI/SectionTitle/SectionTitle', () => ({
    default: ({ title }: { title: string }) => <h2 data-testid="section-title">{title}</h2>
}))

vi.mock('../MovieCarousel/MovieCarousel', () => ({
    default: ({ movies }: { movies: Movie[] }) => (
        <div data-testid="movie-carousel">
            {movies.length} movies
        </div>
    )
}))

const mockCategory: MovieCategory = {
    id: 'western',
    name: 'Western',
    genreId: 37,
    theme: {
        color: '#ffaa17ff',
        font: 'var(--font-western)'
    }
}

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('CategorySection', () => {
    it('renders loading state', () => {
        mockUseMovies.mockReturnValue({
            movies: [],
            loading: true,
            error: null
        })

        renderWithRouter(
            <CategorySection movieCategory={mockCategory} />
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('renders error state', () => {
        mockUseMovies.mockReturnValue({
            movies: [],
            loading: false,
            error: 'Failed to fetch movies'
        })

        renderWithRouter(
            <CategorySection movieCategory={mockCategory} />
        )

        expect(screen.getByText('Error loading movies')).toBeInTheDocument()
    })

    it('renders movies when data is available', () => {
        const mockMovies: Movie[] = [
            { id: 1, title: 'Movie 1', poster_path: '/path1.jpg', overview: 'Overview 1' },
            { id: 2, title: 'Movie 2', poster_path: '/path2.jpg', overview: 'Overview 2' }
        ]

        mockUseMovies.mockReturnValue({
            movies: mockMovies,
            loading: false,
            error: null
        })

        renderWithRouter(
            <CategorySection movieCategory={mockCategory} />
        )

        expect(screen.getByTestId('section-title')).toHaveTextContent('Western')
        expect(screen.getByTestId('movie-carousel')).toHaveTextContent('2 movies')
    })
})
