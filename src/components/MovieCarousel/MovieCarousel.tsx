import React, { useState, useRef, useCallback } from 'react';
import type { Movie } from '@types';
import './MovieCarousel.scss';
import IconButton from '../UI/IconButton/IconButton';
import MovieCard from './MovieCard/MovieCard';

const MovieCarousel: React.FC<{
    movies: Movie[];
}> = ({ movies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const totalMovies = movies?.length || 0;

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        if (scrollContainerRef.current) {
            const scrollAmount = index * (scrollContainerRef.current.offsetWidth);
            scrollContainerRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    const goToNext = useCallback(() => {
        const newIndex = currentIndex < totalMovies - 1 ? currentIndex + 1 : 0;
        goToSlide(newIndex);
    }, [currentIndex, totalMovies, goToSlide]);

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : totalMovies - 1;
        goToSlide(newIndex);
    }, [currentIndex, totalMovies, goToSlide]);

    return (
        <section className="movie-carousel">
            <div className="movie-carousel-wrapper">
                <IconButton
                    onClick={goToPrevious}
                    ariaLabel="Previous movies"
                    text="‹"
                />

                <div className="movie-carousel-container" ref={scrollContainerRef}>
                    <div className="movie-carousel-scroll-container">
                        {movies?.map((movie) => (
                            <div key={movie.id} className="movie-carousel-item">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                </div>
                <IconButton
                    onClick={goToNext}
                    ariaLabel="Next movies"
                    text="›"
                />
            </div>
        </section>
    );
};

export default MovieCarousel;
