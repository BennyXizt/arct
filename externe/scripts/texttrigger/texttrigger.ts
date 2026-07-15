
export const texttriggerClickArray = [texttriggerClick, '[data-fsc-texttrigger]']

function texttriggerClick(text: HTMLElement) {
    const 
        header = text.closest('header'),
        menu = header?.querySelector('.menu'),
        body = text.closest('body')
  
    if(!text.classList.contains('active')) {        
        text.classList.add('active')
        menu?.classList.add('active')
        body?.classList.add('active')
    }        
    else {
        text.classList.remove('active')
        menu?.classList.remove('active')
        body?.classList.remove('active')
    }
}