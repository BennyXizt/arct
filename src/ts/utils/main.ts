import type { KeyUpEventModule, EventTwoParamsModule, IntersectionHandler, LoadedModule, ResizeEventModule, ResizeHandler, EventOneParamsModule, PointerEventClickModule, PointerEventModule } from '../types/plugin.type.js'

export default (loadedModules: Map<string, LoadedModule>) => {
    const
        onClickedModules: EventTwoParamsModule[] = [],
        onPointerClickedModules: PointerEventClickModule[] = [],
        onIntersectionModules = new Map<string, {
            func: IntersectionHandler
            elementSelector: string
            options: IntersectionObserverInit
        }>(),
        onSubmitModules: ((event: SubmitEvent) => void)[] = [],
        onResizeModules: ResizeEventModule[] = [],
        onKeyUpModules: KeyUpEventModule[] = [],
        onHoverModules: EventTwoParamsModule[] = [],
        onUnhoverModules: EventTwoParamsModule[] = [],
        onPointerMoveModules: PointerEventModule[] = [],
        onPointerUpModules: PointerEventModule[] = [],
        onScrolledModules: EventOneParamsModule[] = []

    for (const [moduleName, module] of loadedModules) {
        const autoload = module[`${moduleName}Autoload`]

        // Autoload
        if (typeof autoload === 'function') {
            autoload()
        }

        for (const [key, value] of Object.entries(module)) {
            if (key.endsWith('ClickArray') && !key.endsWith('PointerClickArray')) {
                onClickedModules.push(value as EventTwoParamsModule)
            } else if(key.endsWith('PointerClickArray')) {
                onPointerClickedModules.push(value as PointerEventClickModule)
            } else if (key === `${moduleName}ObserverArray`) {
                const [func, elementSelector, options] = value as [
                    IntersectionHandler,
                    string?,
                    IntersectionObserverInit?
                ]

                onIntersectionModules.set(moduleName, {
                    func,
                    elementSelector: elementSelector || `[data-fsc-${moduleName}]`,
                    options: options || {}
                })
            } else if (key === `${moduleName}OnSubmit`) {
                onSubmitModules.push(value as (event: SubmitEvent) => void)
            } else if (key.endsWith('OnResizeArray')) {
                onResizeModules.push(value as ResizeEventModule)
            } else if (key === `${moduleName}OnKeyUp`) {
                onKeyUpModules.push(value as KeyUpEventModule)
            } else if (key.endsWith('HoverArray')) {
                onHoverModules.push(value as EventTwoParamsModule)
            } else if (key.endsWith('UnhoverArray')) {
                onUnhoverModules.push(value as EventTwoParamsModule)
            } else if (key.endsWith('PointerMoveArray')) {
                onPointerMoveModules.push(value as PointerEventModule)
            } else if (key.endsWith('PointerUpArray')) {
                onPointerUpModules.push(value as PointerEventModule)
            } else if (key.endsWith('ScrollArray')) {
                onScrolledModules.push(value as EventOneParamsModule)
            }
        }
    }
        
    // Click Event
    window.addEventListener('click', function(event) {
        const target = event.target

        if (!(target instanceof Element)) return

        onClickedModules.forEach(([func, query]) => {
            const 
                DOMElement: HTMLElement | null = (target as HTMLElement).closest(query)
                
            if(DOMElement)
                func(DOMElement, event)
        })
    })

    // PointerClick Event
    window.addEventListener('pointerdown', function(event) {
        const target = event.target

        if (!(target instanceof Element)) return

        onPointerClickedModules.forEach(([func, query]) => {
            const 
                DOMElement: HTMLElement | null = (target as HTMLElement).closest(query)
                
            if(DOMElement)
                func(DOMElement, event)
        })
    })

    // Intersection Event
    const intersectionObservers = new Map<string, {
        observer: IntersectionObserver
        handlers: WeakMap<Element, IntersectionHandler[]>
    }>()

    for (const element of onIntersectionModules.values()) {
        const key = JSON.stringify(element.options)

        let observerData = intersectionObservers.get(key)

        if (!observerData) {

            const handlers = new WeakMap<Element, IntersectionHandler[]>()

            const observer = new IntersectionObserver((entries, observer) => {

                for (const entry of entries) {

                    const elementHandlers = handlers.get(entry.target)

                    if (!elementHandlers) continue

                    for (const handler of elementHandlers) {
                        handler(entry, observer)
                    }
                }

            }, element.options)

            observerData = {
                observer,
                handlers
            }

            intersectionObservers.set(key, observerData)
        }

        document
            .querySelectorAll(element.elementSelector)
            .forEach(el => {

                const handlers =
                    observerData!.handlers.get(el) ?? []

                handlers.push(element.func)

                observerData!.handlers.set(el, handlers)

                observerData!.observer.observe(el)
            })
    }

    // Submit Event
    window.addEventListener('submit', function(event) {
        onSubmitModules.forEach(func => func(event))
    })

    // Resize Event
    const resizeFunctions = new WeakMap<Element, ResizeHandler[]>()

    const resizeObserver = new ResizeObserver((entries, observer) => {

        for (const entry of entries) {

            const handlers = resizeFunctions.get(entry.target)

            if (!handlers) continue

            for (const handler of handlers) {
                handler(entry, observer)
            }
        }
    })

    for (const [func, query] of onResizeModules) {

        document.querySelectorAll(query).forEach(el => {

            const handlers = resizeFunctions.get(el) ?? []

            handlers.push(func)

            resizeFunctions.set(el, handlers)

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

    // Scroll Event 
    const scrolledElements = new Map<EventTarget, {
        ticking: boolean
        funcs: Function[]
    }>()

    onScrolledModules.forEach(e => {
        if(!Array.isArray(e)) return
        
        const [func, query] = e

        if(typeof query === 'string') {
            const HTMLElements = document.querySelectorAll<HTMLElement>(query)

            HTMLElements.forEach(el => {
                const data = scrolledElements.get(el) ?? {
                    ticking: false,
                    funcs: []
                }

                data.funcs.push(func)

                scrolledElements.set(el, data)
            })

        } else if(query instanceof Window) {
            const data = scrolledElements.get(query) ?? {
                    ticking: false,
                    funcs: []
                }

            data.funcs.push(func)

            scrolledElements.set(query, data)
        }
        
    })
    
    scrolledElements.forEach((data, target) => {
        target.addEventListener('scroll', event => {
            if (data.ticking) return

            data.ticking = true
            
            requestAnimationFrame(() => {
                data.funcs.forEach(func => {
                    func(event)
                })

                data.ticking = false
            })
        }, {
            passive: true
        })
    })

    if (process.env.NODE_ENV === 'development') {
        const 
            activeModules = [...loadedModules.keys()]
                .filter(e => e != 'dummyaside'),
            eventListeners = [...loadedModules.values()]
                .flatMap(e => Object.keys(e))
                .filter(e => !e.startsWith('dummyaside'))
            
        console.log('-- Статистика Сайта --')
        
        console.log('Активные модули', activeModules)
        
        console.log('Всего', eventListeners)

        console.log('-- Статистика Сайта --')
    }
}