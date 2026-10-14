const fs = require('node:fs')
const path = require('node:path')

const DATA_FILE = path.join(__dirname, 'data', 'images.json')
const SIZES = '(max-width: 800px) 100vw, 800px'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function formatSrcset(variants) {
  return variants.map(variant => `${variant.src} ${variant.width}w`).join(', ')
}

function generatePictureSnippet(image, altText) {
  const jpegFallback = image.jpeg[image.jpeg.length - 1]

  return `<picture>
  <source type="image/avif" srcset="${escapeHtml(formatSrcset(image.avif))}" sizes="${SIZES}">
  <source type="image/webp" srcset="${escapeHtml(formatSrcset(image.webp))}" sizes="${SIZES}">
  <img
    src="${escapeHtml(jpegFallback.src)}"
    srcset="${escapeHtml(formatSrcset(image.jpeg))}"
    sizes="${SIZES}"
    width="${image.width}"
    height="${image.height}"
    alt="${escapeHtml(altText)}"
    loading="lazy"
    decoding="async"
    style="background-color: ${escapeHtml(image.dominantColor)}; background-image: url('${image.placeholder}'); background-size: cover;"
  >
</picture>`
}

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error('Image data was not found. Run "npm run images" first.')
  }

  const images = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const [requestedName, ...altTextParts] = process.argv.slice(2)
  const selectedImages = requestedName
    ? images.filter(image => image.name === requestedName)
    : images

  if (requestedName && selectedImages.length === 0) {
    const availableNames = images.map(image => image.name).join(', ') || '(none)'
    throw new Error(`Image "${requestedName}" was not found. Available images: ${availableNames}`)
  }

  const altText = altTextParts.join(' ')
  for (const image of selectedImages) {
    const filenameAlt = path.parse(image.name).name.replace(/[-_]+/g, ' ')
    console.log(`<!-- ${image.name} -->`)
    console.log(generatePictureSnippet(image, altText || filenameAlt))
    console.log()
  }
}

try {
  main()
} catch (error) {
  console.error('Could not build picture snippets:', error.message)
  process.exitCode = 1
}
