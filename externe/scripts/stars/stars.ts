/**
 * stars.ts
 * Компонент рейтинга.
 *
 * Поддерживаемые атрибуты `data-fsc-stars-*`:
 * 
 */

// @ts-ignore
import { starsHovered, starsUnhovered } from "./utils/events"

export const starsHoverArray = [starsHovered, '[data-fsc-stars] .stars__link']
export const starsUnhoverArray = [starsUnhovered, '[data-fsc-stars] .stars__link']