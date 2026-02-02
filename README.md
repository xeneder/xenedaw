# XeneDAW

Lightweight web DAW (Digital Audio Workstation) for game music creation, built with React, TypeScript, and Tone.js.

## Features (Phase 1 - MVP)

- ✅ **Project Management**: Create, save, and load projects
- ✅ **Track System**: Multi-track timeline with volume and pan controls
- ✅ **Transport Controls**: Play, pause, stop, tempo, and time signature
- ✅ **Theme Support**: Light and dark mode
- 🚧 **Pattern Editor**: Create and edit musical patterns
- 🚧 **Piano Roll**: MIDI note editing interface
- 🚧 **Instruments**: Waveform synthesizers, General MIDI, samplers
- 🚧 **Effects**: Reverb, Delay, and more
- 🚧 **Export**: WAV, MP3, MIDI export

## Tech Stack

- **Framework**: React 18 + TypeScript
- **State Management**: Zustand
- **Audio Engine**: Tone.js
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **Storage**: IndexedDB (idb)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── Timeline/    # Timeline and track view
│   ├── Track/       # Individual track component
│   ├── PianoRoll/   # MIDI editor
│   ├── Mixer/       # Mixing console
│   ├── Transport/   # Playback controls
│   ├── Effects/     # Audio effects
│   ├── Modals/      # Modal dialogs
│   └── UI/          # Reusable UI components
├── store/           # Zustand state stores
├── audio/           # Audio engine (Tone.js wrapper)
├── storage/         # IndexedDB storage layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
└── constants/       # Constants and presets
```

## Keyboard Shortcuts

- `Ctrl+N` - New Project
- `Ctrl+S` - Save Project
- `Ctrl+T` - Add Track
- `Space` - Play/Pause
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## Development Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and configuration
- [x] Basic UI layout
- [x] State management
- [x] Transport controls
- [x] Track system
- [ ] Pattern creation
- [ ] Piano Roll
- [ ] Basic waveform synth
- [ ] WAV export
- [ ] Project save/load

### Phase 2: Extended Features
- [ ] General MIDI instruments
- [ ] Sampler and soundfont support
- [ ] All effects (Reverb, Delay, Distortion, etc.)
- [ ] Automation
- [ ] Mixer view
- [ ] Undo/Redo system

### Phase 3: Advanced
- [ ] MIDI input support
- [ ] MP3/OGG export
- [ ] Localization
- [ ] Electron desktop app

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
