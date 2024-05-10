<script setup>
import {
    AisInstantSearch,
    AisHits,
    AisSearchBox,
} from 'vue-instantsearch/vue3/es'

const client = useInstantSearch()
</script>

<template>

    <div class="flex gap-4 mx-auto max-w-screen-xl px-2 my-4 z-20 relative">



        <div class="bg-yellow-400 rounded-2xl p-2 flex items-center">
            <nuxt-link to="/">
                <div class=" border-r border-yellow-500 px-3 py-1 hover:text-yellow-800 transition">
                    <h1 class="italic font-extrabold text-xl leading-none">Archiwum</h1>
                    <h2 class="leading-none">.watch</h2>
                </div>
            </nuxt-link>
            <div class="flex gap-6 mx-6 ">
                <Icon name="material-symbols:favorite" size="28px" class="text-black hover:text-yellow-800 transition">
                </Icon>
                <Icon name="material-symbols:history" class="text-black hover:text-yellow-800 transition" size="28px">
                </Icon>
            </div>
        </div>

        <ais-instant-search :search-client="client" index-name="archiwum" class="flex flex-grow">
            <div
                class="bg-gray-900 bg-opacity-20 flex-grow rounded-2xl border border-purple-400 backdrop-blur-lg flex justify-center md:justify-start items-center gap-2 px-1 md:px-4">
                <Icon name="material-symbols:search" size="28px" class="text-purple-400"></Icon>
                <ais-search-box placeholder="Magiczna wyszukiwarka" class="szukajka"></ais-search-box>
            </div>
            <ais-hits class="absolute top-16">
                <template v-slot="{ items }">
                    <ul>
                        <li v-for="{ hierarchy_lvl0, hierarchy_lvl1, content } in items" :key="id"
                            class="backdrop-blur-lg text-white rounded overflow-hidden px-4 py-4 flex flex-col gap-2 border-1 border">
                            <p class="">{{ hierarchy_lvl0 }}</p>
                            <p class="">Data: {{ hierarchy_lvl1 }}</p>
                            <p class="text-yellow-400 underline font-bold">{{ content }}</p>
                        </li>
                    </ul>
                </template>
            </ais-hits>
        </ais-instant-search>

    </div>
</template>

<style>
.szukajka input {
    background: transparent;
}
</style>