<script setup>
const route = useRoute();
const chosenStreamer = route.params.id;
const chosenVideo = route.params.name;
console.log(chosenStreamer + "/" + chosenVideo)
const { data: chat } = await useFetch('https://cdn1.fivecity.watch/test/' + chosenStreamer + "/" + chosenVideo + " - Chat.json");

const instance = getCurrentInstance()
const duration = ref(0)
const playerx = ref(null)
import VueDraggableResizable from 'vue-draggable-resizable'


import { ref, nextTick, onMounted, onUpdated } from 'vue';


// Save progress of movie
const currentProgress = ref([]); // Array to store progress objects
const router = useRouter();
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

    //localStorage.setItem('current-progress', JSON.stringify(progress));
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
        // Handle potential errors (optional)
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
    });

    window.onbeforeunload = (event) => {
        saveProgress();
        return null; // Optional: prevent default message (use with caution)
    };


});

onUpdated(scrollToBottom); // Scroll on content updates
onBeforeUnmount(saveProgress);

function videoTimeUpdated() {
    playerx.value = instance.refs.playerx.player

    duration.value = playerx.value.currentTime
    // console.log(duration.value)
    // console.log(chat.value.comments)
    // console.log("jazda")
    // console.log(filteredComments)
    // console.log("jazda2")
}

const filteredComments = computed(() => {
    return chat.value.comments.filter(comment => comment.content_offset_seconds < duration.value).slice(-30)
})

const videoRef = ref(null);
const chapters = ref([]);

async function fetchChapters() {
    try {
        const response = await fetch('https://cdn1.fivecity.watch/test/' + chosenStreamer + "/" + chosenVideo + ".json");
        chapters.value = await response.json();
    } catch (error) {
        console.error('Error fetching chapters:', error);
    }
}

function handleClickChapter(chapterino) {
    console.log(chapterino)
    const chapterStartTime = parseFloat(chapterino.start_time);
    instance.refs.playerx.player.currentTime = chapterStartTime;
}

fetchChapters();

</script>

<template>
    <div class="text-neutral-400 p-4 py-12 mx-auto max-w-screen-xl ">

        <p class="text-yellow-800">
            [DEBUG] Progress oglądania: {{ duration }}
        </p>



        <VueDraggableResizable :w="280" :h="160" :min-width="240" :max-width="480" :min-height="80" :max-height="720"
            class="bg-black bg-opacity-80 backdrop-blur text-white px-1 pb-1 rounded text-xs flex scrollable-container"
            style="z-index:1;position:fixed;">
            <div class="text-xs text-white w-full overflow-y-scroll" style="touch-action: none;"
                ref="scrollableContainerRef">
                <br> Tutaj będzie wyświetlany czat! 😊
                <br> Pociągając za krawędź możesz zmienić rozmiar czatu
                <br> Przeciągając ten element możesz zmienić jego położenie
                <br>
                <br>
                <br>
                <div v-if="chat">
                    <div v-for="comment in filteredComments"
                        class="flex gap-1 flex-wrap border-b border-neutral-900 py-2" style="display:non">
                        <p class="text-neutral-500">{{ comment.created_at.substring(11, 19) }}</p>
                        <img :src="comment.commenter.logo" class="w-4 h-4 rounded-full">

                        <b>{{ comment.commenter.display_name }}</b>
                        <p>{{ comment.message.body }}</p>
                    </div>
                </div>
            </div>

        </VueDraggableResizable>



        <vue-plyr @timeupdate="videoTimeUpdated" ref="playerx" class="z-20">
            <video :emit="['timeupdate']" controls crossorigin playsinline>
                <source :src='"https://cdn1.fivecity.watch/test/" + chosenStreamer + "/" + chosenVideo + ".mp4"'
                    type="video/mp4" />
                <track default kind="captions" label="Polskie napisy (AI)"
                    :src='"https://cdn1.fivecity.watch/test/" + chosenStreamer + "/" + chosenVideo + ".vtt"'
                    srclang="pl" />
            </video>
        </vue-plyr>






        <div
            class="flex bg-neutral-900 px-6 py-6 mt-6 rounded-2xl flex border-t border-neutral-800 shadow-xl flex-grow flex-wrap gap-6">
            <div class="flex items-center flex-grow ">
                <NuxtLink :to="'../' + chosenStreamer"><img
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jinnytty_Dec_22%2C_2020_002.jpg"
                        class="w-32 h-32 rounded-full mr-3"></NuxtLink>
                <div class="flex-grow">
                    <NuxtLink :to="'../' + chosenStreamer">
                        <h1 class="text-xl font-bold underline text-yellow-400">{{ chosenStreamer }}</h1>
                    </NuxtLink>

                    <p>{{ chosenVideo.substring(11).split(/-(?=.*\-)/)[1] }}</p>
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



            </div>
            <div class="flex gap-3 md:ml-4 justify-end flex-grow items-center flex-wrap md:gap-6">

                <div class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 w-28 md:flex-grow=0 h-24 rounded-xl
                flex flex-col items-center justify-center text-neutral-600 hover:text-purple-400 transition 
                outline-purple-900 hover:bg-purple-900 hover:bg-opacity-20 hover:border-purple-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(107,33,168,0.4)]
                hover:outline-1
                ">
                    <Icon name="material-symbols:favorite" size="32px" class="">
                    </Icon>
                    <p class="text-sm mt-2">Polub</p>
                </div>
                <div class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 w-40 md:flex-grow=0 h-24 rounded-xl
                flex flex-col items-center justify-center text-neutral-600 hover:text-purple-400 transition 
                outline-purple-900 hover:bg-purple-900 hover:bg-opacity-20 hover:border-purple-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(107,33,168,0.4)]
                hover:outline-1
                ">
                    <Icon name="material-symbols:auto-fix" size="32px" class="">
                    </Icon>
                    <p class="text-sm mt-2">Zgłoś poprawkę</p>
                </div>
            </div>


        </div>
    </div>
</template>

<style>
@import "vue-draggable-resizable/style.css";

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
</style>