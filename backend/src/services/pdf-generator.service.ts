import puppeteer from 'puppeteer'
import path from 'path'
import { renderResumeHtml } from '@/templates/resume-template'

export class PdfGeneratorService {
  async generateResumePdf(data: any): Promise<Buffer> {
    const html = renderResumeHtml(data)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
