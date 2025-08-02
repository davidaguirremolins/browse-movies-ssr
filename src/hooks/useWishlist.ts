import { create } from 'zustand';
import type { Movie, WishlistItem } from '@types'; // Adjust the import path as necessary

interface WishlistState {
    wishlist: WishlistItem[]
    addToWishlist: (movie: Movie) => void
    removeFromWishlist: (id: number) => void
    isInWishlist: (id: number) => boolean
    clearWishlist: () => void
}

export const useWishlist = create<WishlistState>((set, get) => ({
    wishlist: [],
    addToWishlist: (movie: Movie) => set((state) => ({
        wishlist: [...state.wishlist, { movie, addedAt: new Date() }] as WishlistItem[]
    })),
    removeFromWishlist: (id: number) => set((state) => ({
        wishlist: state.wishlist.filter((item: WishlistItem) => item.movie.id !== id)
    })),
    isInWishlist: (id: number) => get().wishlist.some((item: WishlistItem) => item.movie.id === id),
    clearWishlist: () => set({ wishlist: [] })
}))
