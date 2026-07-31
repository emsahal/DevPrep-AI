import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AnimateOnScroll } from '@/components/common/AnimateOnScroll'
import heroImg from '@/assets/hero.jpg'
import cpeImg from '@/assets/cpe.jpg'

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes. Our "First Sprint" program allows for a complete diagnostic assessment and access to the first 3 modules of any curriculum track at no cost.' },
  { q: 'How realistic are the mock interviews?', a: 'We utilize high-fidelity voice-to-voice models trained specifically on engineering interview patterns, simulating live whiteboarding and behavioral cross-examination.' },
  { q: 'What programming languages are supported?', a: 'Full support for C++, Java, Python, Go, TypeScript, and Rust, including language-specific optimization feedback and idiom checks.' },
  { q: 'How does the AI tutor work?', a: 'Our AI tutor provides real-time explanations, code reviews, and hints. You can ask questions about any topic, get code walkthroughs, or request personalized study plans.' },
  { q: 'Can I practice company-specific questions?', a: 'Absolutely. Our platform includes curated question banks from top tech companies (FAANG, fintech, startups) with company-specific mock interviews and grading rubrics.' },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col font-sans selection:bg-primary/30 selection:text-white" style={{ background: 'var(--color-surface-container-lowest)', color: 'var(--color-on-surface)' }}>

      {/* ═══════ 1. Hero Section ═══════ */}
      <section className="relative min-h-[85vh] pt-20 pb-20 flex flex-col items-center justify-center overflow-hidden"
               style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img src={heroImg} alt="Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest/40 via-surface-container-lowest/80 to-surface-container-lowest" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs mb-8 backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            ENGINEERING EXCELLENCE
          </div>

          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl max-w-5xl mx-auto leading-[1.1] mb-6 tracking-tighter">
            The AI-Engineered Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#d0bcff]">FAANG Mastery</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
            A high-fidelity preparation platform featuring real-time code analysis, system design simulation, and behavioral AI coaching for elite software engineers.
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
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Header and Primary Spotlight */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div className="max-w-xl">
                  <div className="text-primary font-mono text-xs mb-3 tracking-widest uppercase">THE ECOSYSTEM</div>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 tracking-tighter">
                    Complete Preparation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#d0bcff]">Ecosystem</span>
                  </h2>
                  <p className="text-on-surface-variant text-sm sm:text-base opacity-80 leading-relaxed">
                    Everything you need to master the technical interview loop, from DS&A to System Design, powered by our proprietary neural engine.
                  </p>
                </div>

                {/* Featured Spotlight Card */}
                <div className="relative flex-1 rounded-3xl overflow-hidden border border-primary/40 shadow-[0_0_30px_rgba(139,92,246,0.15)] group min-h-[360px] p-8 sm:p-10 flex flex-col justify-end"
                     style={{ background: 'var(--color-surface-container-lowest)' }}>
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <img src={cpeImg} alt="System Design Grid" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/40 flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3">System Design Simulation</h3>
                    <p className="text-on-surface-variant text-sm max-w-md leading-relaxed opacity-90">
                      Interactive canvas for scaling distributed systems with real-time bottleneck detection and latency modeling. Master high-availability architecture.
                    </p>
                    <Link to="/learning-paths" className="mt-6 inline-flex items-center gap-2 text-primary font-mono text-xs font-semibold tracking-wider">
                      LAUNCH SIMULATOR <span className="material-symbols-outlined text-sm">arrow_outward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Technical Matrix */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'terminal', title: 'DS&A Mastery', desc: '500+ curated problems with AI-driven hint generation.' },
                  { icon: 'psychology', title: 'Behavioral AI', desc: 'Simulated soft-skill loops with sentiment analysis.' },
                  { icon: 'cloud_sync', title: 'Distributed Systems', desc: 'Master CAP theorem and consensus protocols.' },
                  { icon: 'database', title: 'DB Internals', desc: 'Deep dives into B-Trees, LSM trees, and indexing.' },
                  { icon: 'api', title: 'API Design', desc: 'REST, GraphQL, and gRPC best practices.' },
                  { icon: 'shield_person', title: 'Leadership', desc: 'Executive-level communication & conflict resolution.' },
                ].map((item) => (
                  <div key={item.title} className="bg-surface-container-lowest/50 backdrop-blur-md p-6 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all flex flex-col justify-between"
                       style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-border-subtle)' }}>
                    <div>
                      <span className="material-symbols-outlined text-primary mb-3 text-2xl">{item.icon}</span>
                      <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-on-surface)' }}>{item.title}</h4>
                      <p className="text-xs text-on-surface-variant/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 3. Core Features ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Large Feature */}
              <div className="p-8 sm:p-10 rounded-2xl border border-white/5 md:row-span-2 flex flex-col justify-between"
                   style={{ background: 'var(--color-surface-container)' }}>
                <div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">map</span>
                  </div>
                  <div className="font-mono text-xs text-primary/80 mb-3 tracking-wider">PROVEN METHODOLOGY</div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tighter">Adaptive Curriculums</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed opacity-80">
                    Our neural engine maps your current technical proficiency against target role requirements, generating a path focused exclusively on your knowledge gaps. Over 500+ hours of curriculum content covering 40+ technologies.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <Link to="/learning-paths" className="inline-flex items-center gap-2 text-primary font-mono text-xs font-semibold tracking-wider">
                    EXPLORE MODULES <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'code', title: 'Real-time Critique', desc: 'Complexity analysis as you type.' },
                  { icon: 'draw', title: 'Design Sandbox', desc: 'Interactive canvas for scaling.' },
                  { icon: 'mic', title: 'Voice AI Coaching', desc: 'Simulated live feedback loops.' },
                  { icon: 'analytics', title: 'Progress Analytics', desc: 'Detailed dimension mapping.' },
                ].map((f) => (
                  <div key={f.title} className="p-6 rounded-xl border border-white/5"
                       style={{ background: 'var(--color-surface-container)' }}>
                    <span className="material-symbols-outlined text-primary mb-3 text-2xl">{f.icon}</span>
                    <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-on-surface-variant opacity-70 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 4. How it Works (Previous Step Layout Preserved) ═══════ */}
      <section className="py-24 border-y border-white/5" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <div className="font-mono text-xs text-primary/80 mb-3 tracking-widest uppercase">WORKFLOW</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tighter">How it works</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto text-sm sm:text-base">
                Four simple steps to interview mastery through our procedural AI pipeline.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', icon: 'person_add', title: 'Create Account', desc: 'Sign up free and set your target companies, role, and experience level.' },
              { step: '02', icon: 'route', title: 'Pick a Roadmap', desc: 'Choose from 40+ curated paths or let AI build a personalized plan.' },
              { step: '03', icon: 'psychology', title: 'Learn & Practice', desc: 'Study with AI tutor, solve coding labs, and take adaptive quizzes daily.' },
              { step: '04', icon: 'work_history', title: 'Crush the Interview', desc: 'Simulate real interviews with company-specific questions and time pressure.' },
            ].map((s, i) => (
              <AnimateOnScroll key={s.step} delay={i * 120}>
                <div className="flex flex-col items-center text-center relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-40px)] h-[2px]"
                         style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-border-muted))' }} />
                  )}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10"
                       style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border-muted)' }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: 'var(--color-primary)', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                  <div className="text-xs font-mono font-semibold mb-2 px-3 py-1 rounded-full" style={{ background: 'rgba(208,188,255,0.1)', color: 'var(--color-primary)' }}>
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
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
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
                  <Link to="/code-analyzer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm" style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary-fixed)' }}>
                    Try Code Lab <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                     style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-border-subtle)' }}>
                  <div className="h-9 px-4 flex items-center gap-2 border-b border-white/5" style={{ background: 'var(--color-surface-container)' }}>
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
                    <div className="mt-5 p-4 rounded-lg border-l-2 border-primary" style={{ background: 'rgba(208,188,255,0.06)' }}>
                      <div className="text-primary font-bold mb-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span> AI Suggestion:
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        Consider using a Min-Heap data structure to maintain O((V + E) log V) time complexity for sparse graphs.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 6. AI Powered Tools Preview ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">AI-POWERED TOOLS</div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter leading-tight mb-4">
                    Master the Modern Technical Loop
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">integration_instructions</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1">Advanced Coding Practice</h4>
                      <p className="text-on-surface-variant text-sm opacity-75">Multi-file environment with language-specific linting and automated unit test generation.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">description</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base mb-1">Resume Optimizer</h4>
                      <p className="text-on-surface-variant text-sm opacity-75">AI scanning to ensure your experience highlights hit the specific keywords FAANG recruiters look for.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl aspect-video flex flex-col"
                     style={{ background: 'var(--color-surface-container-lowest)' }}>
                  <div className="h-8 px-4 flex items-center gap-2 border-b border-white/5" style={{ background: 'var(--color-surface-container)' }}>
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
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ═══════ 7. Comparison Table ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">BENCHMARKING</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Engineered for Results</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 border border-white/5 rounded-2xl overflow-hidden shadow-xl"
                 style={{ background: 'var(--color-surface-container-lowest)' }}>
              <div className="p-8 border-b md:border-b-0 md:border-r border-white/5">
                <div className="font-mono text-xs text-on-surface-variant/50 mb-6 uppercase">FEATURES</div>
                <ul className="space-y-5 text-sm font-medium">
                  <li>Personalized Pathing</li>
                  <li>Live AI Interviewing</li>
                  <li>System Design Simulation</li>
                  <li>Resume ATS Check</li>
                  <li>FAANG Success Rate</li>
                </ul>
              </div>
              <div className="p-8 border-b md:border-b-0 md:border-r border-white/5">
                <div className="font-mono text-xs text-on-surface-variant/50 mb-6 uppercase">TRADITIONAL PREP</div>
                <ul className="space-y-5 text-sm opacity-50">
                  <li>Manual Track Tracking</li>
                  <li>Static Mock Interviews</li>
                  <li>Static Diagrams</li>
                  <li>Manual Review</li>
                  <li>~12%</li>
                </ul>
              </div>
              <div className="p-8" style={{ background: 'rgba(208,188,255,0.04)' }}>
                <div className="font-mono text-xs text-primary font-bold mb-6 uppercase">DEVPREP AI</div>
                <ul className="space-y-5 text-sm font-semibold text-primary">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Neural Engine</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Voice-Native AI</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Interactive Canvas</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> Automated ATS</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span> 84%</li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>
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
                <div key={item.step} className="p-8 rounded-xl border border-white/10" style={{ background: 'var(--color-surface-container)' }}>
                  <div className="text-primary font-bold text-xl mb-2">{item.step}</div>
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
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-3">Built for every career stage.</h2>
              <p className="text-on-surface-variant text-sm sm:text-base opacity-75 max-w-xl mx-auto">
                Tailored preparation tracks designed to meet the specific demands of your next move.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stage 1 */}
              <div className="p-8 rounded-xl border border-white/10 flex flex-col items-center text-center" style={{ background: 'var(--color-surface-container-lowest)' }}>
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">school</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Students</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">Master core fundamentals, DS&A, and the rigors of internship loops at top-tier labs.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/40">CORE TRACK</div>
              </div>

              {/* Stage 2 */}
              <div className="p-8 rounded-xl border border-primary/40 relative flex flex-col items-center text-center" style={{ background: 'var(--color-surface-container-lowest)' }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-0.5 rounded-full text-[10px] font-bold text-black tracking-widest uppercase">Popular</div>
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Bootcamp Grads</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">Bridging the gap to professional engineering with intensive technical polishing and interview simulation.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/40">ACCELERATED TRACK</div>
              </div>

              {/* Stage 3 */}
              <div className="p-8 rounded-xl border border-white/10 flex flex-col items-center text-center" style={{ background: 'var(--color-surface-container-lowest)' }}>
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
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
          <div className="md:w-1/3">
            <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">METHODOLOGY</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-4">The Engineering Process</h2>
            <p className="text-on-surface-variant text-sm opacity-80 leading-relaxed mb-6">
              Our proprietary methodology for turning candidates into top-percentile hires through iterative AI loops.
            </p>
          </div>
          <div className="md:w-2/3 space-y-8 border-l border-white/10 pl-6 sm:pl-8">
            {[
              { num: '01 / DIAGNOSTICS', title: 'Deep Skill Assessment', desc: 'AI-driven benchmarking of your current technical stack and interview readiness across 12 dimensions.' },
              { num: '02 / EXECUTION', title: 'Targeted Prep Sprints', desc: 'Rapid iteration on weak points with adaptive problem sets that increase in complexity as you improve.' },
              { num: '03 / SIMULATION', title: 'Mock Interview Loops', desc: 'High-pressure simulations with our LLM-powered interviewers, trained on verified FAANG transcripts.' },
              { num: '04 / DEPLOYMENT', title: 'Final Polish & Placement', desc: 'Confidence calibration and negotiation coaching for your final onboarding phase.' },
            ].map((node) => (
              <div key={node.num} className="relative">
                <div className="text-primary font-mono text-[11px] mb-1 tracking-widest">{node.num}</div>
                <h4 className="font-semibold text-lg mb-1">{node.title}</h4>
                <p className="text-on-surface-variant text-xs sm:text-sm opacity-75 max-w-lg leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 11. Testimonials ═══════ */}
      <section className="py-24" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <div className="text-primary font-mono text-xs tracking-widest uppercase mb-3">SOCIAL PROOF</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">Verified FAANG Placements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-white/5" style={{ background: 'var(--color-surface-container)' }}>
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

              <div className="p-6 rounded-xl border border-primary/20" style={{ background: 'rgba(208,188,255,0.05)' }}>
                <p className="text-on-surface text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "DevPrep AI helped me transition from a bootcamp to a FAANG role in just 3 months. The roadmap kept me focused on what actually matters in interviews."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-bold text-primary">SC</div>
                  <div>
                    <div className="text-sm font-semibold">Sarah Chen</div>
                    <div className="text-[10px] font-mono text-primary uppercase">Engineer @ Google</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-white/5" style={{ background: 'var(--color-surface-container)' }}>
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
            </div>
          </AnimateOnScroll>
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
