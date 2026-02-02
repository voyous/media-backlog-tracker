export const searchOpenLibrary = async (query) => {
    try {
        // Explicitly request fields to ensure we get subjects/pages/ratings
        const fields = "title,author_name,first_publish_year,cover_i,subject,number_of_pages_median,ratings_average,key";
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=${fields}`);
        const data = await response.json();

        if (!data.docs) return [];

        return data.docs.map(item => {
            const hasCover = item.cover_i;
            const coverUrl = hasCover
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
                : null;

            // Better Genre Mapping
            let genre = '';
            if (item.subject && item.subject.length > 0) {
                // simple mapping for common variations
                const subjects = item.subject.map(s => s.toLowerCase());

                if (subjects.some(s => s.includes('science fiction') || s.includes('sci-fi'))) genre = 'Sci-Fi';
                else if (subjects.some(s => s.includes('fantasy'))) genre = 'Fantasy';
                else if (subjects.some(s => s.includes('thriller'))) genre = 'Thriller';
                else if (subjects.some(s => s.includes('horror'))) genre = 'Horror';
                else if (subjects.some(s => s.includes('mystery'))) genre = 'Mystery';
                else if (subjects.some(s => s.includes('romance'))) genre = 'Romance';
                else if (subjects.some(s => s.includes('biography'))) genre = 'Biography';
                else if (subjects.some(s => s.includes('history'))) genre = 'History';
                else if (subjects.some(s => s.includes('graphic novel') || s.includes('comic'))) genre = 'Graphic Novel';
                else {
                    // Fallback: take the first subject that isn't too long/weird, or just the first few
                    genre = item.subject.slice(0, 2).join(', ');
                }
            }

            return {
                id: item.key,
                apiId: item.key,
                title: item.title,
                author: item.author_name ? item.author_name[0] : 'Unknown Author',
                year: item.first_publish_year ? String(item.first_publish_year) : '',
                coverUrl: coverUrl,
                pages: item.number_of_pages_median || 0,
                genre: genre,
                tmdbRating: item.ratings_average ? parseFloat(item.ratings_average.toFixed(1)) : 0,
                source: 'open_library',
                category: 'book'
            };
        }).filter(item => item.coverUrl); // prioritize items with covers? or maybe just take top 5
    } catch (error) {
        console.error('Open Library Search Error:', error);
        return [];
    }
};
