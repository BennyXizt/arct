import { GalleryElementInterface } from "../types/plugin.interface.js"


export function createImage(gallery: GalleryElementInterface, lightBox: HTMLElement) {
    const 
        imagesHTML = lightBox.querySelector('.gallery-lightbox__images'),
        counterHTML = lightBox.querySelector('.gallery-lightbox__counter'),
        figureHTML = document.createElement('figure')

    if(!gallery.image || !imagesHTML) return

    gallery.image.removeAttribute('class')

    gallery.image.classList.add('gallery-lightbox__image')

    figureHTML.classList.add('gallery-lightbox__figure', 'current')
    figureHTML.append(gallery.image)
    imagesHTML.append(figureHTML)
    
    if(counterHTML)
        counterHTML.innerHTML = `${gallery.index + 1} / ${gallery.images.length}`
}

export function moveImage(gallery: GalleryElementInterface, lightBox: HTMLElement) {
    const 
        counterHTML = lightBox.querySelector<HTMLElement>('.gallery-lightbox__counter'),
        currFigureHTML = lightBox.querySelector<HTMLElement>('.gallery-lightbox__figure.current')!,
        nextFigureHTML = document.createElement('figure'),
        imageHTML = gallery.images[gallery.index].cloneNode() as HTMLImageElement,
        container = lightBox.querySelector<HTMLElement>('.gallery-lightbox__images')


    imageHTML.removeAttribute('class')

    imageHTML.classList.add('gallery-lightbox__image')
    
    if(gallery.moveTo === 'right') {
        currFigureHTML.classList.add('to-left')
        nextFigureHTML.classList.add('gallery-lightbox__figure', 'next-right')
    } else {
        currFigureHTML.classList.add('to-right')
        nextFigureHTML.classList.add('gallery-lightbox__figure', 'next-left')
    }

    nextFigureHTML.append(imageHTML)
    container?.insertAdjacentElement('beforeend', nextFigureHTML)

    currFigureHTML.addEventListener('transitionend', (event) => {
       if (event.propertyName !== 'transform' || !(event.currentTarget instanceof HTMLElement)) return

        event.currentTarget.remove()
    }, { once: true })

    nextFigureHTML.addEventListener('transitionend', (event) => {
        if (event.propertyName !== 'transform' || !(event.currentTarget instanceof HTMLElement)) return

        gallery.image = gallery.images[gallery.index].cloneNode() as HTMLImageElement
        gallery.moveTo = undefined
        gallery.isActive = false
        
    }, { once: true })

    requestAnimationFrame(() => {
        nextFigureHTML.classList.remove('next-right')
        nextFigureHTML.classList.remove('next-left')
        nextFigureHTML.classList.add('current')
    })
    
    if(counterHTML)
        counterHTML.innerHTML = `${gallery.index + 1} / ${gallery.images.length}`
}