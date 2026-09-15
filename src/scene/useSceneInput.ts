import { useEffect, useRef, type KeyboardEvent, type WheelEvent } from 'react'
import { useSceneStore } from './store'

const WHEEL_THRESHOLD = 60
const WHEEL_WINDOW_MS = 150

/**
 * Idle: click, Enter/Space, or scroll down flies into the monitor.
 * Monitor: Escape or scroll up (outside the OS) flies back to the desk.
 */
export function useSceneInput() {
  const view = useSceneStore((state) => state.view)
  const setView = useSceneStore((state) => state.setView)
  const wheel = useRef({ total: 0, lastTime: 0 })

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape' && useSceneStore.getState().view === 'monitor') setView('idle')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setView])

  const handlers = {
    onClick() {
      if (view === 'idle') setView('monitor')
    },
    onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (view !== 'idle' || event.target !== event.currentTarget) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setView('monitor')
      }
    },
    onWheel(event: WheelEvent<HTMLDivElement>) {
      // Scrolling inside the OS scrolls its windows, never the camera.
      if (event.target instanceof Element && event.target.closest('[data-os-root]')) return

      const state = wheel.current
      if (event.timeStamp - state.lastTime > WHEEL_WINDOW_MS) state.total = 0
      state.lastTime = event.timeStamp
      state.total += event.deltaY

      if (view === 'idle' && state.total > WHEEL_THRESHOLD) {
        state.total = 0
        setView('monitor')
      } else if (view === 'monitor' && state.total < -WHEEL_THRESHOLD) {
        state.total = 0
        setView('idle')
      }
    },
  }

  return { view, handlers }
}
