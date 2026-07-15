/**
 * carousel.ts
 * Компонент бесшовной карусели/марки с горизонтальным скроллом.
 *
 * Поддерживаемые атрибуты `data-fsc-carousel-*`:
 * - data-fsc-carousel           — инициализирует элемент как карусель
 */

import { carouselDotClick, carouselLeftClick, carouselObserver, carouselRightClick } from "./utils/events.js";
export { carouselAutoload, carouselOnResize } from "./utils/events.js";

export const carouselObserverArray = [carouselObserver, '[data-fsc-carousel]', {             
    rootMargin: '50px 0px 50px 0px',  
}]

export const carouselLeftClickArray = [carouselLeftClick, '[data-fsc-carousel-button-left]']
export const carouselRightClickArray = [carouselRightClick, '[data-fsc-carousel-button-right]']
export const carouselDotClickArray = [carouselDotClick, '[data-fsc-carousel-dot]']




