import { GalleryElementInterface } from "../types/plugin.interface.js"
import { createImage, moveImage } from "./utils.js"


const galleryElements: GalleryElementInterface[] = []

export function galleryAutoload() {
    const root = document.querySelector('.root')

    if(!root) return

    const galleries = document.querySelectorAll('[data-fsc-gallery]') as NodeListOf<HTMLElement>

    for(const gallery of galleries) {
        const images = gallery.querySelectorAll('img')

        const galleryElement = {
            gallery,
            images,
            image: undefined,
            index: 0,
            moveTo: undefined,
            total: images.length,
            isActive: false,
        }

        galleryElements.push(galleryElement)
    }

    const lightBox = 
    `
        <div class="gallery-lightbox">
            <div class="gallery-lightbox__overlay"></div>
            <div class="gallery-lightbox__top">
                <span class="gallery-lightbox__counter"></span>
                <button class="gallery-lightbox__close">X</button>
            </div>
            <div class="gallery-lightbox__content">
                <button data-fsc-gallery-button-left class="gallery-lightbox__button">Left</button>
                <div class="gallery-lightbox__images">
                   </div>
                <button data-fsc-gallery-button-right class="gallery-lightbox__button">Right</button>
            </div>
        </div>
    `

   root.insertAdjacentHTML("beforeend", lightBox)
    
    
}

export function galleryOpenClick(target: HTMLElement, event: Event) {
    event.preventDefault()

    const lightBox = document.querySelector<HTMLElement>('.gallery-lightbox')

    if(!lightBox) return

    const gallery = galleryElements.find(e => e.gallery === target)

    if(!gallery) return    

    if(!(event.target instanceof HTMLImageElement)) return
    
    const 
        image = event.target,
        index = [...gallery.images].indexOf(image)

    gallery.image = image.cloneNode() as HTMLImageElement
    gallery.index = index

    createImage(gallery, lightBox)

    lightBox.classList.add('active')
    lightBox.removeAttribute('inert')
    lightBox.setAttribute('data-fsc-gallery-root', `.${target.className}`)
}

export function galleryCloseClick(target: HTMLElement, _?: PointerEvent) {
    const lightBox = document.querySelector('.gallery-lightbox')

    if(!lightBox) return

    const figureHTML = lightBox.querySelector<HTMLElement>('.gallery-lightbox__figure')

    figureHTML?.remove()
    lightBox.classList.remove('active')
    lightBox.setAttribute('inert', "")
    lightBox.removeAttribute('data-fsc-gallery-root')
}

export function galleryMoveClick(target: HTMLElement, _?: PointerEvent) {
    const lightBox = target.closest<HTMLElement>('.gallery-lightbox')

    if(!lightBox) return

    const 
        selector = lightBox.getAttribute('data-fsc-gallery-root'),
        HTMLGallery = document.querySelector(`[data-fsc-gallery]${selector}`)

    const gallery = galleryElements.find(e => e.gallery === HTMLGallery)

    if(!gallery || gallery.isActive) return    

    gallery.isActive = true

    if(target.hasAttribute('data-fsc-gallery-button-right')) {
        gallery.moveTo = 'right'
        gallery.index = gallery.index === gallery.total - 1 ? 0 : gallery.index + 1
    } else {
        gallery.moveTo = 'left'
        gallery.index = gallery.index === 0 ? gallery.total - 1 : gallery.index - 1
    }

    moveImage(gallery, lightBox)
}