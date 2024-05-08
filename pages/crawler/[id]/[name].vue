<script setup>
const route = useRoute();
const chosenStreamer = route.params.id;
const chosenVideo = route.params.name;
const { data: chat } = await useFetch('https://cdn1.fivecity.watch/test/' + chosenStreamer + "/" + chosenVideo + " - Chat.json");

const filteredComments = computed(() => {
    return chat.value.comments
})


const captions = ref([]);

async function loadCaptions(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    const cues = parseSrt(text);
    captions.value = cues;
}

function parseSrt(text) {
    const cues = [];
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 3) {
        const cue = {
            text: lines[i],
            startTime: lines[i + 1].split(' --> ')[0],
            endTime: lines[i + 1].split(' --> ')[1],
            id: lines[i + 2],
        };
        cues.push(cue);
    }
    return cues;
}

loadCaptions("https://cdn1.fivecity.watch/test/" + chosenStreamer + "/" + chosenVideo + ".vtt");

</script>

<template>
    <div class="text-neutral-400 mx-auto max-w-screen-xl ">
        <div class="py-4 mb-4">
            <h1 class="text-xl font-bold text-yellow-400 crawlerStreamStreamer">{{ chosenStreamer }}</h1>
            <p class="crawlerStreamNameWithoutDate">{{ chosenVideo.substring(11) }}</p>
            <p class="crawlerStreamNameWithDate">{{ chosenVideo }}</p>

        </div>
        <div v-if="captions" style="height:400px;overflow-y:scroll" class="text-blue-200 mb-8">
            <h1 class="text-2xl font-bold text-blue-500">Tekst</h1>
            <div v-for="(cue, index) in captions" :key="index"
                class="py-1 text-sm border-b border-neutral-900 flex flex-wrap gap-1">
                <p class="text-blue-400 crawlerStreamCaptionTime">{{ cue.id }}</p>
                <p class="crawlerStreamCaptionText">{{ cue.text }}</p>
            </div>
        </div>

        <div v-if="chat" style="height:400px;overflow-y:scroll">
            <h1 class="text-red-500 text-2xl font-bold">Czat</h1>
            <div v-for="comment in filteredComments"
                class="flex gap-1 flex-wrap border-b border-neutral-900 py-1 text-sm text-red-200">
                <p class="text-red-400 crawlerStreamChatMsgTime">{{ comment.created_at.substring(11, 19) }}</p>
                <b class="crawlerStreamChatMsgAuthor">{{ comment.commenter.display_name }}</b>
                <p class="crawlerStreamChatMsgText">{{ comment.message.body }}</p>
            </div>
        </div>
    </div>
</template>