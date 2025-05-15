<template>
  <div
    class="pad"
    :class="{
      'is-sharp': isSharp,
      'is-highlighted': isHighlighted,
    }"
  >
    <span :class="{ sharp: isSharp }">{{ note }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
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
</script>

<style scoped>
.pad {
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
</style>
