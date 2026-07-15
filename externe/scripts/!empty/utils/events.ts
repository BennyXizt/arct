
// без массива
export function emptyAutoload() {}
export async function emptyOnSubmit(event: Event) {}
export function emptyOnResize({ event, isWidthResized, isHeightResized, differenceWidth, differenceHeight}) {}

// экспортируются через массив
export function emptyObserver(entry: IntersectionObserverEntry, _: IntersectionObserver) {}
export function emptyOnKeyUp(event: KeyboardEvent) {}
export function emptyItemClick(target: HTMLElement, _: Event) {}
export function emptyHovered(target: HTMLElement, _: Event) {}
export function emptyUnhovered(target: HTMLElement, _: Event) {}