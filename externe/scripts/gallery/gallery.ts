/**
 * gallery.ts
 * Компонент ОПИСАНИЕ.
 *
 * Поддерживаемые атрибуты `data-fsc-gallery-*`:
 * - data-fsc-gallery                    — инициализирует элемент
 * - data-fsc-gallery-gallery - 
 *   - default (ОПИСАНИЕ)
 * 
*/

import { galleryOpenClick, galleryCloseClick, galleryMoveClick } from './utils/events.js'

export { galleryAutoload } from './utils/events.js'

// const intersectionOptions: IntersectionObserverInit = {rootMargin: '50px 0px 50px 0px',}

// export const galleryObserverArray                 = [galleryObserver, '[data-fsc-gallery]', intersectionOptions]
// export const galleryOnKeyUpArray                  = [galleryOnKeyUp, '[data-fsc-gallery]']
export const galleryCloseOnXClickArray          = [galleryCloseClick, '.gallery-lightbox__close']
export const galleryCloseOnOverlayClickArray    = [galleryCloseClick, '.gallery-lightbox__overlay']
export const galleryMoveClickArray              = [galleryMoveClick, '.gallery-lightbox__button']
export const galleryOpenClickArray              = [galleryOpenClick, '[data-fsc-gallery]']
// export const galleryHoverArray                    = [galleryHovered, '[data-fsc-gallery]']
// export const galleryUnhoverArray                  = [galleryUnhovered, '[data-fsc-gallery]']
// export const galleryOnResizeArray                 = [galleryOnResize, '[data-fsc-gallery]']
// export const galleryDragEventPointerMoveArray     = [galleryDragEventPointerMove, '[data-fsc-gallery]']
// export const galleryDragEventPointerUpArray       = [galleryDragEventPointerUp, '[data-fsc-gallery]']
// export const galleryScrollArray                   = [galleryScroll, window]