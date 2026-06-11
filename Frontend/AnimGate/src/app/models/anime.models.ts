export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface AnimeCard {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  type?: string;
  status: string;
  release_year: number | null;
  episodes_count: number;
  rating: string;

  is_featured?: boolean;
  is_trending?: boolean;
  is_new_release?: boolean;
}

export interface AnimeSlide {
  id: number;
  title: string;
  slug: string;
  banner_image: string | null;
  synopsis: string;
  genres: Genre[];
  age_rating: string;
}

export interface HomeSection {
  slides: AnimeSlide[];
  cards: AnimeCard[];
}

export interface HomeFeed {
  hero: HomeSection;
  movies: HomeSection;
  new_releases: HomeSection;
}

export interface AnimeDetail {
  id: number;
  title: string;
  title_japanese: string;
  slug: string;
  synopsis: string;
  cover_image: string | null;
  banner_image: string | null;
  trailer_url: string;
  type: string;
  status: string;
  age_rating: string;
  genres: string[];
  categories: string[];
  studio: string;
  release_year: number | null;
  episodes_count: number;
  rating: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  title: string;
  thumbnail?: string | null;
  duration_minutes?: number;
  release_date?: string;
  is_filler?: boolean;
}

export interface EpisodeDetail {
  id: number;
  anim_title: string;
  anim_slug: string;
  anim_cover: string;
  episode_number: number;
  title: string;
  description: string;
  thumbnail: string | null;
  episode_video: string | null;
  duration_minutes: number;
  release_date: string | null;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Favorite {
  id: number;
  anim_detail: AnimeCard;
  added_at: string;
}

export interface Suggestion {
  id: number;
  suggested_anim: string;
  message: string;
  state: 'pending' | 'accepted' | 'rejected';
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AdminStats {
  total_animes: number;
  total_users: number;
  total_episodes: number;
  pending_suggestions: number;
}

export interface AnimeDetailAdmin {
  id: number;
  title: string;
  title_japanese: string;
  studio: string;
  type: string;
  status: string;
  age_rating: string;
  episode_duration: number;
  release_year: number | null;
  synopsis: string;
  cover_image: string | null;
  banner_image: string | null;
  trailer_url: string;
  is_featured: boolean;
  is_trending: boolean;
}

export interface WatchHistory {
  id: number;
  episode: number;
  episode_detail: EpisodeDetail;
  anime_title: string;
  anime_slug: string;
  anime_cover: string | null;
  progress_percentage: number;
  last_watched: string;
  is_completed: boolean;
}

export interface WatchlistItem {
  id: number;
  anime: number;
  anime_detail: AnimeCard;
  added_at: string;
}
