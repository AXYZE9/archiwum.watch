<script setup>
const route = useRoute();
const chosenStreamer = route.params.id;
const chosenVideo = route.params.name;

// Remove await and handle loading state
const { data: chat, pending: chatLoading } = useFetch('https://cdn1.fivecity.watch/test/' + chosenStreamer + "/" + chosenVideo + " - Chat.json", {
    key: `chat-${chosenStreamer}-${chosenVideo}`,
    lazy: true,
});

const instance = getCurrentInstance()
const duration = ref(0)
const playerx = ref(null)
const showModal = ref(false);
const modalMessage = ref('');
const isTheatreMode = ref(false);
import VueDraggableResizable from 'vue-draggable-resizable'


import { ref, nextTick, onMounted, onUpdated, watch } from 'vue';

//Polubienia
const likedVideos = ref([]);

// Save progress of movie
const currentProgress = ref([]); // Array to store progress objects
const router = useRouter();

// Add history tracking
const hasAddedToHistory = ref(false);
const addToHistory = () => {
    if (hasAddedToHistory.value) return;

    const historyVideo = {
        id: chosenStreamer,
        name: chosenVideo,
        timestamp: new Date().toISOString()
    };

    const storedHistory = localStorage.getItem('watched-history') || '[]';
    const historyArray = JSON.parse(storedHistory);

    // Remove duplicate if exists
    const existingIndex = historyArray.findIndex(
        video => video.id === historyVideo.id && video.name === historyVideo.name
    );
    if (existingIndex !== -1) {
        historyArray.splice(existingIndex, 1);
    }

    // Add to beginning of array
    historyArray.unshift(historyVideo);

    // Keep only last 100 videos
    if (historyArray.length > 100) {
        historyArray.pop();
    }

    localStorage.setItem('watched-history', JSON.stringify(historyArray));
    hasAddedToHistory.value = true;
    console.log('✨ Dodano oglądany film do historii oglądania')
};

// Add timer to track watch time
let watchTimer = null;

const saveProgress = () => {
    const url = route.params.name
    const progress = { url, duration: duration.value };

    // Get current progress from localStorage
    const storedProgress = localStorage.getItem('current-progress') || '[]';
    const progressArray = JSON.parse(storedProgress);

    const existingIndex = progressArray.findIndex(item => item.url === url);


    if (existingIndex !== -1) {
        // Update existing object
        progressArray[existingIndex] = progress;
    } else {
        // Add new object for the URL
        progressArray.push(progress);
    }

    localStorage.setItem('current-progress', JSON.stringify(progressArray));
};




// Scrollable container
const scrollableContainerRef = ref(null);
const scrollToBottom = async () => {
    // Wait for the element to be rendered
    await nextTick();

    if (scrollableContainerRef.value) {
        scrollableContainerRef.value.scrollTo({
            top: scrollableContainerRef.value.scrollHeight,
            behavior: 'smooth',
        });
    } else {
        console.warn('Scrollable container element not found.');
    }
};

onMounted(() => {
    instance.refs.playerx.player.on('loadeddata', (event) => {
        const storedProgress = localStorage.getItem('current-progress');
        if (storedProgress) {
            const progressArray = JSON.parse(storedProgress);
            const matchingProgress = progressArray.find(item => item.url === route.params.name);

            if (matchingProgress) {
                duration.value = matchingProgress.duration;
                instance.refs.playerx.player.currentTime = duration.value;
            }
        }

        // Start watch timer
        watchTimer = setTimeout(() => {
            addToHistory();
        }, 10000); // 10 seconds
    });

    loadLikedVideos();

    window.onbeforeunload = (event) => {
        saveProgress();
        if (watchTimer) {
            clearTimeout(watchTimer);
        }
        return null;
    };
    const handleEscape = (event) => {
        if (event.key === 'Escape' && isTheatreMode.value) {
            isTheatreMode.value = false;
        }
    };

    window.addEventListener('keydown', handleEscape);

    // Clean up on unmount
    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleEscape);
    });
});

