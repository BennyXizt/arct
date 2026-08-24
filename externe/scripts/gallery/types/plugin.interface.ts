
export interface GalleryElementInterface {
    gallery: HTMLElement
    images: NodeListOf<HTMLImageElement>
    image:  HTMLImageElement | undefined
    index: number
    moveTo: string | undefined
    total: number
    isActive: boolean
}