import { useParams, Link } from 'react-router-dom'
import { SEOHead } from '@/components/common/SEOHead'
import { BLOG_ARTICLES } from '@/data/blogArticlesData'

import { BackButton } from '@/components/common/BackButton'

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const article = BLOG_ARTICLES.find(a => a.id === id)

  if (!article) {
    return (
      <div className="px-6 py-20 max-w-4xl mx-auto text-center">
        <span className="material-symbols-outlined text-5xl mb-4" style={{ color: 'var(--color-outline)' }}>article</span>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>Article Not Found</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>The article you are looking for does not exist or has been moved.</p>
        <Link to="/blogs" className="px-4 py-2 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
              style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Articles</span>
        </Link>
      </div>
    )
  }

  const relatedArticles = BLOG_ARTICLES.filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(t => article.tags.includes(t)))).slice(0, 3)

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.description}
      />
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <BackButton to="/blogs" label="Back to all articles" />
        </div>

        {/* Article Meta */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
              {article.category}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded font-semibold"
                  style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
              {article.difficulty}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-4 border-y border-subtle" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--color-primary)' }}>account_circle</span>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--color-on-surface)' }}>{article.author}</p>
                <p className="text-[10px]" style={{ color: 'var(--color-outline)' }}>Published on {article.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {article.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded font-medium hidden sm:inline-block"
                      style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="p-6 rounded-2xl mb-8 leading-relaxed text-base italic font-medium"
             style={{ background: 'var(--color-surface-container-low)', borderLeft: '4px solid var(--color-primary)', color: 'var(--color-on-surface)' }}>
          {article.content.introduction}
        </div>

        {/* Article Sections */}
        <div className="space-y-8 mb-12">
          {article.content.sections.map((section, idx) => (
            <div key={idx} className="bento-card p-6">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-on-surface)' }}>
                <span className="text-sm px-2 py-0.5 rounded font-mono" style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-primary)' }}>
                  0{idx + 1}
                </span>
                {section.heading}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)', lineHeight: '1.7' }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="bento-card p-6 mb-12" style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-primary)' }}>
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            <span>Key Takeaways for Interviews</span>
          </h3>
          <ul className="space-y-3">
            {article.content.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--color-on-surface)' }}>
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">check_circle</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-outline)' }}>
              Related Engineering Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <Link key={rel.id} to={`/blogs/${rel.id}`} className="bento-card p-4 flex flex-col justify-between group no-underline">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase mb-2 inline-block"
                          style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--color-outline)' }}>{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
