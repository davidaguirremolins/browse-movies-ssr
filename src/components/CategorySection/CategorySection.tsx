import React from 'react';
import SectionTitle from '../UI/SectionTitle/SectionTitle';
import MovieCarousel from '../MovieCarousel/MovieCarousel';
import { useMovies } from '@hooks/useMovies';
import type { MovieCategory } from '@types';
import './CategorySection.scss';

interface CategorySectionProps {
    movieCategory: MovieCategory;
}

const CategorySection: React.FC<CategorySectionProps> = ({ movieCategory }) => {
    const { movies, loading, error } = useMovies(movieCategory);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error loading movies</div>;
    }
    if (!movies || movies.length === 0) {
        return <div>No movies available in this category</div>;
    }

    return (
        <div className="home-category-section">
            <SectionTitle
                theme={movieCategory.theme}
                title={movieCategory.name}
            />
            <MovieCarousel
                movies={movies}
            />
        </div>
    );
};

export default CategorySection;
