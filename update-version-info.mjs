import { readFile, writeFile } from 'node:fs/promises'

const filePath = './src/data/info.ts'

const update = async () => {

  const packageString = await readFile('./package.json', { encoding: 'utf-8' })
  const version = JSON.parse(packageString).version

  const info = await readFile(filePath, { encoding: 'utf-8' })
  const newInfo = info
    .replace(/version: '.*'/, `version: '${version}'`)
    .replace(/buildTime: '.*'/, `buildTime: '${new Date().toISOString()}'`)

  await writeFile(filePath, newInfo, { encoding: 'utf-8' })

}

update()