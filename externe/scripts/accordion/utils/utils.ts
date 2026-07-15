
import { HTMLAccordion } from "../types/plugin.interface.js"

export function clearAccordionWithAlternativeBehaviour({HTMLElements, accordion}: { HTMLElements: HTMLAccordion[], accordion: HTMLElement }) {
    HTMLElements
        .filter(HTMLElement => HTMLElement.behaviour === 'alternative')
        .forEach(HTMLElement => {
            if(HTMLElement.body.hasAttribute('style'))
                HTMLElement.body.removeAttribute('style')
            if(!HTMLElement.accordion.isSameNode(accordion) && HTMLElement.accordion.hasAttribute('data-fsc-accordion-active') )
                HTMLElement.accordion.removeAttribute('data-fsc-accordion-active')            
        })
}