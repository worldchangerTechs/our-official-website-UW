import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inputDir = path.join(root, 'images')
const outputDir = path.join(root, 'public', 'images', 'optimized')
const dataDir = path.join(root, 'src', 'data')
const targetWidths = [480, 800, 1200, 1600]
const basePath = '/unitywithin-application-page/'
const formats = { avif: { quality: 60 }, webp: { quality: 75 }, jpeg: { quality: 72 } }
const extensions = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function optimize(file) {
  const input = path.join(inputDir, file)
  const metadata = await sharp(input).metadata()
  const rotated = [5, 6, 7, 8].includes(metadata.orientation)
  const width = rotated ? metadata.height : metadata.width
  const height = rotated ? metadata.width : metadata.height
  const widths = targetWidths.filter(targetWidth => targetWidth <= width)
  if (!widths.length) widths.push(width)
  const name = path.parse(file).name
  const variants = {}

  for (const [format, options] of Object.entries(formats)) {
    variants[format] = []
    for (const variantWidth of widths) {
      const extension = format === 'jpeg' ? 'jpg' : format
      const filename = `${name}-${variantWidth}.${extension}`
      await sharp(input)
        .rotate()
        .resize({ width: variantWidth, withoutEnlargement: true })
        .toFormat(format, options)
        .toFile(path.join(outputDir, filename))
      variants[format].push({
        width: variantWidth,
        src: `${basePath}images/optimized/${encodeURIComponent(filename)}`,
      })
    }
  }

  const placeholder = await sharp(input)
    .rotate()
    .resize({ width: 20, height: 20, fit: 'inside', withoutEnlargement: true })
    .blur(8)
    .jpeg({ quality: 20 })
    .toBuffer()
  const { dominant } = await sharp(input).rotate().stats()
  const dominantColor = `#${[dominant.r, dominant.g, dominant.b]
    .map(channel => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`

  return {
    name: file,
    width,
    height,
    dominantColor,
    placeholder: `data:image/jpeg;base64,${placeholder.toString('base64')}`,
    ...variants,
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true })
  await fs.mkdir(dataDir, { recursive: true })
  const files = (await fs.readdir(inputDir, { withFileTypes: true }))
    .filter(entry => entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase()))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b))

  if (!files.length) throw new Error(`No JPG, PNG, or WebP source images found in ${inputDir}`)
  const names = new Set()
  const images = []
  for (const file of files) {
    const key = path.parse(file).name.toLowerCase()
    if (names.has(key)) throw new Error(`Duplicate output basename "${key}". Rename one of the source images.`)
    names.add(key)
    images.push(await optimize(file))
    console.log(`Optimized ${file}`)
  }
  await fs.writeFile(path.join(dataDir, 'images.json'), `${JSON.stringify(images, null, 2)}\n`)
  console.log(`Generated ${images.length} images in public/images/optimized and src/data/images.json`)
}

main().catch(error => {
  console.error('Image optimization failed:', error)
  process.exitCode = 1
})
