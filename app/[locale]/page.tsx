'use client';

import { memo, useMemo, useCallback, useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useMotionValueEvent, useInView } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  Github,
  Zap,
  Palette,
  Code2,
  Layers,
  Sparkles,
  Copy,
  Check,
  Terminal,
  Rocket,
  Star,
  Heart,
  BookOpen,
  Shield,
  Package,
  Boxes,
  FileCode,
  Type,
  Globe,
  ChevronDown,
  History,
  Languages,
} from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useSoundEffects } from '@/hooks/use-sound';

// Dynamic imports for heavy components (code-split)
const SpotifyModal = lazy(() => import('@/components/spotify-modal').then(m => ({ default: m.SpotifyModal })));
const ScrollProgress = lazy(() => import('@/components/scroll-progress').then(m => ({ default: m.ScrollProgress })));
const BackToTop = lazy(() => import('@/components/back-to-top').then(m => ({ default: m.BackToTop })));


// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// --- Background Components ---
function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* === SUBTLE SPOTLIGHT - Hero area only === */}
      {/* Dark mode: purple glow, Light mode: softer purple glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[70vh] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.1),transparent)]" />
      
      {/* === BENTO GRID PATTERN === */}
      {/* Dark mode grid - white lines */}
      <div 
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Light mode grid - dark lines */}
      <div 
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* === FADE OVERLAYS - Smooth edges === */}
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
      {/* Left fade */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent" />
      {/* Right fade */}
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

// --- Language Switcher ---
function LanguageSwitcher() {
  const t = useTranslations('languageSwitcher');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { playHover, playClick } = useSoundEffects(0.15);

  const handleLocaleChange = (locale: string) => {
    playClick();
    router.replace(pathname, { locale });
    setIsOpen(false);
  };

  const handleToggle = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        onMouseEnter={playHover}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
      >
        <Globe className="w-4 h-4" />
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 bg-card border rounded-xl shadow-lg overflow-hidden min-w-[150px] z-50"
        >
          {routing.locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              onMouseEnter={playHover}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
            >
              <span className="text-lg">{locale === 'en' ? '🇺🇸' : '🇮🇩'}</span>
              {t(locale)}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// --- Floating Nav ---
function FloatingNav() {
  const t = useTranslations('nav');
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { playHover, playClick } = useSoundEffects(0.15);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
    >
      <div className={`px-4 md:px-6 py-3 flex items-center justify-between rounded-2xl border shadow-lg backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 border-border/50' 
          : 'bg-background/60 border-white/10'
      }`}>
        <Link href="/" className="flex items-center gap-3" onMouseEnter={playHover}>
          <Image src="/logo.png" alt="Ourin Logo" width={32} height={32} className="rounded-full" />
          <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Ourin</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/70">
          <a href="#features" className="hover:text-foreground transition-colors" onMouseEnter={playHover} onClick={playClick}>{t('features')}</a>
          <a href="#hooks" className="hover:text-foreground transition-colors" onMouseEnter={playHover} onClick={playClick}>Hooks</a>
          <a href="#utilities" className="hover:text-foreground transition-colors" onMouseEnter={playHover} onClick={playClick}>Utils</a>
          <a href="#fonts" className="hover:text-foreground transition-colors" onMouseEnter={playHover} onClick={playClick}>{t('fonts')}</a>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button size="sm" className="rounded-full px-4 hidden sm:flex font-semibold gap-2" onMouseEnter={playHover} onClick={playClick}>
            <Rocket className="w-4 h-4" />
            <span className="hidden lg:inline">{t('getStarted')}</span>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

// --- Animated Counter ---
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// --- Stat Card ---
function StatCard({ icon, value, label, suffix = '' }: { icon: React.ReactNode; value: number; label: string; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-display font-bold">
            <AnimatedCounter value={value} suffix={suffix} />
          </div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Feature Card ---
function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0,
  fontClass = '',
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
  fontClass?: string;
}) {
  const { playHover } = useSoundEffects(0.1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onMouseEnter={playHover}
      className="group relative p-6 md:p-8 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-primary/10">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className={`text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors ${fontClass || 'font-display'}`}>{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// --- Update Card ---
function UpdateCard({ version, title, description, isLatest = false }: { version: string; title: string; description: string; isLatest?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={`relative pl-8 pb-8 border-l-2 ${isLatest ? 'border-primary' : 'border-border/50'} last:pb-0`}
    >
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${isLatest ? 'bg-primary' : 'bg-muted-foreground/30'} border-4 border-background`} />
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {version}
      </div>
      <h4 className="font-display font-bold text-lg mb-1">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
}

// --- Copy Command ---
function CopyCommand() {
  const [copied, setCopied] = useState(false);
  const { playHover, playClick, playSuccess } = useSoundEffects(0.15);
  const displayCommand = "npx create-next-app -e https://github.com/LuckyArch/ourin-nextjs-starter";
  const fullCommand = "npx create-next-app -e https://github.com/LuckyArch/ourin-nextjs-starter";

  const handleCopy = async () => {
    playClick();
    await navigator.clipboard.writeText(fullCommand);
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={playHover}
      className="relative flex items-center justify-between w-full max-w-xl mx-auto bg-[#0a0a0a] rounded-2xl p-2 shadow-2xl ring-1 ring-white/10 cursor-pointer"
    >
      <div className="flex items-center gap-3 pl-4 overflow-hidden">
        <Terminal className="w-4 h-4 text-green-400 shrink-0" />
        <code className="text-xs sm:text-sm text-gray-300 font-mono truncate">
          {displayCommand}
        </code>
      </div>
      
      <button
        onClick={handleCopy}
        onMouseEnter={playHover}
        className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 shrink-0 focus:outline-none gap-2 text-sm font-medium"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </motion.div>
  );
}

// --- Font Showcase ---
function FontShowcase() {
  const { playHover } = useSoundEffects(0.1);
  const fonts = [
    { name: 'Outfit', class: 'font-display', desc: 'Modern headings' },
    { name: 'Space Grotesk', class: 'font-space', desc: 'Tech & bold' },
    { name: 'Poppins', class: 'font-poppins', desc: 'Friendly & clean' },
    { name: 'Plus Jakarta Sans', class: 'font-sans', desc: 'Body text' },
    { name: 'Playfair Display', class: 'font-serif', desc: 'Elegant serif' },
    { name: 'JetBrains Mono', class: 'font-mono', desc: 'Code blocks' },
    { name: 'Caveat', class: 'font-hand', desc: 'Handwritten' },
    { name: 'Inter', class: 'font-inter', desc: 'UI labels' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {fonts.map((font, i) => (
        <motion.div
          key={font.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.02 }}
          onMouseEnter={playHover}
          className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all group cursor-pointer"
        >
          <div className={`text-2xl font-bold mb-1 ${font.class} group-hover:text-primary transition-colors`}>
            Aa
          </div>
          <div className="text-sm font-medium">{font.name}</div>
          <div className="text-xs text-muted-foreground">{font.desc}</div>
        </motion.div>
      ))}
    </div>
  );
}

// --- Hooks Showcase ---
function HooksShowcase() {
  const { playHover } = useSoundEffects(0.1);
  const hooks = [
    { name: 'useDebounce', desc: 'Delay value updates', font: 'font-space', color: 'from-violet-500/20 to-purple-500/10' },
    { name: 'useFetch', desc: 'Declarative data fetching', font: 'font-poppins', color: 'from-blue-500/20 to-cyan-500/10' },
    { name: 'useLocalStorage', desc: 'Persistent state', font: 'font-raleway', color: 'from-emerald-500/20 to-green-500/10' },
    { name: 'useMediaQuery', desc: 'Responsive breakpoints', font: 'font-manrope', color: 'from-orange-500/20 to-amber-500/10' },
    { name: 'useCountdown', desc: 'Timer with controls', font: 'font-inter', color: 'from-pink-500/20 to-rose-500/10' },
    { name: 'useNetworkStatus', desc: 'Online/offline tracking', font: 'font-nunito', color: 'from-teal-500/20 to-cyan-500/10' },
    { name: 'useIntersectionObserver', desc: 'Viewport detection', font: 'font-dm', color: 'from-indigo-500/20 to-blue-500/10' },
    { name: 'useKeyboardShortcut', desc: 'Hotkey bindings', font: 'font-source', color: 'from-red-500/20 to-orange-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {hooks.map((hook, i) => (
        <motion.div
          key={hook.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onMouseEnter={playHover}
          className={`relative p-5 rounded-2xl border border-border/50 hover:border-primary/30 transition-all overflow-hidden bg-gradient-to-br ${hook.color} backdrop-blur-sm group cursor-pointer`}
        >
          <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Boxes className="w-12 h-12" />
          </div>
          <div className={`font-mono text-xs text-primary/80 mb-1`}>hook</div>
          <h4 className={`${hook.font} font-bold text-base mb-1 group-hover:text-primary transition-colors`}>
            {hook.name}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{hook.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

// --- Utilities Showcase ---
function UtilitiesShowcase() {
  const categories = [
    { 
      name: 'String', 
      count: 18, 
      examples: ['capitalize', 'slugify', 'truncate'], 
      font: 'font-display',
      icon: <Type className="w-5 h-5" />,
      color: 'from-violet-500 to-purple-600'
    },
    { 
      name: 'Array', 
      count: 22, 
      examples: ['chunk', 'shuffle', 'groupBy'], 
      font: 'font-space',
      icon: <Layers className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Date', 
      count: 12, 
      examples: ['formatDate', 'timeAgo', 'daysBetween'], 
      font: 'font-poppins',
      icon: <History className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      name: 'Validation', 
      count: 10, 
      examples: ['isEmail', 'isURL', 'validatePassword'], 
      font: 'font-raleway',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-orange-500 to-amber-600'
    },
    { 
      name: 'Crypto', 
      count: 14, 
      examples: ['uuid', 'sha256', 'base64Encode'], 
      font: 'font-manrope',
      icon: <Code2 className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-600'
    },
    { 
      name: 'Async', 
      count: 10, 
      examples: ['retry', 'debounce', 'throttle'], 
      font: 'font-inter',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-indigo-500 to-violet-600'
    },
  ];

  const { playHover } = useSoundEffects(0.1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          onMouseEnter={playHover}
          className="relative p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all bg-card/50 backdrop-blur-sm group overflow-hidden cursor-pointer"
        >
          {/* Gradient accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color}`} />
          
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>
              {cat.icon}
            </div>
            <span className="px-3 py-1 rounded-full bg-muted text-xs font-bold text-muted-foreground">
              {cat.count}+
            </span>
          </div>
          
          <h4 className={`${cat.font} font-bold text-xl mb-2 group-hover:text-primary transition-colors`}>
            {cat.name} Utils
          </h4>
          
          <div className="flex flex-wrap gap-1.5">
            {cat.examples.map((ex) => (
              <code key={ex} className="px-2 py-0.5 rounded bg-muted/50 text-xs font-mono text-muted-foreground">
                {ex}()
              </code>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}


// --- Main Page Component ---
export default function Home() {
  const t = useTranslations();
  const { playHover, playClick } = useSoundEffects(0.2);
  
  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 font-sans overflow-x-hidden">
      <Suspense fallback={null}>
        <ScrollProgress />
      </Suspense>
      <GridBackground />
      <FloatingNav />
      <Suspense fallback={null}>
        <SpotifyModal playlistId="37i9dQZF1DWWY64wDtewQt" position="bottom-left" />
        <BackToTop position="bottom-right" />
      </Suspense>
      
      {/* === Hero Section === */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-primary text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('hero.badge')}</span>
          </motion.div>

          {/* Main Heading - Using different fonts */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1]"
          >
            <span className="font-poppins">{t('hero.title')}</span>{' '}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent font-display">
              {t('hero.titleHighlight')}
            </span>
            <br />
            <span className="font-serif italic">{t('hero.titleEnd')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            {t('hero.subtitle')}{' '}
            <span className="text-foreground font-semibold font-space">{t('hero.utilities')}</span>,{' '}
            <span className="text-foreground font-semibold font-raleway">{t('hero.fonts')}</span>, {t('hero.and')}{' '}
            <span className="text-foreground font-semibold font-manrope">{t('hero.components')}</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto"
          >
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all gap-2" onMouseEnter={playHover} onClick={playClick}>
              <Rocket className="w-5 h-5" />
              {t('hero.ctaPrimary')}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full text-base gap-2 hover:bg-muted/50" onMouseEnter={playHover} onClick={playClick}>
              <Github className="w-5 h-5" />
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          {/* Copy Command */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-xl px-4"
          >
            <CopyCommand />
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {/* Next.js - Black pill white text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <svg viewBox="0 0 180 180" className="w-4 h-4" fill="currentColor">
                <mask id="mask0_408_134" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                  <circle cx="90" cy="90" r="90" fill="black"/>
                </mask>
                <g mask="url(#mask0_408_134)">
                  <circle cx="90" cy="90" r="90" fill="black"/>
                  <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear)"/>
                  <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear)"/>
                </g>
                <defs>
                  <linearGradient id="paint0_linear" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="white" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              Next.js 16
            </span>
            
            {/* React - Cyan bg black text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#61DAFB] text-black text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="black">
                <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85-1.03 0-1.87-.85-1.87-1.85 0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9Z"/>
              </svg>
              React 19
            </span>
            
            {/* TypeScript - Blue bg white text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3178C6] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/>
              </svg>
              TypeScript 5
            </span>
            
            {/* Tailwind - Cyan bg white text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06B6D4] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
              </svg>
              Tailwind 4
            </span>
            
            {/* next-intl - Violet bg white text */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              next-intl
            </span>
          </motion.div>
        </div>
      </section>

      {/* === Stats Section === */}
      <section id="stats" className="py-20 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            <StatCard icon={<Package className="w-6 h-6" />} value={185} suffix="+" label={t('stats.utilities')} />
            <StatCard icon={<Type className="w-6 h-6" />} value={16} label={t('stats.fonts')} />
            <StatCard icon={<Boxes className="w-6 h-6" />} value={20} suffix="+" label={t('stats.hooks')} />
            <StatCard icon={<FileCode className="w-6 h-6" />} value={850} suffix="+" label={t('stats.css')} />
          </div>
        </div>
      </section>

      {/* === Features Section === */}
      <section id="features" className="py-20 md:py-28 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider font-mono">{t('features.sectionLabel')}</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-4 tracking-tight">
              {t('features.title')}
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title={t('features.turbopack.title')}
              description={t('features.turbopack.description')}
              delay={0}
              fontClass="font-space"
            />
            <FeatureCard 
              icon={<Palette className="w-6 h-6" />}
              title={t('features.fonts.title')}
              description={t('features.fonts.description')}
              delay={0.1}
              fontClass="font-poppins"
            />
            <FeatureCard 
              icon={<Code2 className="w-6 h-6" />}
              title={t('features.utilities.title')}
              description={t('features.utilities.description')}
              delay={0.2}
              fontClass="font-raleway"
            />
            <FeatureCard 
              icon={<Layers className="w-6 h-6" />}
              title={t('features.shadcn.title')}
              description={t('features.shadcn.description')}
              delay={0.3}
              fontClass="font-manrope"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title={t('features.typescript.title')}
              description={t('features.typescript.description')}
              delay={0.4}
              fontClass="font-inter"
            />
            <FeatureCard 
              icon={<Boxes className="w-6 h-6" />}
              title={t('features.hooks.title')}
              description={t('features.hooks.description')}
              delay={0.5}
              fontClass="font-nunito"
            />
            <FeatureCard 
              icon={<Languages className="w-6 h-6" />}
              title={t('features.i18n.title')}
              description={t('features.i18n.description')}
              delay={0.6}
              fontClass="font-dm"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title={t('features.middleware.title')}
              description={t('features.middleware.description')}
              delay={0.7}
              fontClass="font-source"
            />
          </div>
        </div>
      </section>

      {/* === Fonts Section === */}
      <section id="fonts" className="py-20 md:py-28 bg-muted/30 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider font-mono">{t('typography.sectionLabel')}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mt-3 mb-4 tracking-tight">
              {t('typography.title')}
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              {t('typography.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <FontShowcase />
          </div>
        </div>
      </section>

      {/* === Hooks Section === */}
      <section id="hooks" className="py-20 md:py-28 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider font-mono">
              <Boxes className="w-4 h-4 inline mr-2" />
              Custom Hooks
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-4 tracking-tight">
              20+ React Hooks
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              Production-ready hooks for common patterns. Fully typed, tree-shakeable, zero dependencies.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <HooksShowcase />
          </div>
        </div>
      </section>

      {/* === Utilities Section === */}
      <section id="utilities" className="py-20 md:py-28 bg-muted/30 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider font-mono">
              <Package className="w-4 h-4 inline mr-2" />
              Utility Library
            </span>
            <h2 className="text-3xl md:text-5xl font-space font-bold mt-3 mb-4 tracking-tight">
              185+ Helper Functions
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              Categorized, documented utilities for strings, arrays, dates, validation, and more.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <UtilitiesShowcase />
          </div>
        </div>
      </section>

      {/* === Updates Section === */}
      <section id="updates" className="py-20 md:py-28 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wider font-mono">
              <History className="w-4 h-4 inline mr-2" />
              {t('updates.sectionLabel')}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-4 tracking-tight">
              {t('updates.title')}
            </h2>
            <p className="text-lg text-muted-foreground font-sans">
              {t('updates.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <UpdateCard 
              version="v1.3" 
              title={t('updates.v13.title')} 
              description={t('updates.v13.description')} 
              isLatest 
            />
            <UpdateCard 
              version="v1.2" 
              title={t('updates.v12.title')} 
              description={t('updates.v12.description')} 
            />
            <UpdateCard 
              version="v1.1" 
              title={t('updates.v11.title')} 
              description={t('updates.v11.description')} 
            />
            <UpdateCard 
              version="v1.0" 
              title={t('updates.v10.title')} 
              description={t('updates.v10.description')} 
            />
          </div>
        </div>
      </section>

      {/* === CTA Section === */}
      <section className="py-20 md:py-28 relative">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-primary/10 via-violet-500/5 to-fuchsia-500/10 border border-primary/20 overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight relative z-10">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto relative z-10 font-sans">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" className="h-14 px-8 rounded-full text-base font-bold gap-2">
                <Rocket className="w-5 h-5" />
                {t('cta.primary')}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base gap-2">
                <BookOpen className="w-5 h-5" />
                {t('cta.secondary')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="py-16 border-t border-border/40 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Ourin Logo" width={40} height={40} className="rounded-lg" />
                <span className="font-display font-bold text-xl">Ourin</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed mb-4 font-sans">
                {t('footer.description')}
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/LuckyArch/ourin-nextjs-starter" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">{t('nav.features')}</a></li>
                <li><a href="#fonts" className="hover:text-foreground transition-colors">{t('nav.fonts')}</a></li>
                <li><a href="https://github.com/LuckyArch/ourin-nextjs-starter" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{t('nav.docs')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link></li>
                <li><a href="https://github.com/LuckyArch/ourin-nextjs-starter/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{t('footer.license')}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-sans">
              © {new Date().getFullYear()} Ourin. {t('footer.madeWith')} <Heart className="w-4 h-4 inline text-red-500" /> {t('footer.by')}{' '}
              <a href="https://github.com/LuckyArch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                Fauzan Adyatma P
              </a>
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{t('footer.starUs')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
