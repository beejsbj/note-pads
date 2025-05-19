<script setup>
import { useMelodyStore } from "../stores/melodyStore";
import { ref, watch } from "vue";

const store = useMelodyStore();
const bpm = ref(store.bpm); // Initialize with store's BPM

// Watch store's BPM for changes
watch(
  () => store.bpm,
  (newBpm) => {
    bpm.value = newBpm;
  }
);

// Watch local BPM for user changes
watch(bpm, (newBpm) => {
  store.setBpm(newBpm);
});

// Handle melody selection
function handleMelodyChange(event) {
  store.setSelectedMelody(event.target.value);
  bpm.value = store.bpm; // Update local BPM when melody changes
}
</script>

<template>
  <div class="melody-player">
    <div class="controls">
      <div class="bpm-control">
        <label for="bpm">BPM:</label>
        <input
          type="number"
          id="bpm"
          v-model="bpm"
          min="40"
          max="240"
          :disabled="store.isPlaying"
        />
      </div>
      <select
        v-model="store.selectedMelody"
        class="melody-select"
        @change="handleMelodyChange"
      >
        <option v-for="(melody, key) in store.melodies" :key="key" :value="key">
          {{ melody.name }}
        </option>
      </select>
      <button
        @click="store.playMelody"
        :disabled="store.isPlaying"
        class="play-button"
      >
        {{ store.isPlaying ? "Playing..." : "Play" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.melody-player {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.bpm-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bpm-control input {
  width: 70px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
}

.melody-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-size: 1rem;
}

.play-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: var(--button-success);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.play-button:hover:not(:disabled) {
  background-color: var(--button-success-hover);
}

.play-button:disabled {
  background-color: var(--button-disabled);
  cursor: not-allowed;
}
</style>
