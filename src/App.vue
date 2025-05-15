<script setup>
import { onMounted } from "vue";
import PadGrid from "./components/PadGrid.vue";
import OctaveControl from "./components/OctaveControl.vue";
import MelodyPlayer from "./components/MelodyPlayer.vue";
import { initAudioContext } from "./utils/audio";

onMounted(() => {
  // Lazy-initialize AudioContext on first user interaction for mobile Safari
  const resume = () => {
    initAudioContext();
    window.removeEventListener("pointerdown", resume);
  };
  window.addEventListener("pointerdown", resume, { once: true });
});
</script>

<template>
  <div class="container">
    <PadGrid />
    <OctaveControl />
    <MelodyPlayer />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  padding: 0.5rem;
  box-sizing: border-box;
  max-width: 600px;
  margin: 0 auto;
}
</style>
