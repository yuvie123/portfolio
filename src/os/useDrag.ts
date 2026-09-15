import { useRef, type PointerEvent } from 'react'

type Point = { x: number; y: number }

type DragState = {
  pointerId: number
  originX: number
  originY: number
  start: Point
  scale: number
}

/**
 * Pointer drag that works inside CSS 3D transforms: screen-pixel deltas are divided by the
 * OS root's on-screen scale so the dragged thing tracks the cursor exactly.
 */
export function useDrag(getStart: () => Point, onDrag: (x: number, y: number) => void) {
  const drag = useRef<DragState | null>(null)

  function end(event: PointerEvent<HTMLElement>) {
    if (drag.current?.pointerId !== event.pointerId) return
    drag.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return
      const root = event.currentTarget.closest<HTMLElement>('[data-os-root]')
      const scale = root ? root.getBoundingClientRect().width / root.offsetWidth : 1
      drag.current = {
        pointerId: event.pointerId,
        originX: event.clientX,
        originY: event.clientY,
        start: getStart(),
        scale: scale || 1,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      const state = drag.current
      if (!state || state.pointerId !== event.pointerId) return
      onDrag(
        state.start.x + (event.clientX - state.originX) / state.scale,
        state.start.y + (event.clientY - state.originY) / state.scale,
      )
    },
    onPointerUp: end,
    onPointerCancel: end,
  }
}
