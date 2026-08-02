export type PointerEventModule = [
    (HTMLElement: HTMLElement, event: PointerEvent) => void,
    string
]
export type ResizeEventModule = [
    (observer: ResizeObserverEntry) => void,
    string
]
export type EventTwoParamsModule = [
    (HTMLElement: HTMLElement, event: Event) => void,
    string
]
export type EventOneParamsModule = [
    (event: Event) => void,
    string | object
]