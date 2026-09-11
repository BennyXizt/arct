/**
 * gallery.ts
 * Компонент ОПИСАНИЕ.
 *
 * Поддерживаемые атрибуты `data-fsc-gallery-*`:
 * - data-fsc-gallery                    — инициализирует элемент
 * - data-fsc-gallery-allow-scallable    - нужно ли вытаскиват самое огромное разрешение картинки из srcset 
 * 
*/

import { galleryOpenClick, galleryCloseClick, galleryMoveClick, galleryDownloadClick } from './utils/events.js'

export { galleryAutoload } from './utils/events.js'

export const galleryCloseOnXClickArray          = [galleryCloseClick, '.gallery-lightbox__close']
export const galleryCloseOnOverlayClickArray    = [galleryCloseClick, '.gallery-lightbox__overlay']
export const galleryMoveClickArray              = [galleryMoveClick, '.gallery-lightbox__button']
export const galleryOpenClickArray              = [galleryOpenClick, '[data-fsc-gallery]']
export const galleryDownloadClickArray          = [galleryDownloadClick, '.gallery-lightbox__download']