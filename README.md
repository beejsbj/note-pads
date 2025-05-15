# Note Pads

A Vue.js application that lets you play musical notes by tapping on pads. Built with Vue 3 and Vite.

## Features

- Grid of musical note pads (C through B with sharps)
- Tap/click to play notes using Web Audio API
- Mobile-first responsive design
- Adjustable octave range (0-8)

## Preview

The app displays a grid of note pads on a deep red background. Natural notes are displayed in white, while sharp notes are displayed in blue. At the bottom, there are controls to change the octave.

## Project Setup

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Implementation Details

- Built with Vue 3 Composition API
- Uses Web Audio API for sound generation
- Responsive design works on mobile and desktop
- Component-based architecture
