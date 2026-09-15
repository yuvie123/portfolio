/** Logical CSS size the OS is laid out at (4:3, like the CRT). */
export const OS_SIZE = { width: 1280, height: 960 }
export const TASKBAR_HEIGHT = 56
export const DESKTOP = { width: OS_SIZE.width, height: OS_SIZE.height - TASKBAR_HEIGHT }

export const APP_IDS = ['about', 'experience', 'projects', 'resume', 'contact', 'terminal'] as const
export type AppId = (typeof APP_IDS)[number]

export type Rect = { x: number; y: number; w: number; h: number }

export const APPS: Record<AppId, { title: string; defaultRect: Rect }> = {
  about: { title: 'About', defaultRect: { x: 200, y: 40, w: 780, h: 660 } },
  experience: { title: 'Experience', defaultRect: { x: 250, y: 70, w: 840, h: 680 } },
  projects: { title: 'Projects', defaultRect: { x: 230, y: 50, w: 880, h: 740 } },
  resume: { title: 'Resume', defaultRect: { x: 290, y: 30, w: 840, h: 800 } },
  contact: { title: 'Contact', defaultRect: { x: 360, y: 150, w: 640, h: 480 } },
  terminal: { title: 'Terminal', defaultRect: { x: 420, y: 240, w: 720, h: 500 } },
}

export function isAppId(value: string): value is AppId {
  return (APP_IDS as readonly string[]).includes(value)
}
