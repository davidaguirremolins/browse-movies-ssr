import React from 'react';
import './Home.scss';
import CategorySection from '../components/CategorySection/CategorySection';
import { MOVIE_CATEGORIES } from '@constants';

const Home: React.FC = () => {

    return (
        <section className='home'>
            {MOVIE_CATEGORIES.map(movieCategory => (
                <CategorySection
                    key={movieCategory.id}
                    movieCategory={movieCategory}
                />
            ))}
        </section>
    );
}
export default Home;
