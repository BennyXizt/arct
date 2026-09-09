/**
 * counter.ts
 * Компонент анимированного счетчика.
 *
 * Поддерживаемые атрибуты `data-fsc-counter-*`:
 * - data-fsc-counter — инициализирует элемент как счетчик
 * - data-fsc-counter-finalvalue — конечное значение счетчика
 * - data-fsc-counter-once — элемент будет отслеживаем лишь один раз
 * - data-fsc-counter-offset — определяет смещение от конечного значения, с которого счётчик возобновляет анимацию после выхода элемента из области видимости (по умолчанию '3')
 * - data-fsc-counter-mode — режим выполнения счетчика: 'increment' или 'decrement' (по умолчанию 'increment')
 * - data-fsc-counter-duration — длительность выполнения счетчика в мс (по умолчанию '7000')
 * - data-fsc-counter-easing — определяют, как значение изменяется во времени (по умолчанию '2' - easeOutQuart)
 */

import { counterObserver } from './utils/events.js'
export { counterAutoload } from "./utils/events.js";

export const counterObserverArray = [counterObserver, '[data-fsc-counter]']