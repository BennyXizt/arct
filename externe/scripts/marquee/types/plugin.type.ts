
const DIRECTIONS = [ 'top', 'left', 'right', 'bottom' ] as const
const TYPES = [ 'default', 'double' ] as const

export type MarqueeDirection = typeof DIRECTIONS[number]
export type MarqueeType = typeof TYPES[number]

export function isDirection(value: string | null): value is MarqueeDirection {
    return value !== null && DIRECTIONS.includes(value as MarqueeDirection)
}

export function isType(value: string | null): value is MarqueeType {
    return value !== null && TYPES.includes(value as MarqueeType)
}