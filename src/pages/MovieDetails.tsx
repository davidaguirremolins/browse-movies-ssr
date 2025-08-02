import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovieDetails } from '@hooks/useMovieDetails';
import './MovieDetails.scss';
import Loading from '../components/UI/Loading/Loading';
import WishlistButton from '../components/WishlistButton/WishlistButton';
import { IMAGE_BASE_URL } from '@services/movieService';
import { MOVIE_CATEGORIES } from '@constants';
import type { MovieCategory, MovieDetailsType } from '@types';
import MovieAdditionalInfo from '../components/MovieAdditionalInfo/MovieAdditionalInfo';

const findCategoryByGenre = (movieData: MovieDetailsType): MovieCategory | null => {
    if (!movieData?.genres || movieData.genres.length === 0) {
        return null;
    }

    return MOVIE_CATEGORIES.find((category: MovieCategory) =>
        movieData.genres!.some((genre) => genre.id === category.genreId)
    ) || null;
};

const MovieDetails: React.FC = () => {
    const { id: movieId } = useParams<{ id: string }>();
    const { movie, loading, error } = useMovieDetails(movieId || null);


    if (loading) {
        return <Loading />;
    }

    if (error || !movie) {
        return <p>Movie not found</p>;
    }

    const categoryConfig = findCategoryByGenre(movie);

    if (!categoryConfig) {
        return <p>Category not included</p>;
    }

    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : '';
    const backdropUrl = movie.backdrop_path ? `${IMAGE_BASE_URL}/w500${movie.backdrop_path}` : '';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'TBA';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown';
    const formattedRevenue = movie.revenue
        ? `$${movie.revenue.toLocaleString('en-US')}`
        : 'Revenue unknown';

    return (
        <div className="movie-detail">
            <div className="movie-detail-backdrop">
                <img
                    src={backdropUrl}
                    alt={movie.title}
                    className="movie-detail-backdrop-image"
                />
                <div className="movie-detail-backdrop-overlay"></div>
            </div>
            <div className="movie-detail-container">
                <div className="movie-detail-content">
                    <div className="movie-detail-main">
                        <div className="movie-detail-poster-container">
                            <img
                                src={posterUrl}
                                alt={movie.title}
                                className="movie-detail-poster"
                            />
                        </div>
                        <div className="movie-detail-info">
                            <h1
                                className="movie-detail-title"
                                style={{ fontFamily: categoryConfig?.theme.font, color: categoryConfig?.theme.color }}
                            >
                                {movie.title}
                            </h1>
                            <p className="movie-detail-overview">
                                {movie.overview || 'No description available.'}
                            </p>
                            <WishlistButton movie={movie} fontFamily={categoryConfig.theme.font} color={categoryConfig.theme.color} />
                        </div>
                    </div>
                    <MovieAdditionalInfo movie={movie} year={year} runtime={runtime} revenue={formattedRevenue} />
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
