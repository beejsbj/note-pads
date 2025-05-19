<script setup>
import {
  currentInstrument,
  setInstrument,
  getAvailableInstruments,
} from "../stores/instrumentStore";

const instruments = getAvailableInstruments();

function handleInstrumentChange(event) {
  setInstrument(event.target.value);
}
</script>

<template>
  <div class="instrument-selector">
    <label for="instrument">Instrument:</label>
    <select
      id="instrument"
      :value="currentInstrument"
      @change="handleInstrumentChange"
      class="instrument-select"
    >
      <option
        v-for="instrument in instruments"
        :key="instrument"
        :value="instrument"
      >
        {{ instrument.charAt(0).toUpperCase() + instrument.slice(1) }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.instrument-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: #2a2a2a;
  border-radius: 8px;
}

.instrument-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  background: #333;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
}

.instrument-select:hover {
  background: #3a3a3a;
}

label {
  color: #fff;
  font-weight: 500;
}
</style>
