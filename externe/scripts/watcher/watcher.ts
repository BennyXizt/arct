/**
 * watcher.ts
 * Компонент Intersection Observer, позволяющий следить за появлением элемента в viewport Браузера.
 * Экспортирует 3 параметра: [функцию, селектор слежения и опциональный объект с настройками options]
 *
 * Поддерживаемые атрибуты `data-fsc-watcher-*`:
 * - data-fsc-watcher      — инициализирует элемент
 * - data-fsc-watcher-once — элемент будет отслеживаем лишь один раз
 * 
 * В scss следить за data-fsc-watcher-animation
 */

const initialized = new WeakSet<Element>()

export const watcherObserverArray = [watcherObserver, '[data-fsc-watcher]']

function watcherObserver(entry: IntersectionObserverEntry, observer: IntersectionObserver) {
  const 
    el = entry.target as HTMLElement,
    isFinite = el.hasAttribute('data-fsc-watcher-once')

  if (!initialized.has(el)) {
    initialized.add(el)

    if(entry.isIntersecting) {    
      if(isFinite) {
        el.removeAttribute('data-fsc-watcher')
        el.removeAttribute('data-fsc-watcher-once')
        observer.unobserve(el) 
      }
      return
    }
  }
  
  if(entry.isIntersecting) {    
    el.classList.add('intersected')

    if(isFinite) el.setAttribute('data-fsc-watcher-showed', '')
  }  
  else {
    if(!el.hasAttribute('data-fsc-watcher-animation'))
      el.setAttribute('data-fsc-watcher-animation', '');
    
    el.classList.remove('intersected')   

    if(isFinite && el.hasAttribute('data-fsc-watcher-showed')) {
      el.removeAttribute('data-fsc-watcher')
      el.removeAttribute('data-fsc-watcher-once')
      el.removeAttribute('data-fsc-watcher-showed')
      el.removeAttribute('data-fsc-watcher-animation')
      observer.unobserve(el) 
    }
  }
}