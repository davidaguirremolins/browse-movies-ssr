import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import MovieDetails from '../pages/MovieDetails';
import Wishlist from '../pages/Wishlist';
import '../index.scss';

export const Router: React.FC = () => {
    return (
        <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
    );
};
export default Router;