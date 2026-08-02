/**
 * combobox.ts
 * Компонент визульного поиска элементов из выпадющего списка.
 *
 * Поддерживаемые атрибуты `data-fsc-combobox-*`:
 * 
 * Вешать на главный элемент
 * - data-fsc-combobox-id — уникальный идентификатор элемента
 * - data-fsc-combobox-collapsed — состояние открытия
 * - data-fsc-combobox-search-type — тип поиска default (любое нахождение) | firstLetter (по первой букве)
 * - data-fsc-combobox-prestyled — включение дефолтных стилей
 *      - 'list' список ul
 *      - 'input' элемент ввода + label
 *      - 'icons' иконки dispose + close
 *      - 'all' все стили
 * 
 * Вешать не на всплывающий список
 * - data-fsc-combobox (input, svg)
 * - data-fsc-combobox-input-icon-dispose (svg)
 * - data-fsc-combobox-input-icon-close (svg)
 *  
 * Вешать на список
 * - data-fsc-combobox-item (ul -> li, ul -> li -> svg)
 * - data-fsc-combobox-p-icon (svg)
 */

import { comboboxItemPointerClick, comboboxInputPointerClick, comboboxClosePointerClick, comboboxBlankPointerClick, comboboxOnKeyUp, comboboxHovered, comboboxUnhovered } from './utils/events.js'
export { comboboxAutoload } from './utils/events.js'

export const comboboxOnKeyUpArray = [comboboxOnKeyUp, '[data-fsc-combobox] input']
export const comboboxInputPointerClickArray = [comboboxInputPointerClick, '[data-fsc-combobox] input']
export const comboboxBlankPointerClickArray = [comboboxBlankPointerClick, '[data-fsc-combobox-blank]']
export const comboboxClosePointerClickArray = [comboboxClosePointerClick, '[data-fsc-combobox-input-icon-close]']
export const comboboxItemPointerClickArray = [comboboxItemPointerClick, '[data-fsc-combobox-item]']
export const comboboxHoverArray = [comboboxHovered, '[data-fsc-combobox]']
export const comboboxUnhoverArray = [comboboxUnhovered, '[data-fsc-combobox]']