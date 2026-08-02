/**
 * scroll.ts
 * Компонент ОПИСАНИЕ.
 *
 * Поддерживаемые атрибуты `data-fsc-scroll-*`:
 * - data-fsc-scroll            — инициализирует элемент
 * - data-fsc-scroll-type       - тип поведения (По умолчанию: base)
 *   - base (стандарт)
 *   - parallax (эффект параллакса)
 * - data-fsc-scroll-trigger    - при каком скролле срабатывают события (По умолчанию: both)
 *   - both (оба)
 *   - up (вверх)
 *   - down (вниз)
 *   - none (без)
 * - data-fsc-scroll-timer      - через сколько событие после конечного скролла сработает (По умолчанию: 1000)
*/

export { scrollAutoload } from './utils/events.js'

import { scrollEventScroll } from './utils/events.js'

export const scrollScrollArray = [scrollEventScroll, window]