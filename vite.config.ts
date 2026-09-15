import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { personJsonLd, seo } from './src/content/seo.ts'

/** Injects title, meta, Open Graph and JSON-LD tags generated from src/content/seo.ts. */
function seoHead(): Plugin {
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })

  return {
    name: 'seo-head',
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [
        meta({ name: 'description', content: seo.description }),
        meta({ name: 'theme-color', content: seo.themeColor }),
        { tag: 'link', attrs: { rel: 'canonical', href: seo.url }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:url', content: seo.url }),
        meta({ property: 'og:title', content: seo.title }),
        meta({ property: 'og:description', content: seo.description }),
        meta({ name: 'twitter:card', content: 'summary' }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          // Escape "<" so the JSON can never close the script tag early.
          children: JSON.stringify(personJsonLd).replace(/</g, '\\u003c'),
          injectTo: 'head',
        },
      ]

      return {
        html: html.replace(/<title>.*?<\/title>/, `<title>${seo.title}</title>`),
        tags,
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHead()],
})
