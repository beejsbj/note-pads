<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { PitchDetector } from "pitchy";
import { useNotesStore } from "../stores/notes";

const isListening = ref(false);
const notesStore = useNotesStore();
const currentFrequency = ref(0);
const currentClarity = ref(0);
const currentVolume = ref(0);
const currentNote = ref("");

let audioContext = null;
let analyser = null;
let mediaStream = null;
let detector = null;
let animationFrame = null;

// Base frequencies for A4=440Hz
const A4 = 440;
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Detection thresholds
const CLARITY_THRESHOLD = 0.9; // Increased from 0.8
const VOLUME_THRESHOLD = 0.1; // Minimum volume to detect notes
const MINIMUM_NOTE_DURATION = 200; // Increased from 100ms

function getRMS(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i] * array[i];
  }
  return Math.sqrt(sum / array.length);
}

function getNoteFromFrequency(frequency) {
  // Get the number of half steps away from A4
  const halfStepsFromA4 = 12 * Math.log2(frequency / A4);

  // Round to nearest integer to get the closest note
  const roundedHalfSteps = Math.round(halfStepsFromA4);

  // Convert to a note in the scale (0-11)
  // Add 9 to align with C (since we're calculating distance from A)
  // Use modulo to wrap around the octave
  const noteIndex = (((roundedHalfSteps + 9) % 12) + 12) % 12;

  return NOTES[noteIndex];
}

async function startListening() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048; // Increase FFT size for better frequency resolution
    analyser.smoothingTimeConstant = 0.8; // Add smoothing
    source.connect(analyser);

    detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);

    let lastNote = null;
    let noteStartTime = 0;
    let consecutiveFrames = 0;
    const REQUIRED_FRAMES = 3; // Number of consecutive frames needed to confirm a note

    function updatePitch() {
      analyser.getFloatTimeDomainData(input);

      // Calculate volume
      const volume = getRMS(input);
      currentVolume.value = Math.round(volume * 100) / 100;

      const [pitch, clarity] = detector.findPitch(
        input,
        audioContext.sampleRate
      );

      currentFrequency.value = Math.round(pitch * 10) / 10;
      currentClarity.value = Math.round(clarity * 100) / 100;

      if (
        clarity > CLARITY_THRESHOLD &&
        pitch > 0 &&
        volume > VOLUME_THRESHOLD
      ) {
        const note = getNoteFromFrequency(pitch);

        if (note === lastNote) {
          consecutiveFrames++;
        } else {
          consecutiveFrames = 0;
        }

        // Only update if we've seen the same note for enough frames
        const now = Date.now();
        if (
          consecutiveFrames >= REQUIRED_FRAMES &&
          (note !== currentNote.value ||
            now - noteStartTime > MINIMUM_NOTE_DURATION)
        ) {
          currentNote.value = note;
          notesStore.highlightNote(note);
          noteStartTime = now;
        }

        lastNote = note;
      } else {
        currentNote.value = "";
        lastNote = null;
        consecutiveFrames = 0;
      }

      animationFrame = requestAnimationFrame(updatePitch);
    }

    updatePitch();
    isListening.value = true;
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
}

function stopListening() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  if (audioContext) {
    audioContext.close();
  }
  isListening.value = false;
  currentFrequency.value = 0;
  currentClarity.value = 0;
  currentVolume.value = 0;
  currentNote.value = "";
}

function toggleListening() {
  if (isListening.value) {
    stopListening();
  } else {
    startListening();
  }
}

onUnmounted(() => {
  stopListening();
});
</script>

<template>
  <div class="microphone-control">
    <button
      @click="toggleListening"
      :class="{ active: isListening }"
      class="mic-button"
    >
      <span class="mic-icon">🎤</span>
      {{ isListening ? "Stop Listening" : "Start Listening" }}
    </button>
    <div v-if="isListening" class="debug-info">
      <div>Frequency: {{ currentFrequency }}Hz</div>
      <div>Clarity: {{ currentClarity }}</div>
      <div>Volume: {{ currentVolume }}</div>
      <div>Detected Note: {{ currentNote || "None" }}</div>
    </div>
  </div>
</template>

<style scoped>
.microphone-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.mic-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2rem;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mic-button:hover {
  background: #d0d0d0;
}

.mic-button.active {
  background: #ff4444;
  color: white;
}

.mic-icon {
  font-size: 1.2rem;
}

.debug-info {
  font-family: monospace;
  background: #f5f5f5;
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: left;
  min-width: 200px;
}

.debug-info > div {
  margin: 0.25rem 0;
}
</style>
