

export function dummyasideAutoload() {
   const 
        restFiles = (import.meta as any).glob('/externe/pages/*.html', { 
            eager: true, 
            query: '?url', 
            import: 'default'  
        }),
        pages = (import.meta as any).glob('/*.html', { 
            eager: true, 
            query: '?url', 
            import: 'default'  
        })
    
   const 
        resultRestFiles = Object.entries(restFiles)
        .map(e => {
            const  
                specialNames: { [key: string]: string } = {
                    externecomponents: 'Prebildet Components',
                    test: 'Test Page',
                    fonticons: 'Font Icons'
                },
                formattedName = e[0].match(/\/externe\/pages\/(.+)\.html$/)![1]

            return {
                name: specialNames.hasOwnProperty(formattedName.toLowerCase()) ?  specialNames[formattedName.toLowerCase()] : formattedName,
                link: e[0]
            }
        }),
        resultPages = Object.entries(pages)
        .map(e => {
            const
                specialNames: { [key: string]: string } = {
                    index: 'Main Page'
                },
                formattedName = e[0].match(/\/(.+)\.html$/)![1]

            return {
                name: specialNames.hasOwnProperty(formattedName.toLowerCase()) ?  specialNames[formattedName.toLowerCase()] : formattedName,
                link: formattedName.toLowerCase() === 'index' ? '/' : e[0]
            }
        })
    
    const 
        divPages = document.createElement('div'),
        ulPages = document.createElement('ul'),
        divRestFiles = document.createElement('div'),
        ulRestFiles = document.createElement('h6')

    resultPages.forEach(e =>{
        ulPages.innerHTML += 
        `
            <li class="dummy__element">
                <a class="dummy__link" href='${e.link}' tabindex="-1">${e.name[0].toUpperCase() + e.name.slice(1)}</a>
            </li>
        `
    })
    resultRestFiles.forEach(e =>{
        ulRestFiles.innerHTML += 
        `
            <li class="dummy__element">
                <a class="dummy__link" href='${e.link}' tabindex="-1">${e.name[0].toUpperCase() + e.name.slice(1)}</a>
            </li>
        `
    })

    divPages.classList.add('dummy__navigation')
    divPages.innerHTML = '<h6 class="dummy__title">Pages</h6>'
    ulPages.classList.add('dummy__list')
    divPages.append(ulPages)

    divRestFiles.classList.add('dummy__navigation')
    divRestFiles.innerHTML = '<h6 class="dummy__title">Rest Files</h6>'
    ulRestFiles.classList.add('dummy__list')
    divRestFiles.append(ulRestFiles)
    
    document.querySelector('[data-fsc-dummyaside]')?.append(divPages)
    document.querySelector('[data-fsc-dummyaside]')?.append(divRestFiles)
    
}