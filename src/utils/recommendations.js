export const getWeightedRandomItem = (items, category) => {
    if (!items || items.length === 0) return null;

    // Filter items that are 'backlog' AND match the requested category
    const candidates = items.filter(item => item.status === 'backlog' && item.category === category);

    if (candidates.length === 0) return null;

    // If "Others" (book, music, etc) or no specific logic, return pure random
    if (!['game', 'movie'].includes(category)) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    // Weighted Logic
    let weightedCandidates = [];

    if (category === 'game') {
        // Validation: Hype factor (excitement) and Date Added
        const now = new Date();
        weightedCandidates = candidates.map(item => {
            const excitement = parseInt(item.excitement) || 5; // Default to middle if not set
            const dateAdded = new Date(item.addedAt);
            const daysInBacklog = Math.max(0, (now - dateAdded) / (1000 * 60 * 60 * 24));

            // Weight Formula: Excitement * (1 + Age Bonus)
            // Age Bonus: +10% weight for every 30 days in backlog, capped at 2x multiplier
            const ageBonus = Math.min(1, daysInBacklog / 365); // 1 year = max age bonus

            const weight = excitement * (1 + ageBonus);
            return { item, weight };
        });
    } else if (category === 'movie') {
        // Weighted by Rating + Date Added (similar age bonus)
        const now = new Date();
        weightedCandidates = candidates.map(item => {
            const rating = parseFloat(item.letterboxdRating) || 5; // Default to middle
            const dateAdded = new Date(item.addedAt);
            const daysInBacklog = Math.max(0, (now - dateAdded) / (1000 * 60 * 60 * 24));

            const ageBonus = Math.min(1, daysInBacklog / 365);

            const weight = rating * (1 + ageBonus);
            return { item, weight };
        });
    }

    // Select based on weight
    const totalWeight = weightedCandidates.reduce((sum, current) => sum + current.weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (const candidate of weightedCandidates) {
        randomValue -= candidate.weight;
        if (randomValue <= 0) {
            return candidate.item;
        }
    }

    // Fallback
    return candidates[0];
};

export const getOldestRandomItems = (items, count = 3, percentage = 0.10) => {
    if (!items || items.length === 0) return [];

    // Sort by addedAt ascending (oldest first)
    const sortedItems = [...items].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));

    // Determine the pool size (10% of total)
    const poolSize = Math.max(count, Math.ceil(sortedItems.length * percentage));

    // Slice options to get the oldest 10%
    const oldestPool = sortedItems.slice(0, poolSize);

    // Shuffle and pick 'count' items
    const shuffled = oldestPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
