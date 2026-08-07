import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, any> | Record<string, any>[]
}

const DEFAULT_TITLE = 'DevPreps - Developer Preparation & AI Coding Technical Interview Prep'
const DEFAULT_DESCRIPTION = 'Master developer preparation, software engineering technical interviews, system design, and coding practice with DevPreps AI tools and developer roadmaps.'
const DEFAULT_DOMAIN = 'https://devpreps.tech'
const DEFAULT_OG_IMAGE = 'https://devpreps.tech/fab.png'
const DEFAULT_KEYWORDS = 'Dev Preparation, Developer Preparation, Technical Interview, Coding Interview Prep, System Design, Data Structures Algorithms, Software Engineer Interview'

export function SEOHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    // 1. Update Title to strictly follow "DevPreps - {page}" format
    const cleanTitle = title.replace(/\s*[-|]\s*DevPrep.*$/i, '').trim()
    document.title = cleanTitle.startsWith('DevPreps') ? cleanTitle : `DevPreps - ${cleanTitle}`

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // 2. Standard Meta Tags & Targeted SEO Keywords
    updateMetaTag('description', description)
    updateMetaTag('keywords', DEFAULT_KEYWORDS)
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // 3. OpenGraph Meta Tags
    const fullCanonical = canonicalUrl || `${DEFAULT_DOMAIN}${window.location.pathname}`
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:url', fullCanonical, true)
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:image', ogImage, true)
    updateMetaTag('og:site_name', 'DevPrep AI', true)

    // 4. Twitter Card Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', ogImage)

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', fullCanonical)

    // 6. JSON-LD Structured Data Injection
    let jsonLdScript = document.getElementById('json-ld-structured-data') as HTMLScriptElement | null
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script')
        jsonLdScript.id = 'json-ld-structured-data'
        jsonLdScript.type = 'application/ld+json'
        document.head.appendChild(jsonLdScript)
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd)
    } else if (jsonLdScript) {
      jsonLdScript.remove()
    }
  }, [title, description, canonicalUrl, ogImage, ogType, noindex, jsonLd])

  return null
}
