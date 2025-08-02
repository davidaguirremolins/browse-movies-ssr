import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
    const mockOnClick = vi.fn()

    it('renders button with text', () => {
        render(
            <Button text="Click me" onClick={mockOnClick} />
        )

        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('calls onClick when button is clicked', () => {
        render(
            <Button text="Click me" onClick={mockOnClick} />
        )

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('applies custom font family when provided', () => {
        render(
            <Button
                text="Styled Button"
                onClick={mockOnClick}
                fontFamily="Georgia"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveStyle({ fontFamily: 'Georgia' })
    })

    it('applies custom color when provided', () => {
        render(
            <Button
                text="Colored Button"
                onClick={mockOnClick}
                color="rgb(255, 0, 0)"
            />
        )

        const button = screen.getByRole('button')
        expect(button).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('works without optional font and color props', () => {
        render(
            <Button text="Simple Button" onClick={mockOnClick} />
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(screen.getByText('Simple Button')).toBeInTheDocument()
    })
})
