
export interface CarouselElementInterface {
    // base
    carousel: HTMLElement
    carouselList: HTMLElement
    childrens: HTMLElement[]
    originalDirection: string
    direction: string
    dimention: number
    offset: number
    length: number
    position: number
    index: number
    step: number | undefined
    HTMLCounter: HTMLElement | null
    
    // intersection
    visible: boolean
    animationID: number | undefined

    // drag
    isDraggableAllowed: boolean
    isDragging: boolean
    draggingStartX: number | undefined
    draggingMoveX: number | undefined
    draggingIsMoved: boolean

    // interval
    intervalMs: number
    intervalNext: number | undefined
    intervalSeconds: number | undefined
    intervalSVGLength: number
    HTMLInterval: HTMLElement | null
    HTMLSVGInterval: SVGCircleElement | null

    // disabled
    isDisabledAllowed: boolean
    HTMLButtonLeft: HTMLElement | null
    HTMLButtonRight: HTMLElement | null
}