import { animate, calculateCarouselProps, renderCounter, step, toggleDotActive } from "./utils.js"
import { CarouselElementInterface } from "../types/plugin.interface.js";

const carouselElements: CarouselElementInterface[] = []

export function carouselAutoload() {
    const carousels = document.querySelectorAll('[data-fsc-carousel]') as NodeListOf<HTMLElement>
    
    for (const carousel of carousels) {
        const 
            carouselList = carousel.querySelector<HTMLElement>('[data-fsc-carousel-list]')

        if (!carouselList || carouselList.getAttribute('data-fsc-carousel-initialized')) continue

        const
            direction = carousel.getAttribute('data-fsc-carousel-direction') ?? 'left',
            interval = carousel.getAttribute('data-fsc-carousel-interval') ?
                parseInt(carousel.getAttribute('data-fsc-carousel-interval')!) : 3000

        const { dimention, offset, length } = calculateCarouselProps(carouselList)

        const carouselElement = 
            {carousel, carouselList, originalDirection: direction, direction, dimention, offset, length, position: 0, index: 0, timerInterval: interval, timerNext: undefined, timerSeconds: undefined, step: undefined, visible: false, animationID: undefined}

        carouselElements.push(carouselElement)

        renderCounter(carouselElement)
        toggleDotActive(carouselElement)

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
    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const 
        carousel = carouselElements.find(e => e.carousel === root)
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'right'
    step(carousel)
}

export function carouselRightClick(element: HTMLElement) {
    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const carousel = carouselElements.find(e => e.carousel === root)
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'left'
    step(carousel)
}

export function carouselDotClick(element: HTMLElement) {
    const root = element.closest('[data-fsc-carousel]')

    if(!root) return

    const
        carousel = carouselElements.find(e => e.carousel === root),
        offset = Array.from(element.parentNode.children).indexOf(element)
    
    carousel.timerNext = Date.now() + carousel.timerInterval
    carousel.direction = 'step'
    carousel.step = offset
    step(carousel)
}

export function carouselOnResize({ isHeightResized }) {
    if(isHeightResized) return

    for (const carousel of carouselElements) {
        const { dimention, offset } = calculateCarouselProps(carousel.carouselList)

        carousel.dimention = dimention
        carousel.offset = offset
    }
}