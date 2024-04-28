<script setup>
const route = useRoute();
const chosenCreatorName = route.params.id;
console.log(chosenCreatorName)
const { data: chosenStreamerStreams } = await useFetch('https://cdn1.fivecity.watch/test/' + chosenCreatorName);

const filteredVideos = computed(() => {

    console.log(Array.isArray(chosenStreamerStreams.value))
    console.log(chosenStreamerStreams.value.filter(object => object.name.includes("mp4")))
    console.log("TwojStary")

    return chosenStreamerStreams.value.filter(object => object.name.includes("mp4"))
})

</script>

<template>
    <div class="mx-4 my-12">

        <div class="text-white flex gap-3 flex-wrap justify-center mx-auto max-w-screen-xl">
            <div v-for='stream in filteredVideos' class="flex">
                <nuxt-link :to="chosenCreatorName + '/' + stream.name.slice(0, -4)" class="videoCard border border-purple-900 rounded-xl
                    shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0px_0px_70px_rgba(59,7,100,0.7)]
                    hover:border-yellow-400 hover:bg-stone-800 hover:shadow-yellow-900
                    transition overflow-hidden
                    w-96 max-w-lg flex-grow videoAnimation
        ">
                    <img loading="lazy"
                        src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jinnytty_Dec_22%2C_2020_002.jpg"
                        alt="Screenshot">
                    <div class="p-3 ">
                        <p class="">{{ stream.name.substring(11) }}</p>
                        <p class="text-xs">{{ stream.name.slice(1, 9) }}</p>
                    </div>

                </nuxt-link>

            </div>
        </div>

    </div>
</template>