onUpdated(scrollToBottom); // Scroll on content updates
onBeforeUnmount(saveProgress);

function videoTimeUpdated() {
    playerx.value = instance.refs.playerx.player
    duration.value = playerx.value.currentTime
}

const filteredComments = computed(() => {
    if (!chat.value?.comments) return [];
    return chat.value.comments.filter(comment => comment.content_offset_seconds < duration.value).slice(-30)
})

const videoRef = ref(null);
const chapters = ref([]);

async function fetchChapters() {
    try {
        const response = await fetch('https://cdn1.fivecity.watch/test/' + chosenStreamer + "/" + chosenVideo + ".json");
        chapters.value = await response.json();
    } catch (error) {
    }
}

function handleClickChapter(chapterino) {
    // console.log(chapterino)
    const chapterStartTime = parseFloat(chapterino.start_time);
    instance.refs.playerx.player.currentTime = chapterStartTime;
}

fetchChapters();

const likeVideo = () => {
    const newVideo = { id: chosenStreamer, name: chosenVideo };
    const likedVideos = loadLikedVideos();

    if (!likedVideos.some(video => video.id === newVideo.id && video.name === newVideo.name)) {
        likedVideos.push(newVideo);
        saveLikedVideos(likedVideos);

        // Success message
        showModal.value = true;
        modalMessage.value = 'Polubiono film! 🥰';

        setTimeout(() => {
            showModal.value = false;
        }, 3000);

    } else {
        // Already liked message
        showModal.value = true;
        modalMessage.value = 'Już polubiono ten film 🤷';

        setTimeout(() => {
            showModal.value = false;
        }, 3000);
    }
};

const saveLikedVideos = (videos) => {
    localStorage.setItem('likedVideos', JSON.stringify(videos));
};

const loadLikedVideos = () => {
    const storedVideos = localStorage.getItem('likedVideos');
    return storedVideos ? JSON.parse(storedVideos) : [];
};

// Function to get time from query parameter
const getTimeFromQuery = () => {
    const timeParam = route.query.time;
    return timeParam ? parseInt(String(timeParam), 10) : null;
};


// Function to set player time from query
const setPlayerTimeFromQuery = () => {
    const queryTime = getTimeFromQuery();
    if (queryTime !== null) {
        instance.refs.playerx.player.currentTime = queryTime;
    }
};

