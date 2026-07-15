import { Language } from "../types/plugin.type.js"
import { Translation } from "./Translation.js"

export class EJSFolderTranslation extends Translation {
    constructor({pluginName, language}: {pluginName: string, language?: Language}) {
        super({pluginName, language}),
            this.messages = {
                ru: {
                    ...this.messages.ru,
                    pluginStart: (watchedDirs: string[], { destinationPagesHTML, destinationRestHTML }: { destinationPagesHTML: string | undefined, destinationRestHTML: string | undefined}) =>
                        'Началось слежение за директориями ' + watchedDirs.join(', ') +
                        (destinationPagesHTML ? `\n\x1b[32m[${this.pluginName}]:\x1b[0m Итоговые Pages HTML будут записаны в ${destinationPagesHTML}` : '') +
                        (destinationRestHTML ? `\n\x1b[32m[${this.pluginName}]:\x1b[0m Остальные HTML будут записаны в ${destinationRestHTML}` : '')
                }
            }
    }
    pluginStart(watchedDirs: string[], { destinationPagesHTML, destinationRestHTML }: { destinationPagesHTML: string | undefined, destinationRestHTML: string | undefined}) {
        console.log(`\x1b[32m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginStart(watchedDirs, { destinationPagesHTML, destinationRestHTML })}`)
    }
}