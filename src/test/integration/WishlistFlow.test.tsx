import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { act } from 'react'
import WishlistButton from '../../components/WishlistButton/WishlistButton'
import { useWishlist } from '../../hooks/useWishlist'
import type { Movie } from '@types'

// Mock the store to avoid persistence
vi.mock('../../stores/wishlistStore', () => ({
    wishlistStore: {
        getState: () => ({ items: [] }),
        setState: vi.fn(),
        subscribe: vi.fn(() => () => { }),
        destroy: vi.fn(),
    }
}))

const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    overview: 'Test overview'
}

const mockMovie2: Movie = {
    id: 2,
    title: 'Test Movie 2',
    poster_path: '/test2.jpg',
    overview: 'Test overview 2'
}

// Component to track renders
const RenderTracker = ({ onRender, children }: { onRender: () => void, children: React.ReactNode }) => {
    onRender()
    return <>{children}</>
}

// Test component that uses the real hook
const TestWishlistFlow = ({
    movie,
    onButtonRender,
    onHookRender
}: {
    movie: Movie
    onButtonRender: () => void
    onHookRender: () => void
}) => {
    const wishlistHook = useWishlist()

    return (
        <BrowserRouter>
            <RenderTracker onRender={onHookRender}>
                <div data-testid="hook-consumer">
                    <p>Items in wishlist: {wishlistHook.wishlist.length}</p>
                    <p>Is in wishlist: {wishlistHook.isInWishlist(movie.id) ? 'Yes' : 'No'}</p>
                </div>
            </RenderTracker>
            <RenderTracker onRender={onButtonRender}>
                <WishlistButton
                    movie={movie}
                    fontFamily="Arial"
                    color="blue"
                />
            </RenderTracker>
        </BrowserRouter>
    )
}

