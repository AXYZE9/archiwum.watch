<script setup>
const route = useRoute();
const chosenCreatorName = route.params.id;
const { data: chosenStreamerStreams } = await useFetch('https://cdn1.fivecity.watch/test/' + chosenCreatorName);

const filteredVideos = computed(() => {
    return chosenStreamerStreams.value.filter(object => object.name.includes("mp4"))
})



</script>

<template>
    <div>
        <div class="text-white">
            <h1 class="titlex">Archiwum Fivecity.Watch | {{ chosenCreatorName }} </h1>
            <div v-for='stream in filteredVideos' :key="stream.name">
                <p class="text-yellow-400 crawlerChosenStreamerStreamDate">{{ stream.name.slice(7, 9)
                    }}.{{
                        stream.name.slice(4, 6) }}.20{{ stream.name.slice(1, 3) }}</p>
                <nuxt-link :to="chosenCreatorName + '/' + stream.name.slice(0, -4)" class="crawlerStreamNameWithDate">
                    {{ stream.name }}
                    <!-- <div class="py-1">

                        <p class="crawlerChosenStreamerStreamName">{{ stream.name.substring(stream.name.indexOf('- ') +
                            1).slice(0, -4) }}</p>
                        <p class="crawlerChosenStreamerStreamFileName"></p>
                    </div> -->
                </nuxt-link>
            </div>
        </div>
    </div>
</template>