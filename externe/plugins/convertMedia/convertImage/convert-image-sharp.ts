import sharp from 'sharp'
import { ConvertImage } from './types/plugin.interface'

export function convertImage({ file, name, extention, outputDestination, translation }: ConvertImage) {
    const 
        image = sharp(file).rotate(),
        sizes = [
            { suffix: 'sm', width: 480, quality: 80 },
            { suffix: 'md', width: 800, quality: 75 },
            { suffix: 'lg', width: 1200, quality: 75 },
            { suffix: 'xl', width: 1600, quality: 75 },
            { suffix: '2xl', width: 2400, quality: 70 },
        ],
        tasks =  sizes.flatMap(({ suffix, width, quality }) => {
            const predefinedImage = image
                .clone()
                .resize({ width, withoutEnlargement: true })

                return [
                    predefinedImage
                        .webp({ quality: quality })
                        .toFile(`${outputDestination}/${name}-${suffix}.webp`),

                    predefinedImage
                        .avif({ quality: Math.max(quality - 20, 40) })
                        .toFile(`${outputDestination}/${name}-${suffix}.avif`),

                    predefinedImage
                        .jpeg({ quality: quality })
                        .toFile(`${outputDestination}/${name}-${suffix}.jpg`),
                ]
               
        })

    const total = tasks.length
    let completed = 0
    
    return Promise.all(
        tasks.map(e => {
            return e.then(() => {
                completed++

                const percent = Math.round((completed / total) * 100)

                translation.progress({name, extention, completed, total, percent})
            })
        })
    )
}

export function reencodeImage({ file, name, extention, outputDestination, translation }: ConvertImage) {
    const 
        image = sharp(file).rotate(),
        completed = 1,
        total = 1,
        percent = Math.round((completed / total) * 100)

    if(extention == '.webp') {
        return image
            .webp({ quality: 80 })
            .toFile(`${outputDestination}/${name}.webp`)
            .then(() => translation.progress({name, extention, completed, total, percent}))
    }
    else if(extention == '.avif') {
        return image
            .avif({ quality: 80 })
            .toFile(`${outputDestination}/${name}.avif`)
            .then(() => translation.progress({name, extention, completed, total, percent}))
    }
    
}