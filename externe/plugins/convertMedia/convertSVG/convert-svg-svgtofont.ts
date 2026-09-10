import svgtofont from 'svgtofont'
import { settings } from '../../../../template.config.js';

const { svg: { font } } = settings

await svgtofont({
    ...font,
    fontName: 'icons',

    startUnicode: 0xe001,

    svgicons2svgfont: {
        fontHeight: 1000,
        normalize: true,
    },
});