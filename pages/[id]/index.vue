<script setup>
const route = useRoute();
const chosenCreatorName = route.params.id;

// Add caching to the fetch call
const { data: chosenStreamerStreams, pending } = useFetch('https://cdn1.fivecity.watch/test/' + chosenCreatorName, {
    // Use unique key for each streamer
    key: `streamer-${chosenCreatorName}`,
    getCachedData: (key) => {
        const cached = useNuxtData(key).data.value;
        if (cached) {
            const cacheTime = localStorage.getItem(`${key}-cacheTime`);
            if (cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) { // 1 hour cache
                return cached;
            }
        }
        return null;
    },
    onResponse({ response }) {
        localStorage.setItem(`streamer-${chosenCreatorName}-cacheTime`, Date.now().toString());
    }
});

// Get just mp4 files from object array that has variety of extensions and reverse the order
const filteredVideos = computed(() => {
    if (!chosenStreamerStreams.value) return [];
    return chosenStreamerStreams.value.filter(object => object.name.includes("mp4")).reverse();
})

function getCaptionName(streamName) {
    const baseName = streamName.slice(0, -4);
    return `${baseName}.vtt`;
}

function hasCaptions(streamName) {
    const captionName = getCaptionName(streamName);
    return chosenStreamerStreams.value.some(stream => stream.name === captionName);
}

// Check if chat file (filename - Chat.json.gz) exists
function getChatName(streamName) {
    const baseName = streamName.slice(0, -4);
    return `${baseName} - Chat.json.gz`;
}

function hasChat(streamName) {
    const chatName = getChatName(streamName);
    return chosenStreamerStreams.value.some(stream => stream.name === chatName);
}

// Interactive bubbles
const interactiveElement = ref(null);

let x = ref(0);
let y = ref(0);

function handleMouseMove(event) {
    x.value += (event.clientX - x.value) / 20;
    y.value += (event.clientY - y.value) / 20;
}

function animate() {
    interactiveElement.value.style.transform = `translate(${Math.round(x.value)}px, ${Math.round(y.value)}px)`;
    requestAnimationFrame(animate);
}


onMounted(() => {
    interactiveElement.value = document.querySelector(".interactive");
    window.addEventListener("mousemove", handleMouseMove);
    animate();
});

onBeforeUnmount(() => {
    window.removeEventListener("mousemove", handleMouseMove);
});

const pageSize = 12;
const currentPage = ref(1);

// Add these new refs and computed properties after filteredVideos
const selectedFilter = ref('all');

const availableFilters = computed(() => {
    if (!filteredVideos.value) return [];

    // Get unique month/year combinations from video names
    const filters = new Set();
    filters.add('all');

    filteredVideos.value.forEach(video => {
        const month = video.name.slice(4, 6);
        const year = '20' + video.name.slice(1, 3);
        filters.add(`${month}/${year}`);
    });

    return Array.from(filters).sort((a, b) => {
        if (a === 'all') return -1;
        if (b === 'all') return 1;

        // Split the dates into month and year
        const [monthA, yearA] = a.split('/');
        const [monthB, yearB] = b.split('/');

        // Compare years first
        if (yearA !== yearB) {
            return yearB - yearA; // Descending order of years
        }

        // If years are same, compare months
        return monthB - monthA; // Descending order of months
    });
});

// Update paginatedVideos to use filtered results
const filteredByDate = computed(() => {
    if (selectedFilter.value === 'all') return filteredVideos.value;

    return filteredVideos.value.filter(video => {
        const month = video.name.slice(4, 6);
        const year = '20' + video.name.slice(1, 3);
        return `${month}/${year}` === selectedFilter.value;
    });
});

// Update paginatedVideos to use filteredByDate instead of filteredVideos
const paginatedVideos = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredByDate.value.slice(start, start + pageSize);
});

// Update isNextPage to use filteredByDate
const isNextPage = computed(() => {
    return (currentPage.value * pageSize) < filteredByDate.value.length;
});

// When filter changes, reset to first page
watch(selectedFilter, () => {
    currentPage.value = 1;
});

const isPreviousPage = computed(() => {
    return currentPage.value > 1;
});

function nextPage() {
    if ((currentPage.value * pageSize) < filteredVideos.value.length) {
        currentPage.value++;
    }
}

function previousPage() {
    if (isPreviousPage.value) {
        currentPage.value--;
    }
}
</script>

