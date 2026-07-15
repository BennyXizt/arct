

export function starsHovered(target: HTMLElement, _: Event) {
    const root = target.closest('[data-fsc-stars]')

    if(!root) return
    
    const 
        front = root.querySelector<HTMLElement>('.stars__front')!,
        index = Number.parseInt(target.dataset.index!) + 1,
        item = root.querySelector<HTMLElement>('.stars__link')!,
        nextSibling = item.nextElementSibling!

    const width = Math.abs(item.getBoundingClientRect().left - nextSibling.getBoundingClientRect().left)
    
    front.style.width = `${width * index}px`
    
}
export function starsUnhovered(target: HTMLElement, _: Event) {
    const root = target.closest('[data-fsc-stars]')

    if(!root) return

    const front = root.querySelector<HTMLElement>('.stars__front')!

    front.removeAttribute('style')
}