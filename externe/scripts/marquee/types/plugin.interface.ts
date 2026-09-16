import type { MarqueeDirection, MarqueeType } from "./plugin.type.js"

export interface MarqueeElementInterface {
    marquee: HTMLElement
    HTMLWrapper: HTMLElement | null
    HTMLList: HTMLElement
    speed: number
    type: MarqueeType
    offset: number
    direction: MarqueeDirection
    gap: number
    visible: boolean
    dimension: number
    animationID: number | undefined
}
