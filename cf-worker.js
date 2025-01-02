// Funkcjonalność "Tego dnia w poprzednich latach"
// Ten plik jest zdeployowany na Cloudflare Workers

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Max-Age": "86400",
                }
            });
        }

        const url = new URL(request.url);

        // Handle refresh route
        if (url.pathname.endsWith('/refresh')) {
            const cache = caches.default;
            // Create a key for the main endpoint
            const mainEndpointUrl = new URL(request.url);
            mainEndpointUrl.pathname = '/'; // Reset to main endpoint
            const mainEndpointKey = new Request(mainEndpointUrl.toString());

            // Delete the cache
            await cache.delete(mainEndpointKey);

            return new Response(JSON.stringify({ message: 'Cache cleared successfully' }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                },
            });
        }

        const cacheKey = new Request(url.toString(), request);
        const cache = caches.default;

        // Try to get the response from cache
        let response = await cache.match(cacheKey);

        if (response) {
            // Parse cached data to check if it's still valid for today
            const cachedData = await response.json();
            const cachedDate = new Date(cachedData.timestamp);
            const now = new Date();

            // Check if cached data is from today
            if (cachedDate.getDate() === now.getDate() &&
                cachedDate.getMonth() === now.getMonth()) {
                return new Response(JSON.stringify(cachedData), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'public, max-age=3600',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    },
                });
            }
        }

        try {
            // Fetch streamers list
            const streamersResponse = await fetch('https://cdn1.fivecity.watch/test/');
            const streamers = await streamersResponse.json();

            // Get current date for comparison
            const today = new Date();
            const currentDay = today.getDate();
            const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based

            const historicalVideos = [];

            // Process each streamer
            for (const streamer of streamers) {
                // Fetch videos for this streamer
                const videosResponse = await fetch(`https://cdn1.fivecity.watch/test/${streamer.name}`);
                const videos = await videosResponse.json();

                // First filter for MP4 files only
                const mp4Videos = videos.filter(object => object.name.includes("mp4"));

                // Then filter for matching dates from filename
                const matchingVideos = mp4Videos.filter(video => {
                    // Extract date from filename [YY-MM-DD]
                    const dateMatch = video.name.match(/\[(\d{2})-(\d{2})-(\d{2})\]/);
                    if (!dateMatch) return false;

                    const [_, yearStr, monthStr, dayStr] = dateMatch;
                    const videoDay = parseInt(dayStr, 10);
                    const videoMonth = parseInt(monthStr, 10);
                    const videoYear = 2000 + parseInt(yearStr, 10); // Convert YY to YYYY

                    return videoDay === currentDay &&
                        videoMonth === currentMonth &&
                        videoYear < today.getFullYear();
                });

                // If we found matching videos, add them to our results
                if (matchingVideos.length > 0) {
                    matchingVideos.forEach(video => {
                        // Extract date from filename for consistent timestamp
                        const [_, yearStr, monthStr, dayStr] = video.name.match(/\[(\d{2})-(\d{2})-(\d{2})\]/);
                        const videoDate = new Date(2000 + parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));

                        historicalVideos.push({
                            streamer: streamer.name,
                            video: video.name,
                            year: 2000 + parseInt(yearStr, 10),
                            timestamp: videoDate.toISOString()
                        });
                    });
                }
            }

            // Sort by year (newest first)
            historicalVideos.sort((a, b) => b.year - a.year);

            // Prepare the response data
            const responseData = {
                timestamp: new Date().toISOString(),
                videos: historicalVideos
            };

            // Create the response with CORS headers
            response = new Response(JSON.stringify(responseData), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                },
            });

            // Cache the response for 24 hours
            ctx.waitUntil(cache.put(cacheKey, response.clone()));

            return response;

        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                },
            });
        }
    },
};