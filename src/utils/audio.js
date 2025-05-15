import { ref } from "vue";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const noteDurations = {
  4: 4, //whole note
  2: 2, //half note
  1: 1, //quarter note
  0.5: 0.5, //eighth note
  0.25: 0.25, //sixteenth note
  0.125: 0.125, //thirty-second note
};

const octave = ref(4);
const MIN_OCTAVE = 0;
const MAX_OCTAVE = 8;

// Calculate duration in milliseconds based on BPM and relative note duration
export function calculateNoteDuration(relativeDuration, bpm) {
  // At 60 BPM, a quarter note (duration 1.0) is 1000ms
  // At other BPMs, we scale accordingly
  const quarterNoteMs = (60 / bpm) * 1000;
  return quarterNoteMs * relativeDuration;
}

let audioCtx;
const activeOscillators = new Map();

// Initialize audio context
export function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function frequencyFor(noteName, oct) {
  const semitoneMap = {
    C: -9,
    "C#": -8,
    D: -7,
    "D#": -6,
    E: -5,
    F: -4,
    "F#": -3,
    G: -2,
    "G#": -1,
    A: 0,
    "A#": 1,
    B: 2,
  };
  const semitoneOffset = semitoneMap[noteName] + 12 * (oct - 4);
  return 440 * 2 ** (semitoneOffset / 12);
}

export function startNote(noteName) {
  if (!audioCtx) return;
  if (activeOscillators.has(noteName)) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = frequencyFor(noteName, octave.value);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);

  osc.connect(gain).connect(audioCtx.destination);
  osc.start();

  activeOscillators.set(noteName, { osc, gain });
}

export function stopNote(noteName) {
  if (!audioCtx) return;
  const entry = activeOscillators.get(noteName);
  if (!entry) return;

  const { osc, gain } = entry;
  const now = audioCtx.currentTime;

  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.stop(now + 0.07);

  activeOscillators.delete(noteName);
}

export function decrementOctave() {
  if (octave.value > MIN_OCTAVE) octave.value--;
}

export function incrementOctave() {
  if (octave.value < MAX_OCTAVE) octave.value++;
}

export { notes, octave, MIN_OCTAVE, MAX_OCTAVE };
