
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Basic Genre Map
const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Musical', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action', // TV Action & Adventure
    10762: 'Kids', // TV Kids
    10763: 'News', // TV News
    10764: 'Reality', // TV Reality
    10765: 'Sci-Fi', // TV Sci-Fi & Fantasy
    10766: 'Soap', // TV Soap
    10767: 'Talk', // TV Talk
    10768: 'War', // TV War & Politics
};

export const searchTmdb = async (query, type = 'movie') => {
    if (!API_KEY) {
        console.warn('TMDB API Key missing');
        return [];
    }

    // type is 'movie' or 'tv'
    try {
        const response = await fetch(
            `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        const results = data.results.slice(0, 20);

        // Fetch detailed info (Director for movies) - Limit to top 5 to avoid rate limits
        const detailedResults = await Promise.all(results.map(async (item, index) => {
            let director = null;
            if (type === 'movie' && index < 5) {
                try {
                    const creditsRes = await fetch(`${BASE_URL}/movie/${item.id}/credits?api_key=${API_KEY}`);
                    const creditsData = await creditsRes.json();
                    const directorObj = creditsData.crew?.find(c => c.job === 'Director');
                    director = directorObj ? directorObj.name : null;
                } catch (e) {
                    // Ignore detail fetch errors
                }
            }

            return {
                id: item.id,
                title: item.title || item.name,
                year: (item.release_date || item.first_air_date || '').split('-')[0],
                overview: item.overview,
                posterPath: item.poster_path,
                coverUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
                apiId: item.id,
                rating: item.vote_average,
                tmdbRating: item.vote_average, // Ensure consistency
                source: 'tmdb',
                genre: item.genre_ids && item.genre_ids.length > 0 ? GENRE_MAP[item.genre_ids[0]] : null,
                director: director
            };
        }));

        return detailedResults;
    } catch (error) {
        console.error('TMDB Search Error:', error);
        return [];
    }
};

export const fetchMovieDetails = async (id) => {
    if (!API_KEY) return null;
    try {
        const creditsRes = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
        const creditsData = await creditsRes.json();
        const directorObj = creditsData.crew?.find(c => c.job === 'Director');
        return {
            director: directorObj ? directorObj.name : null
        };
    } catch (e) {
        console.error("Error fetching details", e);
        return null;
    }
};
