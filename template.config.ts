import { convertVideo } from "./externe/plugins/convertMedia/index.js"
import { ConvertVideo } from "./externe/plugins/convertMedia/types/plugin.interface.js"
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


type Settings = {
    watcherNeeded: boolean
    videoConverter: {
        outputFormat: string
        convertVideoFunction: ({ inputFile, outputFile }: ConvertVideo) => void
    }
    svg: {
        convertType: number
        excludedSVG: string[]
        font?: {
            src?: string
            dist?: string
            css?: boolean
        }
    }
}

export const settings: Settings = {
    watcherNeeded: true,
    videoConverter: {
        outputFormat: convertVideo.toMP4scale480.extention,
        convertVideoFunction: convertVideo.toMP4scale480.function
    },
    svg: {
        font: {
            src: `${__dirname}/externe/components/media/Gallery/icons`,
            dist: `${__dirname}/externe/components/media/Gallery/icons`,
            css: true,
        },
        convertType: 0,
        excludedSVG: [
            'logo'
        ]
    }
}