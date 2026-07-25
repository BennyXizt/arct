// @ts-ignore
import '@/assets/styles/main.scss'
// @ts-ignore
import { autoloader } from '~/scripts/autoloader/autoloader'
import { ClickedModule, ResizedModule } from './types/plugin.type.js'
import { IntersectionObserverElements } from './types/plugin.interface.js'

// window.addEventListener('pointerdown', function(event) {
//     const target = event.target

//     if (!(target instanceof Element)) return
// })

document.fonts.ready.then(async() => {
    const 
        loadedModules = new Map<string, any>()

    await autoloader({loadedModules})

    const
        autoloadedModules = Array.from(loadedModules)
            .map(([k, e]) => e?.[`${k}Autoload`])
            .filter(e => typeof e === 'function')
            .forEach(func => func())

    const
        onClickedModules: ClickedModule[] = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('ClickArray'))
                    .map(([, value]) => value as ClickedModule)
            )
            
    const
        IntersectionElements: IntersectionObserverElements[] = [],
        onIntersectionModules = Object.fromEntries(
             Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}ObserverArray`] === 'object')
            .map(([k, e]) => {
                return [
                    k,
                    {
                        func: e[`${k}ObserverArray`][0],
                        elementSelector: e[`${k}ObserverArray`][1] || `[data-fsc-${k}]`,
                        options: e[`${k}ObserverArray`][2] || {}
                    }
                ]
            })
        )

    const
        onSubmitModules = Array.from(loadedModules)
            .filter(([k, e]) => typeof e[`${k}OnSubmit`] === 'function')
            .map(e => [e[0], e[1][`${e[0]}OnSubmit`]])

    const
        onResizeModules = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('OnResizeArray'))
                    .map(([, value]) => value as ResizedModule)
            )

    const
        onKeyUpModules = Array.from(loadedModules)
            .map(([k, e]) => {
                return Object.values(e).find(el => {
                    if(Array.isArray(el) && el[0].name === `${k}OnKeyUp`)
                        return true
                    
                })
            })
            .filter(e => typeof e !== 'undefined')

    const
        onHoverModules = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('HoverArray'))
                    .map(([, value]) => value)
            )

    const
        onUnhoverModules = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('UnhoverArray'))
                    .map(([, value]) => value)
            )

    const
        onPointerMoveModules = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('PointerMoveArray'))
                    .map(([, value]) => value)
            )

    const
        onPointerUpModules = Array.from(loadedModules)
            .flatMap(([_, e]) =>
                Object.entries(e)
                    .filter(([key]) => key.endsWith('PointerUpArray'))
                    .map(([, value]) => value)
            )
            
    // Click Event
    window.addEventListener('pointerdown', function(event) {
        const target = event.target

        if (!(target instanceof Element)) return

        onClickedModules.forEach(([func, query]) => {
            const 
                DOMElement: HTMLElement | null = (target as HTMLElement).closest(query)
                
            if(DOMElement)
                func(DOMElement, event)
        })
    })

    // Intersection Event
    for(const element of Object.values(onIntersectionModules)) {
        let observer: IntersectionObserver | undefined  = 
            IntersectionElements
                .find(e => JSON.stringify(e.options) === JSON.stringify(element.options) )
                ?.observer
        
        if(!observer) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const watchedModule = Array.from(entry.target.attributes)
                        .map(a => a.name)
                        .filter(name => /^data-fsc-[^-]+$/.test(name))
                        .map(name => name.slice('data-fsc-'.length))[0]
                        
                    if(onIntersectionModules[watchedModule])
                        onIntersectionModules[watchedModule].func(entry, observer)
                })
            }, element.options)

            IntersectionElements.push({
                options: element.options,
                observer
            })
        }

        document.querySelectorAll(element.elementSelector).forEach(el => observer.observe(el))
    }

    // Submit Event
    window.addEventListener('submit', function(event) {
        onSubmitModules.forEach(e => e[1](event))
    })

    // Resize Event
    const resizeFunctions = new WeakMap()

    const resizeObserver = new ResizeObserver((entries) => {
       for (const entry of entries) {
            resizeFunctions.get(entry.target)?.(entry)
        }
    })

    for (const [func, query] of Object.values(onResizeModules)) {
        document.querySelectorAll(query).forEach((el) => {
            resizeFunctions.set(el, func)
            resizeObserver.observe(el)
        })
    }
    
    // KeuUp Event
    onKeyUpModules.forEach(e => {
        if(!Array.isArray(e)) return
        
        const [func, query] = e

        const HTMLElements = document.querySelectorAll<HTMLElement>(query)

        HTMLElements.forEach(el => el.addEventListener('keyup', function(event: KeyboardEvent) {
            func(event)
        }))
    })

    // Hover Start Event
    onHoverModules.forEach(e => {
        if(!Array.isArray(e)) return

        const [func, query] = e

        const HTMLElements = document.querySelectorAll<HTMLElement>(query)

        HTMLElements.forEach(el => el.addEventListener('mouseenter', function(this, event) {
            func(this, event)
        }))
    })

    // Unhover Event
    onUnhoverModules.forEach(e => {
        if(!Array.isArray(e)) return

        const [func, query] = e

        const HTMLElements = document.querySelectorAll<HTMLElement>(query)

        HTMLElements.forEach(el => el.addEventListener('mouseleave', function(this, event) {
            func(this, event)
        }))
    })

    // PointerMove Event
    onPointerMoveModules.forEach(e => {
        if(!Array.isArray(e)) return
        
        const [func, query] = e

        const HTMLElements = document.querySelectorAll<HTMLElement>(query)

        HTMLElements.forEach(el => el.addEventListener('pointermove', function(event: PointerEvent) {
            func(event)
        }))
    })

    // PointerUp Event
    onPointerUpModules.forEach(e => {
        if(!Array.isArray(e)) return
        
        const [func, query] = e

        const HTMLElements = document.querySelectorAll<HTMLElement>(query)

        HTMLElements.forEach(el => el.addEventListener('pointerup', function(event: PointerEvent) {
            func(event)
        }))
    })

    if (process.env.NODE_ENV === 'development') {
        const 
            activeModules = [...loadedModules.keys()]
                .filter(e => e != 'dummyaside'),
            eventListeners = [...loadedModules.values()]
                .flatMap(e => Object.keys(e))
                .filter(e => !e.startsWith('dummyaside'))
            
        console.log('-- Статистика Сайта --');
        
        console.log(`Активные модули: ${activeModules}`)
        
        console.log(eventListeners);

        console.log('-- Статистика Сайта --');
    }
})