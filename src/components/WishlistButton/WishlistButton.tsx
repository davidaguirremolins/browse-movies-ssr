import React from 'react';
import { useWishlist } from '@hooks/useWishlist';
import type { Movie } from '@types';
import './WishlistButton.scss';

const WishlistButton: React.FC<{ movie: Movie, fontFamily: string, color: string }> = ({ movie, fontFamily, color }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const handleWishlistToggle = () => {
        if (isInWishlist(movie.id)) {
            removeFromWishlist(movie.id);
        } else {
            addToWishlist(movie);
        }
    };

    return (
        <button
            className="movie-detail-wishlist-button"
            onClick={handleWishlistToggle}
            style={{ fontFamily, color }}
        >
            {isInWishlist(movie.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
    );
};

export default WishlistButton;