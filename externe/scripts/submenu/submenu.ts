

const HTMLElements: HTMLElement[] = []

export const submenuClickArray = [submenuClick, '[data-fsc-submenu] [data-fsc-submenu-trigger]']

function submenuClick(element: HTMLElement) {
    const 
        hoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        root = element.closest<HTMLElement>('.submenu-menu')

    if(hoverSupported || !root) return
    
    HTMLElements.forEach(e => {
        if(!e.isSameNode(root) && !root.closest('.submenu-menu.active')) 
            e.classList.remove('active')
    })

    root.querySelectorAll('.submenu-menu.active').forEach(e => e.classList.remove('active'))
    
    HTMLElements.push(root)

    root.classList.toggle('active')
}