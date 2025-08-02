import { render, screen, fireEvent } from '@testing-library/react'
import IconButton from './IconButton'

describe('IconButton', () => {
    const mockOnClick = vi.fn()

    beforeEach(() => {
        mockOnClick.mockClear()
    })

    it('renders button with text', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                text="›"
                ariaLabel="Next"
            />
        )

        expect(screen.getByRole('button')).toBeInTheDocument()
        expect(screen.getByText('›')).toBeInTheDocument()
    })

    it('renders button without text', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                ariaLabel="Close"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toBeEmptyDOMElement()
    })

    it('calls onClick when button is clicked', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                text="‹"
                ariaLabel="Previous"
            />
        )

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('has correct aria-label', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                text="×"
                ariaLabel="Close modal"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-label', 'Close modal')
    })

    it('has correct CSS class', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                text="+"
                ariaLabel="Add item"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveClass('icon-button')
    })

    it('handles multiple clicks', () => {
        render(
            <IconButton
                onClick={mockOnClick}
                text="⚡"
                ariaLabel="Action button"
            />
        )

        const button = screen.getByRole('button')
        fireEvent.click(button)
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockOnClick).toHaveBeenCalledTimes(3)
    })
})
