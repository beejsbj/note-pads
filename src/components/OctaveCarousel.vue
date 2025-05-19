<script setup>
import { ref, onMounted, watch, computed } from "vue";
import PadGrid from "./PadGrid.vue";
import { MIN_OCTAVE, MAX_OCTAVE, octave } from "../utils/audio";

const container = ref(null);
const currentOctave = ref(octave);

const octaves = Array.from(
  { length: MAX_OCTAVE - MIN_OCTAVE + 1 },
  (_, i) => i + MIN_OCTAVE
);

// Compute the HSL color for the current octave
const getOctaveHue = (oct) => {
  // 360 degrees divided by number of octaves, multiplied by octave number
  return (360 / (MAX_OCTAVE - MIN_OCTAVE + 1)) * oct;
};

// Set initial background color immediately
const setBackgroundColor = (oct) => {
  document.documentElement.style.setProperty(
    "--main-bg-color",
    `hsla(${getOctaveHue(oct)}, 79%, 22%, 1)`
  );
};

// Set background color immediately when component is created
setBackgroundColor(currentOctave.value);

// Watch for octave changes from controls
watch(
  () => octave,
  (newOctave) => {
    if (!container.value || newOctave === currentOctave.value) return;

    const index = newOctave - MIN_OCTAVE;
    container.value.scrollTo({
      left: container.value.clientWidth * index,
      behavior: "smooth",
    });
    currentOctave.value = newOctave;
    setBackgroundColor(newOctave);
  }
);

// Scroll to initial octave and set initial color
onMounted(() => {
  const index = currentOctave.value - MIN_OCTAVE;
  container.value.scrollTo({
    left: container.value.clientWidth * index,
    behavior: "instant",
  });

  // Ensure background color is set
  setBackgroundColor(currentOctave.value);
});

const navigateOctave = (direction) => {
  if (!container.value) return;

  const newOctave = currentOctave.value + direction;
  if (newOctave >= MIN_OCTAVE && newOctave <= MAX_OCTAVE) {
    container.value.scrollTo({
      left: container.value.clientWidth * (newOctave - MIN_OCTAVE),
      behavior: "smooth",
    });
    currentOctave.value = newOctave;
    setBackgroundColor(newOctave);
  }
};

let scrollTimeout;
const handleScroll = () => {
  if (!container.value) return;

  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Set new timeout to handle the end of scrolling
  scrollTimeout = setTimeout(() => {
    const index = Math.round(
      container.value.scrollLeft / container.value.clientWidth
    );
    const newOctave = MIN_OCTAVE + index;
    if (newOctave !== currentOctave.value) {
      currentOctave.value = newOctave;
      setBackgroundColor(newOctave);
    }
  }, 50); // Small delay to ensure scroll has settled
};
</script>

<template>
  <div class="carousel-wrapper">
    <div ref="container" class="carousel-container" @scroll="handleScroll">
      <div v-for="oct in octaves" :key="oct" class="carousel-slide">
        <PadGrid :octave="oct" />
      </div>
    </div>
    <div class="bottom-bar">
      <button
        class="nav-btn"
        @click="navigateOctave(-1)"
        :disabled="currentOctave === MIN_OCTAVE"
        aria-label="Previous octave"
      >
        ◀
      </button>
      <div class="octave-indicator">
        <div class="dots">
          <div
            v-for="oct in octaves"
            :key="oct"
            class="dot"
            :class="{ active: oct === currentOctave }"
          ></div>
        </div>
        <span class="octave-label">OCTAVE {{ currentOctave }}</span>
      </div>
      <button
        class="nav-btn"
        @click="navigateOctave(1)"
        :disabled="currentOctave === MAX_OCTAVE"
        aria-label="Next octave"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  display: grid;
  gap: 1rem;
}

.carousel-container {
  width: 100%;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth;
}

.carousel-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.carousel-slide {
  min-width: 100%;
  flex-shrink: 0;
  scroll-snap-align: center;
  scroll-snap-stop: always;
}

.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  flex-wrap: wrap;
}

.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--text-color);
  background: transparent;
  color: var(--accent-color);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.octave-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-color);
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.dot.active {
  opacity: 1;
  background: var(--accent-color);
}

.octave-label {
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
