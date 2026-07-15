// @ts-ignore
import { SearchType } from '../types/plugin.enum'
// @ts-ignore
import type { FilterList } from '../types/plugin.interface'
import { HTMLCombobox } from '../types/plugin.interface.js'

export function actionFilterList( { ul, input, searchType, originalList }: FilterList) {    
    const searchTerm = input && input.value.trim().toLowerCase()
    
    const filteredList = originalList
        .filter(e => {
            if(searchType == SearchType.firstLetter) 
                return e.textContent?.trim()?.toLowerCase()?.startsWith(searchTerm!)
            else if(searchType == SearchType.default) 
                return e.textContent?.trim()?.toLowerCase()?.includes(searchTerm!)
        })
        .map(e => {
            const 
                value = e.textContent

            let span: string | undefined = ''

            if(searchType == SearchType.firstLetter) 
                span = value?.replace(new RegExp(searchTerm!, "i"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            else if(searchType == SearchType.default) 
                span = value?.replace(new RegExp(searchTerm!, "ig"), match => {
                    return `<span data-fsc-combobox-highlited>${match}</span>`
                })
            
            return {
                span,
                svg: e.querySelector('.combobox__p-icon-wrapper')
            }
            
        })

    ul.innerHTML = ''
    filteredList.forEach(e => {
        ul.insertAdjacentHTML('beforeend',
            `<li data-fsc-combobox-item>
                <p>
                    ${e.span}
                    ${e.svg?.outerHTML ?? ''}
                </p>
            </li>`
        )
    })     
}

export function actionCloseComboBoxOnClick(HTMLElements: HTMLCombobox[]) {
    HTMLElements.forEach((HTMLElement) => {
        HTMLElement.combobox.dataset['fscComboboxCollapsed'] = 'false'
    }) 
    
    document.querySelector('[data-fsc-combobox-blank]')?.remove()
}