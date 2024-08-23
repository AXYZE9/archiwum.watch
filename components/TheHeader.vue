<script setup>
const indexName = 'Buli'
const algolia = useInstantSearch()
import { AisInstantSearch, AisSearchBox, AisHits, AisHighlight, AisPagination, AisConfigure } from 'vue-instantsearch/vue3/es'

const showHits = ref(false);

const handleClickOutside = (event) => {
    const instantSearchElement = document.querySelector('.ais-InstantSearch');
    if (instantSearchElement && !instantSearchElement.contains(event.target)) {
        showHits.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

const searchConfig = {
    hitsPerPage: 4
}

// Function to convert timestamp to seconds
const convertTimestampToSeconds = (timestamp) => {
    const parts = timestamp.split(':');
    let seconds = 0;

    if (parts.length === 3) {
        // Format: HH:MM:SS.mmm
        seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
    } else if (parts.length === 2) {
        // Format: MM:SS.mmm
        seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    }

    return Math.floor(seconds);
};

// Function to generate URL with timestamp
const generateUrlWithTimestamp = (baseUrl, timestamp) => {
    const seconds = convertTimestampToSeconds(timestamp);
    return `${baseUrl}?time=${seconds}`;
};
</script>

<template>

    <div class="flex gap-4 mx-auto max-w-screen-xl px-2 my-4 z-20 relative flex-wrap">



        <div class="bg-yellow-400 rounded-2xl p-2 flex items-center z-10">
            <nuxt-link to="/">
                <div class=" border-r border-yellow-500 px-3 py-1 hover:text-yellow-800 transition">
                    <h1 class="italic font-extrabold text-xl leading-none">Archiwum</h1>
                    <h2 class="leading-none">.watch</h2>
                </div>
            </nuxt-link>
            <div class="flex gap-6 mx-6 ">
                <nuxt-link to="/ulubione">
                    <Icon name="material-symbols:favorite" size="28px"
                        class="text-black hover:text-yellow-800 transition">
                    </Icon>
                </nuxt-link>
                <Icon name="material-symbols:history" class="text-black hover:text-yellow-800 transition" size="28px">
                </Icon>
            </div>
        </div>

        <transition name="fade">
            <div class="overlay" v-show="showHits" @click="handleClose"></div>
        </transition>



        <ais-instant-search :index-name="indexName" :search-client="algolia" class="flex flex-grow z-10"
            @click="showHits = true">

            <ais-configure v-bind="searchConfig" />

            <div class="flex-grow bg-gray-900 bg-opacity-20 rounded-2xl border border-purple-400 backdrop-blur-lg flex items-center gap-2 px-4"
                style="min-height:60px;">

                <Icon name="material-symbols:search" size="28px" class="text-purple-400"></Icon>
                <ais-search-box placeholder="Magiczna wyszukiwarka"
                    class="szukajka w-full justify-center md:justify-start flex">
                </ais-search-box>
            </div>



            <transition name="slide">
                <div class="absolute ais-Box" v-if="showHits" @click.stop>
                    <ais-hits
                        class="flex flex-col backdrop-blur-lg bg-black/50 rounded-2xl border border-purple-400/30 overflow-hidden -ml-2 md:ml-0">
                        <template v-slot="{ items }">
                            <div v-for="item in items" :key="item.objectID" class="overflow-hidden px-2 hover:bg-purple-700/80 transition text-neutral-200 hover:text-white
                            searchitem">
                                <NuxtLink @click="showHits = false"
                                    :href="generateUrlWithTimestamp('/' + item.streamer_name + '/' + item.filename, item.start_time)"
                                    class="flex gap-2 items-center">
                                    <div class="shrink-0 img-overlay">
                                        <img :src="'https://cdn1.fivecity.watch/test/' + item.streamer_name + '/' + item.filename + '.jpg'"
                                            class="h-12 md:h-20" loading="lazy"></img>
                                    </div>

                                    <div class="py-3 md:py-6">
                                        <p class="font-bold text-xs">
                                            <ais-highlight attribute="filename" :hit="item" />
                                        </p>
                                        <p class="text-neutral-400 text-xs left-2  rounded-md">
                                            🕒 {{ item.start_time.slice(0, -4) }} - {{ item.end_time.slice(0, -4) }}
                                        </p>
                                        <p class="text-xs">
                                            <ais-highlight attribute="content" :hit="item" />
                                        </p>
                                    </div>
                                </NuxtLink>
                            </div>
                        </template>

                    </ais-hits>
                    <ais-pagination :padding="1" class="transition" :showNext="false" :showPrevious="false" />
                </div>


            </transition>

        </ais-instant-search>


    </div>
</template>

<style>
.ais-Pagination {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.ais-Pagination-list {
    display: flex;
    list-style-type: none;
    padding: 0;
    background: radial-gradient(#3e1d8ca3 10%, transparent 70%);
    height: 80px;
}

.ais-Pagination-item {
    margin: 0 0.5rem;
}

.ais-Pagination-link {
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    background-color: rgb(139 92 246 / 24%);
    transition: background-color 0.3s ease;
    border: 1px solid #8b5cf62b;
}

.ais-Pagination-item--selected .ais-Pagination-link {
    background-color: rgb(139, 92, 246);
    border-top: 1px solid #a98ee5;
}

.ais-Pagination-link:hover {
    background-color: rgba(139, 92, 246, 0.7);
}

.searchitem img {
    transition: 0.15s ease-out;
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 90%);
    -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 95%);
}

.searchitem .py-3 {
    z-index: 1;
}

.searchitem:hover img {
    mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 90%);
    -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 95%);
    transform: scale(1.5) translateX(-10px);
    box-shadow: rgba(230, 212, 253, 0.5) 0px 0px 20px 0px;
}

.ais-SearchBox-form button {
    display: none;
}

.szukajka input {
    background: transparent;
    outline: 0;
    color: white;
    width: 100%;
    height: 100%;
}

.szukajka form {
    width: 100%;
}

.ais-Box {
    position: absolute;
    margin-top: 80px;
}

.ais-Hits>*:not(:last-child) {
    border-bottom: 1px solid #241b2d;
}

.slide-enter-active {
    transition: 0.2s ease-out;
    backdrop-filter: blur(16px);
}

.slide-enter-from {
    transform: translateY(-20px);
    opacity: 0;
    backdrop-filter: blur(16px);
}

.searchitem:hover {
    box-shadow: rgba(210, 175, 255, 0.5) 0px 20px 30px 0px inset, rgb(135, 50, 247, 0.5) 0px 0px 20px 0px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: saturate(0) blur(4px);
    -webkit-backdrop-filter: saturate(0) blur(4px);
    z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>