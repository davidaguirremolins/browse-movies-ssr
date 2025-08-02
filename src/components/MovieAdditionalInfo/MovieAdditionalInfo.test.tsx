import { render, screen } from '@testing-library/react'
import MovieAdditionalInfo from './MovieAdditionalInfo'
import type { MovieDetailsType, Genre } from '@types'

const mockGenres: Genre[] = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Adventure' },
    { id: 3, name: 'Sci-Fi' }
]

const mockMovieWithTagline: MovieDetailsType = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview',
    tagline: 'The ultimate test movie',
    genres: mockGenres,
    runtime: 120,
    budget: 50000000,
    revenue: 1000000,
    status: 'Released',
    homepage: 'https://example.com',
    release_date: '2023-01-01',
    vote_average: 8.5,
    backdrop_path: '/backdrop.jpg'
}

const mockMovieWithoutTagline: MovieDetailsType = {
    id: 2,
    title: 'Another Movie',
    poster_path: '/another.jpg',
    overview: 'Another overview',
    tagline: '',
    genres: mockGenres,
    runtime: 90,
    budget: 30000000,
    revenue: 500000,
    status: 'Released',
    homepage: 'https://example2.com',
    release_date: '2023-02-01',
    vote_average: 7.2,
    backdrop_path: '/backdrop2.jpg'
}

const mockMovieWithoutGenres: MovieDetailsType = {
    id: 3,
    title: 'No Genres Movie',
    poster_path: '/nogenres.jpg',
    overview: 'No genres overview',
    tagline: 'A movie without genres',
    genres: [],
    runtime: 105,
    budget: 25000000,
    revenue: 750000,
    status: 'Released',
    homepage: 'https://example3.com',
    release_date: '2023-03-01',
    vote_average: 6.8,
    backdrop_path: '/backdrop3.jpg'
}

describe('MovieAdditionalInfo', () => {
    it('renders tagline when present', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        expect(screen.getByText('"The ultimate test movie"')).toBeInTheDocument()
        expect(screen.getByText('"The ultimate test movie"')).toHaveClass('movie-detail-tagline')
    })

    it('does not render tagline when not present', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithoutTagline}
                year="2023"
                runtime="1h 30m"
                revenue="$500,000"
            />
        )

        expect(screen.queryByTestId('movie-detail-tagline')).not.toBeInTheDocument()
        expect(screen.queryByText(/"/)).not.toBeInTheDocument()
    })

    it('renders meta information correctly', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        expect(screen.getByText('Released in 2023')).toBeInTheDocument()
        expect(screen.getByText('2h 0m')).toBeInTheDocument()
        expect(screen.getByText('$1,000,000 revenue')).toBeInTheDocument()
    })

    it('renders separators between meta items', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        const separators = screen.getAllByText('•')
        expect(separators).toHaveLength(2)
        separators.forEach(separator => {
            expect(separator).toHaveClass('movie-detail-separator')
        })
    })

    it('renders genres when present', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        expect(screen.getByText('Action')).toBeInTheDocument()
        expect(screen.getByText('Adventure')).toBeInTheDocument()
        expect(screen.getByText('Sci-Fi')).toBeInTheDocument()

        expect(screen.getByText('Action')).toHaveClass('movie-detail-genre')
        expect(screen.getByText('Adventure')).toHaveClass('movie-detail-genre')
        expect(screen.getByText('Sci-Fi')).toHaveClass('movie-detail-genre')
    })

    it('does not render genres section when no genres', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithoutGenres}
                year="2023"
                runtime="1h 45m"
                revenue="$750,000"
            />
        )

        expect(screen.queryByText('Action')).not.toBeInTheDocument()
        expect(screen.queryByText('Adventure')).not.toBeInTheDocument()
        expect(screen.queryByText('Sci-Fi')).not.toBeInTheDocument()
    })

    it('does not render genres section when genres array is undefined', () => {
        const movieWithUndefinedGenres = { ...mockMovieWithoutGenres }
        // @ts-expect-error Testing undefined genres
        movieWithUndefinedGenres.genres = undefined

        render(
            <MovieAdditionalInfo
                movie={movieWithUndefinedGenres}
                year="2023"
                runtime="1h 45m"
                revenue="$750,000"
            />
        )

        expect(screen.queryByText('Action')).not.toBeInTheDocument()
    })

    it('has correct container class', () => {
        const { container } = render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        expect(container.querySelector('.movie-detail-additional')).toBeInTheDocument()
    })

    it('handles different runtime formats', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="120 minutes"
                revenue="$1,000,000"
            />
        )

        expect(screen.getByText('120 minutes')).toBeInTheDocument()
    })

    it('handles different revenue formats', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="Not disclosed"
            />
        )

        expect(screen.getByText('Not disclosed revenue')).toBeInTheDocument()
    })

    it('renders all components together correctly', () => {
        render(
            <MovieAdditionalInfo
                movie={mockMovieWithTagline}
                year="2023"
                runtime="2h 0m"
                revenue="$1,000,000"
            />
        )

        // Tagline
        expect(screen.getByText('"The ultimate test movie"')).toBeInTheDocument()

        // Meta info
        expect(screen.getByText('Released in 2023')).toBeInTheDocument()
        expect(screen.getByText('2h 0m')).toBeInTheDocument()
        expect(screen.getByText('$1,000,000 revenue')).toBeInTheDocument()

        // Genres
        expect(screen.getByText('Action')).toBeInTheDocument()
        expect(screen.getByText('Adventure')).toBeInTheDocument()
        expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    })
})
