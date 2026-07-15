// @ts-ignore
import { SearchType } from '../types/plugin.enum'
// @ts-ignore
import type { FilterList, HTMLCombobox } from '../types/plugin.interface'
// @ts-ignore
import { actionFilterList } from './utils'
import { actionCloseComboBoxOnClick } from './utils.js'

const 
    HTMLElements: HTMLCombobox[] = [],
    // isHoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    isHoverSupported = false

let isBlankExist = false

export function comboboxAutoload() {
    const comboboxes = document.querySelectorAll<HTMLElement>('[data-fsc-combobox-id]')
    
    for(const combobox of comboboxes) {
        const   
            ul = combobox.querySelector('ul')

        if(!ul) return

        const
            list = ul.querySelectorAll('p'),
            convertedList = list ? Array.from(list) : [],
            insecureSearchType = combobox.getAttribute('data-fsc-combobox-search-type'),
            input = combobox.querySelector<HTMLInputElement>('input'),
            imgClose = combobox.querySelector<HTMLElement>("img[data-fsc-combobox-input-icon-close]")
        
        if(!input) return

        const searchType = ((el): SearchType => {
            const values = Object.values(SearchType) as string[]

            return el !== null && values.includes(el) ?
                SearchType[el as keyof typeof SearchType] : SearchType.default
        })(insecureSearchType)
        
        HTMLElements.push({
            combobox,
            originalList: convertedList,
            ul,
            input,
            searchType,
            imgClose
        })
    }
}
export function comboboxOnKeyUp(event: KeyboardEvent) {
    const   
        root = (event.target as HTMLElement).closest('[data-fsc-combobox-id]')

    const combobox = HTMLElements.find(e => e.combobox === root)

    if(!combobox) return

    const filteredList: FilterList = {
        ul: combobox.ul,
        input: combobox.input,
        searchType: combobox.searchType,
        originalList: combobox.originalList
    }
    actionFilterList(filteredList)
}
export function comboboxInputClick(target: HTMLElement, _: Event) {
    if(isHoverSupported) return

    const root = target.closest<HTMLElement>('[data-fsc-combobox-id]')

    if(!root) return

    const combobox = HTMLElements.find(e => e.combobox === root)

    if(!combobox) return
       
    if(!isBlankExist) {
        isBlankExist = true

        const windowScreenHTMLElement = document.createElement('div')

        windowScreenHTMLElement.setAttribute('data-fsc-combobox-blank', '')
        document.querySelector('body')!.append(windowScreenHTMLElement)
    }

    combobox.combobox.dataset['fscComboboxCollapsed'] = 'true'
}
export function comboboxItemClick(target: HTMLElement, _: Event) {
    const root = target.closest('[data-fsc-combobox-id]')

    if(!root) return

    const HTMLElement = HTMLElements.find(e => e.combobox === root)

    if(!HTMLElement) return
    
    if(HTMLElement.imgClose) {
        HTMLElement.imgClose.setAttribute('data-fsc-combobox-collapsed', '')
    }
    
    if(HTMLElement.input) {
        HTMLElement.input.value = target.textContent!.trim()
        HTMLElement.input.setAttribute('data-fsc-combobox-result', '')
    }

    console.log(target);
    
    
    actionCloseComboBoxOnClick(HTMLElements)
    isBlankExist = false
}
export function comboboxCloseClick(target: HTMLElement, _: Event) {
    const root = target.closest('[data-fsc-combobox-id]')

    if(!root) return

    const combobox = HTMLElements.find(e => e.combobox === root)

    if(!combobox) return
    
    combobox.input.value = ''

    actionCloseComboBoxOnClick(HTMLElements)
    isBlankExist = false
}
export function comboboxBlankClick(target: HTMLElement, _: Event) {
    actionCloseComboBoxOnClick(HTMLElements)
    isBlankExist = false
}
export function comboboxHovered(target: HTMLElement, _: Event) {
    comboboxInputClick(target, _)
}
export function comboboxUnhovered(target: HTMLElement, _: Event) {
    comboboxBlankClick(target, _)
}