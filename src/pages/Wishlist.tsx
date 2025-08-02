import React, { useMemo } from 'react';
import { useWishlist } from '@hooks/useWishlist';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import Button from '../components/UI/Button/Button';
import './Wishlist.scss';

const Wishlist: React.FC = () => {
    const wishlistItems = useWishlist((state) => state.wishlist);
    const clearWishlist = useWishlist((state) => state.clearWishlist);

    const allMovies = useMemo(() =>
        wishlistItems.map(item => item.movie),
        [wishlistItems]
    );

    if (wishlistItems.length === 0) {
        return (
            <div className="wishlist wishlist-empty">
                <div className="container">
                    <div className="wishlist-empty-content">
                        <h1 className="wishlist-empty-title">Your Wishlist is Empty</h1>
                        <p className="wishlist-empty-subtitle">
                            Start exploring movies and add your favorites to your wishlist!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist">
            <div className="container">
                <div className="wishlist-header">
                    <h1 className="wishlist-title">
                        My Wishlist
                        <span className="wishlist-count">({wishlistItems.length})</span>
                    </h1>
                    <Button
                        text="Clear All"
                        onClick={clearWishlist}
                    />
                </div>
                <MovieCarousel
                    movies={allMovies}
                />
            </div>
        </div>
    );
};

export default Wishlist;
