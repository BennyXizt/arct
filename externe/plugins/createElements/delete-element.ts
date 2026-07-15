import readline from 'node:readline'
import fs from 'fs'
import { resolve, parse } from 'path'
import { readdir } from 'fs/promises'
// @ts-ignore
import { deleteFile, deleteUpdatedRecordFromHeaderEJSFile, deleteUpdatedRecordFromMainScss, deleteUpdatedRecordFromTestEJSFile } from './utils/utils.js'

type EJSTypes = keyof typeof types

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const 
  types = {
    'component': 'components',
    'section': 'layout',
    'page': 'pages'
  } as const,
  questionFirstString = 
    `Выберите тип элемента для удаления (${Object.keys(types).map((e, i) => {
      return i == 0 ? `${i + 1} - ${e}(По умолчанию)` : `${i + 1} - ${e}`
    }).join(', ')}): `,
  questionFirstAnswer = await new Promise<string>(resolve => rl.question(questionFirstString, resolve))


const
  componentType = Object.keys(types)[Number.parseInt(questionFirstAnswer) - 1 || 0] as EJSTypes,
  blockType = types[componentType]

if(!blockType) {
    console.log(`Ошибка: Такого элемента ${blockType} не существует!`)
    
    rl.close()
}

const 
  files = await readdir(`${process.cwd()}/src/ejs/${blockType}`),
  listOfEJSElements = files
    .filter(e => /^.+\.ejs$/.test(e))
    .map(e => parse(e).name),
  questionSecondString =
    `Выберите сам элемент (${listOfEJSElements.map((e, i) => {
      return i == 0 ? `${i + 1} - ${e}(По умолчанию)` : `${i + 1} - ${e}`
    }).join(', ')}): `
    
rl.question(questionSecondString, (answer: string) => {
  const 
    ejsDir = resolve(process.cwd(), "src/ejs"),
    scssDir = resolve(process.cwd(), "src/assets/styles"),
    componentName = listOfEJSElements[Number.parseInt(answer) - 1 || 0]
    
  deleteFile({fileDir: ejsDir, blockType, componentName, extention: '.ejs', fs})
  deleteFile({fileDir: scssDir, blockType, componentName: `_${componentName}`, extention: '.scss', fs})
  deleteUpdatedRecordFromMainScss({scssDir, blockType, componentName, fs})

  switch(blockType) {
    case 'components': {
      deleteUpdatedRecordFromTestEJSFile({ejsDir, componentName, fs})
      break
    }
    case 'pages': {
      deleteUpdatedRecordFromHeaderEJSFile({ejsDir, componentName, fs})
      break
    }
  }
  
  rl.close()
})