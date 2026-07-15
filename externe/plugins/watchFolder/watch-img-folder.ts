import type { Plugin, ViteDevServer } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname, basename, extname } from 'path'
import { IMGFolderTranslation } from './i18n'
import { convertImage, reencodeImage } from '../convertMedia'
import { IMGFolderInterface } from './types/plugin.interface'

export function ViteWatchIMGFolderPlugin({ relativePath, outputDestination, language}: IMGFolderInterface): Plugin {
    return {
        name: 'watch-img-folder-plugin',
        configureServer(server: ViteDevServer) {
            const 
                __filename = fileURLToPath(import.meta.url),
                __dirname = dirname(__filename),
                watchDir = resolve(__dirname, relativePath),
                destinationFile = resolve(__dirname, outputDestination),
                translation = new IMGFolderTranslation({pluginName: 'watchIMGFolderPlugin', language})

            const imageExtentions = [
                '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.heic', '.heif', '.webp', '.avif'
            ]

            translation.pluginStart(watchDir, destinationFile)

            server.watcher.on('add', (addedFile) => {
                const extention = extname(addedFile)

                if (dirname(addedFile) !== watchDir || !imageExtentions.includes(extention.toLowerCase())) 
                    return

                translation.newFileAdded(addedFile) 
                
                const name = basename(addedFile, extention)
                
                setTimeout(() => {
                    if(extention === '.webp' || extention === '.avif') 
                    {
                        reencodeImage({ file: addedFile, name, extention, outputDestination, translation})
                    }
                    else 
                    {
                        convertImage({ file: addedFile, name, extention, outputDestination, translation})
                    }
                }, 100)
                // server.ws.send({ type: 'full-reload' })
            })
        }
    }
}