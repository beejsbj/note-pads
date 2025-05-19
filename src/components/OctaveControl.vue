<script setup>
import { defineProps } from "vue";
import {
  octave,
  MIN_OCTAVE,
  MAX_OCTAVE,
  incrementOctave,
  decrementOctave,
} from "../utils/audio";

defineProps({
  octave: {
    type: Number,
    default: () => octave,
  },
  minOctave: {
    type: Number,
    default: MIN_OCTAVE,
  },
  maxOctave: {
    type: Number,
    default: MAX_OCTAVE,
  },
});
</script>

<template>
  <div class="bottom-bar">
    <button
      class="nav-btn"
      @click="decrementOctave"
      :disabled="octave <= minOctave"
      aria-label="Previous octave"
    >
      ◀
    </button>
    <span class="octave-label">OCTAVE : {{ octave }}</span>
    <button
      class="nav-btn"
      @click="incrementOctave"
      :disabled="octave >= maxOctave"
      aria-label="Next octave"
    >
      ▶
    </button>
  </div>
</template>

<style scoped>
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

.octave-label {
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
