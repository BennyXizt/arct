import { isScrollBehaviour, type ScrollBehaviour } from "../types/plugin.type.js"
import { getTargetY, smoothDynamicScroll } from "./utils.js"

export function scrolltoClick(target: HTMLElement, event: Event) {
    const 
        isHeaderOffsetAllowed = target.hasAttribute('data-fsc-scrollto-allow-header'),
        isHeaderOffsetAllowedWithBottom = target.hasAttribute('data-fsc-scrollto-allow-header-offset'),
        isDynamic = target.hasAttribute('data-fsc-scrollto-dynamic')
        
    if (target instanceof HTMLAnchorElement) {
        event.preventDefault()
    }

    let targetY = getTargetY(target)

    if (targetY === undefined) return

    const
        behaviourAttr = target.getAttribute('data-fsc-scrollto-behaviour'),
        offsetAttr = target.getAttribute('data-fsc-scrollto-offset') || '0'
    
    // Определяем поведение прокрутки
    const behaviour: ScrollBehaviour =
        isScrollBehaviour(behaviourAttr)
            ? behaviourAttr
            : 'smooth'

    // Считываем offset в px
    const offset = parseInt(offsetAttr, 10)

    // Получаем координаты элемента относительно документа
    const header = document.querySelector<HTMLElement>('header')

    let headerOffset = 0

    if(header && (isHeaderOffsetAllowed || isHeaderOffsetAllowedWithBottom)) {
        const headerRect = header.getBoundingClientRect()

        headerOffset = isHeaderOffsetAllowedWithBottom
                ? headerRect.bottom
                : headerRect.height
    }

    if (isDynamic && behaviour === 'smooth') {
        smoothDynamicScroll(
            target,
            offset,
            header
        )

        return
    }
    
    // применяем offset
    targetY -= offset + headerOffset

    // скроллим к рассчитанной позиции
    window.scrollTo({
        top: targetY,
        behavior: behaviour
    })
}