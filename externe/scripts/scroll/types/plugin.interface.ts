import type { ScrollTrigger, ScrollType } from "./plugin.type.js"

export interface ScrollElementInterface {
    element: HTMLElement
    type: ScrollType
    trigger: ScrollTrigger
    startTop: number

    // core
    scrollY: number
    hidden: boolean
    offset: number

    // intersection
    isVisible: boolean

    // timer
    timer: boolean
    timerID: undefined | ReturnType<typeof setTimeout>
    timerInterval: number
}