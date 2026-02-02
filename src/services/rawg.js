
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const searchGames = async (query) => {
    if (!API_KEY) {
        console.error('RAWG API Key is missing!');
        return [];
    }

    try {
        const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=20`);
        const data = await response.json();

        if (!data.results) return [];

        return data.results.map(item => {
            // Map Genres (taking first 2)
            const genre = item.genres && item.genres.length > 0
                ? item.genres.slice(0, 2).map(g => g.name).join(', ')
                : '';

            return {
                id: String(item.id),
                apiId: String(item.id),
                title: item.name,
                year: item.released ? item.released.split('-')[0] : '',
                coverUrl: item.background_image,
                genre: genre,
                tmdbRating: item.rating || 0, // RAWG is 1-5 scale
                excitement: 0, // Filled manually by user during add
                status: 'backlog', // Default
                category: 'game',
                source: 'rawg'
            };
        });
    } catch (error) {
        console.error('Error searching RAWG:', error);
        return [];
    }
};
