import { isThemeAttribute } from "./types/plugin.type.js"

export const themetogglePointerClickArray = [themetogglePointerClick, '[data-fsc-themetoggle]']


export function themetoggleAutoload() {
    document.documentElement.removeAttribute('data-pre-themetoggle')
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