
import { fetchMovieDetails } from './src/services/tmdb.js';
import dotenv from 'dotenv';
dotenv.config();

// Test with a known movie ID (e.g., Ran - ID 11645)
const TEST_ID = 11645;

console.log(`Fetching details for Movie ID: ${TEST_ID}...`);

fetchMovieDetails(TEST_ID).then(details => {
    console.log("Result:", details);
}).catch(err => {
    console.error("Error:", err);
});
