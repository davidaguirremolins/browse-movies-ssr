
export type MovieCategory = {
    id: string;
    name: string;
    genreId: number;
    theme: {
        color: string;
        font: string;
    };
};

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

export interface MovieDetailsType extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string;
}
export interface WishlistItem {
  movie: Movie;
  addedAt: Date;
}
