import type { CounterMode } from "./plugin.type.js";

export interface CounterElementInterface {
    // base
    counter: HTMLElement
    mode: CounterMode
    duration: number
    isInteger: boolean
    floatToFixed: number
    func: (t: number) => number

    // core
    startTimestamp: number | null
    startValue: number
    currentValue: number
    lastValue: number
    endValue: number
    offset: number

    // intersection
    visible: boolean
    animationID: number | undefined
    intersected: boolean
    isFinite: boolean
}