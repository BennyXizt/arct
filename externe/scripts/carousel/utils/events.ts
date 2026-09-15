import { animate, calculateCarouselProps, renderCounter, step, toggleDotActive, toggleButtonDisabled } from "./utils.js"
import { CarouselElementInterface } from "../types/plugin.interface.js";
import { isDirection, type Direction } from "../types/plugin.type.js";

const carouselElements: CarouselElementInterface[] = []

export function carouselAutoload() {
    const carousels = document.querySelectorAll('[data-fsc-carousel]') as NodeListOf<HTMLElement>
    
    for (const carousel of carousels) {
        const 
            carouselList = carousel.querySelector<HTMLElement>('[data-fsc-carousel-list]')

        if (!carouselList || carouselList.getAttribute('data-fsc-carousel-initialized')) continue

        const
            HTMLButtonLeft = carousel.querySelector<HTMLElement>('[data-fsc-carousel-button-left]'),
            HTMLButtonRight = carousel.querySelector<HTMLElement>('[data-fsc-carousel-button-right]'),
            HTMLInterval = carousel.querySelector<HTMLElement>('[data-fsc-carousel-html-interval-label]'),
            HTMLSVGInterval = carousel.querySelector<SVGCircleElement>('[data-fsc-carousel-html-interval-svg]'),
            HTMLCounter = carousel.querySelector<HTMLElement>('[data-fsc-carousel-html-counter]')

        const
            directionAttr = carousel.getAttribute('data-fsc-carousel-direction'),
            intervalAttr = carousel.getAttribute('data-fsc-carousel-interval'),
            isDisabledAllowedAttr = carousel.getAttribute('data-fsc-carousel-allow-disabled'),
            isDraggableAllowedAttr = carousel.getAttribute('data-fsc-carousel-allow-draggable')

        const
            direction: Direction = 
                isDirection(directionAttr) ? directionAttr : 'left',
            intervalMs: number = intervalAttr ? Number.parseInt(intervalAttr) : 3000,
            isDisabledAllowed = 
                isDisabledAllowedAttr === 'true' || isDisabledAllowedAttr === ''
                    ? true : false,
            isDraggableAllowed = 
                isDraggableAllowedAttr === 'true' || isDraggableAllowedAttr === ''
                    ? true : false,
            intervalSVGLength = HTMLSVGInterval
                ? 2 * Math.PI * HTMLSVGInterval.r.baseVal.value
                : 0
                    
        if(HTMLSVGInterval) {
            HTMLSVGInterval.style.strokeDasharray = `${intervalSVGLength}`
        }

        const childrens = Array.from(
            carouselList.querySelectorAll<HTMLElement>('[data-fsc-carousel-item]')
        )

        const { dimention, offset, length } = calculateCarouselProps(childrens)

        const carouselElement = 
            {
                // base
                carousel,
                carouselList,
                childrens,
                originalDirection: direction,
                direction, 
                dimention, 
                offset, 
                length, 
                position: 0, 
                index: 0, 
                step: undefined, 
                HTMLCounter,

                // intersection
                visible: false, 
                animationID: undefined,

                // drag
                isDraggableAllowed, 
                isDragging: false,
                draggingStartX: undefined,
                draggingMoveXPlusPointer: undefined,
                draggingMoveX: undefined,
                draggingIsMoved: false,

                // interval
                intervalMs, 
                intervalNext: undefined, 
                intervalSeconds: undefined, 
                intervalSVGLength,
                HTMLInterval,
                HTMLSVGInterval,

                // disabled
                isDisabledAllowed, 
                HTMLButtonLeft, 
                HTMLButtonRight, 
            }

        carouselElements.push(carouselElement)

        renderCounter(carouselElement)
        toggleDotActive(carouselElement)
        toggleButtonDisabled(carouselElement)  

        carouselList.setAttribute('data-fsc-carousel-initialized', 'true')
    }
}

export function carouselObserver(entry: IntersectionObserverEntry, _: IntersectionObserver) {
    const carousel = carouselElements.find(e => e.carousel === entry.target)
    if (!carousel) return

    carousel.visible = entry.isIntersecting 

    if (carousel.visible && !carousel.animationID) {
        animate(carousel)
    }
}

export function carouselLeftPointerClick(element: HTMLElement) {
    if(element.hasAttribute('disabled')) return

    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel) return
    
    carousel.intervalNext = Date.now() + carousel.intervalMs
    carousel.direction = 'right'
    step(carousel)
}

export function carouselRightPointerClick(element: HTMLElement) {
    if(element.hasAttribute('disabled')) return

    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel) return
    
    carousel.intervalNext = Date.now() + carousel.intervalMs
    carousel.direction = 'left'
    step(carousel)
}

export function carouselDotPointerClick(element: HTMLElement) {
    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const
        carousel = carouselElements.find(e => e.carousel === root),
        offset = Array.from(element.parentNode!.children).indexOf(element)

    if(!carousel) return
    
    carousel.intervalNext = Date.now() + carousel.intervalMs
    carousel.direction = 'step'
    carousel.step = offset
    step(carousel)
}

export function carouselOnResize(observer: ResizeObserverEntry) {
    const carousel = carouselElements.find(e => e.carousel === observer.target)
    
    if(!carousel) return

    const { dimention, offset } = calculateCarouselProps(carousel.childrens)

    carousel.dimention = dimention
    carousel.offset = offset
    carousel.index -= 1

    step(carousel)
}

export function carouselDragEventPointerClick(element: HTMLElement, event: PointerEvent) {
    const root = element.closest('[data-fsc-carousel]') 

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel || !carousel.isDraggableAllowed) return

    carousel.isDragging = true
    carousel.draggingStartX = event.clientX
}

export function carouselDragEventPointerMove(event: PointerEvent) {
    const 
        element = event.currentTarget! as HTMLElement,
        root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if (!carousel || !carousel.isDraggableAllowed || !carousel.isDragging || carousel.draggingStartX === undefined) return

    carousel.draggingMoveX = event.clientX - carousel.draggingStartX

    if (Math.abs(carousel.draggingMoveX) <= 5)  return

    if (!carousel.draggingIsMoved) {
        carousel.carouselList.classList.add('dragging')
        carousel.draggingIsMoved = true
    } 

    carousel.carouselList.style.transform =
        `translate3d(${carousel.draggingMoveX + carousel.position}px, 0, 0)`
}

export function carouselDragEventPointerUp(event: PointerEvent) {
    const 
        element = event.currentTarget! as HTMLElement,
        root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if (!carousel || !carousel.isDraggableAllowed || !carousel.isDragging) return

    if (carousel.draggingIsMoved && carousel.draggingMoveX) {
        carousel.carouselList.classList.remove('dragging')

        if (Math.abs(carousel.draggingMoveX) <= 100)  {
            carousel.carouselList.style.transform = ''

            carousel.index -= 1
        }
        else {
            carousel.intervalNext = Date.now() + carousel.intervalMs

            if(carousel.draggingMoveX > 0) {
                carousel.direction = 'right'
            } else {
                carousel.direction = 'left'
            }
        }

        step(carousel)
    }

    carousel.isDragging = false
    carousel.draggingIsMoved = false
    carousel.draggingMoveX = undefined
}