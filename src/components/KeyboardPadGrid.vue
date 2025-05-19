<script setup>
import NotePad from "./NotePad.vue";
import { defineProps } from "vue";
import { notes, octave, startNote, stopNote } from "../utils/audio";
import { useMelodyStore } from "../stores/melodyStore";

const store = useMelodyStore();

defineProps({
  notes: {
    type: Array,
    default: () => notes,
  },

  octave: {
    type: Number,
    default: () => octave,
  },
});

// Separate white and black keys
const whiteNotes = notes.filter((note) => !note.includes("#"));
const blackNotes = notes.filter((note) => note.includes("#"));
</script>

<template>
  <div class="keyboard-grid">
    <div class="black-keys">
      <NotePad
        v-for="note in blackNotes"
        :key="note"
        :note="note"
        :is-sharp="true"
        :is-highlighted="note === store.highlightedNote"
        @pointerdown="startNote(note)"
        @pointerup="stopNote(note)"
        @pointerleave="stopNote(note)"
        class="black-key"
      />
    </div>
    <div class="white-keys">
      <NotePad
        v-for="note in whiteNotes"
        :key="note"
        :note="note"
        :is-sharp="false"
        :is-highlighted="note === store.highlightedNote"
        @pointerdown="startNote(note)"
        @pointerup="stopNote(note)"
        @pointerleave="stopNote(note)"
        class="white-key"
      />
    </div>
  </div>
</template>

<style scoped>
.keyboard-grid {
  /* display: grid; */
}

.white-keys {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.black-keys {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}
</style>