describe('Wishlist Flow Integration Tests', () => {
    let buttonRenderCount = 0
    let hookRenderCount = 0

    const trackButtonRender = () => {
        buttonRenderCount++
    }

    const trackHookRender = () => {
        hookRenderCount++
    }

    beforeEach(() => {
        buttonRenderCount = 0
        hookRenderCount = 0
        // Clear the wishlist store before each test
        const store = useWishlist.getState()
        store.clearWishlist()
    })

    it('should minimize re-renders when adding and removing items', async () => {
        const user = userEvent.setup()

        render(
            <TestWishlistFlow
                movie={mockMovie}
                onButtonRender={trackButtonRender}
                onHookRender={trackHookRender}
            />
        )

        // Initial render
        expect(buttonRenderCount).toBe(1)
        expect(hookRenderCount).toBe(1)
        expect(screen.getByText('Add to Wishlist')).toBeInTheDocument()
        expect(screen.getByText('Items in wishlist: 0')).toBeInTheDocument()
        expect(screen.getByText('Is in wishlist: No')).toBeInTheDocument()

        // Reset counters after initial render
        buttonRenderCount = 0
        hookRenderCount = 0

        // Add to wishlist
        const addButton = screen.getByText('Add to Wishlist')
        await act(async () => {
            await user.click(addButton)
        })

        await waitFor(() => {
            expect(screen.getByText('Remove from Wishlist')).toBeInTheDocument()
        })

        expect(screen.getByText('Items in wishlist: 1')).toBeInTheDocument()
        expect(screen.getByText('Is in wishlist: Yes')).toBeInTheDocument()

        // Check that we didn't have excessive re-renders (should be 1 for state change)
        expect(buttonRenderCount).toBeLessThanOrEqual(2) // Allow some flexibility
        expect(hookRenderCount).toBeLessThanOrEqual(2)

        // Reset counters
        buttonRenderCount = 0
        hookRenderCount = 0

        // Remove from wishlist
        const removeButton = screen.getByText('Remove from Wishlist')
        await act(async () => {
            await user.click(removeButton)
        })

        await waitFor(() => {
            expect(screen.getByText('Add to Wishlist')).toBeInTheDocument()
        })

        expect(screen.getByText('Items in wishlist: 0')).toBeInTheDocument()
        expect(screen.getByText('Is in wishlist: No')).toBeInTheDocument()

        // Check for efficient re-renders
        expect(buttonRenderCount).toBeLessThanOrEqual(2)
        expect(hookRenderCount).toBeLessThanOrEqual(2)
    })

    it('should handle multiple rapid clicks without excessive re-renders', async () => {
        const user = userEvent.setup()

        render(
            <TestWishlistFlow
                movie={mockMovie}
                onButtonRender={trackButtonRender}
                onHookRender={trackHookRender}
            />
        )

        // Reset after initial render
        buttonRenderCount = 0
        hookRenderCount = 0

        const button = screen.getByRole('button')

        // Perform rapid clicks
        await act(async () => {
            await user.click(button) // Add
            await user.click(button) // Remove
            await user.click(button) // Add
            await user.click(button) // Remove
        })

        await waitFor(() => {
            expect(screen.getByText('Add to Wishlist')).toBeInTheDocument()
        })

        // Should end up with empty wishlist
        expect(screen.getByText('Items in wishlist: 0')).toBeInTheDocument()
        expect(screen.getByText('Is in wishlist: No')).toBeInTheDocument()

        // Check that re-renders are reasonable (should be 4 state changes + some buffer)
        expect(buttonRenderCount).toBeLessThanOrEqual(8) // Allow reasonable buffer
        expect(hookRenderCount).toBeLessThanOrEqual(8)
    })

    it('should not cause re-renders when interacting with different movies', async () => {
        const user = userEvent.setup()

        const MultiMovieComponent = () => {
            return (
                <BrowserRouter>
                    <div>
                        <div data-testid="movie1-section">
                            <RenderTracker onRender={() => buttonRenderCount++}>
                                <WishlistButton
                                    movie={mockMovie}
                                    fontFamily="Arial"
                                    color="blue"
                                />
                            </RenderTracker>
                        </div>
                        <div data-testid="movie2-section">
                            <RenderTracker onRender={() => hookRenderCount++}>
                                <WishlistButton
                                    movie={mockMovie2}
                                    fontFamily="Arial"
                                    color="red"
                                />
                            </RenderTracker>
                        </div>
                    </div>
                </BrowserRouter>
            )
        }

        render(<MultiMovieComponent />)

        // Reset after initial render
        buttonRenderCount = 0
        hookRenderCount = 0

        // Click on first movie button
        const movie1Button = screen.getAllByRole('button')[0]
        await act(async () => {
            await user.click(movie1Button)
        })

        await waitFor(() => {
            expect(movie1Button).toHaveTextContent('Remove from Wishlist')
        })

        // Both components should re-render due to shared state, but minimally
        expect(buttonRenderCount).toBeLessThanOrEqual(2)
        expect(hookRenderCount).toBeLessThanOrEqual(2)

        // Reset counters
        buttonRenderCount = 0
        hookRenderCount = 0

        // Click on second movie button
        const movie2Button = screen.getAllByRole('button')[1]
        await act(async () => {
            await user.click(movie2Button)
        })

        await waitFor(() => {
            expect(movie2Button).toHaveTextContent('Remove from Wishlist')
        })

        // Again, both should re-render but minimally
        expect(buttonRenderCount).toBeLessThanOrEqual(2)
        expect(hookRenderCount).toBeLessThanOrEqual(2)
    })

    it('should maintain consistent state across multiple components', async () => {
        const user = userEvent.setup()

        const ConsistencyTestComponent = () => {
            const wishlist1 = useWishlist()
            const wishlist2 = useWishlist()

            return (
                <BrowserRouter>
                    <div>
                        <div data-testid="instance1">
                            <p>Instance 1 - Items: {wishlist1.wishlist.length}</p>
                            <WishlistButton movie={mockMovie} fontFamily="Arial" color="blue" />
                        </div>
                        <div data-testid="instance2">
                            <p>Instance 2 - Items: {wishlist2.wishlist.length}</p>
                            <button onClick={() => wishlist2.addToWishlist(mockMovie2)}>
                                Add Movie 2
                            </button>
                        </div>
                    </div>
                </BrowserRouter>
            )
        }

        render(<ConsistencyTestComponent />)

        // Both instances should show 0 items initially
        expect(screen.getByText('Instance 1 - Items: 0')).toBeInTheDocument()
        expect(screen.getByText('Instance 2 - Items: 0')).toBeInTheDocument()

        // Add movie via instance 1
        const wishlistButton = screen.getByText('Add to Wishlist')
        await act(async () => {
            await user.click(wishlistButton)
        })

        await waitFor(() => {
            expect(screen.getByText('Instance 1 - Items: 1')).toBeInTheDocument()
            expect(screen.getByText('Instance 2 - Items: 1')).toBeInTheDocument()
        })

        // Add movie via instance 2
        const addMovie2Button = screen.getByText('Add Movie 2')
        await act(async () => {
            await user.click(addMovie2Button)
        })

        await waitFor(() => {
            expect(screen.getByText('Instance 1 - Items: 2')).toBeInTheDocument()
            expect(screen.getByText('Instance 2 - Items: 2')).toBeInTheDocument()
        })

        // Remove movie via instance 1
        const removeButton = screen.getByText('Remove from Wishlist')
        await act(async () => {
            await user.click(removeButton)
        })

        await waitFor(() => {
            expect(screen.getByText('Instance 1 - Items: 1')).toBeInTheDocument()
            expect(screen.getByText('Instance 2 - Items: 1')).toBeInTheDocument()
        })
    })

    it('should handle edge cases without unnecessary re-renders', async () => {
        const user = userEvent.setup()

        render(
            <TestWishlistFlow
                movie={mockMovie}
                onButtonRender={trackButtonRender}
                onHookRender={trackHookRender}
            />
        )

        // Reset after initial render
        buttonRenderCount = 0
        hookRenderCount = 0

        const button = screen.getByRole('button')

        // Try to add the same movie multiple times
        await act(async () => {
            await user.click(button) // Add first time
        })

        await waitFor(() => {
            expect(screen.getByText('Remove from Wishlist')).toBeInTheDocument()
        })

        // Reset counters after first add
        buttonRenderCount = 0
        hookRenderCount = 0

        // Try to add again (should be remove now)
        await act(async () => {
            await user.click(button) // Remove
        })

        await waitFor(() => {
            expect(screen.getByText('Add to Wishlist')).toBeInTheDocument()
        })

        // Try to add the same movie again
        await act(async () => {
            await user.click(button) // Add again
        })

        await waitFor(() => {
            expect(screen.getByText('Remove from Wishlist')).toBeInTheDocument()
        })

        // Final state should be consistent
        expect(screen.getByText('Items in wishlist: 1')).toBeInTheDocument()
        expect(screen.getByText('Is in wishlist: Yes')).toBeInTheDocument()

        // Re-renders should be reasonable
        expect(buttonRenderCount).toBeLessThanOrEqual(4) // 2 state changes
        expect(hookRenderCount).toBeLessThanOrEqual(4)
    })
})
