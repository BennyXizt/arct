
export interface CarouselElementInterface {
    // base
    carousel: HTMLElement
    carouselList: HTMLElement
    originalDirection: string
    direction: string
    dimention: number
    offset: number
    length: number
    position: number
    index: number
    step: number | undefined
    
    // intersection
    visible: boolean
    animationID: number | undefined

    // drag
    isDragging: boolean
    draggingStartX: number | undefined
    draggingMoveX: number | undefined
    draggingIsMoved: boolean

    // timer
    timerInterval: number
    timerNext: number | undefined
    timerSeconds: number | undefined

    // disabled
    buttonLeft: HTMLElement | null
    buttonRight: HTMLElement | null
    isDisabledAllowed: boolean
}