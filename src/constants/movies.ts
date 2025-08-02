import type { MovieCategory } from "@types";

export const MOVIE_CATEGORIES: MovieCategory[] = [
    {
        id: 'western',
        name: 'Western',
        genreId: 37,
        theme: {
            color: '#ffaa17ff',
            font: 'var(--font-western)',
        }
    },
    {
        id: 'documentary',
        name: 'Documentary',
        genreId: 99,
        theme: {
            color: '#105615ff',
            font: 'var(--font-documentary)',
        }
    },
    {
        id: 'science_fiction',
        name: 'Science Fiction',
        genreId: 878,
        theme: {
            color: '#0984e3',
            font: 'var(--font-science-fiction)',
        }
    }
];