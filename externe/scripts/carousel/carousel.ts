/**
 * carousel.ts
 * Компонент бесшовной карусели/marquee с горизонтальным скроллом.
 *
 * Поддерживаемые атрибуты `data-fsc-carousel-*`:
 * - data-fsc-carousel                    — инициализирует элемент как карусель
 * - data-fsc-carousel-direction          — направление карусели
 * - data-fsc-carousel-interval           — тик смены слайдера
 * - data-fsc-carousel-allow-disabled     — выключить кнопку, если дальше нет доступного слайдера (default: перейти на первый слайд)
 */

import { carouselDotClick, carouselLeftClick, carouselObserver, carouselRightClick, carouselOnResize, carouselDragEventClick, carouselDragEventPointerMove, carouselDragEventPointerUp } from "./utils/events.js";
export { carouselAutoload } from "./utils/events.js";

export const carouselObserverArray = [carouselObserver, '[data-fsc-carousel]', {             
    rootMargin: '50px 0px 50px 0px',  
}]

export const carouselLeftClickArray             = [carouselLeftClick, '[data-fsc-carousel-button-left]']
export const carouselRightClickArray            = [carouselRightClick, '[data-fsc-carousel-button-right]']
export const carouselDotClickArray              = [carouselDotClick, '[data-fsc-carousel-dot]']

export const carouselOnResizeArray              = [carouselOnResize, '[data-fsc-carousel]']

export const carouselDragEventClickArray        = [carouselDragEventClick, '[data-fsc-carousel-list]']
export const carouselDragEventPointerMoveArray  = [carouselDragEventPointerMove, '[data-fsc-carousel-list]']
export const carouselDragEventPointerUpArray    = [carouselDragEventPointerUp, '[data-fsc-carousel-list]']