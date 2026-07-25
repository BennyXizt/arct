export type ClickedModule = [
    (HTMLElement: HTMLElement, event: PointerEvent) => void,
    string
]
export type ResizedModule = [
    (observer: ResizeObserverEntry) => void,
    string
]