<script setup>

const likedVideos = ref([]);

// Interactive bubbles
const interactiveElement = ref(null);

let x = ref(0);
let y = ref(0);

function handleMouseMove(event) {
    x.value += (event.clientX - x.value) / 20;
    y.value += (event.clientY - y.value) / 20;
}

function animate() {
    interactiveElement.value.style.transform = `translate(${Math.round(x.value)}px, ${Math.round(y.value)}px)`;
    requestAnimationFrame(animate);
}


onMounted(() => {
    likedVideos.value = loadLikedVideos();
    interactiveElement.value = document.querySelector(".interactive");
    window.addEventListener("mousemove", handleMouseMove);
    animate();
});

onBeforeUnmount(() => {
    window.removeEventListener("mousemove", handleMouseMove);
});

const loadLikedVideos = () => {
    const storedVideos = localStorage.getItem('likedVideos');
    return storedVideos ? JSON.parse(storedVideos) : [];
};


</script>

<template>
    <div class="mx-4 my-12">
        <div class="gradient-bg">
            <div class="gradients-container" ref="interactive">
                <div class="g1"></div>
                <div class="g2"></div>
                <div class="g3"></div>
                <div class="g4"></div>
                <div class="g5"></div>
                <div class="interactive"></div>
            </div>
        </div>

        <div class="text-white flex gap-6 flex-wrap justify-center mx-auto max-w-screen-xl">
            <div v-for='video in likedVideos' class="flex zoomOnHover" :key="video.id">

                <nuxt-link :to="video.id + '/' + video.name" class="videoCard border border-purple-900 rounded-xl
                    shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0px_0px_70px_rgba(59,7,100,0.7)]
                    hover:border-yellow-400 hover:bg-stone-800 hover:shadow-yellow-900
                    transition overflow-hidden
                    w-96 max-w-lg flex-grow videoAnimation
        ">
                    <img loading="lazy"
                        :src="'https://cdn1.fivecity.watch/test/' + video.id + '/' + video.name + '.jpg'"
                        :alt="'Screenshot' + video.name">
                    <div class="px-4 py-4">

                        <p class="font-bold text-yellow-400"> {{ video.name.slice(7, 9) }}.{{
                            video.name.slice(4, 6) }}.20{{ video.name.slice(1, 3) }}</p>
                        <p class="">{{ video.name.substring(11) }}</p>
                    </div>

                </nuxt-link>

            </div>
        </div>

    </div>
</template>

<style>
.zoomOnHover {
    transition: 0.05s ease-out;
}

.zoomOnHover:hover {
    transform: scale(1.05);
    z-index: 1;
}

:root {
    --color1: 36, 27, 43;
    --color2: 26, 34, 49;
    --color3: 20, 33, 41;
    --color4: 49, 28, 34;
    --color5: 19, 36, 45;
    --color-interactive: 47, 26, 62;
    --background: 11, 11, 11;
    --circle-size: 90%;
    --blending: lighten;
}

@keyframes moveInCircle {
    0% {
        transform: rotate(0)
    }

    50% {
        transform: rotate(180deg)
    }

    to {
        transform: rotate(360deg)
    }
}

@keyframes moveVertical {
    0% {
        transform: translateY(-50%)
    }

    50% {
        transform: translateY(50%)
    }

    to {
        transform: translateY(-50%)
    }
}

@keyframes moveHorizontal {
    0% {
        transform: translate(-50%) translateY(-10%)
    }

    50% {
        transform: translate(50%) translateY(10%)
    }

    to {
        transform: translate(-50%) translateY(-10%)
    }
}

.gradient-bg {
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0
}

.gradient-bg svg {
    display: none
}

.gradient-bg .gradients-container {
    filter: url(#goo) blur(40px);
    width: 100%;
    height: 100%
}

.gradient-bg .g1 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color1), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: center center;
    animation: moveVertical 30s ease infinite;
    opacity: 1
}

.gradient-bg .g2 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color2), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 400px);
    animation: moveInCircle 20s reverse infinite;
    opacity: 1
}

.gradient-bg .g3 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color3), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2 + 200px);
    left: calc(50% - var(--circle-size) / 2 - 500px);
    transform-origin: calc(50% + 400px);
    animation: moveInCircle 40s linear infinite;
    opacity: 1
}

.gradient-bg .g4 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color4), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: var(--circle-size);
    height: var(--circle-size);
    top: calc(50% - var(--circle-size) / 2);
    left: calc(50% - var(--circle-size) / 2);
    transform-origin: calc(50% - 200px);
    animation: moveHorizontal 40s ease infinite;
    opacity: 1
}

.gradient-bg .g5 {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color5), 1) 0, rgba(var(--background), 1) 50%) no-repeat;
    mix-blend-mode: var(--blending);
    width: calc(var(--circle-size) * 2);
    height: calc(var(--circle-size) * 2);
    top: calc(50% - var(--circle-size));
    left: calc(50% - var(--circle-size));
    transform-origin: calc(50% - 800px) calc(50% + 200px);
    animation: moveInCircle 20s ease infinite;
    opacity: 1
}

.gradient-bg .interactive {
    position: absolute;
    background: radial-gradient(circle at center, rgba(var(--color-interactive), 1) 0, rgb(var(--background), 1) 60%) no-repeat;
    mix-blend-mode: var(--blending);
    width: 100%;
    height: 100%;
    top: -50%;
    left: -50%;
    opacity: 1
}
</style>