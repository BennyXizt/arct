export type LoadedModule = Record<string, unknown>
export type PointerEventClickModule = [
    (HTMLElement: HTMLElement, event: PointerEvent) => void,
    string
]
export type PointerEventModule = [
    (event: PointerEvent) => void,
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
export type KeyUpEventModule = [
    (event: KeyboardEvent) => void,
    string
]
export type EventOneParamsModule = [
    (event: Event) => void,
    string | object
]
export type IntersectionHandler = (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
) => void
export type ResizeHandler = (
    entry: ResizeObserverEntry,
    observer: ResizeObserver
) => void