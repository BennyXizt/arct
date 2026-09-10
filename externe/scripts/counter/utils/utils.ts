import { CounterElementInterface } from "../types/plugin.interface.js"

export function step(counter: CounterElementInterface, timestamp: number) {
    if (!counter.visible) {
        counter.animationID = undefined

        counter.startValue = counter.currentValue
        counter.startTimestamp = null

        return
    }
    
    if (!counter.startTimestamp) counter.startTimestamp = timestamp

    const 
        progress = Math.min((timestamp - counter.startTimestamp) / counter.duration, 1),
        easedProgress = counter.func(progress)

    if(counter.mode === 'increment') {
        if(!counter.isInteger)
            counter.currentValue = Number((counter.startValue + (counter.endValue - counter.startValue) * easedProgress).toFixed(counter.floatToFixed))
        else
            counter.currentValue = Math.round(counter.startValue + (counter.endValue - counter.startValue) * easedProgress)
    } else {
        if(!counter.isInteger)
            counter.currentValue = Number((counter.startValue - (counter.startValue - counter.endValue) * easedProgress).toFixed(counter.floatToFixed))
        else
            counter.currentValue = Math.round(counter.startValue - (counter.startValue - counter.endValue) * easedProgress)
    }

    if(counter.lastValue !== counter.currentValue) {
        counter.counter.textContent = counter.currentValue!.toString()
        counter.lastValue = counter.currentValue
    }
            
    if (progress < 1 && counter.currentValue < counter.endValue) {
        counter.animationID = requestAnimationFrame(
            (timestamp) => step(counter, timestamp)
        )
    } else {
        counter.counter.removeAttribute('style')
        cancelAnimationFrame(counter.animationID!)
    }
}