// Function to share current time
const shareCurrentTime = () => {
    const currentTime = Math.floor(instance.refs.playerx.player.currentTime);
    const shareUrl = `${window.location.origin}${route.path}?time=${currentTime}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        showModal.value = true;
        modalMessage.value = 'Link skopiowany do schowka! 🔗';
        setTimeout(() => {
            showModal.value = false;
        }, 3000);
    });
};

onMounted(() => {
    instance.refs.playerx.player.on('loadeddata', (event) => {
        const storedProgress = localStorage.getItem('current-progress');
        if (storedProgress) {
            const progressArray = JSON.parse(storedProgress);
            const matchingProgress = progressArray.find(item => item.url === route.params.name);

            if (matchingProgress) {
                duration.value = matchingProgress.duration;
                instance.refs.playerx.player.currentTime = duration.value;
            }
        }

        setPlayerTimeFromQuery();
    });

    loadLikedVideos();

    window.onbeforeunload = (event) => {
        saveProgress();
        if (watchTimer) {
            clearTimeout(watchTimer);
        }
        return null;
    };
});

const toggleTheatreMode = () => {
    isTheatreMode.value = !isTheatreMode.value;
};

watch(isTheatreMode, (newValue) => {
    document.documentElement.setAttribute('data-theatre-mode', newValue.toString());
});

</script>

<template>
    <div class="text-neutral-400 p-4 py-12 mx-auto max-w-screen-xl ">
        <VueDraggableResizable :w="300" :h="320" :min-width="240" :max-width="480" :min-height="80" :max-height="720"
            v-if="chat"
            class="bg-black bg-opacity-80 backdrop-blur text-white px-1 pb-1 rounded text-xs flex scrollable-container"
            style="z-index:20;position:fixed;">
            <div class="text-xs text-white w-full overflow-y-scroll"
                style="touch-action: none;    scrollbar-color: #9037e9 rgb(255 255 255 / 5%);"
                ref="scrollableContainerRef">
                <template v-if="chatLoading">
                    <div class="p-4 text-center">
                        <p>Ładowanie czatu...</p>
                    </div>
                </template>
                <template v-else>
                    <br> Tutaj będzie wyświetlany czat! 😊
                    <br> ↔ Pociągając za krawędź możesz zmienić rozmiar czatu
                    <br> ☝️ Przeciągając ten element możesz zmienić jego położenie
                    <br>
                    <br>
                    <br>
                    <div>
                        <div v-for="comment in filteredComments"
                            class="flex gap-1 flex-wrap border-b border-neutral-900 py-2">
                            <p class="text-neutral-500">{{ comment.created_at.substring(11, 19) }}</p>
                            <img :src="comment.commenter.logo" class="w-4 h-4 rounded-full">
                            <b>{{ comment.commenter.display_name }}</b>
                            <p style="word-break: break-word;">{{ comment.message.body }}</p>
                        </div>
                    </div>
                </template>
            </div>

        </VueDraggableResizable>



        <div class="theatre-mode flex flex-col md:flex-row md:items-center max-md:-ml-4 max-md:-mr-4">
            <div class="relative md:rounded-2xl overflow-hidden flex w-full">
                <vue-plyr @timeupdate="videoTimeUpdated" ref="playerx" class="z-20">
                    <video :emit="['timeupdate']" controls crossorigin playsinline
                        :data-poster="`https://cdn1.fivecity.watch/test/${chosenStreamer}/${chosenVideo}.jpg`">
                        <source :src='"https://cdn1.fivecity.watch/test/" + chosenStreamer + "/" + chosenVideo + ".mp4"'
                            type="video/mp4" />
                        <track default kind="captions" label="Polskie napisy (AI)"
                            :src='"https://cdn1.fivecity.watch/test/" + chosenStreamer + "/" + chosenVideo + ".vtt"'
                            srclang="pl" />
                    </video>
                </vue-plyr>
                <button v-if="isTheatreMode" @click="toggleTheatreMode"
                    class="fixed mt-2 md:top-0 right-2 z-[101] bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-1 rounded-lg transition-all duration-200 hover:scale-110 border-2 border-neutral-800">
                    <Icon name="material-symbols:close" size="24px" />
                </button>
            </div>
            <div v-if="chat"
                class="bg-black hidden bg-opacity-80 backdrop-blur text-white px-1 pb-1 rounded text-xs flex scrollable-container w-full md:w-[500px] md:h-full h-32 flex-grow"
                style="z-index:20;">
                <div class="text-xs text-white w-full overflow-y-scroll h-full"
                    style="touch-action: none;    scrollbar-color: #9037e9 rgb(255 255 255 / 5%);"
                    ref="scrollableContainerRef">
                    <template v-if="chatLoading">
                        <div class="p-4 text-center">
                            <p>Ładowanie czatu...</p>
                        </div>
                    </template>
                    <template v-else>
                        <br> Tutaj będzie wyświetlany czat! 😊
                        <br> ↔ Pociągając za krawędź możesz zmienić rozmiar czatu
                        <br> ☝️ Przeciągając ten element możesz zmienić jego położenie
                        <br>
                        <br>
                        <br>
                        <div>
                            <div v-for="comment in filteredComments"
                                class="flex gap-1 flex-wrap border-b border-neutral-900 py-2">
                                <p class="text-neutral-500">{{ comment.created_at.substring(11, 19) }}</p>
                                <img :src="comment.commenter.logo" class="w-4 h-4 rounded-full">
                                <b>{{ comment.commenter.display_name }}</b>
                                <p style="word-break: break-word;">{{ comment.message.body }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div
            class="flex gap-3 px-2 py-4 flex-grow-1 md:ml-2 justify-center flex-grow items-center flex-wrap md:flex-grow-0">

            <div @click="likeVideo" class="border-t p-4 border-neutral-700 bg-neutral-800 bg-opacity-30 rounded-xl
                flex items-center justify-center text-neutral-600 hover:text-yellow-400 transition 
                outline-yellow-900 hover:bg-yellow-900 hover:bg-opacity-20 hover:border-yellow-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(255,215,0,0.2)]
                hover:outline-1 cursor-pointer gap-2">
                <Icon name="material-symbols:favorite" size="24px" />
            </div>
            <transition name="slide-up">
                <div class="fixed py-2 bottom-10 px-2 z-30 w-screen left-0 flex justify-center" v-if="showModal">
                    <div class="absolute -bottom-12 -rotate-6 px-2 z-20 w-screen flex justify-center">
                        <p class="w-48 justify-end flex h-48 items-center serduszko mr-96">
                            <Icon name="fluent-emoji-flat:red-heart" size="120px" class="text-purple-400" />
                        </p>
                    </div>
                    <div class="absolute -bottom-12 rotate-6 px-2 z-20 w-screen flex justify-center">
                        <p class="w-48 justify-start flex h-48 items-center serduszko ml-96">
                            <Icon name="fluent-emoji-flat:red-heart" size="96px" class="text-purple-400" />
                        </p>
                    </div>
                    <p
                        class="text-white bg-neutral-800 z-30 rounded-xl px-4 py-2 border-t-neutral-600 border-b-neutrl-900 border border-transparent shadow-2xl shadow-red-900">

                        {{
                            modalMessage }}
                    </p>
                </div>
            </transition>

            <a :href="'https://cdn1.fivecity.watch/test/' + chosenStreamer + '/' + chosenVideo + '.mp4'" download>
                <div class="border-t p-4 border-neutral-700 bg-neutral-800 bg-opacity-30 rounded-xl
                    flex items-center justify-center text-neutral-600 hover:text-blue-400 transition 
                    outline-blue-800 hover:bg-blue-900 hover:bg-opacity-20 hover:border-blue-500
                    shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                    outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(33,107,168,0.4)]
                    hover:outline-1 cursor-pointer gap-2">
                    <Icon name="material-symbols:download" size="24px" />
                </div>
            </a>
            <div @click="shareCurrentTime" class="border-t p-4 border-neutral-700 bg-neutral-800 bg-opacity-30 rounded-xl
                flex items-center justify-center text-neutral-600 hover:text-green-400 transition 
                outline-green-900 hover:bg-green-900 hover:bg-opacity-20 hover:border-green-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(33,168,107,0.4)]
                hover:outline-1 cursor-pointer gap-2">
                <Icon name="material-symbols:share" size="24px" />
            </div>
            <div @click="toggleTheatreMode" class="border-t p-4 border-neutral-700 bg-neutral-800 bg-opacity-30 rounded-xl
                flex items-center justify-center text-neutral-600 hover:text-purple-400 transition 
                outline-purple-900 hover:bg-purple-900 hover:bg-opacity-20 hover:border-purple-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(147,51,234,0.4)]
                hover:outline-1 cursor-pointer gap-2">
                <p>Tryb kinowy</p>
            </div>
        </div>

        <div
            class="flex bg-neutral-900 bg-opacity-80 px-6 py-6 mt-6 rounded-2xl flex border-t border-neutral-800 shadow-xl flex-grow flex-wrap gap-6">
            <div class="flex items-center flex-grow flex-wrap justify-center">
                <NuxtLink :to="' ../' + chosenStreamer"><img
                        :src='"https://cdn1.fivecity.watch/avatar/" + chosenStreamer + ".jpg"'
                        class="w-32 h-32 rounded-full mr-3">
                </NuxtLink>
                <div class="flex-grow w-72">
                    <NuxtLink :to="'../' + chosenStreamer">
                        <h1 class="text-xl font-bold underline text-yellow-400">{{ chosenStreamer }}</h1>
                    </NuxtLink>
                    <p><sub>STREAMOWANO</sub><br> {{ chosenVideo.slice(7, 9) }}.{{ chosenVideo.slice(4, 6) }}.20{{
                        chosenVideo.slice(1, 3) }}
                    </p>
                    <p><sub>TYTUŁ ARCHIWUM.WATCH</sub><br> {{
                        chosenVideo.substring(11).substring(chosenVideo.substring(11).indexOf('-') + 2) }}</p>
                    <div
                        v-if="chat && chat.video && chat.video.title && chat.video.title !== chosenVideo.substring(11).substring(chosenVideo.substring(11).indexOf('-') + 2)">
                        <p><sub>TYTUŁ ORYGINALNY</sub><br> {{ chat.video.title }}</p>
                    </div>

                    <div></div>

                    <div v-if="chapters !== null" v-for="chapter in chapters" :key="chapter.id"
                        class="flex gap-3 flex-wrap mt-4">

                        <button v-for="chapterino in chapter" @click="handleClickChapter(chapterino)" class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 md:flex-grow=0 px-3 py-1 rounded-xl
                flex flex-col items-center justify-center text-yellow-400 hover:text-yellow-300 transition 
                outline-yellow-900 hover:bg-orange-900 hover:bg-opacity-20 hover:border-yellow-400
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(166,168,33,0.2)]
                hover:outline-1">
                            {{
                                chapterino.tags.title
                            }}
                        </button>
                    </div>
                </div>

                <div v-if="chat && chat.video && chat.video.chapters && chat.video.chapters[0] && chat.video.chapters[0].gameBoxArtUrl"
                    class="flex mt-6 flex-row gap-2 justify-center text-white">
                    <div class="flex flex-row items-center border border-neutral-800 rounded-xl overflow-hidden">
                        <img :src="chat.video.chapters[0].gameBoxArtUrl">
                        <p class="px-2">{{ chat.video.chapters[0].gameDisplayName }}</p>
                    </div>
                </div>



            </div>


        </div>
    </div>
