import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'
import type { MovieCategory } from '@types'

// Mock the CategorySection component
vi.mock('../components/CategorySection/CategorySection', () => ({
    default: ({ movieCategory }: { movieCategory: MovieCategory }) => (
        <div data-testid={`category-section-${movieCategory.id}`}>
            <h2>{movieCategory.name}</h2>
            <span style={{ color: movieCategory.theme.color }}>
                Theme Color: {movieCategory.theme.color}
            </span>
        </div>
    )
}))

// Mock the constants
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
            id: 'documentary',
            name: 'Documentary',
            genreId: 99,
            theme: {
                color: '#105615ff',
                font: 'var(--font-documentary)',
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

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Home', () => {
    it('renders home section with correct class', () => {
        const { container } = renderWithRouter(<Home />)

        expect(container.querySelector('.home')).toBeInTheDocument()
    })

    it('renders all movie categories', () => {
        renderWithRouter(<Home />)

        expect(screen.getByTestId('category-section-western')).toBeInTheDocument()
        expect(screen.getByTestId('category-section-documentary')).toBeInTheDocument()
        expect(screen.getByTestId('category-section-science_fiction')).toBeInTheDocument()
    })

    it('displays category names correctly', () => {
        renderWithRouter(<Home />)

        expect(screen.getByText('Western')).toBeInTheDocument()
        expect(screen.getByText('Documentary')).toBeInTheDocument()
        expect(screen.getByText('Science Fiction')).toBeInTheDocument()
    })

    it('applies theme colors to categories', () => {
        renderWithRouter(<Home />)

        expect(screen.getByText('Theme Color: #ffaa17ff')).toBeInTheDocument()
        expect(screen.getByText('Theme Color: #105615ff')).toBeInTheDocument()
        expect(screen.getByText('Theme Color: #0984e3')).toBeInTheDocument()
    })

    it('renders categories in correct order', () => {
        renderWithRouter(<Home />)

        const categories = screen.getAllByTestId(/category-section-/)
        expect(categories).toHaveLength(3)
        expect(categories[0]).toHaveAttribute('data-testid', 'category-section-western')
        expect(categories[1]).toHaveAttribute('data-testid', 'category-section-documentary')
        expect(categories[2]).toHaveAttribute('data-testid', 'category-section-science_fiction')
    })

    it('passes correct props to CategorySection components', () => {
        renderWithRouter(<Home />)

        // Check that each category section receives the right data
        const westernSection = screen.getByTestId('category-section-western')
        const documentarySection = screen.getByTestId('category-section-documentary')
        const sciFiSection = screen.getByTestId('category-section-science_fiction')

        expect(westernSection).toHaveTextContent('Western')
        expect(documentarySection).toHaveTextContent('Documentary')
        expect(sciFiSection).toHaveTextContent('Science Fiction')
    })
})
