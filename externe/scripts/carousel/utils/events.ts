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
            pureDirection = carousel.getAttribute('data-fsc-carousel-direction'),
            pureInterval = carousel.getAttribute('data-fsc-carousel-interval'),
            pureIsDisabledAllowed = carousel.getAttribute('data-fsc-carousel-allow-disabled'),
            buttonLeft = carousel.querySelector<HTMLElement>('[data-fsc-carousel-button-left]'),
            buttonRight = carousel.querySelector<HTMLElement>('[data-fsc-carousel-button-right]')

        const
            formattedDirection: Direction = 
                isDirection(pureDirection) ? pureDirection : 'left',
            formattedInterval: number = pureInterval ? Number.parseInt(pureInterval) : 3000,
            formattedIsDisabledAllowed = 
                pureIsDisabledAllowed === 'true' || pureIsDisabledAllowed === ''
                    ? true : false
                    

        const { dimention, offset, length } = calculateCarouselProps(carouselList)

        const carouselElement = 
            {
                // base
                carousel,
                carouselList,
                originalDirection: formattedDirection,
                direction: formattedDirection, 
                dimention, 
                offset, 
                length, 
                position: 0, 
                index: 0, 
                step: undefined, 

                // intersection
                visible: false, 
                animationID: undefined,

                // drag
                isDragging: false,
                draggingStartX: undefined,
                draggingMoveXPlusPointer: undefined,
                draggingMoveX: undefined,
                draggingIsMoved: false,

                // timer
                timerInterval: formattedInterval, 
                timerNext: undefined, 
                timerSeconds: undefined, 

                // disabled
                buttonLeft, 
                buttonRight, 
                isDisabledAllowed: formattedIsDisabledAllowed, 
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

export function carouselLeftClick(element: HTMLElement) {
    if(element.hasAttribute('disabled')) return

    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel) return
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'right'
    step(carousel)
}

export function carouselRightClick(element: HTMLElement) {
    if(element.hasAttribute('disabled')) return

    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel) return
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'left'
    step(carousel)
}

export function carouselDotClick(element: HTMLElement) {
    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const
        carousel = carouselElements.find(e => e.carousel === root),
        offset = Array.from(element.parentNode!.children).indexOf(element)

    if(!carousel) return
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'step'
    carousel.step = offset
    step(carousel)
}

export function carouselOnResize(observer: ResizeObserverEntry) {
    const carousel = carouselElements.find(e => e.carousel === observer.target)
    
    if(!carousel) return

    const { dimention, offset } = calculateCarouselProps(carousel.carouselList)

    carousel.dimention = dimention
    carousel.offset = offset
    carousel.index -= 1

    step(carousel)
}

export function carouselDragEventClick(element: HTMLElement, event: PointerEvent) {
    const root = element.closest('[data-fsc-carousel]') 

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if(!carousel) return

    carousel.isDragging = true
    carousel.draggingStartX = event.clientX
}

export function carouselDragEventPointerMove(event: PointerEvent) {
    const 
        element = event.currentTarget! as HTMLElement,
        root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)

    if (!carousel || !carousel.isDragging || carousel.draggingStartX === undefined) return

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

    if (!carousel || !carousel.isDragging) return

    if (carousel.draggingIsMoved && carousel.draggingMoveX) {
        carousel.carouselList.classList.remove('dragging')

        if (Math.abs(carousel.draggingMoveX) <= 100)  {
            carousel.carouselList.style.transform = ''

            carousel.index -= 1
        }
        else {
            carousel.timerNext = Date.now() + carousel.timerInterval

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