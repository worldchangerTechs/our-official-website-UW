const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

const IMAGES_DIR = path.join(__dirname, 'images')
const OUTPUT_DIR = path.join(IMAGES_DIR, 'optimized')
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'images.json')

const TARGET_WIDTHS = [480, 800, 1200, 1600]
const QUALITIES = { avif: 60, webp: 75, jpeg: 72 }
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

function getOrientedDimensions(metadata) {
  const isRotated = [5, 6, 7, 8].includes(metadata.orientation)
  return {
    width: isRotated ? metadata.height : metadata.width,
    height: isRotated ? metadata.width : metadata.height,
  }
}

async function optimizeImage(file) {
  const filePath = path.join(IMAGES_DIR, file)
  const baseName = path.parse(file).name
  const metadata = await sharp(filePath).metadata()
  const { width, height } = getOrientedDimensions(metadata)
  const widths = TARGET_WIDTHS.filter(targetWidth => targetWidth <= width)

  if (widths.length === 0) {
    widths.push(width)
  }

  for (const format of Object.keys(QUALITIES)) {
    for (const outputWidth of widths) {
      const outputPath = path.join(OUTPUT_DIR, `${baseName}-${outputWidth}.${format === 'jpeg' ? 'jpg' : format}`)
      await sharp(filePath)
        .rotate()
        .resize({ width: outputWidth, withoutEnlargement: true })
        [format]({ quality: QUALITIES[format] })
        .toFile(outputPath)
    }
  }

  const placeholder = await sharp(filePath)
    .rotate()
    .resize({ width: 20, height: 20, fit: 'inside', withoutEnlargement: true })
    .blur(10)
    .jpeg({ quality: 20 })
    .toBuffer()

  const { dominant } = await sharp(filePath).stats()
  const dominantColor = `#${[dominant.r, dominant.g, dominant.b]
    .map(channel => channel.toString(16).padStart(2, '0'))
    .join('')}`

  return {
    name: file,
    width,
    height,
    dominantColor,
    placeholder: `data:image/jpeg;base64,${placeholder.toString('base64')}`,
    ...Object.fromEntries(
      Object.keys(QUALITIES).map(format => [
        format,
        widths.map(outputWidth => ({
          width: outputWidth,
          src: `/images/optimized/${encodeURIComponent(baseName)}-${outputWidth}.${format === 'jpeg' ? 'jpg' : format}`,
        })),
      ]),
    ),
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.mkdir(DATA_DIR, { recursive: true })

  const files = (await fs.readdir(IMAGES_DIR, { withFileTypes: true }))
    .filter(entry => entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map(entry => entry.name)
    .sort((a, b) => a.localeCompare(b))

  const basenames = new Set()
  for (const file of files) {
    const baseName = path.parse(file).name.toLowerCase()
    if (basenames.has(baseName)) {
      throw new Error(`More than one source image has the name "${path.parse(file).name}". Rename one to avoid output collisions.`)
    }
    basenames.add(baseName)
  }

  const results = []
  for (const file of files) {
    results.push(await optimizeImage(file))
    console.log(`Optimized ${file}`)
  }

  await fs.writeFile(DATA_FILE, `${JSON.stringify(results, null, 2)}\n`)
  console.log(`Processed ${results.length} image(s). Image data saved to ${DATA_FILE}.`)
}

main().catch(error => {
  console.error('Image optimization failed:', error)
  process.exitCode = 1
})
