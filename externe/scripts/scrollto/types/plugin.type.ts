
const BEHAVIOUR = [ 'auto', 'instant', 'smooth' ] as const
const POSITION = [ 'center', 'end', 'nearest', 'start', 'bottom' ] as const

export type ScrollBehaviour =  typeof BEHAVIOUR[number]
export type ScrollLogicalPosition = typeof POSITION[number]

export function isScrollBehaviour(value: string | null): value is ScrollBehaviour {
    return value !== null && BEHAVIOUR.includes(value as ScrollBehaviour)
}

export function isScrollLogicalPosition(value: string | null): value is ScrollLogicalPosition {
    return value !== null && POSITION.includes(value as ScrollLogicalPosition)
}