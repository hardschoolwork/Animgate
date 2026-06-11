export interface Genre {
  id?: number;
  name: string;
  slug?: string;
}

export interface AnimCard {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  status: string;
  release_year: number | null;
  episodes_count: number;
  rating: number;
}

export interface AnimSlide {
  id: number;
  title: string;
  slug: string;
  banner_image: string;
  synopsis: string;
  genres: Genre[];
}

export interface HomeFeed {
  hero: { slides: AnimSlide[]; cards: AnimCard[] };
  movies: { slides: AnimSlide[]; cards: AnimCard[] };
  new_releases: { slides: AnimSlide[]; cards: AnimCard[] };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  title: string;
  description: string;
  thumbnail: string;
  episode_video: string;
  duration_minutes: number;
  release_date: string;
  anim_slug: string;
}

export interface AnimDetail {
  id: number;
  title: string;
  title_japanese: string;
  slug: string;
  synopsis: string;
  cover_image: string;
  banner_image: string;
  trailer_url: string;
  type: string;
  status: string;
  age_rating: string;
  genres: Genre[];
  categories: Category[];
  studio: string;
  release_year: number;
  episodes_count: number;
  rating: number;
}
