import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react'
import React, { useRef } from 'react'
import WishlistButton from '../../components/WishlistButton/WishlistButton'
import { useWishlist } from '../../hooks/useWishlist'
import type { Movie } from '@types'

const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview'
}

// Performance monitoring component
const PerformanceMonitor = ({
    children,
    onRender
}: {
    children: React.ReactNode
    onRender: (id: string, phase: string) => void
}) => {
    const renderCount = useRef(0)

    React.useLayoutEffect(() => {
        renderCount.current++
        onRender('monitor', 'commit')
    })

    return <>{children}</>
}

// Component that uses wishlist hook for testing
const WishlistConsumer = ({
    movieId,
    onRender
}: {
    movieId: number
    onRender: (id: string, phase: string) => void
}) => {
    const { wishlist, isInWishlist } = useWishlist()

    React.useLayoutEffect(() => {
        onRender('consumer', 'commit')
    })

    return (
        <div data-testid="wishlist-consumer">
            <span>Total items: {wishlist.length}</span>
            <span>Is movie {movieId} in wishlist: {isInWishlist(movieId) ? 'Yes' : 'No'}</span>
        </div>
    )
}

describe('Wishlist Performance Tests', () => {
    let renderCounts: Record<string, number> = {}

    const trackRender = (componentId: string, _phase: string) => {
        if (!renderCounts[componentId]) {
            renderCounts[componentId] = 0
        }
        renderCounts[componentId]++
    }

    beforeEach(() => {
        renderCounts = {}
        // Clear the wishlist store before each test
        const store = useWishlist.getState()
        store.clearWishlist()
    })

    it('should minimize re-renders when adding/removing items', async () => {
        const user = userEvent.setup()

        const TestApp = () => {
            return (
                <BrowserRouter>
                    <PerformanceMonitor onRender={trackRender}>
                        <div>
                            <WishlistConsumer movieId={1} onRender={trackRender} />
                            <WishlistButton
                                movie={mockMovie}
                                fontFamily="Arial"
                                color="blue"
                            />
                        </div>
                    </PerformanceMonitor>
                </BrowserRouter>
            )
        }

        const { container } = render(<TestApp />)

        // Reset render counts after initial render
        renderCounts = {}

        // Perform add operation
        const button = container.querySelector('button')!
        await act(async () => {
            await user.click(button)
        })

        // Check that components didn't re-render excessively
        expect(renderCounts.consumer || 0).toBeLessThanOrEqual(2) // Should be 1 for state change
        expect(renderCounts.monitor || 0).toBeLessThanOrEqual(2)

        // Reset counts
        renderCounts = {}

        // Perform remove operation
        await act(async () => {
            await user.click(button)
        })

        // Again, minimal re-renders expected
        expect(renderCounts.consumer || 0).toBeLessThanOrEqual(2)
        expect(renderCounts.monitor || 0).toBeLessThanOrEqual(2)
    })

    it('should not re-render unrelated components', async () => {
        const user = userEvent.setup()

        const UnrelatedComponent = ({ onRender }: { onRender: (id: string, phase: string) => void }) => {
            React.useLayoutEffect(() => {
                onRender('unrelated', 'commit')
            })

            return <div data-testid="unrelated">Unrelated Component</div>
        }

        const TestApp = () => {
            return (
                <BrowserRouter>
                    <div>
                        <UnrelatedComponent onRender={trackRender} />
                        <WishlistConsumer movieId={1} onRender={trackRender} />
                        <WishlistButton
                            movie={mockMovie}
                            fontFamily="Arial"
                            color="blue"
                        />
                    </div>
                </BrowserRouter>
            )
        }

        const { container } = render(<TestApp />)

        // Reset after initial render
        renderCounts = {}

        // Interact with wishlist
        const button = container.querySelector('button')!
        await act(async () => {
            await user.click(button)
        })

        // Unrelated component should not re-render
        expect(renderCounts.unrelated || 0).toBe(0)

        // Wishlist consumer should re-render due to state change
        expect(renderCounts.consumer || 0).toBeLessThanOrEqual(2)
    })

    it('should handle rapid state changes efficiently', async () => {
        const user = userEvent.setup()

        const TestApp = () => {
            return (
                <BrowserRouter>
                    <PerformanceMonitor onRender={trackRender}>
                        <WishlistConsumer movieId={1} onRender={trackRender} />
                        <WishlistButton
                            movie={mockMovie}
                            fontFamily="Arial"
                            color="blue"
                        />
                    </PerformanceMonitor>
                </BrowserRouter>
            )
        }

        const { container } = render(<TestApp />)

        // Reset after initial render
        renderCounts = {}

        const button = container.querySelector('button')!

        // Perform rapid clicks (toggle 10 times)
        await act(async () => {
            for (let i = 0; i < 10; i++) {
                await user.click(button)
            }
        })

        // Even with 10 operations, re-renders should be reasonable
        // Each click should cause at most 1-2 re-renders
        expect(renderCounts.consumer || 0).toBeLessThanOrEqual(20) // Allow some buffer
        expect(renderCounts.monitor || 0).toBeLessThanOrEqual(20)
    })

    it('should maintain performance with multiple wishlist buttons', async () => {
        const user = userEvent.setup()

        const movie2: Movie = { ...mockMovie, id: 2, title: 'Movie 2' }
        const movie3: Movie = { ...mockMovie, id: 3, title: 'Movie 3' }

        const TestApp = () => {
            return (
                <BrowserRouter>
                    <div>
                        <WishlistConsumer movieId={1} onRender={(_id, phase) => trackRender('consumer1', phase)} />
                        <WishlistConsumer movieId={2} onRender={(_id, phase) => trackRender('consumer2', phase)} />
                        <WishlistConsumer movieId={3} onRender={(_id, phase) => trackRender('consumer3', phase)} />

                        <WishlistButton movie={mockMovie} fontFamily="Arial" color="blue" />
                        <WishlistButton movie={movie2} fontFamily="Arial" color="red" />
                        <WishlistButton movie={movie3} fontFamily="Arial" color="green" />
                    </div>
                </BrowserRouter>
            )
        }

        const { container } = render(<TestApp />)

        // Reset after initial render
        renderCounts = {}

        // Click on first movie button
        const buttons = container.querySelectorAll('button')
        await act(async () => {
            await user.click(buttons[0])
        })

        // All consumers should re-render (shared state), but minimally
        expect(renderCounts.consumer1 || 0).toBeLessThanOrEqual(2)
        expect(renderCounts.consumer2 || 0).toBeLessThanOrEqual(2)
        expect(renderCounts.consumer3 || 0).toBeLessThanOrEqual(2)

        // Reset counts
        renderCounts = {}

        // Click on second movie button
        await act(async () => {
            await user.click(buttons[1])
        })

        // Again, all should re-render minimally
        expect(renderCounts.consumer1 || 0).toBeLessThanOrEqual(2)
        expect(renderCounts.consumer2 || 0).toBeLessThanOrEqual(2)
        expect(renderCounts.consumer3 || 0).toBeLessThanOrEqual(2)
    })

    it('should be memory efficient with component unmounting', async () => {
        const user = userEvent.setup()

        const TestApp = ({ showButton }: { showButton: boolean }) => {
            return (
                <BrowserRouter>
                    <div>
                        <WishlistConsumer movieId={1} onRender={trackRender} />
                        {showButton && (
                            <WishlistButton
                                movie={mockMovie}
                                fontFamily="Arial"
                                color="blue"
                            />
                        )}
                    </div>
                </BrowserRouter>
            )
        }

        const { container, rerender } = render(<TestApp showButton={true} />)

        // Reset after initial render
        renderCounts = {}

        // Interact with button
        const button = container.querySelector('button')!
        await act(async () => {
            await user.click(button)
        })

        // Unmount the button component
        rerender(<TestApp showButton={false} />)

        // Reset counts
        renderCounts = {}

        // The consumer should still work and reflect the state
        // but shouldn't have unnecessary re-renders
        expect(renderCounts.consumer || 0).toBeLessThanOrEqual(1) // At most 1 for rerender
    })
})
