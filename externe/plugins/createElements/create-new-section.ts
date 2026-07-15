import readline from 'node:readline';
import fs from 'fs'
import { readdir } from 'fs/promises'
import { resolve } from 'path';
// @ts-ignore
import { createEJSFile, createSCSSFile, updateMainEJSFile, updateMainSCSS } from './utils/utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const 
  files = await readdir(process.cwd()),
  pages = files
    .filter(e => /^.+\.html$/.test(e))
    .map(e => `${e.slice(0, -5)}.ejs`)

const 
  questionFirstString = 
    `Выберите файл для записи (${pages.map((e, i) => {
      return i == 0 ? `${i + 1} - ${e}(По умолчанию)` : `${i + 1} - ${e}`
    }).join(', ')}): `,
  answer = await new Promise<string>(resolve => rl.question(questionFirstString, resolve)),
  page = pages[Number.parseInt(answer) - 1 || 0]

if(!page) {
  console.log(`Ошибка: Такого элемента не существует!`)
  rl.close()
}


rl.question('Придумайте название секции: ', (componentName: string) => {
  const 
    ejsDir = resolve(process.cwd(), "src/ejs"),
    scssDir = resolve(process.cwd(), "src/assets/styles"),
    blockType = 'layout'
   
    if(fs.existsSync(`${ejsDir}/${blockType}/${componentName}`)) 
    {
        console.log(`Ошибка: Секция ${componentName} уже существует!`)
        
        rl.close()
        return
    }

    createSCSSFile({scssDir, blockType, componentName, fs})
    createEJSFile({ejsDir, blockType, componentName, fs})
    updateMainSCSS({scssDir, blockType, componentName, fs})
    updateMainEJSFile({ejsDir, componentName, rootPage: page, fs})
    
    console.log(`Секция ${componentName} создана!`)
    rl.close()
})