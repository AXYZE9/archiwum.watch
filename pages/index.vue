<script setup>
const { data: streamerList } = await useFetch('https://cdn1.fivecity.watch/test/');
const chosenStreamer = ref();
</script>

<template>
    <div class="">
        <div class="videoBackground">
            <div class="backgroundOverlay"></div>
            <video autoplay muted loop playsinline id="myVideo">
                <source src="https://fivecity.watch/assets/background-vp9.webm" type="video/webm">
                <source src="https://fivecity.watch/assets/background-h265.mp4" type="video/mp4">
            </video>
        </div>
        <!-- Streamer List -->
        <!-- <p class="text-white">
            {{ chosenStreamer }}
            <br>
            {{ chosenStreamerStreams }}
        </p> -->


        <div class="flex my-16 gap-6 md:gap-12 px-2 justify-center text-yellow-400 flex-wrap underline">
            <div class="flex" v-for="streamer in streamerList">
                <nuxt-link :to='streamer.name'>
                    <div class="flex" @click='chosenStreamer = streamer.name'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jinnytty_Dec_22%2C_2020_002.jpg"
                            class="w-6 h-6 rounded-full mr-3">
                        <p> {{ streamer.name }}</p>
                    </div>
                </nuxt-link>
            </div>
        </div>

        <p class="text-white">
            <br><br><br><br><br><b>Progres</b><br>
            ✔️ Routing<br>
            ✔️ Czat synchronizowany z filmem<br>
            ✔️ Automatycznie przewijanie czatu<br>
            ✔️ Zapamiętywanie ostatnio oglądanego momentu filmu<br>
            ⏳ Generowanie napisów (aktualny stan na Discord)<br>
            ⏳ Miniaturki i screeny na pasku przewijania<br>
            ⏳ Magiczna wyszukiwarka (Użyjemy MeiliSearch Docs Scraper, ten krok oczekuje na wygenerowane napisy)
            🟡 Możliwość lajkowania filmów oraz historia przeglądania (LocalStorage)<br>
            <br>
        </p>

    </div>
</template>

<style>
.backgroundOverlay {
    top: 0;
    content: "";
    background: linear-gradient(to left, rgba(10, 2, 26, 0.623), rgba(31, 4, 22, 0.596));
    background-repeat: no-repeat;
    /* background-color: rgba(39, 14, 37, 0.521); */
    height: 100%;
    width: 100%;
    z-index: -1;
    position: absolute;
    mix-blend-mode: color;
}

.videoBackground video {
    z-index: 0;
    position: absolute;
    object-fit: cover;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(2px) brightness(0.2);
    z-index: -2;
    animation: fadeInAnimation ease 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.videoCard {
    background-color: rgb(11, 6, 15);
}

.videoAnimation {
    animation: videoAnimation ease 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

@keyframes videoAnimation {
    0% {
        opacity: 0;
        transform: perspective(400px) rotateX(20deg);
    }

    20% {
        opacity: 0;
        transform: perspective(400px) rotateX(20deg);
    }

    100% {
        opacity: 1;
    }
}

@keyframes fadeInAnimation {
    0% {
        opacity: 0;
    }

    20% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>