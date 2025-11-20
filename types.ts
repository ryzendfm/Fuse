export interface ContentItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: string;
}

export interface ContentDetails extends ContentItem {
    genres: { id: number; name: string }[];
    number_of_episodes?: number;
    number_of_seasons?: number;
    seasons?: SeasonInfo[];
    runtime?: number;
}

export interface SeasonInfo {
    season_number: number;
    name: string;
    episode_count: number;
}

export interface CastMember {
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
}

export interface Episode {
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    still_path: string | null;
    runtime: number;
}

export interface FetchResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export type MediaType = 'movie' | 'tv';

export interface Genre {
    id: number;
    name: string;
}
