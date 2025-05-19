<template>
  <div
    class="pad"
    :class="{
      'is-sharp': isSharp,
      'is-highlighted': isHighlighted,
    }"
  >
    <svg class="piano-keys" width="400" height="150" viewBox="0 0 400 150">
      <!-- White keys -->
      <g class="white-keys">
        <rect
          :class="{ active: note === 'C' }"
          id="key-c"
          x="10"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'D' }"
          id="key-d"
          x="65"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'E' }"
          id="key-e"
          x="120"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'F' }"
          id="key-f"
          x="175"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'G' }"
          id="key-g"
          x="230"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'A' }"
          id="key-a"
          x="285"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
        <rect
          :class="{ active: note === 'B' }"
          id="key-b"
          x="340"
          y="10"
          width="50"
          height="130"
          stroke="black"
          stroke-width="2"
          fill="white"
        />
      </g>
      <!-- Black keys -->
      <g class="black-keys">
        <rect
          :class="{ active: note === 'C#' }"
          id="key-c-sharp"
          x="45"
          y="10"
          width="30"
          height="80"
          fill="black"
        />
        <rect
          :class="{ active: note === 'D#' }"
          id="key-d-sharp"
          x="100"
          y="10"
          width="30"
          height="80"
          fill="black"
        />
        <rect
          :class="{ active: note === 'F#' }"
          id="key-f-sharp"
          x="210"
          y="10"
          width="30"
          height="80"
          fill="black"
        />
        <rect
          :class="{ active: note === 'G#' }"
          id="key-g-sharp"
          x="265"
          y="10"
          width="30"
          height="80"
          fill="black"
        />
        <rect
          :class="{ active: note === 'A#' }"
          id="key-a-sharp"
          x="320"
          y="10"
          width="30"
          height="80"
          fill="black"
        />
      </g>
    </svg>
    <span :class="{ sharp: isSharp }">
      {{
        note.includes("#")
          ? `${note.replace("#", "♯")}/${getNextNote(note.replace("#", ""))}♭`
          : note
      }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  note: {
    type: String,
    required: true,
  },
  isSharp: {
    type: Boolean,
    default: false,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
});

// Function to get the next note in the sequence
const getNextNote = (note) => {
  const sequence = ["C", "D", "E", "F", "G", "A", "B"];
  const index = sequence.indexOf(note);
  return sequence[(index + 1) % sequence.length];
};
</script>

<style scoped>
.pad {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: clamp(1rem, 5vw, 1.5rem);
  border: 2px solid var(--text-color);
  border-radius: 0.25rem;
  user-select: none;
  background: var(--main-bg-color);
  transition: all 0.08s;
  aspect-ratio: 1/1;
  padding: 1rem;
}

.pad:active,
.pad.is-highlighted {
  background: var(--active-bg-color);
  transform: scale(0.98);
}

.sharp {
  color: var(--accent-color);
}

.is-sharp.is-highlighted {
  background: var(--accent-color);
  color: var(--main-bg-color);
}

.is-sharp.is-highlighted .sharp {
  color: var(--main-bg-color);
}

.piano-keys {
  position: absolute;
  top: 10px;
  width: 80%;
  height: auto;
}

/* White key highlighting */
.white-keys rect.active {
  fill: #4caf50;
}

/* Black key highlighting */
.black-keys rect.active {
  fill: #2e7d32;
}
</style>
