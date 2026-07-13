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
const NAV = [{ slug: 'setup', title: 'Setup Dasar' }]

export default class TutorialsController {
  async index({ inertia, params, response }: HttpContext) {
    const slug = params.slug || 'setup'

    // Validate slug exists in nav
    const navItem = NAV.find((n) => n.slug === slug)
    if (!navItem) return response.notFound({ message: 'Page not found' })

    const filePath = app.makePath(`tutorials/${slug}.md`)
    if (!existsSync(filePath)) {
      return response.notFound({ message: 'Tutorial page not found' })
    }

    const raw = await readFile(filePath, 'utf-8')
    const content = await marked.parse(raw, { gfm: true, breaks: true })

    return inertia.render('tutorial', {
      content,
      nav: NAV,
      currentSlug: slug,
      currentTitle: navItem.title,
    })
  }
}
