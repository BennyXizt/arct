import { IMGFolderTranslation } from "../../../watchFolder/i18n"

export interface ConvertImage {
    file: string
    name: string
    extention: string
    outputDestination: string
    translation: IMGFolderTranslation
}