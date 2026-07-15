import readline from 'node:readline'
import fs from 'fs'
import { resolve } from 'path'
// @ts-ignore
import { createEJSFile, createSCSSFile, updateHeaderEJSFile, updateMainSCSS } from './utils/utils'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Придумайте название страницы: ', (componentName: string) => {
  const 
    ejsDir = resolve(process.cwd(), "src/ejs"),
    scssDir = resolve(process.cwd(), "src/assets/styles"),
    blockType = 'pages'
  
  if(fs.existsSync(`${ejsDir}/${blockType}/${componentName}`)) 
  {
      console.log(`Ошибка: Страница ${componentName} уже существует!`);
      
      rl.close()
      return
  }

  createEJSFile({ejsDir, blockType, componentName, fs})
  createSCSSFile({scssDir, blockType, componentName, fs})
  updateHeaderEJSFile({ejsDir, componentName, fs})
  updateMainSCSS({scssDir, blockType, componentName, fs})

  console.log(`Страница ${componentName} создана!`)
  rl.close()
})