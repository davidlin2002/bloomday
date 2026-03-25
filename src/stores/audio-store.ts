import { create } from 'zustand'
import { Howl } from 'howler'

import rainSrc from '../assets/audio/rain.wav'
import birdsSrc from '../assets/audio/birds.wav'
import lofiSrc from '../assets/audio/lofi.mp3'

export interface AudioTrack {
  id: string
  label: string
  emoji: string
  src: string
}

export const TRACKS: AudioTrack[] = [
  { id: 'rain', label: '雨聲', emoji: '🌧️', src: rainSrc },
  { id: 'birds', label: '鳥鳴', emoji: '🐦', src: birdsSrc },
  { id: 'lofi', label: 'Lo-fi', emoji: '🎵', src: lofiSrc },
]

interface AudioStore {
  activeTrackId: string | null
  volume: number
  playing: boolean
  howl: Howl | null

  play: (trackId: string) => void
  stop: () => void
  toggle: (trackId: string) => void
  setVolume: (v: number) => void
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  activeTrackId: null,
  volume: parseFloat(localStorage.getItem('bloomday-volume') || '0.5'),
  playing: false,
  howl: null,

  play: (trackId) => {
    const { howl, volume } = get()
    if (howl) { howl.unload() }

    const track = TRACKS.find((t) => t.id === trackId)
    if (!track) return

    const newHowl = new Howl({
      src: [track.src],
      loop: true,
      volume,
    })
    newHowl.play()

    set({ activeTrackId: trackId, playing: true, howl: newHowl })
  },

  stop: () => {
    const { howl } = get()
    if (howl) { howl.unload() }
    set({ activeTrackId: null, playing: false, howl: null })
  },

  toggle: (trackId) => {
    const { activeTrackId, playing } = get()
    if (activeTrackId === trackId && playing) {
      get().stop()
    } else {
      get().play(trackId)
    }
  },

  setVolume: (v) => {
    const { howl } = get()
    if (howl) howl.volume(v)
    localStorage.setItem('bloomday-volume', String(v))
    set({ volume: v })
  },
}))
