
export const texttriggerClickArray = [texttriggerClick, '[data-fsc-texttrigger]']

function texttriggerClick(target: HTMLElement) {
    const header = target.closest('header')

    if(!header) return

    const
        menu = header.querySelector('.menu'),
        body = target.closest('body')

    if(!menu || !body) return
  
    if(!target.classList.contains('active')) {              
        target.classList.add('active')
        menu.classList.add('active')
        body.classList.add('active')
    }        
    else {
        target.classList.remove('active')
        menu.classList.remove('active')
        body.classList.remove('active')
    }

    menu.classList.add('is-animating')
}