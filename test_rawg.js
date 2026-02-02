
import fs from 'fs';
import path from 'path';

// Manual .env parser
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';

try {
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        const lines = envConfig.split('\n');
        for (const line of lines) {
            const match = line.match(/^VITE_RAWG_API_KEY=(.*)$/);
            if (match) {
                apiKey = match[1].trim();
                break;
            }
        }
    }
} catch (e) {
    console.error("Error reading .env:", e);
}

const query = "The Witcher 3";

if (!apiKey) {
    console.error("Error: VITE_RAWG_API_KEY is missing or could not be read from .env file");
    process.exit(1);
}

const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(query)}&page_size=5`;

console.log(`Fetching results for '${query}'...`);

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            console.log(`Found ${data.count} results.`);
            const game = data.results[0];
            console.log("Title:", game.name);
            console.log("Released:", game.released);
            console.log("Rating:", game.rating);
            console.log("Metacritic:", game.metacritic);
            console.log("Image:", game.background_image);
            console.log("Genres:", game.genres ? game.genres.map(g => g.name).join(', ') : 'None');
        } else {
            console.log("No results found.");
            if (data.detail) console.error("API Error:", data.detail);
        }
    })
    .catch(err => console.error("Error:", err));
