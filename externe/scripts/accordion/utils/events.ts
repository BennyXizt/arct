import { HTMLAccordion } from "../types/plugin.interface.js"
import { clearAccordionWithAlternativeBehaviour } from "./utils.js"

const HTMLElements: HTMLAccordion[] = []

export function accordionAutoload() {
    const accordions = document.querySelectorAll('[data-fsc-accordion]') as NodeListOf<HTMLElement>

    for(const accordion of accordions) {
        const
            isHoverNeeded = accordion.hasAttribute('data-fsc-accordion-nohover') ?? true,
            behaviour = accordion?.getAttribute('data-fsc-accordion-behaviour') ?? 'default',
            media = accordion?.getAttribute('data-fsc-accordion-media-query'),
            body = accordion.querySelector('[data-fsc-accordion-body]') as HTMLElement || accordion.querySelector('.accordion__body') as HTMLElement
        
        const accordionElement = {
            accordion,
            behaviour,
            media,
            isHoverNeeded,
            body
        }
        HTMLElements.push(accordionElement)
    }
}

export function accordionClick(target: HTMLElement, _: Event) {
    const 
        HTMLAccordion = target.closest('[data-fsc-accordion]') as HTMLElement,
        HTMLElement = HTMLElements.find(e => e.accordion === HTMLAccordion)

    if(!HTMLElement) return

    const
        hoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        isHoverNeeded = HTMLElement.isHoverNeeded

    if(hoverSupported && !isHoverNeeded) return

    const
        accordion = HTMLElement.accordion,
        behaviour = HTMLElement.behaviour,
        media = HTMLElement.media,
        body = HTMLElement.body

    if((media && !window.matchMedia(`(${media})`).matches) ) return
    
    clearAccordionWithAlternativeBehaviour({ HTMLElements, accordion })
       
    accordion.toggleAttribute('data-fsc-accordion-active')
    
    if(accordion.hasAttribute('data-fsc-accordion-active')) {
        if(behaviour === 'default' || behaviour === 'alternative') {
            const clone = body!.cloneNode(true) as HTMLElement

            clone.style.cssText = 
                `
                    opacity: 1;
                    visibility: visible;
                    height: max-content;
                    max-height: unset;
                `

            accordion!.append(clone)
            const cloneHeight = window.getComputedStyle(clone).height
            clone.remove()

            body.style.maxHeight = cloneHeight
            body.style.height = 'max-content'

            // tempParticle.push(hiddenPart!)
        } else if(behaviour === 'active') {

        }
    }
    else {
        if(behaviour === 'default' || behaviour === 'alternative') {
            body.removeAttribute('style')
        }
    }
    
}