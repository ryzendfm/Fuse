import { BASE_URL, TMDB_KEY, DEMO_KEY } from '../constants';
import { FetchResponse, ContentItem, ContentDetails, CastMember, Episode } from '../types';

const getHeaders = () => ({
    Authorization: `Bearer ${TMDB_KEY}`,
    accept: 'application/json'
});

async function fetchWithFallback<T>(url: string): Promise<T> {
    try {
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Auth Failed');
        return await res.json();
    } catch (err) {
        // Fallback to API Key query param
        const separator = url.includes('?') ? '&' : '?';
        const backupUrl = `${url}${separator}api_key=${DEMO_KEY}`;
        const res = await fetch(backupUrl);
        if (!res.ok) throw new Error('Backup Failed');
        return await res.json();
    }
}

export const fetchDiscover = async (
    type: 'movie' | 'tv', 
    page: number = 1, 
    genreId?: number
): Promise<FetchResponse<ContentItem>> => {
    let url = `${BASE_URL}/discover/${type}?include_adult=false&language=en-US&sort_by=popularity.desc&page=${page}`;
    if (genreId) {
        url += `&with_genres=${genreId}`;
    }
    return fetchWithFallback(url);
};

export const fetchSearch = async (
    type: 'movie' | 'tv',
    query: string,
    page: number = 1
): Promise<FetchResponse<ContentItem>> => {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search/${type}?query=${encodedQuery}&include_adult=false&page=${page}`;
    return fetchWithFallback(url);
};

export const fetchDetails = async (type: 'movie' | 'tv', id: number): Promise<ContentDetails> => {
    const url = `${BASE_URL}/${type}/${id}`;
    return fetchWithFallback(url);
};

export const fetchCredits = async (type: 'movie' | 'tv', id: number): Promise<{ cast: CastMember[] }> => {
    const url = `${BASE_URL}/${type}/${id}/credits`;
    return fetchWithFallback(url);
};

export const fetchSeason = async (tvId: number, seasonNum: number): Promise<{ episodes: Episode[] }> => {
    const url = `${BASE_URL}/tv/${tvId}/season/${seasonNum}`;
    return fetchWithFallback(url);
};
