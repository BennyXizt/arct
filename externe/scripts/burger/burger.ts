let isActive = false
let handler: ((this: HTMLElement, event: AnimationEvent) => void) | undefined = undefined

export const burgerClickArray = [burgerClick, '[data-fsc-burger]']

function burgerClick(target: HTMLElement) {
    if(isActive || !target) return

    const header = target.closest('header')

    if(!header) return

    const
        menu = header.querySelector('.menu'),
        body = target.closest('body')

    if(!menu || !body) return

   isActive = true
  
    if(!target.classList.contains('active')) {  
        handler = function(this: HTMLElement, event:AnimationEvent) {
            handleTransition.call(this, event, (menu as HTMLElement))
        }          
        target.addEventListener('animationend', handler)
        target.classList.add('active')
        menu.classList.add('is-animating')
        menu.classList.add('active')
        body.classList.add('active')
    }        
    else {
        target.classList.add('reverse')
        target.classList.remove('active')
        menu.classList.remove('active')
        body.classList.remove('active')
    }
}

function handleTransition(this: HTMLElement, {animationName}: {animationName: string}, menu: HTMLElement) {   
    if(animationName.startsWith('burger-active-rotate-bottom')) isActive = false
    else if(animationName.startsWith('burger-reverse-opacity-middle'))  {
        this.removeEventListener('animationend', handler!)
        this.classList.remove('active', 'reverse')
        menu.classList.remove('is-animating')
        isActive = false
    }             
}