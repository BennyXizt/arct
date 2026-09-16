/**
 * carousel.ts
 * Компонент бесшовной карусели/marquee с горизонтальным скроллом.
 *
 * Поддерживаемые атрибуты `data-fsc-carousel-*`:
 * - data-fsc-carousel                    — инициализирует элемент как карусель
 * - data-fsc-carousel-direction          — направление карусели
 * - data-fsc-carousel-interval           — тик смены слайдера
 * - data-fsc-carousel-allow-disabled     — выключить кнопку, если дальше нет доступного слайдера (default: перейти на первый слайд)
 * - data-fsc-carousel-allow-draggable    — разрешить перетаскивание слайдов (default: нет)
 *  
 * Интерактивные HTML элементы `data-fsc-carousel-*`:
 * - data-fsc-carousel-html-interval-label — счетчик конца времени до переключения слайда
 * - data-fsc-carousel-html-interval-svg   — круг конца времени до переключения слайда
 * - data-fsc-carousel-html-counter        — текущий слайд / кол-во слайдов
 * - data-fsc-carousel-html-bullet         — интерактивный bullet
 */

import { carouselDotPointerClick, carouselLeftPointerClick, carouselObserver, carouselRightPointerClick, carouselOnResize, carouselDragEventPointerClick, carouselDragEventPointerMove, carouselDragEventPointerUp } from "./utils/events.js";
export { carouselAutoload } from "./utils/events.js";

export const carouselObserverArray = [carouselObserver, '[data-fsc-carousel]', {             
    rootMargin: '50px 0px 50px 0px',  
}]

export const carouselLeftPointerClickArray          = [carouselLeftPointerClick, '[data-fsc-carousel-button-left]']
export const carouselRighPointerClickArray          = [carouselRightPointerClick, '[data-fsc-carousel-button-right]']
export const carouselDotPointerClickArray           = [carouselDotPointerClick, '[data-fsc-carousel-dot]']

export const carouselOnResizeArray                  = [carouselOnResize, '[data-fsc-carousel]']

export const carouselDragEventPointerClickArray     = [carouselDragEventPointerClick, '[data-fsc-carousel-list]']
export const carouselDragEventPointerMoveArray      = [carouselDragEventPointerMove, '[data-fsc-carousel-list]']
export const carouselDragEventPointerUpArray        = [carouselDragEventPointerUp, '[data-fsc-carousel-list]']