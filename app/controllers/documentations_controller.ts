import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
)

// Sidebar navigation structure
const NAV = [
  { slug: 'introduction', title: 'Pengenalan' },
  // { slug: 'installation', title: 'Self Hosted' },
  { slug: 'authentication', title: 'Autentikasi API' },
  { slug: 'static-qris', title: 'QRIS Statis' },
  { slug: 'dynamic-qris', title: 'QRIS Dinamis' },
  { slug: 'webhook', title: 'Webhook & Android' },
]

export default class DocumentationsController {
  async index({ inertia, params, response }: HttpContext) {
    const slug = params.slug || 'introduction'

    // Validate slug exists in nav
    const navItem = NAV.find((n) => n.slug === slug)
    if (!navItem) return response.notFound({ message: 'Page not found' })

    const filePath = app.makePath(`docs/${slug}.md`)
    if (!existsSync(filePath)) {
      return response.notFound({ message: 'Documentation page not found' })
    }

    const raw = await readFile(filePath, 'utf-8')
    const content = await marked.parse(raw, { gfm: true, breaks: true })

    return inertia.render('documentation', {
      content,
      nav: NAV,
      currentSlug: slug,
      currentTitle: navItem.title,
    })
  }
}
