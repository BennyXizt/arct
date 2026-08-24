// @ts-ignore
import '@/assets/styles/main.scss'

import main from './utils/main.js'

document.fonts.ready.then(async() => {
    main()

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

        console.log(portfolioStyles);
        
    }
}