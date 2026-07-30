import { renderResumeHtml } from '@/templates/resume-template'
import logger from '@/utils/logger'

export class PdfGeneratorService {
  async generateResumePdf(data: any): Promise<Buffer> {
    const html = renderResumeHtml(data)

    const { default: Chromium } = await import('@sparticuz/chromium' as any)
    const puppeteer = await import('puppeteer-core')

    const executablePath = await Chromium.executablePath()
    logger.info(`Chromium executable: ${executablePath}`)

    let browser: any
    try {
      browser = await puppeteer.launch({
        executablePath,
        args: [
          ...Chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
        headless: true,
        defaultViewport: { width: 1200, height: 1600 },
      })

      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' as any })
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
        preferCSSPageSize: true,
      })
      return Buffer.from(pdf)
    } catch (err) {
      logger.error('PDF generation failed:', err)
      throw new Error('Failed to generate PDF. Please try again later.')
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}

export const pdfGeneratorService = new PdfGeneratorService()
