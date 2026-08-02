
const 
    TYPES = ['base', 'parallax'] as const,
    TRIGGER = ['both', 'up', 'down', 'none'] as const

export type ScrollType = typeof TYPES[number]
export type ScrollTrigger = typeof TRIGGER[number]

export function isScrollType(value: string | null): value is ScrollType {
    return value !== null && TYPES.includes(value as ScrollType)
}

export function isScrollTrigger(value: string | null): value is ScrollTrigger {
    return value !== null && TRIGGER.includes(value as ScrollTrigger)
}