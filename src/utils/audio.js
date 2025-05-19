import { ref } from "vue";
import * as Tone from "tone";
import { getCurrentInstrument } from "../stores/instrumentStore";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Define note durations using Tone.js notation
export const noteDurations = {
  "1m": "whole", // whole note
  "2n": "half", // half note
  "4n": "quarter", // quarter note
  "8n": "eighth", // eighth note
  "16n": "sixteenth", // sixteenth note
  "32n": "thirty-second", // thirty-second note
};

const octave = ref(4);
const MIN_OCTAVE = 0;
const MAX_OCTAVE = 8;

// Initialize audio context and transport
export function initAudioContext() {
  Tone.start();
  Tone.getTransport().bpm.value = 120; // default BPM
}

// Set the BPM using Tone.js Transport
export function setBPM(bpm) {
  Tone.getTransport().bpm.value = bpm;
}

export function startNote(noteName) {
  try {
    const instrument = getCurrentInstrument();

    // Check if noteName already includes an octave number (e.g., "A4", "B5")
    const hasOctave = /^[A-G]#?\d$/.test(noteName);
    const note = hasOctave ? noteName : `${noteName}${octave.value}`;

    // For Sampler (piano)
    if (instrument instanceof Tone.Sampler) {
      instrument.triggerAttack(note);
    }
    // For synths that support note-specific trigger
    else if (
      instrument instanceof Tone.PolySynth ||
      instrument instanceof Tone.Synth ||
      instrument instanceof Tone.AMSynth ||
      instrument instanceof Tone.FMSynth
    ) {
      instrument.triggerAttack(note);
    } else {
      // For percussion-like synths, just trigger with frequency
      const freq = Tone.Frequency(note).toFrequency();
      instrument.frequency.value = freq;
      instrument.triggerAttack();
    }
  } catch (error) {
    console.warn("Error starting note:", error);
  }
}

export function stopNote(noteName) {
  try {
    const instrument = getCurrentInstrument();

    // Check if noteName already includes an octave number (e.g., "A4", "B5")
    const hasOctave = /^[A-G]#?\d$/.test(noteName);
    const note = hasOctave ? noteName : `${noteName}${octave.value}`;

    // For Sampler (piano)
    if (instrument instanceof Tone.Sampler) {
      instrument.triggerRelease(note);
    } else {
      // For other instruments, just release without arguments
      instrument.triggerRelease();
    }
  } catch (error) {
    console.warn("Error stopping note:", error);
  }
}

export function decrementOctave() {
  if (octave.value > MIN_OCTAVE) octave.value--;
}

export function incrementOctave() {
  if (octave.value < MAX_OCTAVE) octave.value++;
}

export { notes, octave, MIN_OCTAVE, MAX_OCTAVE };
