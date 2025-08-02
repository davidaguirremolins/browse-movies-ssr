import { render, screen } from '@testing-library/react'
import SectionTitle from './SectionTitle'

describe('SectionTitle', () => {
    const mockTheme = {
        color: '#ff0000',
        font: 'Georgia'
    }

    it('renders title text', () => {
        render(
            <SectionTitle theme={mockTheme} title="Western Movies" />
        )

        expect(screen.getByText('Western Movies')).toBeInTheDocument()
    })

    it('applies theme font family', () => {
        render(
            <SectionTitle theme={mockTheme} title="Horror Movies" />
        )

        const heading = screen.getByRole('heading')
        expect(heading).toHaveStyle({ fontFamily: 'Georgia' })
    })

    it('renders as h2 element', () => {
        render(
            <SectionTitle theme={mockTheme} title="Sci-Fi Movies" />
        )

        const heading = screen.getByRole('heading', { level: 2 })
        expect(heading).toBeInTheDocument()
    })

    it('has correct CSS class', () => {
        render(
            <SectionTitle theme={mockTheme} title="Documentary Movies" />
        )

        const heading = screen.getByRole('heading')
        expect(heading).toHaveClass('section-title')
    })
})
