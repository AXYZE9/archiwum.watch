<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black z-50">
        <div class="flex h-full">
            <!-- Video container -->
            <div class="flex-grow relative">
                <teleport to="#video-container">
                    <slot name="video"></slot>
                </teleport>
            </div>

            <!-- Chat sidebar -->
            <div class="w-[250px] bg-neutral-900 overflow-y-auto">
                <div class="p-2">
                    <div v-for="comment in comments" :key="comment.created_at"
                        class="flex gap-1 flex-wrap border-b border-neutral-800 py-2">
                        <p class="text-neutral-500">{{ comment.created_at.substring(11, 19) }}</p>
                        <img :src="comment.commenter.logo" class="w-4 h-4 rounded-full">
                        <b class="text-white">{{ comment.commenter.display_name }}</b>
                        <p class="text-white">{{ comment.message.body }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exit button -->
        <button @click="$emit('close')" class="absolute top-4 right-4 text-white hover:text-yellow-400 transition">
            <Icon name="material-symbols:close" size="32px" />
        </button>
    </div>
</template>

<script setup>
defineProps({
    isOpen: Boolean,
    comments: Array
});
</script>