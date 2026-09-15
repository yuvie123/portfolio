import { useSyncExternalStore } from 'react'
import { readPref, writePref } from '../lib/prefs'

// Tiny synthesized UI sounds (no audio files). Off unless the visitor turns them on.

export type SoundName = 'boot' | 'click' | 'open' | 'close'

type Tone = {
  frequency: number
  /** Glide to this frequency by the end of the tone. */
  to?: number
  start: number
  duration: number
  type?: OscillatorType
  volume?: number
}

const SOUNDS: Record<SoundName, Tone[]> = {
  boot: [
    { frequency: 440, start: 0, duration: 0.08, type: 'square', volume: 0.04 },
    { frequency: 660, start: 0.1, duration: 0.08, type: 'square', volume: 0.04 },
    { frequency: 880, start: 0.2, duration: 0.18, type: 'square', volume: 0.04 },
  ],
  click: [{ frequency: 1800, start: 0, duration: 0.025, type: 'square', volume: 0.025 }],
  open: [{ frequency: 520, to: 880, start: 0, duration: 0.09, type: 'triangle', volume: 0.06 }],
  close: [{ frequency: 700, to: 380, start: 0, duration: 0.09, type: 'triangle', volume: 0.06 }],
}

const STORAGE_KEY = 'yr-sound'
const listeners = new Set<() => void>()
let enabled = readPref(STORAGE_KEY) === 'on'
let context: AudioContext | null = null

function getContext(): AudioContext {
  // Browsers start contexts suspended until a user gesture; resume() is a no-op once running.
  context ??= new AudioContext()
  if (context.state === 'suspended') void context.resume()
  return context
}

export function setSoundEnabled(next: boolean): void {
  enabled = next
  writePref(STORAGE_KEY, next ? 'on' : 'off')
  if (next) getContext()
  listeners.forEach((listener) => listener())
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => enabled,
    () => false,
  )
}

export function playSound(name: SoundName): void {
  if (!enabled) return
  const audio = getContext()
  if (audio.state === 'closed') return

  const now = audio.currentTime
  for (const tone of SOUNDS[name]) {
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    const start = now + tone.start
    const end = start + tone.duration

    oscillator.type = tone.type ?? 'sine'
    oscillator.frequency.setValueAtTime(tone.frequency, start)
    if (tone.to) oscillator.frequency.exponentialRampToValueAtTime(tone.to, end)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(tone.volume ?? 0.05, start + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)

    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(start)
    oscillator.stop(end + 0.02)
  }
}
