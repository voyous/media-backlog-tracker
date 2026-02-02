export const searchItunes = async (query) => {
    try {
        // limit=5, entity=album (covers usually better on albums)
        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=album&limit=20`
        );
        const data = await response.json();

        return data.results.map(item => ({
            id: item.collectionId,
            title: item.collectionName,
            artist: item.artistName,
            year: (item.releaseDate || '').split('-')[0],
            coverUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null, // High res hack
            apiId: item.collectionId,
            source: 'itunes',
            genre: item.primaryGenreName
        }));
    } catch (error) {
        console.error('iTunes Search Error:', error);
        return [];
    }
};
