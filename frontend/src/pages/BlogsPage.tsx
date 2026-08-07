import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/common/SEOHead'

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  readTime: string
  date: string
  author: {
    name: string
    role: string
    avatar: string
  }
  tags: string[]
  featured?: boolean
}

const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Mastering System Design: How Microservices Scale Under High Concurrency',
    slug: 'mastering-system-design-microservices-scaling',
    summary: 'An architectural deep dive into load balancing, database sharding, caching strategies, and event-driven messaging pipelines for enterprise web applications.',
    category: 'System Design',
    readTime: '8 min read',
    date: 'Aug 05, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'Staff Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['System Design', 'Microservices', 'Backend', 'Redis', 'Kafka'],
    featured: true,
  },
  {
    id: '2',
    title: 'Modern React 19 Patterns & Server Actions Best Practices',
    slug: 'react-19-patterns-and-server-actions',
    summary: 'Explore full-stack React capabilities, optimistic UI updates, form state handling, and compiler optimizations that reduce client bundle size.',
    category: 'Frontend',
    readTime: '6 min read',
    date: 'Aug 02, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'Lead Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['React', 'JavaScript', 'Frontend', 'Web Dev'],
    featured: true,
  },
  {
    id: '3',
    title: 'Top 15 Data Structures & Algorithms Patterns for FAANG Interviews',
    slug: 'top-dsa-patterns-faang-interviews',
    summary: 'Master Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, and Topological Sort to solve complex coding interview questions.',
    category: 'DSA',
    readTime: '10 min read',
    date: 'Jul 28, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'Algorithms Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['DSA', 'LeetCode', 'Interview', 'Algorithms'],
  },
  {
    id: '4',
    title: 'PostgreSQL Indexing Strategies: B-Tree, GIN, GiST, and Partial Indexes',
    slug: 'postgresql-indexing-strategies-explained',
    summary: 'Unlock database performance optimization by understanding query execution plans, index scan types, and query tuning in relational databases.',
    category: 'Database',
    readTime: '7 min read',
    date: 'Jul 24, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'Database Reliability Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['PostgreSQL', 'Database', 'Backend', 'SQL'],
  },
  {
    id: '5',
    title: 'Securing REST & GraphQL APIs: JWT, OAuth 2.1, and Rate Limiting',
    slug: 'securing-apis-jwt-oauth-rate-limiting',
    summary: 'Comprehensive security checklist for token invalidation, refresh token rotation, CORS headers, CSRF protection, and API gateways.',
    category: 'Security',
    readTime: '9 min read',
    date: 'Jul 19, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'Security Engineer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Security', 'OAuth', 'Node.js', 'API'],
  },
  {
    id: '6',
    title: 'Docker & Kubernetes Production Deployment Playbook',
    slug: 'docker-kubernetes-production-deployment-playbook',
    summary: 'Learn container orchestration, zero-downtime rolling upgrades, health checks, environment variables management, and ingress rules.',
    category: 'DevOps',
    readTime: '8 min read',
    date: 'Jul 15, 2026',
    author: {
      name: 'DevPrep AI Team',
      role: 'DevOps Lead',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
  },
]

const CATEGORIES = ['All', 'System Design', 'Frontend', 'DSA', 'Database', 'Security', 'DevOps']

export function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = ARTICLES.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featured = ARTICLES.filter(a => a.featured)

  return (
    <>
      <SEOHead
        title="Tech Articles & Software Engineering Blogs - DevPrep AI"
        description="Read in-depth technical blogs, technology tutorials, system design breakdowns, modern web dev guides, and algorithm interview articles."
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
            Explore curated articles, architectural breakdowns, modern technology guides, and interview prep strategies written by industry engineers.
          </p>
        </div>

        {/* Featured Section */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="mb-12 animate-fade-up animation-delay-100">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--color-outline)' }}>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map(article => (
                <div key={article.id} className="bento-card p-6 flex flex-col justify-between group hover:border-primary transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                            style={{ background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                        {article.category}
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm line-clamp-3 mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {article.summary}
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
                      <div className="flex items-center gap-3">
                        <img src={article.author.avatar} alt={article.author.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--color-on-surface)' }}>{article.author.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--color-outline)' }}>{article.date}</p>
                        </div>
                      </div>
                      <Link to={`/library`} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                        <span>Read Topic</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
            {filteredArticles.map(article => (
              <div key={article.id} className="bento-card p-5 flex flex-col justify-between group hover:border-primary transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                          style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-outline)' }}>
                      {article.category}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-outline)' }}>
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2" style={{ color: 'var(--color-on-surface)' }}>
                    {article.title}
                  </h3>
                  <p className="text-xs line-clamp-3 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {article.summary}
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
                    <div className="flex items-center gap-2">
                      <img src={article.author.avatar} alt={article.author.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-[11px]" style={{ color: 'var(--color-outline)' }}>{article.date}</span>
                    </div>
                    <Link to="/library" className="text-xs font-semibold text-primary flex items-center gap-0.5 hover:underline">
                      <span>Explore</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
