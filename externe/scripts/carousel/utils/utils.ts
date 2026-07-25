import { CarouselElementInterface } from "../types/plugin.interface.js";

export function animate(carousel: CarouselElementInterface) {
    if (!carousel.visible) {
        carousel.animationID = undefined
        return
    }

    if(!carousel.timerNext) {
        carousel.timerNext = Date.now() + carousel.timerInterval
    }

    const now = Date.now()

    let remaining = carousel.timerNext - now

    const seconds = Math.max(0, Math.ceil(remaining / 1000))

   if(remaining <= 0) {
        step(carousel)

        carousel.timerNext = now + carousel.timerInterval
        remaining = carousel.timerNext - Date.now()

    } else if(seconds !== carousel.timerSeconds) {
        carousel.timerSeconds = seconds
        
        renderTimer(carousel)
    } 

    carousel.animationID = requestAnimationFrame(() => animate(carousel))
}
export function step(carousel: CarouselElementInterface) {
    if(carousel.direction == 'left') {
        if(carousel.index < carousel.length - 1) {
            carousel.position = -(carousel.index + 1) * carousel.offset
            carousel.index++
        } else {
            carousel.position = 0
            carousel.index = 0
        }
    } else if(carousel.direction == 'right') {
        if(carousel.index > 0) {
            carousel.position = -(carousel.index - 1) * carousel.offset
            carousel.index--
        } else {
            carousel.position = -(carousel.length - 1) * carousel.offset
            carousel.index = carousel.length - 1
        }
    } else if(carousel.direction == 'step') {
        carousel.position = -carousel.offset * carousel.step!
        carousel.index = carousel.step!
        
        carousel.step = undefined
    }

    if(carousel.direction !== carousel.originalDirection) carousel.direction = carousel.originalDirection

    toggleDotActive(carousel)
    renderCounter(carousel)
    toggleButtonDisabled(carousel)

    carousel.carouselList.style.transform = `translate3d(${carousel.position}px, 0, 0)`
}

export function toggleDotActive(carousel: CarouselElementInterface) {
    const 
        slides = carousel.carouselList.children,
        slide = Array.from(slides)[carousel.index] as HTMLElement,
        dotsHTML = carousel.carousel.querySelector('[data-fsc-carousel-dots]')

    if(!dotsHTML) return
        
    const
        dots = dotsHTML.children,
        dot = Array.from(dots)[carousel.index]

    for (var item of [...slides, ...dots]) {
        item.classList.remove('active')
    }

    slide.classList.toggle('active')
    dot.classList.toggle('active')

    carousel.carouselList.style.height = `${slide.offsetHeight}px`
}

export function toggleButtonDisabled(carousel: CarouselElementInterface) {
    if(!carousel.isDisabledAllowed) return

    if(carousel.index === 0 && carousel.length === 1) {
        carousel.buttonLeft?.setAttribute('disabled', '')
        carousel.buttonRight?.setAttribute('disabled', '')
    } else if(carousel.index === 0 && carousel.buttonLeft) {
        carousel.buttonLeft.setAttribute('disabled', '')

        if(carousel.buttonRight && carousel.buttonRight.hasAttribute('disabled'))
            carousel.buttonRight.removeAttribute('disabled')
    } else if(carousel.index === carousel.length - 1 && carousel.buttonRight) {
        carousel.buttonRight.setAttribute('disabled', '')

        if(carousel.buttonLeft && carousel.buttonLeft.hasAttribute('disabled'))
            carousel.buttonLeft.removeAttribute('disabled')
    } else {
        if(carousel.buttonLeft && carousel.buttonLeft.hasAttribute('disabled'))
            carousel.buttonLeft.removeAttribute('disabled')
        if(carousel.buttonRight && carousel.buttonRight.hasAttribute('disabled'))
            carousel.buttonRight.removeAttribute('disabled')
    }
}

export function renderCounter(carousel: CarouselElementInterface) {
    const
        element = carousel.carousel.querySelector('[data-fsc-carousel-counter]')
   
    if(!element) return

    const
        slides = carousel.carouselList.children

    element.innerHTML = `${carousel.index + 1} / ${slides.length}`
}

function renderTimer(carousel: CarouselElementInterface) {
    const
        element = carousel.carousel.querySelector('[data-fsc-carousel-timer]')
   
    if(!element) return

    element.innerHTML = carousel.timerSeconds!.toString()
}

export function calculateCarouselProps(carouselList: HTMLElement) {
    const
        childrens = carouselList.querySelectorAll('[data-fsc-carousel-item]')

    const
        length: number = childrens.length,
        offset: number = childrens[0].getBoundingClientRect().width,
        dimention: number = offset * length

    return { length, offset, dimention }
}