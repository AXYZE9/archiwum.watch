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

const { data: historicalVideos, pending: historicalPending } = useFetch('https://recentyears.vitality97.workers.dev/', {
    key: 'historicalVideos',
    getCachedData: (key) => {
        const cached = useNuxtData(key).data.value;
        if (cached) {
            const cacheTime = localStorage.getItem(`${key}-cacheTime`);
            if (cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) { // 1 hour cache
                return cached;
            }
        }
        return null;
    },
    onResponse({ response }) {
        localStorage.setItem('historicalVideos-cacheTime', Date.now().toString());
    }
});

const openFaqItems = ref(new Set());

const toggleFaq = (index) => {
    if (openFaqItems.value.has(index)) {
        openFaqItems.value.delete(index);
    } else {
        openFaqItems.value.add(index);
    }
};

const faqItems = [
    {
        question: '🤔 Co to za strona?',
        answer: 'Archiwum.watch to projekt stworzony przez AXYZE, 0xA43, MrXylax oraz fs_animri mający na celu zachowanie historii serwerów GTA RP. Widzowie, streamerzy jak i gracze mogą powrócić do swoich wspomnień, przeżyć jeszcze raz emocjonujące chwile. 🥹 <br><br>Portal jest w charakterze non-profit i nie znajdują się na nim reklamy czy inne formy monetyzacji.'
    },
    {
        question: '🔍 Ogólne funkcje',
        answer: 'W nagłówku znajdziesz magiczną wyszukiwarkę, która pozwoli Ci znaleźć film klasycznie po tytule, ale także po słowach wypowiedzianych przez streamera. Po kliknięciu w takowy film przeglądarka automatycznie przekieruje Cię do odpowiedniego momentu wideo.'
    },
    {
        question: '🎬 Strona z filmem',
        answer: 'Na stronie odtwarzacza możesz go nie tylko odtworzyć, ale także pobrać na swoje urządzenie czy udostępnić link - inni wchodzący z Twojego linka oglądają od tego samego momentu! Okno z czatem możesz przemieszczać, zwiększać lub zmniejszać.<br><br>Tryb kinowy włącza specjalny, zoptymalizowany układ strony - jeżeli uważasz, że inny rozkład byłby jeszcze lepszy daj znać na naszym X/Twitterze! ❤️'
    },
    {
        question: '❤️ Ulubione / Historia',
        answer: 'W nagłówku znajdziesz serduszko, w którym znajdują się filmy, które dodano do ulubionych, a także historię oglądanych filmów. Ulubione oraz historia są przechowane lokalnie w Twojej przeglądarce bez angażowania serwera.<br><br>Filmy do ulubionych możesz dodać na stronie z odtwarzaczem, a w historii znajdziesz te które oglądano minimum 10 sekund.'
    },
    {
        question: '✨ Napisy AI',
        answer: 'Napisy zwiększają dostępność dla wielu osób, od tych uczących się języka polskiego po tych niedosłyszących. Niestety z powodu ogromu filmów dostępnych u nas oraz z racji, że jesteśmy projektem non-profit nie możemy pozwolić sobie na ręczne przygotowanie napisów. <br><br>Z powyższych powodów wykorzystujemy AI do wygenerowania napisów. Nonstop próbujemy poprawiać jakość napisów AI, dlatego najnowsze filmy będą miały precyzyjniejsze napisy, niż te poprzednie.'
    },
];
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

        <div v-else
            class="flex my-16 gap-6 md:gap-12 px-2 justify-center flex-wrap underline card-container max-w-screen-xl mx-auto">
            <div class="flex card-effect" v-for="streamer in streamerList">
                <nuxt-link :to='streamer.name'>
                    <div class="" @click='chosenStreamer = streamer.name'>
                        <img :src='"https://cdn1.fivecity.watch/avatar/" + streamer.name + ".jpg"' class="w-40 h-40">
                        <p class="absolute font-bold text-xl z-10 text-white"
                            style="bottom: 0px; left: 50%; transform: translate(-50%, -50%);">
                            {{ streamer.name }}</p>
                    </div>
                </nuxt-link>
            </div>
        </div>

        <div class="bg-gradient-to-b from-purple-400/5 from-0% to-neutral-950 to-[100px] py-1 backdrop-blur">
            <!-- Historical Videos Section -->
            <div class="my-8 px-2 max-w-screen-xl mx-auto">
                <h2 class="text-xl md:text-2xl font-bold text-yellow-400 text-center">Tego dnia w poprzednich
                    latach</h2>
                <div v-if="!historicalPending">
                    <p class="text-center text-neutral-600 ">{{ new
                        Date(historicalVideos.timestamp).toLocaleDateString('pl-PL', {
                            day: 'numeric', month: 'long'
                        }).replace(/\//g, '.') }}
                    </p>
                </div>


                <!-- Skeleton loading for historical videos -->
                <div v-if="historicalPending && !historicalVideos" class="flex gap-6 flex-wrap justify-center mt-8">
                    <div v-for=" n in 4" :key="n" class="animate-pulse">
                        <div class="w-96 max-w-lg flex-grow border border-purple-900/50 rounded-xl overflow-hidden">
                            <div class="h-48 bg-purple-900/20"></div>
                            <div class="px-4 py-4 space-y-3">
                                <div class="h-5 w-32 bg-purple-900/20 rounded"></div>
                                <div class="h-4 w-full bg-purple-900/20 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Historical videos grid -->
                <div v-else-if="historicalVideos?.videos?.length" class="flex gap-6 flex-wrap justify-center mt-8">
                    <div v-for="video in historicalVideos.videos" :key="video.timestamp" class="flex zoomOnHover">
                        <nuxt-link :to="video.streamer + '/' + video.video.slice(0, -4)" class="videoCard border border-purple-900 rounded-xl
                        shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0px_0px_70px_rgba(59,7,100,0.7)]
                        hover:border-yellow-400 hover:bg-stone-800 hover:shadow-yellow-900
                        transition overflow-hidden
                        w-96 max-w-lg flex-grow z-0">
                            <img loading="lazy"
                                :src="'https://cdn1.fivecity.watch/test/' + video.streamer + '/' + video.video.slice(0, -4) + '.jpg'"
                                :alt="'Screenshot ' + video.video.slice(0, -4)" style="width:100%;aspect-ratio: 16/9">
                            <div class="px-4 py-4">
                                <div>
                                    <p class="font-bold text-yellow-400 inline-block">{{ new
                                        Date(video.timestamp).getFullYear() }}
                                    </p>
                                    <p class="text-yellow-400 inline-block ml-1">{{ video.streamer }}</p>
                                </div>
                                <p class="text-white">{{ video.video.substring(video.video.indexOf('- ') + 1).slice(0,
                                    -4)
                                    }}</p>
                            </div>
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-neutral-950 py-12 px-4 md:px-8">
            <div id="faq" class="max-w-3xl mx-auto space-y-4">
                <h2 class="text-xl md:text-2xl font-bold text-yellow-400 text-center mb-8">Więcej o Archiwum.watch</h2>
                <div v-for="(item, index) in faqItems" :key="index"
                    class="bg-neutral-900/40 rounded-lg border border-neutral-900 shadow-[0px_1px_0px_inset_rgba(250,255,255,0.1)] overflow-hidden transition-all duration-300 hover:border-yellow-400/50">
                    <button @click="toggleFaq(index)"
                        class="w-full px-6 py-4 flex justify-between items-center text-left">
                        <span class="text-lg text-white">{{ item.question }}</span>
                        <span class="transform transition-transform duration-300 ease-in-out"
                            :class="{ 'rotate-45': openFaqItems.has(index) }">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                    </button>
                    <div class="overflow-hidden transition-all duration-300 ease-in-out"
                        :style="{ maxHeight: openFaqItems.has(index) ? '1000px' : '0px' }">
                        <div class="px-6 pb-4 text-neutral-300" v-html="item.answer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.card-effect img {
    opacity: 0.6;
    transition: opacity 0.1s ease-in-out;
}

.card-effect img:hover {
    opacity: 1;
}

.card-effect>a {
    transition: all 0.1s ease-in-out;
    opacity: 0.8;
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

/* FAQ Animations */
.faq-enter-active,
.faq-leave-active {
    transition: all 0.3s ease-out;
}

.faq-enter-from,
.faq-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Enhanced FAQ item hover effect */
.bg-neutral-900\/50:hover {
    background-color: rgba(23, 23, 23, 0.7);
    transition: all 0.3s ease-in-out;
}
</style>