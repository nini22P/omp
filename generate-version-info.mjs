import { readFile, writeFile } from 'node:fs/promises'

const filePath = './src/data/info.ts'

const run = async (isDev) => {
  const packageString = await readFile('./package.json', { encoding: 'utf-8' })
  const version = JSON.parse(packageString).version

  const finalVersion = isDev ? `${version}-dev` : version

  const newInfo = `const INFO = {
  version: '${finalVersion}',
  dev: ${isDev},
  buildTime: '${new Date().toISOString()}',
}

export default INFO`

  await writeFile(filePath, newInfo, { encoding: 'utf-8' })
  console.log(`Generate version info to ${filePath}`)
}

const isDev = process.argv.includes('--dev')

run(isDev).catch(err => {
  console.error('Error updating the file:', err)
})