/**
 * marquee.ts
 * Компонент бесшовной карусели/марки с горизонтальным скроллом.
 * Экспортирует 3 параметра: [функцию, селектор слежения и опциональный объект с настройками options]
 *
 * Поддерживаемые атрибуты `data-fsc-marquee-*`:
 * - data-fsc-marquee           — инициализирует элемент как карусель
 * - data-fsc-marquee-list      — сама карусель
 * - data-fsc-marquee-speed     — скорость движения в px/сек (по умолчанию 1000)
 * - data-fsc-marquee-direction — направление движения: 'left' или 'right' (по умолчанию 'left')
 * - data-fsc-marquee-start     — начальное смещение в px (по умолчанию 0)
 * - data-fsc-marquee-item      — отдельный элемент карусели
 * - data-fsc-marquee-type      — тип копирования
 *  - default (элементы копируются в одну ленту)
 *  - double (создается еще одна лента)
 * - data-fsc-marquee-pause     — не выполнять marquee
 */

import type { MarqueeElementInterface } from "./types/plugin.interface.js"
import { isDirection, type MarqueeType, type MarqueeDirection, isType } from "./types/plugin.type.js"

const marqueeElements: MarqueeElementInterface[] = []

export function marqueeAutoload() {
    const marquees = document.querySelectorAll('[data-fsc-marquee]') as NodeListOf<HTMLElement>

    for (const marquee of marquees) {
        const HTMLList = marquee.querySelector<HTMLElement>('[data-fsc-marquee-list]')

        if (!HTMLList || marquee.getAttribute('data-fsc-marquee-initialized')) continue

        const HTMLWrapper = marquee.querySelector<HTMLElement>('[data-fsc-marquee-wrapper]')

        const
            speedAttr = marquee.getAttribute('data-fsc-marquee-speed'),
            directionAttr = marquee.getAttribute('data-fsc-marquee-direction'),
            offsetAttr = marquee.getAttribute('data-fsc-marquee-start'),
            typeAttr = marquee.getAttribute('data-fsc-marquee-type'),
            isPaused = marquee.hasAttribute('data-fsc-marquee-pause')

        const
            speed = speedAttr ? Number.parseInt(speedAttr) : 1000,
            direction: MarqueeDirection = isDirection(directionAttr) ? directionAttr : 'left',
            offset = offsetAttr ? Number.parseInt(offsetAttr) : 0,
            type: MarqueeType = isType(typeAttr) ? typeAttr : 'default'

        const gap = Number.parseFloat(getComputedStyle(HTMLList).columnGap) || 0

        const marqueeElement = {
            marquee,
            HTMLWrapper,
            HTMLList,
            type,
            gap,
            speed,
            offset,
            direction,
            dimension: 0,
            visible: false, 
            animationID: undefined,
        }

        copyElements(marqueeElement)

        marquee.setAttribute('data-fsc-marquee-initialized', 'true')

        if(isPaused) continue

        marqueeElements.push(marqueeElement)
    }
}

export function copyElements(marquee: MarqueeElementInterface) { 
    const 
        childrens = marquee.HTMLList.querySelectorAll('[data-fsc-marquee-item]'),
        childrenArray = Array.from(childrens) as HTMLElement[],
        rootWidth = marquee.HTMLList.getBoundingClientRect().width,
        maxIndex = childrens.length - 1,
        isHorizontal = marquee.direction === 'left' || marquee.direction === 'right'

    if (!childrens.length) return

    let currIndex = 0

    if(marquee.type === 'default') {
        marquee.dimension = isHorizontal ? 
                Array.from(childrens).reduce(
                    (acc, el) => acc + (el as HTMLElement).getBoundingClientRect().width,
                0) + marquee.gap * (childrens.length - 1) : 
                marquee.marquee.getBoundingClientRect().height

        while(marquee.dimension <= rootWidth) {
            const clone = childrenArray[currIndex].cloneNode(true) as HTMLElement

            clone.setAttribute('data-fsc-marquee-clone', '')
            marquee.HTMLList.appendChild(clone)

            currIndex = currIndex === maxIndex ? 0 : ++currIndex

            marquee.dimension += clone.getBoundingClientRect().width + marquee.gap
        }

        const 
            newChildrens = marquee.HTMLList.querySelectorAll('[data-fsc-marquee-item]'),
            newChildrenArray = Array.from(newChildrens) as HTMLElement[]
    
        for(const child of newChildrenArray) {
            const clone = child.cloneNode(true) as HTMLElement
            clone.setAttribute('data-fsc-marquee-clone', '')
            marquee.HTMLList.appendChild(clone)
        }
    } else if(marquee.type === 'double' && marquee.HTMLWrapper) {
        const clone = marquee.HTMLList.cloneNode(true) as HTMLElement

        clone.setAttribute('data-fsc-marquee-clone', '')
        marquee.HTMLWrapper.appendChild(clone)

        const 
            firstElement = marquee.HTMLList.querySelector<HTMLElement>('[data-fsc-marquee-item]'),
            originalRect = marquee.HTMLList.getBoundingClientRect(),
            cloneRect = clone.getBoundingClientRect()    
            
        if (firstElement) {
            marquee.gap = firstElement.getBoundingClientRect().width

            marquee.HTMLWrapper.style.columnGap = `${marquee.gap}px`
        }

        marquee.dimension = isHorizontal
            ? cloneRect.left - originalRect.left
            : cloneRect.top - originalRect.top
    }
}

export const marqueeObserverArray = [marqueeObserver, '[data-fsc-marquee]', {             
    rootMargin: '50px 0px 50px 0px',  
}]

function marqueeObserver(entry: IntersectionObserverEntry, _: IntersectionObserver) {
    const marquee = marqueeElements.find(e => e.marquee === entry.target)
    if (!marquee) return

    marquee.visible = entry.isIntersecting 

    if (marquee.visible && !marquee.animationID) {
        marquee.animationID = requestAnimationFrame(() => step(marquee))
    }
}

function step(marquee: MarqueeElementInterface) {
    if (!marquee.visible) {
        marquee.animationID = undefined
        return
    }

    const isHorizontal = marquee.direction === 'left' || marquee.direction === 'right'

    if(marquee.direction === 'left') {
        marquee.offset -= marquee.speed / 1000

        if (marquee.offset < -marquee.dimension) {
            marquee.offset = marquee.gap
        }
    }
    else if(marquee.direction === 'right') {
        marquee.offset += marquee.speed / 1000

        if (marquee.offset >= marquee.gap) {
            marquee.offset = -marquee.dimension
        }
    }
    else if(marquee.direction === 'top') {
        marquee.offset -= marquee.speed / 1000

        if (marquee.offset < -marquee.dimension) {
            marquee.offset = marquee.gap
        }
        
    }
    else if(marquee.direction === 'bottom') {
        marquee.offset += marquee.speed / 1000

        if (marquee.offset >= marquee.gap) {
            marquee.offset = -marquee.dimension
        }
    }

    if(isHorizontal) {
        if(marquee.HTMLWrapper) marquee.HTMLWrapper.style.transform = `translate3d(${marquee.offset}px, 0, 0)`
        else marquee.HTMLList.style.transform = `translate3d(${marquee.offset}px, 0, 0)`
    }
    else {
        if(marquee.HTMLWrapper) marquee.HTMLWrapper.style.transform = `translate3d(0, ${marquee.offset}px, 0)`
        else marquee.HTMLList.style.transform = `translate3d(0, ${marquee.offset}px, 0)`
    }
        
    marquee.animationID = requestAnimationFrame(() => step(marquee))
}