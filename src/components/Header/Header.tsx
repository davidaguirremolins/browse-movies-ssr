import React from "react";
import { Link, useLocation } from "react-router-dom";
import './Header.scss';
import { useWishlist } from "@hooks";

const Header: React.FC = () => {
    const location = useLocation();
    const wishlistItems = useWishlist().wishlist;

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <Link to="/" className="header-title">
                        <span>Browse Films SSR</span>
                    </Link>
                    <nav className="header-nav">
                        <Link
                            to="/"
                            className={`header-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/wishlist"
                            className={`header-nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
                        >
                            <span>Wishlist</span>
                            {wishlistItems.length > 0 && (
                                <span className="header-wishlist-count">{wishlistItems.length}</span>
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;