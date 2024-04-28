import DraggableResizableVue from "draggable-resizable-vue3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("draggable", DraggableResizableVue);
});