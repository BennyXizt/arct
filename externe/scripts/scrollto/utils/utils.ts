import { isScrollLogicalPosition, type ScrollLogicalPosition } from "../types/plugin.type.js"

export function smoothDynamicScroll(
    target: HTMLElement,
    offset: number,
    header: HTMLElement | null
) {
    const
        startY = window.scrollY,
        startTime = performance.now(),
        duration = 600

    const animate = (time: number) => {
        const progress = Math.min(
            (time - startTime) / duration,
            1
        )

        const eased =
            1 - Math.pow(1 - progress, 3)

        let headerOffset = 0

        if (header) {
            const rect =
                header.getBoundingClientRect()

            // Dynamic САМ решает,
            // сколько header сейчас занимает сверху
            headerOffset =
                Math.max(0, rect.bottom)
        }

        const targetY =
            getTargetY(target)

        if (targetY === undefined) return

        const finalTargetY =
            targetY -
            offset -
            headerOffset

        const currentY =
            startY +
            (finalTargetY - startY) * eased

        window.scrollTo({
            top: currentY,
            behavior: 'instant'
        })

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    }

    requestAnimationFrame(animate)
}

export function getTargetY(target: HTMLElement) {
    const destinationSelector = 
        target.getAttribute('data-fsc-scrollto-to') || 
        target.getAttribute('href') || 
        'main'

    if(destinationSelector === '#') {
        console.warn('[SCROLLTO]: Destination cannot be a', destinationSelector)
        return
    } 

    const destination = document.querySelector<HTMLElement>(destinationSelector)

    if (!destination) {
        console.warn('[SCROLLTO]: Destination not found', destinationSelector)
        return
    }

    const 
        blockAttr = target.getAttribute('data-fsc-scrollto-block')

    // Определяем вертикальное положение элемента после скролла
    const block: ScrollLogicalPosition =
        isScrollLogicalPosition(blockAttr)
            ? blockAttr
            : 'start'

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

    return targetY
}