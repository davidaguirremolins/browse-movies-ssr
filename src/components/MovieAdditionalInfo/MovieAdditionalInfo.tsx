import React from 'react';
import type { Genre, MovieDetailsType } from '@types';
import './MovieAdditionalInfo.scss';

const MovieAdditionalInfo: React.FC<{ year: string; runtime: string; revenue: string; movie: MovieDetailsType }> = ({ movie, year, runtime, revenue }) => {

    return (<div className='movie-detail-additional'>
        {movie.tagline && (
            <p className="movie-detail-tagline">"{movie.tagline}"</p>
        )}
        <div className="movie-detail-meta">
            <span className="movie-detail-additional-item">Released in {year}</span>
            <span className="movie-detail-separator"> • </span>
            <span className="movie-detail-additional-item">{runtime}</span>
            <span className="movie-detail-separator"> • </span>
            <span className="movie-detail-additional-item">{revenue} revenue</span>
        </div>

        {movie.genres && movie.genres.length > 0 && (
            <div className="movie-detail-genres">
                {movie.genres.map((genre: Genre) => (
                    <span key={genre.id} className="movie-detail-genre">
                        {genre.name}
                    </span>
                ))}
            </div>
        )}
    </div>);
}

// 🟡 OPCIONAL: React.memo si se re-renderiza frecuentemente
export default React.memo(MovieAdditionalInfo);