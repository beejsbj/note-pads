<script setup>
import NotePad from "./NotePad.vue";
import { defineProps } from "vue";
import { notes, octave, startNote, stopNote } from "../utils/audio";
import { useMelodyStore } from "../stores/melodyStore";
import { useNotesStore } from "../stores/notes";

const melodyStore = useMelodyStore();
const notesStore = useNotesStore();

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
</script>

<template>
  <div class="pads-grid">
    <NotePad
      v-for="note in notes"
      :key="note"
      :note="note"
      :is-sharp="note.includes('#')"
      :is-highlighted="
        note === melodyStore.highlightedNote ||
        note === notesStore.highlightedNote
      "
      @pointerdown="startNote(note)"
      @pointerup="stopNote(note)"
      @pointerleave="stopNote(note)"
    />
  </div>
</template>

<style scoped>
.pads-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 0.75rem;
}

/* Larger screens adjustments */
@media (min-width: 600px) {
  .pads-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
}
</style>
