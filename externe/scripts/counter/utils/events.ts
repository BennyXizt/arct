import { isCounterMode, type CounterMode } from "../types/plugin.type.js"
import { CounterElementInterface } from "../types/plugin.interface.js"
import { step } from "./utils.js"


const counterElements: CounterElementInterface[] = []

export function counterAutoload() {
    const counters = document.querySelectorAll<HTMLElement>('[data-fsc-counter]')

    for(const counter of counters) {
        const finalValueAttr = counter.getAttribute('data-fsc-counter-finalvalue')

        if(!finalValueAttr) continue

        const
            modeAttr = counter.getAttribute('data-fsc-counter-mode'),
            isFinite = counter.hasAttribute('data-fsc-counter-once'),
            offsetAttr = counter.getAttribute('data-fsc-counter-offset') || '3',
            durationAttr = counter.getAttribute('data-fsc-counter-duration') || '7000',
            easing = counter.getAttribute('data-fsc-counter-easing') || '2'

        const easingObject: Record<string, (t: number) => number> = {
            // easeOutCubic — плавнее, более "тяжёлый" конец
            '1': (t) => 1 - Math.pow(1 - t, 3),
            // easeOutQuart — ещё мягче
            '2': (t) => 1 - Math.pow(1 - t, 4),
            // easeOutQuint — максимально плавное замедление
            '3': (t) => 1 - Math.pow(1 - t, 5)
        }
            
        const
            mode: CounterMode = isCounterMode(modeAttr) ? modeAttr : 'increment',
            offset =  Number.parseInt(offsetAttr),
            endValue = Number.parseFloat(finalValueAttr),
            duration = Number.parseInt(durationAttr),
            isInteger = Number.isInteger(endValue),
            startValue = Number.parseFloat(counter.innerHTML),
            floatToFixed = isInteger ? 0 : finalValueAttr.match(/\.(.+)$/)![1].length
            
        const counterElement = {
            // base
            counter,
            mode,
            duration,
            isInteger,
            floatToFixed,
            func: easingObject[easing],

            // core
            startTimestamp: null,
            startValue,
            currentValue: 0,
            lastValue: 0,
            endValue,
            offset,

            // intersection
            visible: false, 
            animationID: undefined,
            intersected: false,
            isFinite
        }

        counterElements.push(counterElement)
    }
}

export function counterObserver(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
    const 
        HTMLElement = entry.target,
        counter = counterElements.find(e => e.counter === HTMLElement)

    if (!counter) return

    counter.visible = entry.isIntersecting 

    if (counter.visible && !counter.animationID) {
        counter.intersected = true

        counter.animationID = requestAnimationFrame(
            (timestamp) => step(counter, timestamp)
        )
    } else {
        if(counter.intersected && (counter.isFinite || counter.currentValue >= counter.endValue - counter.offset) ) {
            counter.counter.textContent = counter.endValue!.toString()

            observer.unobserve(HTMLElement) 
        } else if(counter.intersected) {
            counter.currentValue = counter.endValue - counter.offset
        }

        counter.intersected = false
    }
}