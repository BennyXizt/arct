

export function updateMainSCSS({scssDir, blockType, componentName, fs}: {
    scssDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    let fileContent: string

    const 
        data = fs.readFileSync(`${scssDir}/main.scss`, 'utf-8'),
        outputFile = `${scssDir}/main.scss`,
        startIndex = data.lastIndexOf(`// internal ${blockType} START`),
        lastIndex = data.lastIndexOf(`// internal ${blockType} END`),
        slicedText = data.slice(startIndex + `// internal ${blockType} START`.length, lastIndex).trim()
        
    if(slicedText.length == 0) {
        fileContent = 
            `
            ${data.slice(0, startIndex + `// internal ${blockType} START`.length).trim()}\n@import\n\t'./${blockType}/${componentName}';\n${data.slice(lastIndex).trim()}
            `.trim()   
    }
    else {
        fileContent = 
            `
            ${data.slice(0, startIndex + `// internal ${blockType} START`.length).trim()}\n${slicedText.slice(0, -1)},\n\t'./${blockType}/${componentName}';\n${data.slice(lastIndex).trim()}
            `.trim()   
    }
    fs.writeFileSync(outputFile, fileContent, 'utf-8')  
}

export function deleteUpdatedRecordFromMainScss({scssDir, blockType, componentName, fs}: {
    scssDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const 
        data = fs.readFileSync(`${scssDir}/main.scss`, 'utf-8'),
        targetFile = `'./${blockType}/${componentName}'`,
        outputFile = `${scssDir}/main.scss`
    
    const
        fileContent = data.replace(/@import([\s\S]*?);/g, match => {
            const items = match 
                .replace('@import', '')
                .replace(';', '')
                .split(',')
                .map(s => s.trim())
                .filter(item => !item.includes(targetFile))
            
            return items.length > 0 ? `@import\n  ${items.join(',\n  ')};` : ''
        })

    fs.writeFileSync(outputFile, fileContent, 'utf-8')  
}

export function createEJSFile({ejsDir, blockType, componentName, fs}: {
    ejsDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    let 
        ejsFileContent: string,
        formattedComponentName = componentName
    const ejsFile = `${ejsDir}/${blockType}/${componentName}.ejs`

    if(componentName.includes('-')) {
        formattedComponentName = formattedComponentName
            .split('-')
            .map((e, i) => i > 0 ? e.charAt(0).toUpperCase() + e.slice(1) : e)
            .join('')
    }

    switch(blockType) {
        case 'components': {
            ejsFileContent = 
                `<%\n` +
                `// Пример вызова в шаблоне (EJS):\n` +
                `//\n` +
                `// <\\%- include('src/ejs/components/${componentName}.ejs', { \n` +
                `//\t${componentName}_component: {\n` +
                `//\t\tthis: {\n` +
                `//\t\t\tparent: 'parentClass',\n` +
                `//\t\t\tblock: 'childBlockClass',\n` +
                `//\t\t\tclass: ['childClass'],\n` +
                `//\t\t\tid: ['childID'],\n` +
                `//\t\t\ttag: 'div',\n` +
                `//\t\t\tstyle: ['customStyle'],\n` +
                `//\t\t\tdataAttribute: ['customDataAttributes'], \n` +
                `//\t\t},\n` +
                `//\t\twrapper: {\n` +
                `//\t\t\tparent: 'wrapperParentClass',\n` +
                `//\t\t\tblock: 'wrapperChildBlockClass',\n` +
                `//\t\t\tclass: ['wrapperChildClass'],\n` +
                `//\t\t\tid: ['wrapperChildID'],\n` +
                `//\t\t\ttag: 'div',\n` +
                `//\t\t\tstyle: ['customStyle'],\n` +
                `//\t\t\tdataAttribute: ['customDataAttributes'], \n` +
                `//\t\t}\n` +
                `//\t}\n` +
                `//}) %>\n` +
                `%>\n` +

                `<%\n` +
                `\tif(typeof ${componentName}_component === 'undefined' || !${componentName}_component) {\n` +
                `\t\treturn\n` +
                `\t}\n\n` +
                `\tvar {blockClass, thisClass, thisID, thisTag, thisStyles, thisDataAttributes} = externe.setupEJSComponent({...${componentName}_component.this, componentName: '${componentName}'})\n` +
                `\tvar {isWrapper, blockClass: wrapperBlockClass, thisClass: wrapperThisClass, thisID: wrapperThisID, thisTag: wrapperThisTag, thisStyles: wrapperThisStyles, thisDataAttributes: wrapperThisDataAttributes} = externe.setupEJSComponent({...${componentName}_component.wrapper, componentName: '${componentName}'})\n\n` +
                `\tvar isWrapper = typeof ${componentName}_component.wrapper === 'object' && ${componentName}_component.wrapper\n` +
                `%>\n\n` +


                `<% if(isWrapper) { %>\n` +
                `\t<<%=wrapperThisTag%> <%-wrapperThisDataAttributes%> class='<%=wrapperThisClass%>' <%-wrapperThisID%> <%-wrapperThisStyles%>>\n` +
                `<% } %>\n` +
                `<<%=thisTag%> <%-thisDataAttributes%> class='<%=thisClass%>' <%-thisID%> <%-thisStyles%>>\n` +
                `\t<!-- HTML Here -->\n` +
                `</<%=thisTag%>>\n` +
                `<% if(isWrapper) { %>\n` +
                `\t</<%=wrapperThisTag%>>\n` +
                `<% } %>\n`
            break
        }
        case 'layout': {
            ejsFileContent = 
                `<%\n` + 
                `\tblockClass = '${componentName}'` + 
                `\n%>` +
                `\n\n<section class='layout__<%=blockClass%> <%=blockClass%>'>` +
                `\n\t<div class='<%=blockClass%>__container container'>` +
                `\n\n\t</div>\n</section>` 
            break
        }
        case 'pages': {
            ejsFileContent = 
                `<!DOCTYPE html>` +
                `\n\t<% if(typeof head_component.lang !== 'undefined' && head_component.lang) { %>` +
                `\n\t\t<html lang="<%= head_component.lang %>">` +
                `\n\t<% } else { %>` +
                `\n\t\t<html lang="en">` +
                `\n\t<% } %>` +
                `\n<head>` +
                `\n\t<%- include('src/ejs/layout/head.ejs') %>` +
                `\n</head>` +
                `\n<body>` +
                `\n\t<%- include('externe/components/content/DummyAside/DummyAside.ejs') %>` +
                `\n\t<div class="root">` +
                `\n\t\t<%- include('src/ejs/layout/header.ejs', {` +
                `\n\t\t\theader_component: {` +
                `\n\t\t\t\thomePage: false,` +
                `\n\t\t\t\tactivePage: '${componentName}'` +
                `\n\t\t\t}` +
                `\n\t\t})%>` +
                `\n\t\t<main class="layout layout--${componentName}"></main>` +
                `\n\t\t<%- include('src/ejs/layout/footer.ejs') %>` +
                `\n\t</div>` +
                `\n\t<script type="module" src="/src/ts/main.ts"></script>` +
                `\n</body>` +
                `\n</html>` 
            break
        }
        default:
            throw new Error(`Unknown blockType: ${blockType}`)
    }

    fs.mkdirSync(`${ejsDir}/${blockType}`, { recursive: true })
    fs.writeFileSync(ejsFile, ejsFileContent, 'utf-8')
}

