import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/common/SEOHead'
import { BLOG_ARTICLES } from '@/data/blogArticlesData'

const CATEGORIES = ['All', 'System Design', 'Backend', 'Frontend', 'DSA', 'Database', 'Security', 'DevOps', 'AI Engineering', 'Cloud']

export function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = BLOG_ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featured = BLOG_ARTICLES.filter(a => a.featured)

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' }
      case 'Intermediate': return { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' }
      case 'Advanced': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
      default: return { bg: 'var(--color-surface-container-high)', text: 'var(--color-outline)' }
    }
  }

  return (
    <>
      <SEOHead
        title="Engineering Blogs"
        description="Explore in-depth engineering articles on Netflix System Design, Microservices patterns, React performance, DSA interview patterns, PostgreSQL, API Security, Kafka, and AI engineering."
      />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
               style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-primary)', border: '1px solid var(--color-border-subtle)' }}>
            <span className="material-symbols-outlined text-[16px]">article</span>
            <span>Tech Insights & Articles</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-on-surface)' }}>
            Engineering Blog & Technology Articles
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: 'var(--color-on-surface-variant)' }}>
            Curated deep dives into production system design, microservices, databases, cloud architecture, and AI engineering written by software engineers.
          </p>
        </div>

        {/* Featured Section */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="mb-12 animate-fade-up animation-delay-100">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-outline)' }}>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map(article => {
                const diffStyle = getDifficultyColor(article.difficulty)
                return (
                  <div key={article.id} className="bento-card p-6 flex flex-col justify-between group hover:border-primary transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                                style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                            {article.category}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                                style={{ background: diffStyle.bg, color: diffStyle.text }}>
                            {article.difficulty}
                          </span>
                        </div>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {article.readTime}
                        </span>
                      </div>
                      <Link to={`/blogs/${article.id}`} className="no-underline">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm line-clamp-3 mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {article.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {article.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded font-medium"
                                style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-primary)' }}>person</span>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{article.author}</p>
                            <p className="text-[10px]" style={{ color: 'var(--color-outline)' }}>{article.date}</p>
                          </div>
                        </div>
                        <Link to={`/blogs/${article.id}`} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                          <span>Read Full Article</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="glass-panel rounded-2xl px-4 py-3 mb-8 flex flex-col sm:flex-row items-center gap-4 sticky top-[72px] z-30 animate-fade-up animation-delay-200">
          <div className="flex items-center gap-2 flex-1 min-w-0 rounded-xl px-3 py-2 ai-glow-focus w-full"
               style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>search</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                   type="text" placeholder="Search articles, topics, or technologies…"
                   className="bg-transparent border-none outline-none text-sm flex-1"
                   style={{ color: 'var(--color-on-surface)', fontFamily: 'var(--font-sans)' }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="material-symbols-outlined text-[18px]" style={{ color: 'var(--color-outline)' }}>close</button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {CATEGORIES.map(category => (
              <button key={category} onClick={() => setActiveCategory(category)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                      style={{
                        background: activeCategory === category ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                        color:      activeCategory === category ? 'var(--color-on-primary-fixed)' : 'var(--color-on-surface-variant)',
                        border:     activeCategory === category ? 'none' : '1px solid var(--color-border-muted)',
                      }}>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--color-outline)' }}>
            Showing <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{filteredArticles.length}</span> articles
          </p>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--color-surface-container-lowest)', border: '1px dashed var(--color-border-muted)' }}>
            <span className="material-symbols-outlined text-4xl mb-2" style={{ color: 'var(--color-outline)' }}>search_off</span>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>No articles found</h3>
            <p className="text-xs" style={{ color: 'var(--color-outline)' }}>Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up animation-delay-200">
            {filteredArticles.map(article => {
              const diffStyle = getDifficultyColor(article.difficulty)
              return (
                <div key={article.id} className="bento-card p-5 flex flex-col justify-between group hover:border-primary transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                              style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                          {article.category}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: diffStyle.bg, color: diffStyle.text }}>
                          {article.difficulty}
                        </span>
                      </div>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {article.readTime}
                      </span>
                    </div>
                    <Link to={`/blogs/${article.id}`} className="no-underline">
                      <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: 'var(--color-on-surface)' }}>
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-xs line-clamp-3 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {article.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded font-medium"
                              style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                      <span className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{article.date}</span>
                      <Link to={`/blogs/${article.id}`} className="text-xs font-semibold text-primary flex items-center gap-0.5 hover:underline">
                        <span>Read</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
