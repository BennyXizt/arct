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
 */

import { MarqueeElementInterface } from "./types/plugin.interface"
import type { MarqueeDirection } from "./types/plugin.type"

const marqueeElements: MarqueeElementInterface[] = []

export function marqueeAutoload() {
    const marquees = document.querySelectorAll('[data-fsc-marquee]') as NodeListOf<HTMLElement>

    for (const marquee of marquees) {
        const 
            root = marquee.querySelector<HTMLElement>('[data-fsc-marquee-list]')

        if (!root || root.getAttribute('data-fsc-marquee-initialized')) continue

        const
            speed = marquee.getAttribute('data-fsc-marquee-speed') ? parseInt(marquee.getAttribute('data-fsc-marquee-speed')!) : 1000,
            direction = marquee.getAttribute('data-fsc-marquee-direction'),
            offset = marquee.getAttribute('data-fsc-marquee-start') ? parseInt(marquee.getAttribute('data-fsc-marquee-start')!) : 0,
            childrens = root.querySelectorAll('[data-fsc-marquee-item]'),
            gap = Number.parseFloat(getComputedStyle(root).columnGap)

        const
            typisiertDirection: MarqueeDirection = 
                direction === 'left' || direction === 'right' || direction === 'top' || direction === 'bottom'
                    ? direction : 'left',
            isHorizontal = typisiertDirection === 'left' || typisiertDirection === 'right'
        
        if(isHorizontal) {
            let childrensWidth = Array.from(childrens).reduce(
                (acc, el) => acc + (el as HTMLElement).getBoundingClientRect().width,
            0) + gap * (childrens.length - 1)

            const 
                childrenArray = Array.from(childrens) as HTMLElement[],
                rootWidth = root.getBoundingClientRect().width,
                maxIndex = childrens.length - 1

            let currIndex = 0
            while(childrensWidth <= rootWidth) {
                const clone = childrenArray[currIndex].cloneNode(true) as HTMLElement
                clone.setAttribute('data-fsc-marquee-clone', '')
                root.appendChild(clone)

                currIndex = currIndex === maxIndex ? 0 : ++currIndex

                childrensWidth += clone.getBoundingClientRect().width + gap
            }

            const 
                newChildrens = root.querySelectorAll('[data-fsc-marquee-item]'),
                newChildrenArray = Array.from(newChildrens) as HTMLElement[]
            
            for(const child of newChildrenArray) {
                const clone = child.cloneNode(true) as HTMLElement
                clone.setAttribute('data-fsc-marquee-clone', '')
                root.appendChild(clone)
            }

            marqueeElements.push({marquee, root, dimention: childrensWidth, gap, speed, offset, direction: typisiertDirection, visible: false, animationID: undefined})

        }
        else {
            const childrensHeight = marquee.getBoundingClientRect().height
            marqueeElements.push({marquee, root, dimention: childrensHeight, gap, speed, offset, direction: typisiertDirection, visible: false, animationID: undefined})

        }
        
        root.setAttribute('data-fsc-marquee-initialized', 'true')
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

        if (marquee.offset < -marquee.dimention) {
            marquee.offset = marquee.gap
        }
    }
    else if(marquee.direction === 'right') {
        marquee.offset += marquee.speed / 1000

        if (marquee.offset >= marquee.gap) {
            marquee.offset = -marquee.dimention
        }
    }
    else if(marquee.direction === 'top') {
        marquee.offset -= marquee.speed / 1000

        if (marquee.offset < -marquee.dimention) {
            marquee.offset = marquee.gap
        }
        
    }
    else if(marquee.direction === 'bottom') {
        marquee.offset += marquee.speed / 1000

        if (marquee.offset >= marquee.gap) {
            marquee.offset = -marquee.dimention
        }
    }

    if(isHorizontal) {
        marquee.root.style.transform = `translate3d(${marquee.offset}px, 0, 0)`
    }
    else {
        marquee.root.style.transform = `translate3d(0, ${marquee.offset}px, 0)`
    }
        
    marquee.animationID = requestAnimationFrame(() => step(marquee))
}