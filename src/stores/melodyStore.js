import { defineStore } from "pinia";
import { ref } from "vue";
import { melodies } from "../utils/melodies";
import { startNote, stopNote, calculateNoteDuration } from "../utils/audio";

export const useMelodyStore = defineStore("melody", () => {
  const selectedMelody = ref(Object.keys(melodies)[0]);
  const isPlaying = ref(false);
  const bpm = ref(120);
  const highlightedNote = ref(null);
  let playbackTimeout = null;

  console.log(melodies);

  function setBpm(newBpm) {
    bpm.value = Math.max(40, Math.min(240, newBpm));
  }

  async function playMelody() {
    if (isPlaying.value) return;

    const melody = melodies[selectedMelody.value];
    if (!melody) return;

    isPlaying.value = true;

    try {
      for (const { note, duration } of melody.notes) {
        const durationMs = calculateNoteDuration(duration, bpm.value);
        startNote(note);
        highlightedNote.value = note;
        await new Promise((resolve) => setTimeout(resolve, durationMs));
        stopNote(note);
        highlightedNote.value = null;
      }
    } finally {
      isPlaying.value = false;
    }
  }

  function stopPlayback() {
    if (playbackTimeout) {
      clearTimeout(playbackTimeout);
      playbackTimeout = null;
    }
    isPlaying.value = false;
    highlightedNote.value = null;
  }

  return {
    selectedMelody,
    isPlaying,
    bpm,
    highlightedNote,
    melodies,
    playMelody,
    stopPlayback,
    setBpm,
  };
});
