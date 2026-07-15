const themeArray = ['dark'] as const

export type themeAttributes = typeof themeArray[number]

export const isThemeAttribute = (value: unknown): value is themeAttributes => {
    return themeArray.includes(value as themeAttributes)
}