<template>
    <div class="mx-4 my-12">
        <div class="gradient-bg">
            <div class="gradients-container" ref="interactive">
                <div class="g1"></div>
                <div class="g2"></div>
                <div class="g3"></div>
                <div class="g4"></div>
                <div class="g5"></div>
                <div class="interactive"></div>
            </div>
        </div>

        <!-- Filter buttons - only show when data is loaded -->
        <div v-if="!pending" class="relative z-10 flex flex-wrap justify-center gap-2 mb-8 mx-auto max-w-screen-xl">
            <button v-for="filter in availableFilters" :key="filter" @click="selectedFilter = filter"
                class="px-4 py-2 rounded-xl transition" :class="{
                    'bg-purple-800 text-white hover:bg-purple-700': selectedFilter === filter,
                    'bg-neutral-800 text-neutral-300 hover:bg-neutral-700': selectedFilter !== filter
                }">
                {{ filter === 'all' ? 'Wszystkie' : filter }}
            </button>
        </div>

        <!-- Skeleton loading state - show when pending -->
        <div v-if="pending" class="text-white flex gap-6 flex-wrap justify-center mx-auto max-w-screen-xl">
            <div v-for="n in 12" :key="n" class="flex">
                <div
                    class="animate-pulse w-96 max-w-lg flex-grow border border-purple-900/50 rounded-xl overflow-hidden">
                    <div class="h-48 bg-purple-900/20"></div>
                    <div class="px-4 py-4 space-y-3">
                        <div class="h-5 w-32 bg-purple-900/20 rounded"></div>
                        <div class="h-4 w-full bg-purple-900/20 rounded"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actual content - show when not pending -->
        <div v-else class="text-white flex gap-6 flex-wrap justify-center mx-auto max-w-screen-xl">
            <div v-for='stream in paginatedVideos' class="flex zoomOnHover" :key="stream.name">
                <nuxt-link :to="chosenCreatorName + '/' + stream.name.slice(0, -4)" class="videoCard border border-purple-900 rounded-xl
                    shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0px_0px_70px_rgba(59,7,100,0.7)]
                    hover:border-yellow-400 hover:bg-stone-800 hover:shadow-yellow-900
                    transition overflow-hidden
                    w-96 max-w-lg flex-grow z-0
        ">
                    <div class="flex gap-2 mt-2 ml-2 absolute">
                        <span v-if="hasCaptions(stream.name)"
                            class="px-2 py-1 bg-purple-800 rounded-full text-xs">Napisy
                            AI</span>
                        <span v-if="hasChat(stream.name)" class="px-2 bg-purple-800 rounded-full text-xs py-1">Zapis
                            czatu</span>
                    </div>
                    <img loading="lazy"
                        :src="'https://cdn1.fivecity.watch/test/' + chosenCreatorName + '/' + stream.name.slice(0, -4) + '.jpg'"
                        :alt="'Screenshot' + stream.name.slice(0, -4)">
                    <div class="px-4 py-4">

                        <p class="font-bold text-yellow-400"> {{ stream.name.slice(7, 9) }}.{{
                            stream.name.slice(4, 6) }}.20{{ stream.name.slice(1, 3) }}</p>
                        <p class="">{{ stream.name.substring(stream.name.indexOf('- ') + 1).slice(0, -4) }}</p>


                    </div>

                </nuxt-link>

            </div>

        </div>
        <div v-if="!pending" class="z-10 relative flex justify-around mt-12 gap-6">
            <button v-if="isPreviousPage" @click="previousPage" class="border-t border-neutral-700 bg-neutral-600 bg-opacity-10 md:flex-grow=0 px-4 py-2 gap-2 rounded-xl
                flex items-center justify-center text-neutral-200 hover:text-yellow-300 transition 
                outline-yellow-900 hover:bg-orange-900 hover:bg-opacity-20 hover:border-yellow-400
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(166,168,33,0.2)]
                hover:outline-1">
                <Icon name="fluent:previous-20-filled" size="20px" class="">
                </Icon>
                <p>Poprzednia strona</p>
            </button>

            <button v-if="isNextPage" @click="nextPage" class="border-t border-neutral-700 bg-neutral-600 bg-opacity-10 md:flex-grow=0 px-4 py-2 gap-2 rounded-xl
                flex items-center justify-center text-neutral-200 hover:text-yellow-300 transition 
                outline-yellow-900 hover:bg-orange-900 hover:bg-opacity-20 hover:border-yellow-400
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(166,168,33,0.2)]
                hover:outline-1">
                <Icon name="fluent:next-20-filled" size="20px" class="">
                </Icon>
                <p>Następna strona</p>
            </button>

        </div>


    </div>
</template>

<style>
.zoomOnHover {
    transition: 0.05s ease-out;
}

.zoomOnHover:hover {
    transform: scale(1.05);
    z-index: 1;
}

:root {
    --color1: 36, 27, 43;
    --color2: 26, 34, 49;
    --color3: 20, 33, 41;
    --color4: 49, 28, 34;
    --color5: 19, 36, 45;
    --color-interactive: 47, 26, 62;
    --background: 11, 11, 11;
    --circle-size: 90%;
    --blending: lighten;
}

@keyframes moveInCircle {
    0% {
        transform: rotate(0)
    }

    50% {
        transform: rotate(180deg)
    }

    to {
        transform: rotate(360deg)
    }
}

@keyframes moveVertical {
    0% {
        transform: translateY(-50%)
    }

    50% {
        transform: translateY(50%)
    }

    to {
        transform: translateY(-50%)
    }
}

@keyframes moveHorizontal {
    0% {
        transform: translate(-50%) translateY(-10%)
    }

    50% {
        transform: translate(50%) translateY(10%)
    }

    to {
        transform: translate(-50%) translateY(-10%)
    }
}

.gradient-bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0
}

.gradient-bg svg {
    display: none
}

.gradient-bg .gradients-container {
    filter: url(#goo) blur(40px);
    width: 100%;
    height: 100%
}

.gradient-bg .g1 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color1), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: center center;
    animation: moveVertical 30s ease infinite;
    opacity: 1
}

.gradient-bg .g2 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color2), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;
    opacity: 1
}

.gradient-bg .g3 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color3), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);
    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;
    opacity: 1
}

.gradient-bg .g4 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color4), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;
    opacity: 1
}

.gradient-bg .g5 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color5), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;
    opacity: 1
}

.gradient-bg .interactive {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color-interactive), 1) 0, rgb(var(--background), 1) 60%) no-repeat;
    mix-blend-mode: var(--blending);
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    opacity: 1
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .5;
    }
}
</style>