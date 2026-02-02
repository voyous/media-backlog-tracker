
const query = "Dune";
const fields = "title,author_name,first_publish_year,cover_i,subject,number_of_pages_median,ratings_average,key";
const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1&fields=${fields}`;

console.log(`Fetching ${url}...`);

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.docs && data.docs.length > 0) {
            const item = data.docs[0];
            console.log("Title:", item.title);
            console.log("Subjects (first 5):", item.subject ? item.subject.slice(0, 5) : 'undefined');

            const genre = item.subject ? item.subject.slice(0, 3).join(', ') : 'NO SUBJECTS FOUND';
            console.log("Mapped Genre String:", genre);
        } else {
            console.log("No results found.");
        }
    })
    .catch(err => console.error("Error:", err));
