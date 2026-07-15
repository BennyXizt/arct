/**
 * accordion.ts
 * Компонент раскрытия внутрянки при наведении на заголовок.
 *
 * Поддерживаемые атрибуты `data-fsc-accordion-*`:
 * 
 * Аттрибуты для вешания на html-элементы
 * data-fsc-accordion-summary - Заголовок
 * data-fsc-accordion-body - Скрытая внутрянка
 * data-fsc-accordion-touch - Элемент, при нажатии которого откроется скрытая внутрянка (если хавер не доступен)
 * 
 * Аттрибуты настройки
 * data-fsc-accordion-nohover - Скрипт выполняется даже с доступным хавером
 * data-fsc-accordion-active - Accordion активен
 * data-fsc-accordion-behaviour - 
 *   - default (каждый Accordion закрывается независимо друг от друга)
 *   - alternative (Одновременно может быть открытым лишь один Accordion)
 *   - active (изначально активен)
 * data-fsc-accordion-media-query - С какого момента активен Accordion
*/


export { accordionAutoload } from './utils/events.js'

import { accordionClick } from "./utils/events.js";

export const accordionClickArray = [accordionClick, '[data-fsc-accordion-touch]']