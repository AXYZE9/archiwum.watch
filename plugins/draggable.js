import DraggableResizableVue from "draggable-resizable-vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("draggable", DraggableResizableVue);
});