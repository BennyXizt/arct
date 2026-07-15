import { Language } from "../types/plugin.type"
import { Translation } from "./Translation"

export class IMGFolderTranslation extends Translation {
    constructor({pluginName, language}: {pluginName: string, language?: Language}) {
        super({pluginName, language})
        this.messages = {
            ru: {
                ...this.messages.ru,
                pluginStart: (watchDir: string, outputDestination: string) =>
                    `Началось слежение за директорией ${watchDir}\n\x1b[33m[${this.pluginName}]:\x1b[0m Итоговые изображения будут записаны в ${outputDestination}`,
                progress: (name: string, extention: string, completed: number, total: number, percent: number) =>
                    `[${completed}/${total}] [${name}${extention}] done (${percent}%)`
            }
        }
    }
    pluginStart(watchDir: string, outputDestination: string) {
        console.log(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.pluginStart(watchDir, outputDestination)}`)
    }
    progress({name, extention, completed, total, percent}: {name: string, extention: string, completed: number, total: number, percent: number}) {
        console.log(`\x1b[33m[${this.pluginName}]:\x1b[0m ${this.messages[this.language]?.progress(name, extention, completed, total, percent)}`)
    }
}