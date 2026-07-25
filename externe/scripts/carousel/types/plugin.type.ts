
const DIRECTIONS = [ 'left', 'right', 'top', 'bottom' ] as const

export type Direction = typeof DIRECTIONS[number]

export function isDirection(value: string | null): value is Direction {
    return value !== null && DIRECTIONS.includes(value as Direction)
}