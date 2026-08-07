import { Link } from 'react-router-dom'
import { SEOHead } from '@/components/common/SEOHead'

const homeJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DevPrep AI',
    url: 'https://devpreps.tech',
    logo: 'https://devpreps.tech/fab.png',
    sameAs: ['https://github.com/emsahal'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevPrep AI',
    url: 'https://devpreps.tech',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DevPrep AI',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Prepare for software engineering interviews with AI-powered coding practice, developer roadmaps, system design guides, and personalized preparation tools.',
  },
]
import { useState } from 'react'
import { motion } from 'motion/react'
import { AnimateOnScroll } from '@/components/common/AnimateOnScroll'
import BlurText from '@/components/ui/BlurText'
import TypingCode from '@/components/ui/TypingCode'
import { secondLargestQuestions, twoSumQuestions } from '@/data/homeCodeSamples'
import GradientWaves from '@/components/ui/GradientWaves'
import StarBorder from '@/components/ui/StarBorder'
import LogoLoop from '@/components/ui/LogoLoop'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGit,
  SiDocker,
  SiNginx,
  SiPm2,
} from 'react-icons/si'
import {
  TbApi,
  TbLockAccess,
  TbGitMerge,
  TbTestPipe,
  TbGauge,
  TbShieldLock,
  TbTopologyStar3,
  TbBinaryTree,
} from 'react-icons/tb'

const techLogos = [
  // Frontend
  { node: <SiHtml5 className="text-[#E34F26]" />, title: "HTML", href: "/library/html" },
  { node: <SiCss className="text-[#1572B6]" />, title: "CSS", href: "/library/css" },
  { node: <SiJavascript className="text-[#F7DF1E]" />, title: "JavaScript", href: "/library/javascript" },
  { node: <SiTypescript className="text-[#3178C6]" />, title: "TypeScript", href: "/library/typescript" },
  { node: <SiReact className="text-[#61DAFB]" />, title: "React", href: "/library/react" },
  { node: <SiNextdotjs className="text-white" />, title: "Next.js", href: "/library/nextjs" },
  // Backend
  { node: <SiNodedotjs className="text-[#5FA04E]" />, title: "Node.js", href: "/library/nodejs" },
  { node: <SiExpress className="text-white" />, title: "Express.js", href: "/library/expressjs" },
  { node: <TbApi className="text-[#FF6C2C]" />, title: "REST APIs", href: "/library/rest-apis" },
  { node: <SiGraphql className="text-[#E535AB]" />, title: "GraphQL", href: "/library/graphql" },
  { node: <TbLockAccess className="text-[#FFB703]" />, title: "Authentication", href: "/library/authentication" },
  // Database
  { node: <SiMongodb className="text-[#47A248]" />, title: "MongoDB", href: "/library/mongodb" },
  { node: <SiPostgresql className="text-[#4169E1]" />, title: "PostgreSQL", href: "/library/postgresql" },
  { node: <SiRedis className="text-[#DC382D]" />, title: "Redis", href: "/library/redis" },
  // DevOps
  { node: <SiGit className="text-[#F05032]" />, title: "Git", href: "/library/git" },
  { node: <SiDocker className="text-[#2496ED]" />, title: "Docker", href: "/library/docker" },
  { node: <TbGitMerge className="text-[#2396ED]" />, title: "CI/CD", href: "/library/cicd" },
  { node: <SiNginx className="text-[#009639]" />, title: "Nginx", href: "/library/nginx" },
  { node: <SiPm2 className="text-[#A78BFA]" />, title: "PM2", href: "/library/pm2" },
  // Software Engineering & CS
  { node: <TbTestPipe className="text-[#C21325]" />, title: "Testing", href: "/library/testing" },
  { node: <TbGauge className="text-[#EAB308]" />, title: "Performance", href: "/library/performance" },
  { node: <TbShieldLock className="text-[#DC2626]" />, title: "Security", href: "/library/security" },
  { node: <TbTopologyStar3 className="text-[#0891B2]" />, title: "System Design", href: "/library/system-design" },
  { node: <TbBinaryTree className="text-[#A855F7]" />, title: "DSA", href: "/library/dsa" },
]

