export const searchGoogleBooks = async (query) => {
    try {
        console.log(`Searching Google Books for: ${query}`);
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
        const data = await response.json();
        console.log('Google Books raw response:', data);

        if (!data.items) {
            console.warn('Google Books: No items found');
            return [];
        }

        return data.items.map(item => {
            const info = item.volumeInfo;

            // Attempt to get a better image (secure https)
            let cover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null;
            if (cover) {
                cover = cover.replace('http://', 'https://');
            }

            return {
                id: item.id,
                apiId: item.id,
                title: info.title,
                author: info.authors ? info.authors[0] : 'Unknown Author',
                year: info.publishedDate ? info.publishedDate.split('-')[0] : '',
                coverUrl: cover,
                description: info.description,
                source: 'google_books',
                category: 'book'
            };
        });
    } catch (error) {
        console.error('Google Books Search Error:', error);
        return [];
    }
};
