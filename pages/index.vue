<script setup>
const { data: streamerList, pending } = useFetch('https://cdn1.fivecity.watch/test/', {
    key: 'streamerList',
    getCachedData: (key) => {
        const cached = useNuxtData(key).data.value;
        if (cached) {
            const cacheTime = localStorage.getItem('streamerListCacheTime');
            if (cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
                return cached;
            }
        }
        return null;
    },
    onResponse({ response }) {
        localStorage.setItem('streamerListCacheTime', Date.now().toString());
    }
});

const chosenStreamer = ref();
</script>

<template>
    <div class="">
        <div class="videoBackground">
            <div class="backgroundOverlay"></div>
            <video autoplay muted loop playsinline id="myVideo">
                <source src="https://archiwum.watch/media/background-vp9.webm" type="video/webm">
                <source src="https://archiwum.watch/media/background-h265.mp4" type="video/mp4">
            </video>
        </div>

        <div v-if="pending && !streamerList" class="flex my-16 gap-6 md:gap-12 px-2 justify-center flex-wrap">
            <div v-for="n in 6" :key="n" class="animate-pulse">
                <div class="w-48 h-48 bg-purple-900/20 rounded-lg"></div>
            </div>
        </div>

        <div v-else class="flex my-16 gap-6 md:gap-12 px-2 justify-center flex-wrap underline card-container">
            <div class="flex card-effect" v-for="streamer in streamerList">
                <nuxt-link :to='streamer.name'>
                    <div class="" @click='chosenStreamer = streamer.name'>
                        <img :src='"https://cdn1.fivecity.watch/avatar/" + streamer.name + ".jpg"' class="w-48 h-48">
                        <p class="absolute font-bold text-2xl z-10"
                            style="bottom: 0px; left: 50%; transform: translate(-50%, -50%);">
                            {{ streamer.name }}</p>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<style>
.card-effect>a {
    transition: all 0.1s ease-in-out;
    opacity: 0.6;
    mix-blend-mode: lighten;
    filter:
        drop-shadow(0px 0px 0px rgba(0, 0, 0, 0)) saturate(0);
    border-radius: 10px;
    overflow: hidden;

}

.card-effect>a:hover {
    opacity: 1;
    mix-blend-mode: normal;
    transform: scale(1.05) translateY(-3px);
    filter: drop-shadow(0px -5px 10px rgba(20, 161, 255, 0.26)) drop-shadow(0px 30px 15px rgba(243, 9, 224, 0.329));
    color: white;
}

.card-effect>a::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 55%, rgba(0, 0, 0, 0.5) 70%);
    opacity: 0;
    transition: opacity 0.1s ease;
    z-index: 1;
    pointer-events: none;
}

.card-effect>a:hover::after {
    opacity: 1;
}

.backgroundOverlay {
    top: 0;
    content: "";
    background: linear-gradient(to left, rgba(10, 2, 26, 0.623), rgba(31, 4, 22, 0.596));
    background-repeat: no-repeat;
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