</template>

<style>
@import "vue-draggable-resizable/style.css";


.plyr--full-ui input[type=range] {
    color: #facc15;
}

.plyr__control--overlaid {
    background: rgba(#facc15, .5);
}


.plyr--video .plyr__control.plyr__tab-focus,
.plyr--video .plyr__control:hover,
.plyr--video .plyr__control[aria-expanded=true] {
    background: #9037e9;
}

.serduszko {
    background: radial-gradient(circle, #f31e1e4d, #db1c1500 65%);
}


.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
    transform: translateY(0);
}

@media screen and (max-width: 460px) {
    .plyr__volume {
        max-width: 100px;
    }

    .plyr__volume input[data-plyr="volume"] {
        min-width: 48px;
    }

    .plyr__volume input[data-plyr="volume"] {
        display: none;
    }

    .plyr__controls__item.plyr__control[data-plyr="captions"] {
        display: none;

    }

    .plyr__volume:hover input[data-plyr="volume"],
    .plyr__volume input[data-plyr="volume"]:hover {
        display: block !important;
    }
}

.plyr__poster {
    filter: blur(10px) brightness(0.7);
    transform: scale(1.1);
}

.plyr {
    transition: all 0.1s ease;
    width: 100%;
    aspect-ratio: 16/9;
}

:root[data-theatre-mode="true"] .theatre-mode {
    margin-left: 0;
    margin-right: 0;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: black;
}

:root[data-theatre-mode="true"] .theatre-mode .relative {
    border-radius: 0px;
}

:root[data-theatre-mode="true"] .theatre-mode .scrollable-container {
    display: block;
}
</style>