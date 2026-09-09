
const MODE = [ 'increment', 'decrement' ] as const

export type CounterMode = typeof MODE[number]

export function isCounterMode(value: string | null): value is CounterMode {
    return value !== null && MODE.includes(value as CounterMode)
}