const sectionHeadingStyle = {
  fontFamily: '"Inter", sans-serif',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#ffffff',
}

const faqs = [
  { q: 'How does DevPrep AI differ from conventional DSA platforms?', a: 'DevPrep AI combines interactive coding practice with real-time AI tutoring, complexity heatmaps, ATS resume optimization, and competitive 1v1 duels designed specifically for end-to-end technical interview loops.' },
  { q: 'What programming languages are supported in the Code Analyzer?', a: 'Our live Code Analyzer supports C++, JavaScript, TypeScript, Python, and Java with real-time linting, complexity estimation, and unit test generation.' },
  { q: 'Can I track my progress across different computer science topics?', a: 'Yes! DevPrep AI features structured Learning Paths with milestone tracking, space repetition flashcards, and personalized performance analytics.' },
  { q: 'Are the interview preparation questions updated for FAANG & top tech companies?', a: 'Our question bank and system design breakdown guides are updated regularly to reflect real-world interview loops at top software engineering firms.' },
]

export function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const secondLargestQ = secondLargestQuestions[0]
  const twoSumQ = twoSumQuestions[0]

  return (
    <>
      <SEOHead jsonLd={homeJsonLd} />
    <div className="min-h-[calc(100vh-64px)] flex flex-col font-sans selection:bg-primary/30 selection:text-white" style={{ background: 'var(--color-surface-container-lowest)', color: '#ffffff', fontFamily: '"Inter", sans-serif' }}>

      {/* ═══════ 1. Hero Section (No bottom border, opacity 0.50) ═══════ */}
      <section className="relative h-screen min-h-[580px] pt-16 flex flex-col items-center justify-center overflow-hidden"
               style={{ background: 'linear-gradient(180deg, #10061f 0%, #150a2e 45%, #2e1065 100%)' }}>
        {/* GradientWaves Background - rich vibrant purple/violet gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GradientWaves
            horizonColor="#2e1065"
            waveColor="#7e22ce"
            crestColor="#c084fc"
            speed={0.4}
            amplitude={2.5}
            waveScale={0.7}
            waveRatio={0.9}
            swell={35}
            turbulence={18}
            tilt={0.35}
            zoom={1.1}
            height={7.5}
            fogDepth={16}
            detail="medium"
            brightness={1.0}
            opacity={0.50}
            mouseInteraction
            parallaxStrength={0.4}
            grain
            grainIntensity={0.03}
          />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <BlurText
            text="The AI-Engineered Path to Software Career Success"
            delay={100}
            animateBy="words"
            direction="top"
            className="font-medium text-4xl sm:text-5xl md:text-[56px] max-w-5xl mx-auto leading-[1.1] mb-6 tracking-[-0.04em] justify-center text-white"
          />

          <BlurText
            text="Empowering Computer Science & Software Engineering students with AI-powered DSA practice, system design simulation, and interactive interview coaching."
            delay={40}
            animateBy="words"
            direction="bottom"
            stepDuration={0.3}
            className="text-base sm:text-lg text-white max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed justify-center"
          />

          {/* CTA Buttons - Staggered animation to reveal smoothly after headline and paragraph text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: [0.25, 0.4, 0.25, 1.0] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary White Button */}
            <StarBorder
              as={Link}
              to="/learning-paths"
              color="#a78bfa"
              speed="4s"
              thickness={2}
              className="w-full sm:w-auto"
              innerClassName="inner-content-white"
              style={{ borderRadius: '9999px' }}
            >
              <span className="font-semibold text-sm px-1">Explore Roadmaps</span>
            </StarBorder>

            {/* Secondary Purple Button */}
            <StarBorder
              as={Link}
              to="/learning-paths"
              color="#a78bfa"
              speed="5s"
              thickness={2}
              className="w-full sm:w-auto"
              innerClassName="inner-content-purple"
              style={{ borderRadius: '9999px' }}
            >
              <span className="font-semibold text-sm px-1">Browse Learning Paths</span>
            </StarBorder>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Tech Stack & Topics LogoLoop Marquee ═══════ */}
      <section className="relative py-7 border-b border-white/10 overflow-hidden" style={{ background: 'rgba(14,14,18,0.95)' }}>
        <LogoLoop
          logos={techLogos}
          speed={60}
          direction="left"
          logoHeight={34}
          gap={60}
          scaleOnHover
          fadeOut
          fadeOutColor="#0e0e12"
          ariaLabel="Supported technologies and computer science topics"
          renderItem={(item) => (
            <Link
              to={item.href || '#'}
              className="flex items-center gap-3 py-1 text-white/90 hover:text-white transition-all duration-200 group cursor-pointer"
            >
              <span className="text-3xl flex items-center group-hover:scale-110 transition-transform duration-200">
                {item.node}
              </span>
              <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap" style={{ fontFamily: '"Inter", sans-serif' }}>
                {item.title}
              </span>
            </Link>
          )}
        />
      </section>



      {/* ═══════ 2. Platform Overview ═══════ */}
      <section className="py-20 border-b border-white/10" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col gap-10">
            
            {/* Centered Header */}
            <AnimateOnScroll direction="up">
              <div className="max-w-3xl mx-auto text-center">
                <span className="badge mb-3">The Ecosystem</span>
                <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>
                  Complete Preparation Ecosystem
                </h2>
                <p className="text-white text-sm sm:text-base opacity-90 max-w-2xl mx-auto leading-relaxed font-normal">
                  Everything you need to master technical interview loops, from DS&A practice to AI-driven feedback and competitive duels.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Bottom 3-in-a-row Cards Grid */}
            <AnimateOnScroll className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" direction="up">
              {[
                { icon: 'smart_toy', title: '24/7 AI Tutor', desc: 'Step-by-step guidance, code walkthroughs, and instant problem explanations.', link: '/ai-tutor' },
                { icon: 'code', title: 'Code Analyzer', desc: 'Language-specific linting, complexity heatmaps, and automated test generation.', link: '/code-analyzer' },
                { icon: 'quiz', title: 'Adaptive Quizzes', desc: 'Topic-based practice tests with instant rubrics & detailed explanations.', link: '/quizzes' },
                { icon: 'style', title: 'Spaced Flashcards', desc: 'Master key CS formulas, algorithms, and concepts with SM-2 retention.', link: '/flashcards' },
                { icon: 'swords', title: '1v1 Coding Duels', desc: 'Challenge peers in real-time competitive DSA battles & climb the leaderboard.', link: '/duels' },
                { icon: 'description', title: 'Resume Optimizer', desc: 'AI keyword extraction and ATS scoring tailored for software roles.', link: '/resume-optimizer' },
              ].map((item) => (
                <Link
                  key={item.title}
                  to={item.link}
                  className="group relative backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 flex flex-col justify-between overflow-hidden block"
                  style={{
                    background: 'linear-gradient(145deg, rgba(26,26,35,0.75) 0%, rgba(14,14,18,0.92) 100%)',
                    boxShadow: '0 6px 24px 0 rgba(0, 0, 0, 0.35)',
                  }}
                >
                  {/* Glowing top line accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Corner ambient blur orb */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/25 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      {/* Icon Container */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <span className="material-symbols-outlined text-primary text-xl group-hover:rotate-[3deg] transition-transform duration-300">{item.icon}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base mb-1.5 text-white group-hover:text-primary transition-colors tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-white/80 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom Action Arrow */}
                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
                      <span>Explore feature</span>
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimateOnScroll>

          </div>
        </div>
      </section>



      {/* ═══════ 3. Core Features ═══════ */}
      <section className="py-20 border-b border-white/10" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <AnimateOnScroll direction="up">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="badge mb-3">Platform Features</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>
                Curated Learning Paths & Live Tools
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90 max-w-2xl mx-auto leading-relaxed font-normal">
                Explore structured roadmaps, live code analysis, AI interview tutoring, and peer duels designed for computer science success.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Large Featured Card (5 cols on lg) */}
            <AnimateOnScroll className="lg:col-span-5 h-full" direction="left">
              <div className="relative p-6 sm:p-7 rounded-2xl border h-full flex flex-col justify-between overflow-hidden shadow-2xl group transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
                   style={{
                     background: 'linear-gradient(145deg, rgba(139,92,246,0.12) 0%, rgba(20,20,26,0.85) 60%, rgba(10,10,14,0.95) 100%)',
                     borderColor: 'rgba(139,92,246,0.3)',
                   }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(139,92,246,0.2)] group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-primary text-2xl">map</span>
                  </div>
                  <span className="badge mb-3 text-[11px]">Structured Roadmaps</span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight text-white" style={{ fontFamily: '"Inter", sans-serif' }}>
                    Curated Learning Paths
                  </h3>
                  <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-normal">
                    Navigate structured paths covering Data Structures, Algorithms, System Design, Frontend, Backend, and DevOps. Track your progress with personalized skill analytics and milestone badges.
                  </p>
                </div>
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
                  <Link to="/learning-paths" className="inline-flex items-center gap-2 text-primary font-mono text-xs font-semibold tracking-wider group-hover:translate-x-1 transition-transform">
                    EXPLORE PATHS <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>

            {/* 4 Sub-Cards Grid (7 cols on lg) */}
            <AnimateOnScroll className="lg:col-span-7" direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {[
                  { icon: 'code', title: 'Live Code Analyzer', desc: 'Syntax linting & O(N) complexity checks.', accent: '#38bdf8', link: '/code-analyzer' },
                  { icon: 'smart_toy', title: 'Interactive AI Tutor', desc: 'Ask questions & get instant coding hints.', accent: '#a78bfa', link: '/ai-tutor' },
                  { icon: 'swords', title: 'Live Coding Duels', desc: 'Compete 1v1 with peers on speed & accuracy.', accent: '#34d399', link: '/duels' },
                  { icon: 'description', title: 'Resume ATS Optimizer', desc: 'Tailor your CV for top software roles.', accent: '#60a5fa', link: '/resume-optimizer' },
                ].map((f) => (
                  <Link key={f.title} to={f.link} className="group relative p-5 rounded-2xl border border-white/10 transition-all duration-300 hover:border-white/25 hover:-translate-y-1 overflow-hidden flex flex-col justify-between block"
                       style={{
                         background: 'linear-gradient(145deg, rgba(26,26,34,0.75) 0%, rgba(14,14,18,0.9) 100%)',
                       }}>
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
                    <div className="absolute -top-6 -right-6 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-xl pointer-events-none"
                         style={{ background: `${f.accent}20` }} />
                    <div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 transition-transform duration-300 group-hover:scale-110"
                           style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}>
                        <span className="material-symbols-outlined text-xl" style={{ color: f.accent }}>{f.icon}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1.5 text-white group-hover:text-white transition-colors" style={{ fontFamily: '"Inter", sans-serif' }}>{f.title}</h4>
                      <p className="text-xs text-white/80 leading-relaxed font-normal">{f.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold" style={{ color: f.accent }}>
                      <span>Open tool</span>
                      <span className="material-symbols-outlined text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimateOnScroll>

          </div>
        </div>
      </section>



      {/* ═══════ 4. How it Works (Workflow) ═══════ */}
      <section className="py-24 border-b border-white/10" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-14">
              <span className="badge mb-3">Workflow</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>
                How DevPrep AI Works
              </h2>
              <p className="text-white max-w-xl mx-auto text-sm sm:text-base font-normal opacity-90">
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
                  <h3 className="font-semibold mb-2 text-white">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-white opacity-85 leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════ 5. Live Code Lab ═══════ */}
      <section className="py-20 border-b border-white/10 relative overflow-hidden" style={{ background: 'var(--color-surface-container-lowest)' }}>
        {/* Background glow accent */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <AnimateOnScroll direction="up">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="badge mb-3">Live Code Lab</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>
                Real-Time Feedback for High-Stakes Coding
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90 leading-relaxed font-normal max-w-2xl mx-auto">
                Experience a production-grade IDE environment with integrated AI that analyzes your algorithmic efficiency, space complexity, and edge-case handling as you type.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="flex flex-col lg:flex-row-reverse items-center gap-10">
            {/* Checklist & CTA */}
            <AnimateOnScroll className="lg:w-1/2 space-y-6" direction="right">
              <ul className="space-y-3.5">
                {[
                  'Language-specific linting & optimization feedback',
                  'Automated unit test case generation',
                  'Algorithmic time & space complexity heatmaps',
                  'Multi-file workspace support with syntax highlighting'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                    <span className="material-symbols-outlined text-emerald-400 text-lg flex-shrink-0">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  to="/code-analyzer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
                >
                  Try Code Lab <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </AnimateOnScroll>

            {/* IDE Mockup */}
            <AnimateOnScroll className="lg:w-1/2 w-full" direction="left">
              <div
                className="rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 hover:border-primary/40"
                style={{
                  background: 'linear-gradient(145deg, rgba(24,24,32,0.92) 0%, rgba(12,12,16,0.98) 100%)',
                  borderColor: 'rgba(139,92,246,0.25)',
                }}
              >
                {/* Header bar */}
                <div className="h-9 px-4 flex items-center justify-between border-b border-white/10" style={{ background: 'rgba(30,30,38,0.7)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                  </div>
                  <span className="font-mono text-[11px] text-white/60 font-medium">second_largest.js</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">JavaScript</span>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs leading-relaxed">
                  <div className="text-white/90 text-[12px]">
                    <TypingCode lines={secondLargestQ.lines} funcColor="text-cyan-300 font-semibold" loop />
                  </div>

                  {/* AI Suggestion Box */}
                  <div className="mt-5 p-4 rounded-xl border border-primary/30" style={{ background: 'rgba(139,92,246,0.08)' }}>
                    <div className="text-primary font-bold text-xs mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span> AI Suggestion:
                    </div>
                    <p className="text-white/90 text-xs leading-relaxed font-sans font-normal">
                      {secondLargestQ.suggestion ?? 'Analyzing algorithmic efficiency, space complexity, and edge-case handling as you type.'}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>



      {/* ═══════ 6. AI Powered Tools Preview ═══════ */}
      <section className="py-20 border-b border-white/10 relative overflow-hidden" style={{ background: 'var(--color-surface-container-low)' }}>
        {/* Background glow accent */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <AnimateOnScroll direction="up">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="badge mb-3">AI-Powered Tools</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>
                Master the Modern Technical Loop
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90 leading-relaxed font-normal max-w-2xl mx-auto">
                Comprehensive AI tools tailored specifically to prepare software engineers for multi-stage tech company interviews.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Feature Cards Column */}
            <AnimateOnScroll className="lg:w-1/2 space-y-4 w-full" direction="left">
              {[
                {
                  icon: 'integration_instructions',
                  title: 'Advanced Coding Practice',
                  desc: 'Multi-file environment with language-specific linting and automated unit test generation.',
                  color: '#a78bfa',
                  badgeBg: 'rgba(167, 139, 250, 0.1)',
                  borderColor: 'rgba(167, 139, 250, 0.25)',
                  link: '/code-analyzer',
                },
                {
                  icon: 'description',
                  title: 'Resume Optimizer',
                  desc: 'AI scanning to ensure your experience highlights hit the specific keywords top recruiters look for.',
                  color: '#38bdf8',
                  badgeBg: 'rgba(56, 189, 248, 0.1)',
                  borderColor: 'rgba(56, 189, 248, 0.25)',
                  link: '/resume-optimizer',
                },
              ].map((tool) => (
                <Link
                  key={tool.title}
                  to={tool.link}
                  className="group p-5 rounded-2xl border transition-all duration-300 hover:border-white/25 hover:-translate-y-1 block relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(26,26,34,0.85) 0%, rgba(14,14,18,0.95) 100%)',
                    borderColor: tool.borderColor,
                    boxShadow: '0 6px 24px 0 rgba(0, 0, 0, 0.35)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                      style={{ background: tool.badgeBg, color: tool.color, border: `1px solid ${tool.borderColor}` }}
                    >
                      <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1 text-white group-hover:text-white transition-colors" style={{ fontFamily: '"Inter", sans-serif' }}>
                        {tool.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimateOnScroll>

            {/* Live Dashboard Mockup */}
            <AnimateOnScroll className="lg:w-1/2 w-full" direction="right">
              <div
                className="rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 hover:border-cyan-500/40"
                style={{
                  background: 'linear-gradient(145deg, rgba(24,24,32,0.92) 0%, rgba(12,12,16,0.98) 100%)',
                  borderColor: 'rgba(56, 189, 248, 0.25)',
                }}
              >
                {/* Browser URL Bar */}
                <div className="h-9 px-4 flex items-center justify-between border-b border-white/10" style={{ background: 'rgba(30,30,38,0.7)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
                  </div>
                  <div className="bg-white/5 px-3 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-white/5">
                    devprep.ai/dashboard/two-sum
                  </div>
                  <div className="w-4"></div>
                </div>

                {/* Dashboard Editor Preview */}
                <div className="p-5 flex gap-4 min-h-[160px]">
                  <div className="w-1/3 border-r border-white/10 pr-3 space-y-2.5">
                    <div className="h-3 w-3/4 bg-cyan-400/20 rounded"></div>
                    <div className="h-2 w-full bg-white/10 rounded"></div>
                    <div className="h-2 w-5/6 bg-white/10 rounded"></div>
                    <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                  </div>
                  <div className="flex-1 font-mono text-xs text-white/90 space-y-1">
                    <TypingCode lines={twoSumQ.lines} funcColor="text-yellow-400 font-semibold" loop />
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>



      {/* ═══════ 7. 2-Column Comparison Section ═══════ */}
      <section className="py-20 border-b border-white/10" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-12">
              <span className="badge mb-3">Feature Comparison</span>
              <h2 className="text-3xl sm:text-[40px] mb-3" style={sectionHeadingStyle}>
                Engineered for Proven Results
              </h2>
              <p className="text-white text-xs sm:text-sm opacity-90 max-w-lg mx-auto mt-2 font-normal">
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
                  <div className="text-xs font-mono text-white/60 uppercase tracking-widest mb-3">TRADITIONAL METHOD</div>
                  <h3 className="text-2xl font-bold mb-4 text-white opacity-80">Standard Self-Study</h3>
                  <p className="text-xs text-white opacity-80 leading-relaxed mb-6">
                    Relying on static PDF cards, manual note-taking, and unguided practice sets without real-time AI assistance.
                  </p>
                  <ul className="space-y-4 text-xs text-white opacity-80 border-t border-white/5 pt-6">
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
                <div className="mt-8 pt-4 border-t border-white/5 text-xs font-mono text-white/40 text-center">LIMITATIONS OF STATIC STUDY</div>
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
                  <p className="text-xs text-white opacity-90 leading-relaxed mb-6">
                    All-in-one AI ecosystem designed specifically to train, analyze, and elevate computer science candidates.
                  </p>
                  <ul className="space-y-4 text-xs text-white font-semibold border-t border-primary/20 pt-6">
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
      <section className="py-24 border-b border-white/10 relative overflow-hidden" style={{ background: 'var(--color-surface-container-low)' }}>
        {/* Background neural glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <AnimateOnScroll direction="up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="badge mb-3">The Neural Engine</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>Proprietary AI Architecture</h2>
              <p className="text-white text-sm sm:text-base opacity-90 font-normal max-w-2xl mx-auto leading-relaxed">
                Our engine doesn't just predict answers; it models the cognitive load of an interviewer to provide the most realistic preparation experience possible.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Cognitive Mapping',
                desc: 'Analyzes your problem-solving patterns to identify subconscious biases in your logic.',
                icon: 'memory',
                tag: 'PATTERN MODELING',
                color: '#38bdf8',
                badgeBg: 'rgba(56, 189, 248, 0.1)',
                borderColor: 'rgba(56, 189, 248, 0.25)',
              },
              {
                step: '02',
                title: 'Dynamic Scaling',
                desc: 'Adjusts problem difficulty in real-time based on your latency and accuracy metrics.',
                icon: 'tune',
                tag: 'LATENCY ADAPTATION',
                color: '#c084fc',
                badgeBg: 'rgba(192, 132, 252, 0.1)',
                borderColor: 'rgba(192, 132, 252, 0.25)',
              },
              {
                step: '03',
                title: 'Sentiment Analysis',
                desc: 'Evaluates your verbal confidence and technical communication clarity during mock loops.',
                icon: 'graphic_eq',
                tag: 'VERBAL CALIBRATION',
                color: '#34d399',
                badgeBg: 'rgba(52, 211, 153, 0.1)',
                borderColor: 'rgba(52, 211, 153, 0.25)',
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.step} direction="up" delay={i * 120}>
                <div
                  className="group relative p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col justify-between"
                  style={{
                    background: 'linear-gradient(145deg, rgba(26,26,34,0.85) 0%, rgba(14,14,18,0.95) 100%)',
                    borderColor: item.borderColor,
                    boxShadow: '0 10px 35px 0 rgba(0, 0, 0, 0.45)',
                  }}
                >
                  {/* Glowing background corner accent */}
                  <div
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                    style={{ background: item.color }}
                  />

                  {/* Giant Watermark Step Number */}
                  <span
                    className="absolute right-6 bottom-4 font-mono font-black text-7xl select-none pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ color: item.color, fontFamily: '"Inter", sans-serif' }}
                  >
                    {item.step}
                  </span>

                  <div className="relative z-10">
                    {/* Top status bar with glowing icon */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                          style={{ background: item.badgeBg, color: item.color }}
                        >
                          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                        </div>
                        <span
                          className="font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded-md"
                          style={{ background: item.badgeBg, color: item.color, border: `1px solid ${item.borderColor}` }}
                        >
                          {item.step}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-white/50 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-xl mb-3 text-white tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-white text-sm opacity-85 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>



      {/* ═══════ 9. Career Stages ═══════ */}
      <section className="py-24 border-b border-white/10" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimateOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="badge mb-3">Your Journey</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>Built for Every Stage of Your Learning Journey</h2>
              <p className="text-white text-sm sm:text-base opacity-90 max-w-xl mx-auto font-normal">
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
                <h3 className="font-bold text-xl mb-3 text-white">BSCS & BSSE Students</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed mb-6 opacity-85">Master core CS fundamentals, DS&A, and the rigors of internship loops at top tech firms.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/50">FOUNDATION TRACK</div>
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
                <h3 className="font-bold text-xl mb-3 text-white">Fresh Graduates</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed mb-6 opacity-85">Bridging the gap to professional software engineering with intensive technical polishing and interview simulation.</p>
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
                <h3 className="font-bold text-xl mb-3 text-white">Senior Engineers</h3>
                <p className="text-white text-xs sm:text-sm leading-relaxed mb-6 opacity-85">High-level focus on System Design, Leadership Principles, and cross-functional technical communication.</p>
                <div className="mt-auto w-full pt-4 border-t border-white/5 text-[11px] font-mono text-white/50">EXECUTIVE TRACK</div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>



      {/* ═══════ 12. FAQ (Support) ═══════ */}
      <section className="py-24 border-b border-white/10" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="badge mb-3">Support</span>
              <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>Engineering Logistics (FAQ)</h2>
              <p className="text-white text-sm sm:text-base opacity-90 font-normal">
                Everything you need to know about DevPrep AI practice labs, AI tutoring, and plans.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-white/5"
                     style={{ background: openFaq === i ? 'rgba(208,188,255,0.04)' : 'var(--color-surface-container)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:text-primary font-semibold text-sm text-white"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200"
                          style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-white opacity-85 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>



      {/* ═══════ 13. Final CTA (Get Started) ═══════ */}
      <section className="py-24 text-center" style={{ background: 'var(--color-surface-container-low)' }}>
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimateOnScroll>
            <span className="badge mb-3">Get Started</span>
            <h2 className="text-3xl sm:text-[40px] mb-4" style={sectionHeadingStyle}>Ready to Secure Your Offer?</h2>
            <p className="text-white text-sm sm:text-base mb-8 opacity-90 font-normal max-w-xl mx-auto">
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
    </>
  )
}
