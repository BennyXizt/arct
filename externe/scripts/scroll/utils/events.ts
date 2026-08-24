import { ScrollElementInterface } from "../types/plugin.interface.js";
import { isScrollTrigger, isScrollType } from "../types/plugin.type.js";
import { toggleScrollVisibility } from "./utils.js"

const ScrollElements: ScrollElementInterface[] = []

export function scrollAutoload() {
    const HTMLElements  = document.querySelectorAll<HTMLElement>('[data-fsc-scroll]')

    for(const HTMLElement of HTMLElements) {
      
        const
            rawType = HTMLElement.getAttribute('data-fsc-scroll-type'),
            rawTrigger = HTMLElement.getAttribute('data-fsc-scroll-trigger'),
            timer = HTMLElement.hasAttribute('data-fsc-scroll-timer'),
            rawTimerInterval = HTMLElement.getAttribute('data-fsc-scroll-timer')
        

        const
            type = isScrollType(rawType) ? rawType : 'base',
            trigger = isScrollTrigger(rawTrigger) ? rawTrigger : 'both',
            timerInterval = Number.parseInt(rawTimerInterval || '1000', 10)
            
        ScrollElements.push(
            {
                element: HTMLElement,
                type,
                trigger,
                startTop: HTMLElement.offsetTop,

                // core
                scrollY: window.scrollY,
                hidden: false,
                offset: 0,

                // intersection
                isVisible: true,

                // timer
                timer,
                timerID: undefined,
                timerInterval,
            }
        )
    }
}

export function scrollEventScroll(_: Event) {
    for(const scroll of ScrollElements) {
        if(scroll.isVisible) {
            const 
                current = window.scrollY,
                delta = current - scroll.scrollY

            if (scroll.type !== 'parallax' && Math.abs(delta) < 10) continue
            
            switch (scroll.type) {
                default: {
                    toggleScrollVisibility(scroll, delta)

                    break
                }
                    
            }

            scroll.scrollY = current
        }
    }
    
}