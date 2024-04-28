<template>
  <div>
    <TheHeader />
    <NuxtPage />
    <TheFooter />
  </div>
</template>

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
</style>