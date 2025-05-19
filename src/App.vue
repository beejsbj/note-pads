<script setup>
import { onMounted } from "vue";
import MelodyPlayer from "./components/MelodyPlayer.vue";
import { initAudioContext } from "./utils/audio";
import PadGrid from "./components/PadGrid.vue";
import InstrumentSelector from "./components/InstrumentSelector.vue";
import MicrophoneControl from "./components/MicrophoneControl.vue";
import OctaveCarousel from "./components/OctaveCarousel.vue";
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
    <InstrumentSelector />
    <OctaveCarousel />
    <MelodyPlayer />
    <MicrophoneControl />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  padding: 0.5rem;
  box-sizing: border-box;
  max-width: 800px;
  margin: 0 auto;
  gap: 1rem;
}
</style>
