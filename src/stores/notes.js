import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotesStore = defineStore("notes", () => {
  const highlightedNote = ref(null);
  const highlightTimeout = ref(null);

  function highlightNote(note) {
    highlightedNote.value = note;

    // Clear previous timeout if exists
    if (highlightTimeout.value) {
      clearTimeout(highlightTimeout.value);
    }

    // Clear highlight after 1 second
    highlightTimeout.value = setTimeout(() => {
      highlightedNote.value = null;
    }, 1000);
  }

  return {
    highlightedNote,
    highlightNote,
  };
});
