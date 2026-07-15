import { MarqueeDirection } from "./plugin.type"

export interface MarqueeElementInterface {
    marquee: HTMLElement
    root: HTMLElement
    speed: number
    offset: number
    direction: MarqueeDirection
    gap: number
    visible: boolean,
    dimention: number,
    animationID: number | undefined
}
