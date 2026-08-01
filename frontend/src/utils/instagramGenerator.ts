import html2canvas from 'html2canvas'
import JSZip from 'jszip'

export interface InstagramItem {
  element: HTMLElement
  name: string
}

async function prepareElementForCapture(element: HTMLElement): Promise<void> {
  await Promise.all(Array.from(element.querySelectorAll('img')).map((img) => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve()
    return new Promise<void>((resolve) => {
      const onLoad = () => { cleanup(); resolve() }
      const onError = () => { cleanup(); resolve() }
      const cleanup = () => { img.removeEventListener('load', onLoad); img.removeEventListener('error', onError) }
      img.addEventListener('load', onLoad)
      img.addEventListener('error', onError)
      if (img.complete && img.naturalWidth > 0) { cleanup(); resolve() }
    })
  }))
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}

export async function captureToDataUrl(element: HTMLElement, scale = 1): Promise<string> {
  await prepareElementForCapture(element)
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
  })
  return canvas.toDataURL('image/png')
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = (header.match(/data:(.*?);/) || [])[1] || 'image/png'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mime })
}

export async function generateInstagramZip(items: InstagramItem[]): Promise<Blob> {
  const zip = new JSZip()
  for (const item of items) {
    const dataUrl = await captureToDataUrl(item.element)
    zip.file(item.name, dataUrlToBlob(dataUrl))
  }
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
