import { type themeAttributes, isThemeAttribute } from "./types/plugin.type.js"

export const themetogglePointerClickArray = [themetogglePointerClick, '[data-fsc-themetoggle]']


export function themetoggleAutoload() {
    const
        local = localStorage.getItem('data-theme')
    
    if(!local) return

    const 
        root = document.querySelector('html')!

    if(isThemeAttribute(local))
        root.setAttribute('data-theme', local)
}


function themetogglePointerClick(element: HTMLElement) {
    const
        root: HTMLElement = document.querySelector('html')!,
        attr = root.getAttribute('data-theme')

    if(attr && isThemeAttribute(attr)) {
        root.removeAttribute('data-theme')
        localStorage.removeItem('data-theme')
    }
    else {
        const newAttr = 'dark'

        root.setAttribute('data-theme', newAttr)
        localStorage.setItem('data-theme', newAttr)
    }

    
}