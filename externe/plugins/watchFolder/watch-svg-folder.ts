import type { Plugin, ViteDevServer } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname, basename, extname } from 'path'
import fs from 'fs'
import type { SVGFolderInterface} from './types/plugin.interface.js'
import { SVGFolderTranslation } from './i18n/index.js'
import { settings as config } from '../../../template.config.js'
import { convertSVGToFile } from './utils/svg.js'

const { svg: settings } = config

export function ViteWatchSVGFolderPlugin({ relativePath, nameOfTheOutputFile, language, dummy }: SVGFolderInterface): Plugin  {
    return {
        name: 'watch-svg-folder-plugin',
        configureServer(server: ViteDevServer) {
            const 
                __filename = fileURLToPath(import.meta.url),
                __dirname = dirname(__filename),
                watchDir = resolve(__dirname, relativePath),
                translation = new SVGFolderTranslation({pluginName: 'watchSVGFolderPlugin', language})

            let result = false

            translation.pluginStart(watchDir, nameOfTheOutputFile)

            server.watcher.add(watchDir);
            server.watcher.on('add', (filePath) => {
                if(settings.excludedSVG.includes(basename(filePath, extname(filePath)) ) ) {
                    translation.newFileAdded(filePath)    
                    translation.fileHasBeenIgnored(basename(filePath))
                    return
                }
                
                if (dirname(filePath) === watchDir && !basename(filePath)?.includes(nameOfTheOutputFile) && extname(filePath) === '.svg') {
                    translation.newFileAdded(filePath)    
                        
                    setTimeout(() => {
                        try {
                            switch(settings.convertType) {
                                case 0: {
                                    result = convertSVGToFile({ watchDir, filePath, nameOfTheOutputFile, translation, relativePath, dummy})
                                    break;
                                }
                            }

                            if(result)
                                fs.unlinkSync(filePath)   
                        } catch (err) {
                            translation.errorReadingTheFile((err as Error))
                        }
                    }, 100)
                    
                    server.ws.send({ type: 'full-reload' })
                }
            })
        }
    }
}