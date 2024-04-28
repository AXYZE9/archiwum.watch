<script setup>
// const { data: chat } = await useFetch('media/stream.json');

// const instance = getCurrentInstance()
// const duration = ref(null)
// const playerx = ref(null)


// function videoTimeUpdated() {
//     playerx.value = instance.refs.playerx.player
//     duration.value = playerx.value.currentTime
//     console.log(duration.value)
//     console.log(chat.value.comments)
//     console.log("jazda")
//     console.log(filteredComments)
//     console.log("kurwa")
// }

// const filteredComments = computed(() => {
//     return chat.value.comments.filter(comment => comment.content_offset_seconds < duration.value)
// })

</script>


<template>
    <!-- <div class="text-neutral-400 p-4 py-12 mx-auto max-w-screen-xl ">


        <p class="text-white">
            Duration: {{ duration }}
        </p>
        <vue-plyr @timeupdate="videoTimeUpdated" ref="playerx">
            <video :emit="['timeupdate']" controls crossorigin playsinline data-poster="poster.jpg">
                <source src="media/stream.mp4" type="video/mp4" />
                <track default kind="captions" label="Polskie napisy" src="media/stream.vtt" srclang="pl" />
            </video>
        </vue-plyr>



        <draggable class="bg-black bg-opacity-80 backdrop-blur text-white px-1 pb-1 rounded text-xs flex">
            <div class="text-xs text-white w-full overflow-y-scroll">
                <div v-for="comment in filteredComments" class="flex gap-1 flex-wrap border-b border-neutral-900 py-2"
                    style="display:non">
                    <p class="text-neutral-500">{{ comment.created_at.substring(11, 19) }}</p>
                    <img :src="comment.commenter.logo" class="w-4 h-4 rounded-full">

                    <b>{{ comment.commenter.display_name }}</b>
                    <p>{{ comment.message.body }}</p>
                </div>
            </div>

        </draggable>


        <div
            class="flex bg-neutral-900 px-6 py-6 mt-6 rounded-2xl flex border-t border-neutral-800 shadow-xl flex-grow flex-wrap gap-6">
            <div class="flex items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jinnytty_Dec_22%2C_2020_002.jpg"
                    class="w-32 h-32 rounded-full mr-3">
                <div>
                    <h1 class="text-xl font-bold underline text-purple-500">Xylax</h1>
                    <p>Tytuł streamu</p>
                    <div class="rounded text-xs text-purple-500 underline">FiveCity Sezon 69</div>
                </div>


            </div>
            <div class="flex gap-6 md:ml-4 justify-end flex-grow items-center flex-wrap md:gap-12">

                <div class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 w-32 flex-grow md:flex-grow=0 h-24 rounded-xl
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
                <div class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 w-32 h-24 rounded-xl
                flex flex-col items-center justify-center text-neutral-600 hover:text-purple-400 transition 
                outline-purple-900 hover:bg-purple-900 hover:bg-opacity-20 hover:border-purple-600
                shadow-[0_6px_8px_rgba(0,0,0,0.2)]
                outline outline-0 hover:shadow-[0_6px_15px_rgba(0,0,0,0.7),inset_0px_0px_15px_rgba(107,33,168,0.4)]
                hover:outline-1 hidden md:flex
                ">
                    <Icon name="material-symbols:light-mode" size="32px" class="">
                    </Icon>
                    <p class="text-sm mt-2">Światło</p>
                </div>
                <div class="border-t border-neutral-700 bg-neutral-800 bg-opacity-10 w-32 flex-grow md:flex-grow=0 h-24 rounded-xl
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
    </div> -->
</template>
