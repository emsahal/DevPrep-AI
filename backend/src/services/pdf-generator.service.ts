import { renderResumeHtml } from '@/templates/resume-template'

export class PdfGeneratorService {
  async generateResumePdf(data: any): Promise<Buffer> {
    const html = renderResumeHtml(data)

    const { default: Chromium } = await import('@sparticuz/chromium' as any)
    const puppeteer = await import('puppeteer-core')

    const browser = await puppeteer.launch({
      args: Chromium.args,
      executablePath: await Chromium.executablePath(),
      headless: true,
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' as any })
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
        preferCSSPageSize: true,
      })
      return Buffer.from(pdf)
    } finally {
      await browser.close()
    }
  }
}

export const pdfGeneratorService = new PdfGeneratorService()
