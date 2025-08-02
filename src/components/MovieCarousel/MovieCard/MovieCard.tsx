import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '@types';
import './MovieCard.scss';
import { IMAGE_BASE_URL } from '@services/movieService';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card">
            <div className="movie-card-image-container">
                <img src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`} alt={movie.title} className="movie-card-image" loading="lazy" />
            </div>
            <div className="movie-card-content">
                <h3 className="movie-card-title" title={movie.title}>
                    {movie.title}
                </h3>
                {movie.overview && (
                    <p className="movie-card-overview" title={movie.title}>
                        {movie.overview}
                    </p>
                )}
            </div>
        </Link>
    );
};

// ✅ BENEFICIA: Re-renderiza solo si movie cambia
export default React.memo(MovieCard);
