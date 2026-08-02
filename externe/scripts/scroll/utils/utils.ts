import { ScrollElementInterface } from "../types/plugin.interface.js"
import type { ScrollTrigger } from "../types/plugin.type.js"

function toggleHideNeeded(trigger: ScrollTrigger, delta: number) {
    switch (trigger) {
        case 'up': {
            return delta < 0
        }
        case 'down': {
            return delta > 0
        }
        case 'both': {
            return true
        }
        default: {
            return false
        }
        
    }
}
export function autoToggleScrollVisibility(scroll: ScrollElementInterface, delta: number) {
    if (scroll.timer)
        clearTimeout(scroll.timerID)
    
    const 
        barrier = 100,
        isHideNeeded = toggleHideNeeded(scroll.trigger, delta)
        
    if(window.scrollY >= barrier) {
        if (scroll.hidden !== isHideNeeded) {
            scroll.hidden = isHideNeeded
            scroll.element.classList.toggle('scrolling', isHideNeeded)

            scroll.element.classList.remove('scrolled')
        } 

        if(!scroll.hidden && !scroll.element.classList.contains('scrolled')) {
            scroll.element.classList.add('scrolled')
        } 

        if (scroll.timer) {
            scroll.timerID = setTimeout(() => {
                if(!scroll.element.classList.contains('scrolling')) return
                
                scroll.hidden = false
                scroll.element.classList.remove('scrolling')
                scroll.element.classList.add('scrolled')
            }, scroll.timerInterval)
        }
    } else {
        scroll.hidden = false
        scroll.element.classList.remove('scrolled')
        scroll.element.classList.remove('scrolling')
    }
}

export function parallax(scroll: ScrollElementInterface) {
   const target = window.scrollY * 0.1

    scroll.offset ??= 0

    scroll.offset += (target - scroll.offset) * 0.08

    if (window.scrollY < 100) {
        scroll.offset = 0
        scroll.element.style.removeProperty('transform')
        return
    }

    console.log(window.scrollY);
    

    
    scroll.element.style.transform =
        `translate3d(0, ${scroll.offset}px, 0)`
}
