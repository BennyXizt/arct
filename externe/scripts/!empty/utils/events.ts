
// без массива
export function emptyAutoload() {}
export async function emptyOnSubmit(event: Event) {}

// экспортируются через массив
export function emptyObserver(entry: IntersectionObserverEntry, _?: IntersectionObserver) {}
export function emptyOnKeyUp(event: KeyboardEvent) {}
export function emptyOnResize(observer: ResizeObserverEntry) {}
export function emptyItemPointerClick(target: HTMLElement, _?: PointerEvent) {}
export function emptyItemClick(target: HTMLElement, _?: Event) {}
export function emptyHovered(target: HTMLElement, _?: Event) {}
export function emptyUnhovered(target: HTMLElement, _?: Event) {}
export function emptyDragEventPointerMove(event: PointerEvent) {}
export function emptyDragEventPointerUp(event: PointerEvent) {}
export function emptyScroll(event: Event) {}