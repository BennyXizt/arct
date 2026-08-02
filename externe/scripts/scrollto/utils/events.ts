import { isScrollBehaviour, isScrollLogicalPosition, type ScrollBehaviour, type ScrollLogicalPosition } from "../types/plugin.type.js"

export function scrolltoClick(target: HTMLElement, event: Event) {
    const destinationSelector = 
        target.getAttribute('data-fsc-scrollto-to') || 
        target.getAttribute('href') || 
        'main'
        
    if (target instanceof HTMLAnchorElement) {
        event.preventDefault()
    }

    if(destinationSelector === '#') {
        console.warn('[SCROLLTO]: Destination cannot be a', destinationSelector)
        return
    } 

    const
        destination = document.querySelector<HTMLElement>(destinationSelector),
        behaviourAttr = target.getAttribute('data-fsc-scrollto-behaviour'),
        blockAttr = target.getAttribute('data-fsc-scrollto-block'),
        offsetAttr = target.getAttribute('data-fsc-scrollto-offset')

    if (!destination) {
        console.warn('[SCROLLTO]: Destination not found', destinationSelector)
        return
    }
    
    // Определяем поведение прокрутки
    const behaviour: ScrollBehaviour =
        isScrollBehaviour(behaviourAttr)
            ? behaviourAttr
            : 'smooth'

    // Определяем вертикальное положение элемента после скролла
    const block: ScrollLogicalPosition =
        isScrollLogicalPosition(blockAttr)
            ? blockAttr
            : 'start'

    // Считываем offset в px
    const offset = offsetAttr ? parseInt(offsetAttr, 10) : 0

    // Получаем координаты элемента относительно документа
    const rect = destination.getBoundingClientRect()
    const elementTop = rect.top + window.pageYOffset
    const elementHeight = rect.height
    const viewportHeight = window.innerHeight

    let targetY: number

    switch (block) {
        case 'center':
            // центрируем элемент по вертикали
            targetY = elementTop - viewportHeight / 2 + elementHeight / 2
            break

        case 'end':
            // нижний край элемента у нижнего края окна
            targetY = elementTop - viewportHeight + elementHeight
            break

        case 'nearest': {
            // ближайший край к текущему положению
            const currentTop = window.pageYOffset
            const currentBottom = currentTop + viewportHeight
            const elementBottom = elementTop + elementHeight

            // если элемент полностью виден — не скроллим
            if (elementTop >= currentTop && elementBottom <= currentBottom) {
                return
            }

            const distanceToTop = Math.abs(elementTop - currentTop)
            const distanceToBottom = Math.abs(elementBottom - currentBottom)

            targetY = distanceToTop < distanceToBottom
                ? elementTop
                : elementBottom - viewportHeight
            break
        }

        case 'bottom': {
            // верхний край элемента у нижнего края окна
            targetY = elementTop - viewportHeight
            break
        }

        case 'start':
        default:
            // верхний край элемента у верхнего края окна
            targetY = elementTop
    }

    // применяем offset
    targetY -= offset

    // скроллим к рассчитанной позиции
    window.scrollTo({
        top: targetY,
        behavior: behaviour
    })
}