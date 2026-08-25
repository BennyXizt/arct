// @ts-ignore
import '@/assets/styles/main.scss'
// @ts-ignore
import { autoloader } from '~/scripts/autoloader/autoloader'

import main from './utils/main.js'
import type { LoadedModule } from './types/plugin.type.js'

async function init() {
    const loadedModules = new Map<string, LoadedModule>()

    await autoloader({ loadedModules })

    main(loadedModules)
}

init()

document.addEventListener('DOMContentLoaded', () => {
    const HTMLPortfolio = document.querySelector<HTMLElement>('.portfolio__filter')

    HTMLPortfolio?.addEventListener('pointerdown', portfolioActions)

})

function portfolioActions(e: PointerEvent) {
    if (!(e.target instanceof HTMLElement)) return

    const button = e.target.closest<HTMLElement>('.portfolio__button')
    
    if(button) {
        const 
            filter = button.dataset.filter,
            portfolio = e.target.closest('.portfolio'),
            portfolioStyles = portfolio?.querySelector(':scope > style')

        if(portfolioStyles) portfolioStyles.remove()

        if(filter === 'all') return

        const styles = `
            <style>
                [data-filter-element]:not([data-filter-element='${filter}']) {
                    display: none;
                }
            </style>
        `

        portfolio?.insertAdjacentHTML('afterbegin', styles)
    }
}