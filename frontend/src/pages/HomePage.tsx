import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimateOnScroll } from '@/components/common/AnimateOnScroll'
import heroImg from '@/assets/hero.jpg'

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes. Our platform allows complete diagnostic assessments and access to introductory modules across all CS paths at no cost.' },
  { q: 'How realistic are the mock practice sessions?', a: 'Our AI Tutor provides structured, step-by-step technical interviewing questions, instant rubrics, and real-time code analysis.' },
  { q: 'What programming languages are supported?', a: 'Full support for C++, Java, Python, Go, JavaScript, TypeScript, and Rust, including language-specific optimization feedback and idiom checks.' },
  { q: 'How does the AI tutor work?', a: 'Our AI tutor provides real-time explanations, code reviews, and hints. You can ask questions about any topic, get code walkthroughs, or request personalized study plans.' },
  { q: 'Can I practice company-specific questions?', a: 'Absolutely. Our platform includes curated question banks and practice topics covering core computer science subjects and interview patterns.' },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col font-sans selection:bg-primary/30 selection:text-white" style={{ background: 'var(--color-surface-container-lowest)', color: 'var(--color-on-surface)' }}>

      {/* ═══════ 1. Hero Section ═══════ */}
      <section className="relative min-h-[85vh] pt-16 pb-20 flex flex-col items-center justify-center overflow-hidden"
               style={{ background: 'var(--color-surface-container-lowest)' }}>
        {/* Full Hero Background Image */}
        <div className="absolute inset-0 z-0 opacity-75 pointer-events-none flex items-center justify-center">
          <img src={heroImg} alt="Hero Background" className="w-full max-w-5xl h-[80%] object-cover object-top translate-y-8 rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/70 to-surface-container-lowest" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl max-w-5xl mx-auto leading-[1.1] mb-6 tracking-tighter">
            The AI-Engineered Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#d0bcff]">Software Career Success</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
            Empowering Computer Science & Software Engineering students with AI-powered DSA practice, system design simulation, and interactive interview coaching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"
                  className="px-10 py-4 rounded-full font-semibold text-base text-white w-full sm:w-auto transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_45px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: '#8B5CF6' }}>
              Get Started
            </Link>
            <Link to="/learning-paths"
                  className="bg-white/5 border border-white/10 backdrop-blur-md px-10 py-4 rounded-full font-semibold text-base text-on-surface w-full sm:w-auto hover:bg-white/10 transition-colors">
              View Systems
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 2. Platform Overview ═══════ */}
      <section className="py-16" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col gap-8">
            
            {/* Top Header */}
            <AnimateOnScroll direction="left">
              <div className="max-w-2xl">
                <div className="text-primary font-mono text-xs mb-2 tracking-widest uppercase">THE ECOSYSTEM</div>
                <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3 tracking-tighter">
                  Complete Preparation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#d0bcff]">Ecosystem</span>
                </h2>
                <p className="text-on-surface-variant text-xs sm:text-sm opacity-80 leading-relaxed">
                  Everything you need to master technical interview loops, from DS&A practice to AI-driven feedback and competitive duels.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Bottom 3-in-a-row Cards Grid */}
            <AnimateOnScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" direction="right">
              {[
                { icon: 'smart_toy', title: '24/7 AI Tutor', desc: 'Step-by-step guidance, code walkthroughs, and instant problem explanations.' },
                { icon: 'code', title: 'Code Analyzer', desc: 'Language-specific linting, complexity heatmaps, and automated test generation.' },
                { icon: 'quiz', title: 'Adaptive Quizzes', desc: 'Topic-based practice tests with instant rubrics & detailed explanations.' },
                { icon: 'style', title: 'Spaced Flashcards', desc: 'Master key CS formulas, algorithms, and concepts with SM-2 retention.' },
                { icon: 'swords', title: '1v1 Coding Duels', desc: 'Challenge peers in real-time competitive DSA battles & climb the leaderboard.' },
                { icon: 'description', title: 'Resume Optimizer', desc: 'AI keyword extraction and ATS scoring tailored for software roles.' },
              ].map((item) => (
                <div key={item.title} className="group relative backdrop-blur-xl p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(28,27,27,0.7) 0%, rgba(18,18,18,0.9) 100%)',
                       borderColor: 'rgba(139,92,246,0.2)',
                       boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                     }}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/25 transition-all duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm mb-1.5 group-hover:text-primary transition-colors" style={{ color: 'var(--color-on-surface)' }}>{item.title}</h4>
                    <p className="text-[11px] sm:text-xs text-on-surface-variant/75 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </AnimateOnScroll>

          </div>
        </div>
      </section>

      {/* ═══════ 3. Core Features ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Large Feature */}
            <AnimateOnScroll className="h-full" direction="left">
              <div className="relative p-8 sm:p-10 rounded-3xl border h-full flex flex-col justify-between overflow-hidden shadow-2xl group"
                   style={{
                     background: 'linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(20,20,20,0.85) 60%, rgba(10,10,10,0.95) 100%)',
                     borderColor: 'rgba(139,92,246,0.3)',
                   }}>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                    <span className="material-symbols-outlined text-primary text-3xl">map</span>
                  </div>
                  <div className="font-mono text-xs text-primary font-semibold mb-3 tracking-wider">STRUCTURED ROADMAPS</div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tighter">Curated Learning Paths</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed opacity-85">
                    Navigate structured paths covering Data Structures, Algorithms, System Design, Frontend, Backend, and DevOps. Track your progress with personalized skill analytics and milestone badges.
                  </p>
                </div>
                <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
                  <Link to="/learning-paths" className="inline-flex items-center gap-2 text-primary font-mono text-xs font-semibold tracking-wider group-hover:translate-x-1 transition-transform">
                    EXPLORE PATHS <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Feature Grid */}
            <AnimateOnScroll direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'code', title: 'Live Code Analyzer', desc: 'Syntax linting & O(N) complexity checks.', accent: '#8B5CF6' },
                  { icon: 'smart_toy', title: 'Interactive AI Tutor', desc: 'Ask questions & get instant coding hints.', accent: '#4CD7F6' },
                  { icon: 'swords', title: 'Live Coding Duels', desc: 'Compete 1v1 with peers on speed & accuracy.', accent: '#FFB869' },
                  { icon: 'description', title: 'Resume ATS Optimizer', desc: 'Tailor your CV for top software roles.', accent: '#10B981' },
                ].map((f) => (
                  <div key={f.title} className="group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(32,31,31,0.6) 0%, rgba(18,18,18,0.85) 100%)',
                         borderColor: 'rgba(255,255,255,0.08)',
                       }}>
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl pointer-events-none"
                         style={{ background: `${f.accent}20` }} />
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                         style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}>
                      <span className="material-symbols-outlined text-xl" style={{ color: f.accent }}>{f.icon}</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-on-surface)' }}>{f.title}</h4>
                    <p className="text-xs text-on-surface-variant opacity-75 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

          </div>
        </div>
      </section>

      {/* ═══════ 4. How it Works (Previous Step Layout Preserved) ═══════ */}
      <section className="py-24 border-y border-white/5" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-14">
              <div className="font-mono text-xs text-primary/80 mb-3 tracking-widest uppercase">WORKFLOW</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tighter">How DevPrep AI Works</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto text-sm sm:text-base">
                Four simple steps to transform your technical preparation into verified job offers.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', icon: 'person_add', title: 'Create Account', desc: 'Select your target CS track, technologies, and career milestones.' },
              { step: '02', icon: 'route', title: 'Choose a Path', desc: 'Enroll in structured learning paths or generate custom AI practice sets.' },
              { step: '03', icon: 'psychology', title: 'Practice & Analyze', desc: 'Solve challenges, analyze code, and practice with our 24/7 AI tutor.' },
              { step: '04', icon: 'military_tech', title: 'Duel & Optimize', desc: 'Test skills in 1v1 duels, optimize your resume, and ace technical interviews.' },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 120} direction="up">
                <div className="flex flex-col items-center text-center relative group">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-40px)] h-[2px]"
                         style={{ background: 'linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0.15))' }} />
                  )}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                       style={{
                         background: 'linear-gradient(135deg, rgba(35,30,45,0.9) 0%, rgba(20,20,25,0.95) 100%)',
                         border: '1px solid rgba(139,92,246,0.3)',
                       }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                  <div className="text-xs font-mono font-semibold mb-2 px-3 py-1 rounded-full border border-primary/20" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--color-primary)' }}>
                    Step {s.step}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-on-surface)' }}>{s.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant opacity-80 leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 5. Live Code Lab ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <AnimateOnScroll className="lg:w-1/2 space-y-6" direction="right">
              <div className="text-primary font-mono text-xs tracking-widest uppercase">LIVE CODE LAB</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter leading-tight">
                Real-time feedback for high-stakes coding
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base opacity-80 leading-relaxed">
                Experience a production-grade IDE environment with integrated AI that analyzes your algorithmic efficiency, space complexity, and edge-case handling as you type.
              </p>
              <ul className="space-y-3 pt-2">
                {[
                  'Language-specific linting & optimization',
                  'Automated unit test generation',
                  'Complexity heatmaps',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/code-analyzer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all" style={{ background: '#8B5CF6', color: '#FFF' }}>
                  Try Code Lab <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="lg:w-1/2 w-full" direction="left">
              <div className="rounded-2xl overflow-hidden border shadow-2xl"
                   style={{
                     background: 'linear-gradient(145deg, rgba(25,25,30,0.9) 0%, rgba(12,12,15,0.95) 100%)',
                     borderColor: 'rgba(139,92,246,0.25)',
                   }}>
                <div className="h-9 px-4 flex items-center gap-2 border-b border-white/5" style={{ background: 'rgba(35,35,40,0.6)' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  <span className="ml-2 font-mono text-[11px] text-on-surface-variant/50">shortest_path.py</span>
                </div>
                <div className="p-6 font-mono text-xs leading-relaxed">
                  <div className="text-primary/40 mb-2">// Optimizing Dijkstra's Algorithm</div>
                  <div className="text-primary/90">
                    <span className="text-blue-400">def</span> <span className="text-yellow-400">shortest_path</span>(graph, start):<br />
                    &nbsp;&nbsp;distances = &#123;node: float('inf') for node in graph&#125;<br />
                    &nbsp;&nbsp;pq = [(0, start)]<br />
                    &nbsp;&nbsp;...
                  </div>
                  <div className="mt-5 p-4 rounded-xl border-l-2 border-primary" style={{ background: 'rgba(139,92,246,0.08)' }}>
                    <div className="text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span> AI Suggestion:
                    </div>
                    <div className="text-on-surface-variant text-[11px]">
                      Consider using a Min-Heap data structure to maintain O((V + E) log V) time complexity for sparse graphs.
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════ 6. AI Powered Tools Preview ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <AnimateOnScroll className="lg:w-1/2 space-y-8" direction="left">
              <div>
                <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">AI-POWERED TOOLS</div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter leading-tight mb-4">
                  Master the Modern Technical Loop
                </h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">integration_instructions</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Advanced Coding Practice</h4>
                    <p className="text-on-surface-variant text-sm opacity-75">Multi-file environment with language-specific linting and automated unit test generation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">description</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Resume Optimizer</h4>
                    <p className="text-on-surface-variant text-sm opacity-75">AI scanning to ensure your experience highlights hit the specific keywords top recruiters look for.</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll className="lg:w-1/2 w-full" direction="right">
              <div className="rounded-2xl overflow-hidden border shadow-2xl aspect-video flex flex-col"
                   style={{
                     background: 'linear-gradient(145deg, rgba(25,25,30,0.9) 0%, rgba(12,12,15,0.95) 100%)',
                     borderColor: 'rgba(139,92,246,0.25)',
                   }}>
                <div className="h-8 px-4 flex items-center gap-2 border-b border-white/5" style={{ background: 'rgba(35,35,40,0.6)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="mx-auto font-mono text-[10px] text-on-surface-variant/50">devprep.ai/dashboard/algorithms</div>
                </div>
                <div className="p-6 flex flex-1">
                  <div className="w-1/3 border-r border-white/5 pr-4 space-y-3">
                    <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                    <div className="h-2 w-full bg-white/5 rounded"></div>
                    <div className="h-2 w-full bg-white/5 rounded"></div>
                    <div className="h-2 w-4/5 bg-white/5 rounded"></div>
                  </div>
                  <div className="flex-1 pl-4 font-mono text-xs text-primary/80">
                    <div className="mb-2">class <span className="text-blue-400">LRUCache</span>:</div>
                    <div className="pl-4">def <span className="text-yellow-400">__init__</span>(self, capacity: int):</div>
                    <div className="pl-8">self.cap = capacity</div>
                    <div className="pl-8">self.cache = OrderedDict()</div>
                    <div className="mt-4 animate-pulse">|</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════ 7. 2-Column Comparison Section ═══════ */}
      <section className="py-20" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs mb-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                FEATURE COMPARISON
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
                Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#d0bcff]">Proven Results</span>
              </h2>
              <p className="text-on-surface-variant text-xs sm:text-sm opacity-80 max-w-lg mx-auto mt-2">
                See what is included in DevPrep AI compared to traditional unguided self-study.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column 1: Traditional Prep */}
            <AnimateOnScroll direction="left" delay={0}>
              <div className="p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-between"
                   style={{ background: 'linear-gradient(145deg, rgba(25,25,30,0.6) 0%, rgba(15,15,18,0.85) 100%)' }}>
                <div>
                  <div className="text-xs font-mono text-on-surface-variant/60 uppercase tracking-widest mb-3">TRADITIONAL METHOD</div>
                  <h3 className="text-2xl font-bold mb-4 opacity-75">Standard Self-Study</h3>
                  <p className="text-xs text-on-surface-variant/70 leading-relaxed mb-6">
                    Relying on static PDF cards, manual note-taking, and unguided practice sets without real-time AI assistance.
                  </p>
                  <ul className="space-y-4 text-xs text-on-surface-variant/70 border-t border-white/5 pt-6">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                      <span>No 24/7 AI tutor for instant code explanations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                      <span>No real-time linting & complexity heatmaps</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                      <span>No 1v1 peer coding duels or leaderboards</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                      <span>No automated ATS resume optimization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                      <span>No spaced repetition flashcard algorithm</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-white/30 text-center">LIMITATIONS OF STATIC STUDY</div>
              </div>
            </AnimateOnScroll>

            {/* Column 2: DEVPREP AI (Highlighted) */}
            <AnimateOnScroll direction="right" delay={100}>
              <div className="relative p-8 rounded-3xl border border-primary/40 h-full flex flex-col justify-between shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden"
                   style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.15) 0%, rgba(20,20,28,0.95) 100%)' }}>
                <div className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-2xl text-[10px] font-bold text-black uppercase tracking-wider shadow-md">
                  Complete Platform
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary font-bold uppercase tracking-widest mb-3">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span> DEVPREP AI PLATFORM
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Full AI Interview Suite</h3>
                  <p className="text-xs text-on-surface-variant opacity-90 leading-relaxed mb-6">
                    All-in-one AI ecosystem designed specifically to train, analyze, and elevate computer science candidates.
                  </p>
                  <ul className="space-y-4 text-xs text-on-surface font-semibold border-t border-primary/20 pt-6">
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                      <span>24/7 AI Tutor with instant code walkthroughs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                      <span>Interactive Code Analyzer & test generation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                      <span>Real-time 1v1 Peer Coding Duels & Rankings</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                      <span>Automated ATS Resume Optimizer for Tech CVs</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400 text-lg shrink-0">check_circle</span>
                      <span>SM-2 Spaced Repetition Flashcards & Quizzes</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-primary/20 text-xs font-mono text-primary font-bold text-center">ALL-IN-ONE SOLUTION</div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════ 8. Neural Engine ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">THE NEURAL ENGINE</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Proprietary AI Architecture</h2>
              <p className="text-on-surface-variant text-sm sm:text-base opacity-80">
                Our engine doesn't just predict answers; it models the cognitive load of an interviewer to provide the most realistic preparation experience possible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Cognitive Mapping', desc: 'Analyzes your problem-solving patterns to identify subconscious biases in your logic.' },
                { step: '02', title: 'Dynamic Scaling', desc: 'Adjusts problem difficulty in real-time based on your latency and accuracy metrics.' },
                { step: '03', title: 'Sentiment Analysis', desc: 'Evaluates your verbal confidence and technical communication clarity during mock loops.' },
              ].map((item) => (
                <div key={item.step} className="group relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(30,30,35,0.7) 0%, rgba(18,18,22,0.9) 100%)',
                       borderColor: 'rgba(139,92,246,0.2)',
                     }}>
                  <div className="text-primary font-bold text-xl mb-2 group-hover:scale-110 transition-transform origin-left">{item.step}</div>
                  <h4 className="font-semibold text-base mb-2">{item.title}</h4>
                  <p className="text-on-surface-variant text-xs sm:text-sm opacity-75 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 9. Career Stages ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-3">Built for every stage of your learning journey.</h2>
              <p className="text-on-surface-variant text-sm sm:text-base opacity-75 max-w-xl mx-auto">
                Tailored preparation tracks designed to meet the specific demands of your next career move.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stage 1 */}
              <div className="p-8 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                   style={{
                     background: 'linear-gradient(145deg, rgba(25,25,30,0.8) 0%, rgba(15,15,18,0.95) 100%)',
                     borderColor: 'rgba(255,255,255,0.08)',
                   }}>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">school</span>
                </div>
                <h3 className="font-bold text-xl mb-3">BSCS & BSSE Students</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">Master core CS fundamentals, DS&A, and the rigors of internship loops at top tech firms.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/40">FOUNDATION TRACK</div>
              </div>

              {/* Stage 2 */}
              <div className="p-8 rounded-2xl border relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                   style={{
                     background: 'linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(20,20,25,0.95) 100%)',
                     borderColor: 'rgba(139,92,246,0.4)',
                   }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-0.5 rounded-full text-[10px] font-bold text-black tracking-widest uppercase shadow-md">Popular</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Fresh Graduates</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">Bridging the gap to professional software engineering with intensive technical polishing and interview simulation.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/10 text-[11px] font-mono text-primary/80 font-semibold">ACCELERATED TRACK</div>
              </div>

              {/* Stage 3 */}
              <div className="p-8 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                   style={{
                     background: 'linear-gradient(145deg, rgba(25,25,30,0.8) 0%, rgba(15,15,18,0.95) 100%)',
                     borderColor: 'rgba(255,255,255,0.08)',
                   }}>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary text-3xl">architecture</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Senior Engineers</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">High-level focus on System Design, Leadership Principles, and cross-functional technical communication.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/40">EXECUTIVE TRACK</div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 10. Process Section ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row gap-12">
          <AnimateOnScroll className="md:w-1/3" direction="left">
            <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">METHODOLOGY</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">The Engineering Process</h2>
            <p className="text-on-surface-variant text-sm opacity-80 leading-relaxed mb-6">
              Our proprietary methodology for turning candidates into top-percentile hires through iterative AI loops.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll className="md:w-2/3 space-y-8 border-l border-white/10 pl-6 sm:pl-8" direction="right">
            {[
              { num: '01 / DIAGNOSTICS', title: 'Deep Skill Assessment', desc: 'AI-driven benchmarking of your current technical stack and interview readiness across 12 dimensions.' },
              { num: '02 / EXECUTION', title: 'Targeted Prep Sprints', desc: 'Rapid iteration on weak points with adaptive problem sets that increase in complexity as you improve.' },
              { num: '03 / SIMULATION', title: 'Mock Interview Loops', desc: 'High-pressure simulations with our LLM-powered interviewers, trained on verified tech interview transcripts.' },
              { num: '04 / DEPLOYMENT', title: 'Final Polish & Placement', desc: 'Confidence calibration and negotiation coaching for your final onboarding phase.' },
            ].map((node) => (
              <div key={node.num} className="relative">
                <div className="text-primary font-mono text-[11px] mb-1 tracking-widest">{node.num}</div>
                <h4 className="font-semibold text-lg mb-1">{node.title}</h4>
                <p className="text-on-surface-variant text-xs sm:text-sm opacity-75 max-w-lg leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 11. Testimonials ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-14">
              <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">SOCIAL PROOF</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Verified Tech Placements</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimateOnScroll direction="left" delay={0}>
              <div className="p-6 rounded-2xl border h-full transition-all duration-300 hover:-translate-y-1"
                   style={{
                     background: 'linear-gradient(145deg, rgba(28,27,35,0.7) 0%, rgba(18,18,22,0.9) 100%)',
                     borderColor: 'rgba(255,255,255,0.08)',
                   }}>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "The system design feedback was incredibly detailed. It pointed out flaws in my database sharding logic that I never would have noticed myself."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">AR</div>
                  <div>
                    <div className="text-sm font-semibold">Alex Rivera</div>
                    <div className="text-[10px] font-mono text-primary uppercase">SDE II @ Stripe</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={100}>
              <div className="p-6 rounded-2xl border h-full transition-all duration-300 hover:-translate-y-1 shadow-[0_0_25px_rgba(139,92,246,0.1)]"
                   style={{
                     background: 'linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(20,20,25,0.9) 100%)',
                     borderColor: 'rgba(139,92,246,0.3)',
                   }}>
                <p className="text-on-surface text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "DevPrep AI helped me transition smoothly to a top software role in just 3 months. The roadmap kept me focused on what actually matters in interviews."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold text-primary">SC</div>
                  <div>
                    <div className="text-sm font-semibold">Sarah Chen</div>
                    <div className="text-[10px] font-mono text-primary uppercase">Software Engineer</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="right" delay={200}>
              <div className="p-6 rounded-2xl border h-full transition-all duration-300 hover:-translate-y-1"
                   style={{
                     background: 'linear-gradient(145deg, rgba(28,27,35,0.7) 0%, rgba(18,18,22,0.9) 100%)',
                     borderColor: 'rgba(255,255,255,0.08)',
                   }}>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "The AI tutor doesn't just give the answer; it guides you to find it. Essential for mastering senior-level technical communication."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">MT</div>
                  <div>
                    <div className="text-sm font-semibold">Marcus Thorne</div>
                    <div className="text-[10px] font-mono text-primary uppercase">Lead Architect @ Vercel</div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════ 12. FAQ (Accordion) ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">SUPPORT</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Engineering Logistics (FAQ)</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-white/5"
                     style={{ background: openFaq === i ? 'rgba(208,188,255,0.04)' : 'var(--color-surface-container)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:text-primary font-semibold text-sm"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200"
                          style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 13. Final CTA ═══════ */}
      <section className="py-24 border-t border-white/5 text-center" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">Ready to secure your offer?</h2>
            <p className="text-on-surface-variant text-sm sm:text-base mb-8 opacity-80">
              Join 15,000+ engineers from top institutions and bootcamps who have leveled up their technical careers.
            </p>
            <Link to="/register"
                  className="inline-block px-10 py-4 rounded-full font-semibold text-base text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_45px_rgba(139,92,246,0.5)] transition-all"
                  style={{ background: '#8B5CF6' }}>
              Start Your First Sprint
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  )
}
