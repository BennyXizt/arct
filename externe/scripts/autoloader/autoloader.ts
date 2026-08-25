import type { Autoloader } from "./types/plugin.type.js"

export async function autoloader({ loadedModules }: Autoloader) {
    const moduleNames = new Set<string>()

    for(const HTMLElement of document.querySelectorAll<HTMLElement>('*')) {
        for (const attr of HTMLElement.attributes) {
            if (!attr.name.startsWith('data-fsc-')) continue

            const moduleName = attr.name.replace('data-fsc-', '')

            if (moduleName.includes('-')) continue

            moduleNames.add(moduleName)
        }
    }    

    await Promise.all(
        [...moduleNames].map(async moduleName => {
            if (loadedModules.has(moduleName)) return

            try {
                const module = await import(
                    `~/scripts/${moduleName}/${moduleName}.ts`
                )

                loadedModules.set(moduleName, module)
            } catch (err) {
                console.warn(
                    `❌ Component "${moduleName}" failed to load`,
                    err
                )
            }
        })
    )
}