export function createSCSSFile({scssDir, blockType, componentName, fs}: {
    scssDir: string,
    blockType: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        scssFile = `${scssDir}/${blockType}/_${componentName}.scss`,
        scssFileContent = 
        `
            @use 'sass:map';\n\n.${componentName} {\n\n}
        `.trim()

    fs.writeFileSync(scssFile, scssFileContent, 'utf-8')  
}

export function deleteFile({fileDir, blockType, componentName, extention, fs}: {
    fileDir: string,
    blockType: string,
    componentName: string,
    extention: string,
    fs: typeof import('fs')
}) {
    const file = `${fileDir}/${blockType}/${componentName}${extention}`

    fs.unlink(file, err => {
        if (err) throw err;

        console.log(`${file} удален!`)
    })
}

export function updateTestEJSFile({ejsDir, componentName, fs}: {
    ejsDir: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        data:string = fs.readFileSync(`${ejsDir}/views/test.ejs`, 'utf-8'),
        ejsFile = `${ejsDir}/views/test.ejs`,
        lastIndex = data.lastIndexOf('</section>')

    let formattedComponentName = componentName


    if(componentName.includes('-')) {
        formattedComponentName = formattedComponentName
            .split('-')
            .map((e, i) => i > 0 ? e.charAt(0).toUpperCase() + e.slice(1) : e)
            .join('')
    }

    const fileContent = 
        data.slice(0, lastIndex + '</section>'.length).trim() + '\n\t' +
        `
        <section class='${componentName}_component !mt-5'>
        <div class="outer container">
            <div class="inner">
                <h6 class="text-center">${componentName.toUpperCase()} Component</h6>
                <div class="flex items-center gap-x-2">
                    <%- include('src/ejs/components/${componentName}.ejs', {
                        ${formattedComponentName}_component: {
                            
                        }
                    })%>
                </div>
            </div>
        </div>\n\t</section>
        `.trim() + '\n\t' +
        data.slice(lastIndex + '</section>'.length).trim()

    fs.writeFileSync(ejsFile, fileContent, 'utf-8')  
}

export function deleteUpdatedRecordFromTestEJSFile({ejsDir, componentName, fs}: {
    ejsDir: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const 
        outputFile = `${ejsDir}/views/test.ejs`,
        data = fs.readFileSync(outputFile, 'utf-8'),
        regEx = /<section\b[^>]*>[\s\S]*?<\/section>\s*/g,
        fileContent = data.replace(regEx, (match) => {
            const classMatch = match.match(/class\s*=\s*["']([^"']+)["']/);

            if (!classMatch) return match;

            const classes = classMatch[1].split(/\s+/);

            return classes.includes(`${componentName}_component`) ? '' : match;
        })
        
    fs.writeFileSync(outputFile, fileContent, 'utf-8')     
    console.log(`${outputFile} очищен от ${componentName}!`)
}

export function updateMainEJSFile({ejsDir, componentName, rootPage, fs}: {
    ejsDir: string,
    componentName: string,
    rootPage: string,
    fs: typeof import('fs')
}) {
    const
        blockType = rootPage === 'index.ejs' ? 'views' : 'pages',
        ejsFile = `${ejsDir}/${blockType}/${rootPage}`,
        data:string = fs.readFileSync(ejsFile, 'utf-8'),
        lastIndex = data.lastIndexOf('</main>'),
        fileContent = 
            data.slice(0, lastIndex).trim() + '\n\t' +
            `\t\t<%- include('src/ejs/layout/${componentName}.ejs')%>\n\t\t` +
            data.slice(lastIndex).trim()
            
    fs.writeFileSync(ejsFile, fileContent, 'utf-8')  
}

export function updateHeaderEJSFile({ejsDir, componentName, fs}: {
    ejsDir: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        data:string = fs.readFileSync(`${ejsDir}/layout/header.ejs`, 'utf-8'),
        ejsFile = `${ejsDir}/layout/header.ejs`
       
    const 
        regEx = /var\s+pages\s*=\s*\[(?<pages>[\s\S]*?)\]/,
        match = data.match(regEx),
        searchedString = match ? match.groups?.pages.trim() : ''
    
    const
        newPage =  `{'href': './${componentName}', 'anchor': '${componentName[0].toUpperCase() + componentName.slice(1)}'},`,
        updatedPages = `var pages = [\n\t\t${searchedString}\n\t\t${newPage}\n\t]`,
        fileContent = data.replace(regEx, updatedPages)

    fs.writeFileSync(ejsFile, fileContent, 'utf-8') 
}

export function deleteUpdatedRecordFromHeaderEJSFile({ejsDir, componentName, fs}: {
    ejsDir: string,
    componentName: string,
    fs: typeof import('fs')
}) {
    const
        data:string = fs.readFileSync(`${ejsDir}/layout/header.ejs`, 'utf-8'),
        outputFile = `${ejsDir}/layout/header.ejs`

    const 
        regEx = /var\s+pages\s*=\s*\[(?<pages>[\s\S]*?)\]/,
        match = data.match(regEx),
        searchedString = match ? match.groups?.pages.trim() : ''

    const
        newElement = searchedString
            ?.split('},')
            .map(s => s.trim())
            .filter(e => {
                const anchor = e.match(/.*'anchor': '(?<anchor>[\s\S]*?)'/)?.groups?.anchor

                return anchor && anchor.toLowerCase() !== componentName
            })

    if(!newElement) return

    const
        updatedPages = 
            newElement?.length > 0 ? 
                `var pages = [\n\t\t${newElement?.join('},\n\t\t')}},\n\t]` :
                `var pages = []`,
        fileContent = data.replace(regEx, updatedPages)
    
    fs.writeFileSync(outputFile, fileContent, 'utf-8') 
    console.log(`${outputFile} очищен от ${componentName}!`)
}
