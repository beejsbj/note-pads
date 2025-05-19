<script setup>
import NotePad from "./NotePad.vue";
import { defineProps, computed } from "vue";
import { notes, startNote, stopNote } from "../utils/audio";
import { useMelodyStore } from "../stores/melodyStore";
import { useNotesStore } from "../stores/notes";

const melodyStore = useMelodyStore();
const notesStore = useNotesStore();

const props = defineProps({
  notes: {
    type: Array,
    default: () => notes,
  },
  octave: {
    type: Number,
    required: true,
  },
});

// Compute note names with octave
const octaveNotes = computed(() => {
  return props.notes.map((note) => note.replace(/\d+/, props.octave));
});
</script>

<template>
  <div class="pads-grid">
    <NotePad
      v-for="note in octaveNotes"
      :key="`${note}-${octave}`"
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
  padding: 0.75rem;
  transition: background-color 0.3s ease;
}

/* Larger screens adjustments */
@media (min-width: 600px) {
  .pads-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
}
</style>
