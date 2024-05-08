<script setup>
const { data: streamerList } = await useFetch('https://cdn1.fivecity.watch/test/');
const chosenStreamer = ref();
</script>

<template>
    <div class="main">
        <a class="flex text-yellow-400 py-1 crawlerStreamerName" v-for="streamer in streamerList"
            :href='"crawler/" + streamer.name'>
            {{ streamer.name }}
        </a>

    </div>
</template>