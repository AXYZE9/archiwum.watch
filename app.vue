<template>
  <div>
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo">
          <h1 class="italic font-extrabold text-3xl leading-none">Archiwum</h1>
          <h2 class="leading-none">.watch</h2>
        </div>
        <div class="loading-spinner"></div>
      </div>
    </div>
    <TheHeader />
    <NuxtPage />
    <TheFooter />
  </div>
</template>

<script setup>
const isLoading = ref(true)

// Hide loading screen after initial load
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<style>
html {
  font-family: Poppins;
  background-color: #0B0B0B;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0B0B0B;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.loading-logo {
  background-color: #FACC15;
  padding: 1rem 2rem;
  border-radius: 1rem;
  text-align: center;
  color: black;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #FACC15;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>