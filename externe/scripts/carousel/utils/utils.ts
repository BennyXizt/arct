import { CarouselElementInterface } from "../types/plugin.interface.js";

export function animate(carousel: CarouselElementInterface) {
    if (!carousel.visible) {
        carousel.animationID = undefined
        return
    }

    if(!carousel.intervalNext) {
        carousel.intervalNext = Date.now() + carousel.intervalMs
    }

    const now = Date.now()

    let remaining = carousel.intervalNext - now

    const seconds = Math.max(0, Math.ceil(remaining / 1000))

    if(remaining <= 0) {
        step(carousel)

        carousel.intervalNext = now + carousel.intervalMs
        remaining = carousel.intervalNext - Date.now()
    } else if(seconds !== carousel.intervalSeconds) {
        carousel.intervalSeconds = seconds

        renderInterval(carousel)
        renderSVGInterval(carousel)
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

    renderCounter(carousel)
    toggleDotActive(carousel)
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
        carousel.HTMLButtonLeft?.setAttribute('disabled', '')
        carousel.HTMLButtonRight?.setAttribute('disabled', '')
    } else if(carousel.index === 0 && carousel.HTMLButtonLeft) {
        carousel.HTMLButtonLeft.setAttribute('disabled', '')

        if(carousel.HTMLButtonRight && carousel.HTMLButtonRight.hasAttribute('disabled'))
            carousel.HTMLButtonRight.removeAttribute('disabled')
    } else if(carousel.index === carousel.length - 1 && carousel.HTMLButtonRight) {
        carousel.HTMLButtonRight.setAttribute('disabled', '')

        if(carousel.HTMLButtonLeft && carousel.HTMLButtonLeft.hasAttribute('disabled'))
            carousel.HTMLButtonLeft.removeAttribute('disabled')
    } else {
        if(carousel.HTMLButtonLeft && carousel.HTMLButtonLeft.hasAttribute('disabled'))
            carousel.HTMLButtonLeft.removeAttribute('disabled')
        if(carousel.HTMLButtonRight && carousel.HTMLButtonRight.hasAttribute('disabled'))
            carousel.HTMLButtonRight.removeAttribute('disabled')
    }
}

export function renderCounter(carousel: CarouselElementInterface) {
    if(!carousel.HTMLCounter) return

    const slides = carousel.carouselList.children

    carousel.HTMLCounter.innerHTML = `${carousel.index + 1} / ${slides.length}`
}

function renderInterval(carousel: CarouselElementInterface) {
    if(!carousel.HTMLInterval) return

    carousel.HTMLInterval.innerHTML = carousel.intervalSeconds!.toString()
}

function renderSVGInterval(carousel: CarouselElementInterface) {
    if(!carousel.HTMLSVGInterval) return

    const progress = carousel.intervalSeconds! / (carousel.intervalMs / 1000)

    carousel.HTMLSVGInterval.style.strokeDashoffset = `${carousel.intervalSVGLength * (1 - progress)}`
}

export function calculateCarouselProps(childrens: HTMLElement[]) {
    const length = childrens.length

    if (!length) {
        return {
            length: 0,
            offset: 0,
            dimention: 0
        }
    }

    const first = childrens[0]

    let offset = first.getBoundingClientRect().width

    if (childrens.length > 1) {
        const firstRect = first.getBoundingClientRect()
        const secondRect = childrens[1].getBoundingClientRect()

        // Расстояние от начала первого элемента
        // до начала второго учитывает width + gap + margin
        offset = secondRect.left - firstRect.left
    }

    const dimention = offset * length

    return { length, offset, dimention }
}