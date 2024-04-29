<template>
    <div class="flex gap-4 mx-auto max-w-screen-xl px-2 my-4">
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

        <div
            class="bg-gray-900 bg-opacity-20 flex-grow rounded-2xl border border-purple-400 backdrop-blur-lg flex  justify-center md:justify-start">
            <div class="mx-6 flex items-center">
                <Icon name="material-symbols:search" size="28px" class="text-purple-400 "></Icon>
                <div class="mx-3 text-purple-400 hidden md:block">
                    <p class="leading-none">Magiczna wyszukiwarka</p>
                    <p class="leading-none text-xs">Czat, wypowiedziane słowa, tagi...</p>
                </div>
            </div>

        </div>
    </div>
</template>