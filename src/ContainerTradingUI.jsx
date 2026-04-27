import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ChevronDown, Anchor, Ship, Globe, Package, Truck, TrendingUp, MapPin, Award, Mail, Clock, MapPinned, Send, Linkedin, Twitter, Facebook, Instagram, ArrowUp } from "lucide-react";
import logo from "./assets/logo.png";

// ─── Theme Context ──────────────────────────────────────────────────────────
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark((d) => !d);
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── VIBGYOR Colors ─────────────────────────────────────────────────────────
const V = {
  violet: "#8B5CF6",
  indigo: "#6366F1",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  orange: "#F97316",
  red: "#EF4444",
  gradient: "linear-gradient(135deg, #8B5CF6, #6366F1, #3B82F6, #10B981, #F59E0B, #F97316, #EF4444)",
  gradientShort: "linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)",
};

// ─── Theme Tokens ───────────────────────────────────────────────────────────
const theme = (dark) => ({
  bg: dark ? "#0A0A0F" : "#FAFAFA",
  surface: dark ? "#12121A" : "#FFFFFF",
  surface2: dark ? "#1A1A26" : "#F3F4F6",
  text: dark ? "#F1F1F4" : "#111827",
  muted: dark ? "#9CA3AF" : "#6B7280",
  border: dark ? "rgba(139,92,246,0.15)" : "rgba(99,102,241,0.12)",
  navBg: dark ? "rgba(10,10,15,0.85)" : "rgba(250,250,250,0.85)",
  cardBg: dark ? "rgba(18,18,26,0.6)" : "rgba(255,255,255,0.6)",
});

// ─── Constants ──────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Services", "Trade", "About", "Media", "Contact"];

const STATS = [
  { value: "12K+", label: "Containers Traded", color: V.violet },
  { value: "80+", label: "Countries Served", color: V.blue },
  { value: "15Y", label: "Industry Experience", color: V.green },
  { value: "99%", label: "On-Time Delivery", color: V.orange },
];

const SERVICES = [
  {
    Icon: Package, title: "Buy Containers", tag: "PROCUREMENT", color: V.violet,
    desc: "Source premium ISO containers worldwide — 20ft, 40ft, HC & specialised units at competitive rates with full inspection reports.",
  },
  {
    Icon: TrendingUp, title: "Sell Containers", tag: "LIQUIDATION", color: V.blue,
    desc: "Maximise asset value through our global buyer network. We handle listing, negotiation, documentation and handover end-to-end.",
  },
  {
    Icon: Truck, title: "Logistics & Shipping", tag: "FREIGHT", color: V.green,
    desc: "Door-to-port and port-to-port freight management, customs clearance, inland haulage and real-time cargo tracking.",
  },
];

// ─── Navbar ─────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { dark, toggle } = useTheme();
  const t = theme(dark);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          height: 70,
          background: scrolled ? t.navBg : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
          transition: "background 0.4s, border-bottom 0.4s, backdrop-filter 0.4s",
          padding: "0 clamp(1rem, 4vw, 3rem)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", cursor: "pointer" }}
        >
          <img src={logo} alt="Bigteus Intermodal" style={{ height: 65, width: 200, objectFit: "contain", filter: dark ? "brightness(1.2)" : "none" }} />
        </motion.a>

        {/* Desktop Links */}
        <div style={{
          display: "flex", gap: "2rem", alignItems: "center",
        }} className="gct-nav-links">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              whileHover={{ y: -2 }}
              style={{
                color: t.muted, textDecoration: "none",
                fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.06em",
                transition: "color 0.25s", position: "relative",
              }}
              onMouseEnter={(e) => { e.target.style.color = V.violet; }}
              onMouseLeave={(e) => { e.target.style.color = t.muted; }}
            >
              {link.toUpperCase()}
            </motion.a>
          ))}
        </div>

        {/* Right side: theme toggle + CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Dark/Light toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              background: t.surface2, border: `1px solid ${t.border}`,
              borderRadius: "50%", width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: dark ? V.yellow : V.indigo,
              transition: "background 0.3s, border-color 0.3s",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          {/* CTA Button — desktop */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(139,92,246,0.4)" }}
            whileTap={{ scale: 0.96 }}
            className="gct-nav-cta"
            style={{
              background: V.gradient, color: "#fff", border: "none",
              padding: "10px 24px", borderRadius: 8,
              fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.8rem",
              letterSpacing: "0.06em", cursor: "pointer",
            }}
          >
            GET A QUOTE
          </motion.button>

          {/* Hamburger — mobile */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((o) => !o)}
            className="gct-hamburger"
            aria-label="Toggle menu"
            style={{
              display: "none", background: "transparent", border: "none",
              color: t.text, cursor: "pointer", padding: 4,
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed", top: 70, left: 0, right: 0, bottom: 0,
              zIndex: 999,
              background: dark ? "rgba(10,10,15,0.97)" : "rgba(250,250,250,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "1.8rem",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: t.text, textDecoration: "none",
                  fontSize: "1.4rem", fontWeight: 600, letterSpacing: "0.08em",
                  fontFamily: "'Space Grotesk',sans-serif",
                }}
              >
                {link}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: "1rem",
                background: V.gradient, color: "#fff", border: "none",
                padding: "14px 40px", borderRadius: 10,
                fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.95rem",
                letterSpacing: "0.06em", cursor: "pointer",
              }}
            >
              GET A QUOTE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .gct-nav-links { display: none !important; }
          .gct-nav-cta { display: none !important; }
          .gct-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};

// ─── Hero Canvas ────────────────────────────────────────────────────────────
const HeroCanvas = ({ dark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#8B5CF6", "#6366F1", "#3B82F6", "#10B981", "#F59E0B", "#F97316", "#EF4444"];

    // Particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      x: (i * 137.5) % 1000 / 1000,
      y: (i * 89.3) % 1000 / 1000,
      r: 1.5 + (i % 4) * 0.8,
      speed: 0.15 + (i % 5) * 0.08,
      color: colors[i % colors.length],
      phase: i * 0.5,
    }));

    // Floating containers
    const boxes = [
      { x: 0.08, y: 0.15, w: 70, h: 30, color: colors[0], delay: 0, dur: 9 },
      { x: 0.85, y: 0.1, w: 55, h: 24, color: colors[1], delay: 1.2, dur: 11 },
      { x: 0.12, y: 0.8, w: 85, h: 35, color: colors[2], delay: 2.5, dur: 8 },
      { x: 0.75, y: 0.75, w: 62, h: 27, color: colors[3], delay: 0.7, dur: 13 },
      { x: 0.45, y: 0.06, w: 50, h: 22, color: colors[4], delay: 3.1, dur: 10 },
      { x: 0.9, y: 0.45, w: 74, h: 32, color: colors[5], delay: 1.8, dur: 12 },
      { x: 0.03, y: 0.5, w: 58, h: 25, color: colors[6], delay: 4, dur: 9 },
      { x: 0.6, y: 0.88, w: 78, h: 33, color: colors[0], delay: 2.2, dur: 11 },
    ];

    let start = null;

    const tick = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      ctx.clearRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = dark ? "rgba(139,92,246,0.03)" : "rgba(99,102,241,0.04)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < W; gx += 80) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 80) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // Containers
      boxes.forEach((b) => {
        const elapsed = t + b.delay * 0.8;
        const floatY = Math.sin(elapsed * (6.28 / b.dur)) * 20;
        const angle = Math.sin(elapsed * 0.4) * 0.1;
        const alpha = dark ? 0.35 + Math.sin(elapsed * 0.7) * 0.15 : 0.25 + Math.sin(elapsed * 0.7) * 0.12;
        const cx = b.x * W, cy = b.y * H + floatY;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.fillStyle = b.color;
        ctx.strokeStyle = dark ? "rgba(139,92,246,0.25)" : "rgba(99,102,241,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 3);
        ctx.fill();
        ctx.stroke();
        // Corrugation
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        const lines = Math.floor(b.w / 12);
        for (let i = 1; i < lines; i++) {
          const lx = -b.w / 2 + (b.w / lines) * i;
          ctx.beginPath(); ctx.moveTo(lx, -b.h / 2 + 3); ctx.lineTo(lx, b.h / 2 - 3); ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
      });

      // Particles
      particles.forEach((p) => {
        const px = ((p.x * W + t * p.speed * 30) % W);
        const py = ((p.y * H + Math.sin(t + p.phase) * 15) % H);
        const a = 0.25 + Math.sin(t * 0.5 + p.phase) * 0.2;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [dark]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
};

// ─── Hero ───────────────────────────────────────────────────────────────────
const Hero = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Floating orb positions
  const orbs = [
    { size: 300, x: "15%", y: "20%", color: V.violet, blur: 120, opacity: dark ? 0.15 : 0.25 },
    { size: 250, x: "75%", y: "60%", color: V.blue, blur: 100, opacity: dark ? 0.12 : 0.2 },
    { size: 200, x: "60%", y: "10%", color: V.green, blur: 90, opacity: dark ? 0.1 : 0.18 },
    { size: 180, x: "25%", y: "75%", color: V.orange, blur: 80, opacity: dark ? 0.08 : 0.15 },
  ];

  return (
    <section
      id="home"
      style={{
        position: "relative", height: "100vh", minHeight: 650,
        overflow: "hidden", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Canvas */}
      <HeroCanvas dark={dark} />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: dark
          ? "linear-gradient(160deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.5) 45%, rgba(10,10,15,0.88) 100%)"
          : "linear-gradient(160deg, rgba(250,250,250,0.75) 0%, rgba(250,250,250,0.4) 45%, rgba(250,250,250,0.7) 100%)",
      }} />

      {/* Floating orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: orb.x, top: orb.y, zIndex: 2,
            width: orb.size, height: orb.size, borderRadius: "50%",
            background: orb.color, filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity, pointerEvents: "none",
          }}
        />
      ))}

      {/* Content */}
      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, textAlign: "center", maxWidth: 960, padding: "0rem", width: "100%" }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: dark ? "rgba(139,92,246,0.08)" : "rgba(99,102,241,0.08)",
            border: `1px solid ${dark ? "rgba(139,92,246,0.3)" : "rgba(99,102,241,0.25)"}`,
            padding: "8px 20px", borderRadius: 999, marginBottom: "0.2rem", marginTop: "3rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <Globe size={13} style={{ color: V.violet }} />
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.18em", color: V.violet, fontWeight: 600 }}>
            CHENNAI · INTERMODAL OPERATIONS
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
            lineHeight: 1.08, fontWeight: 700,
            marginBottom: "1.5rem", letterSpacing: "-0.02em",
          }}
        >
          Bigteus Intermodal
          <br />
          <span style={{
            background: V.gradient,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: dark ? "drop-shadow(0 0 40px rgba(139,92,246,0.3))" : "none",
          }}>
            Private Limited
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: t.muted, lineHeight: 1.75,
            maxWidth: 560, margin: "0 auto 2.5rem",
          }}
        >
          Seamless import-export operations, premium container procurement and
          world-class intermodal freight logistics — led by Mr. Muthuvijay from Chennai, India.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(99,102,241,0.15)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: V.gradient, color: "#fff", border: "none",
              padding: "16px 44px", borderRadius: 10, fontWeight: 700,
              fontSize: "0.9rem", letterSpacing: "0.08em", cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
            }}
          >
            GET STARTED
          </motion.button>
          <motion.button
            whileHover={{
              background: dark ? "rgba(139,92,246,0.1)" : "rgba(99,102,241,0.08)",
              borderColor: V.violet,
            }}
            style={{
              background: "transparent", color: t.text,
              border: `1px solid ${dark ? "rgba(139,92,246,0.35)" : "rgba(99,102,241,0.3)"}`,
              padding: "16px 44px", borderRadius: 10, fontWeight: 500,
              fontSize: "0.9rem", letterSpacing: "0.06em", cursor: "pointer",
              fontFamily: "'Inter',sans-serif", transition: "all 0.3s",
              backdropFilter: "blur(10px)",
            }}
          >
            EXPLORE SERVICES
          </motion.button>
        </motion.div>

        {/* Floating icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "3rem" }}
        >
          {[{ Icon: Ship, label: "Shipping" }, { Icon: Anchor, label: "Ports" }, { Icon: Globe, label: "Global" }].map(({ Icon, label }, i) => (
            <motion.div
              key={label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: dark ? "rgba(139,92,246,0.08)" : "rgba(99,102,241,0.06)",
                border: `1px solid ${dark ? "rgba(139,92,246,0.2)" : "rgba(99,102,241,0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}>
                <Icon size={18} style={{ color: V.violet }} />
              </div>
              <span style={{ fontSize: "0.65rem", color: t.muted, letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: t.muted, opacity: 0.6 }}>SCROLL</span>
        <ChevronDown size={16} style={{ color: V.violet, opacity: 0.7 }} />
      </motion.div>
    </section>
  );
};

// ─── useInView hook ─────────────────────────────────────────────────────────
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ─── Animated Counter ───────────────────────────────────────────────────────
const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target.replace(/\D/g, ""));
    let cur = 0;
    const step = Math.ceil(num / 50);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= num) { setCount(num); clearInterval(timer); }
      else setCount(cur);
    }, 30);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{target.replace(/\d+/, count)}</span>;
};

// ─── Stats Bar ──────────────────────────────────────────────────────────────
const StatsBar = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();

  return (
    <section
      ref={ref}
      style={{
        background: t.surface, padding: "3.5rem 2rem",
        borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "2rem", textAlign: "center",
      }}>
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            style={{
              padding: "1.5rem 1rem", borderRadius: 16,
              background: dark ? "rgba(139,92,246,0.04)" : "rgba(99,102,241,0.03)",
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700,
              background: `linear-gradient(135deg, ${s.color}, ${V.indigo})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "0.4rem",
            }}>
              <Counter target={s.value} />
            </div>
            <div style={{
              fontSize: "0.75rem", letterSpacing: "0.14em",
              color: t.muted, textTransform: "uppercase",
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── Services ───────────────────────────────────────────────────────────────
const Services = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();

  return (
    <section id="services" ref={ref} style={{ background: t.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span style={{
            fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600,
            background: V.gradientShort,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            WHAT WE OFFER
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
            marginTop: "0.8rem",
          }}>
            Our Core{" "}
            <span style={{
              background: V.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Services</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              whileHover={{
                y: -10,
                boxShadow: dark
                  ? `0 25px 60px rgba(0,0,0,0.5), 0 0 30px ${s.color}20`
                  : `0 25px 60px rgba(0,0,0,0.08), 0 0 30px ${s.color}15`,
              }}
              style={{
                background: dark ? "rgba(18,18,26,0.6)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${t.border}`, borderRadius: 16,
                padding: "2.5rem 2rem", cursor: "default",
                position: "relative", overflow: "hidden",
                transition: "box-shadow 0.3s",
              }}
            >
              {/* Corner glow */}
              <div style={{
                position: "absolute", top: -40, right: -40,
                width: 120, height: 120, borderRadius: "50%",
                background: s.color, filter: "blur(60px)",
                opacity: dark ? 0.08 : 0.05, pointerEvents: "none",
              }} />

              {/* Tag */}
              <span style={{
                fontSize: "0.65rem", letterSpacing: "0.22em", fontWeight: 600,
                color: s.color, marginBottom: "1.2rem", display: "block",
              }}>
                {s.tag}
              </span>

              {/* Icon */}
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${s.color}12`, border: `1px solid ${s.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.2rem",
              }}>
                <s.Icon size={22} style={{ color: s.color }} />
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.8rem",
              }}>
                {s.title}
              </h3>

              {/* Description */}
              <p style={{ color: t.muted, lineHeight: 1.75, fontSize: "0.9rem" }}>
                {s.desc}
              </p>

              {/* Bottom gradient line on hover */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 3, background: `linear-gradient(90deg, ${s.color}, ${V.indigo})`,
                  transformOrigin: "left",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Trade Routes Data ──────────────────────────────────────────────────────
const TRADE_ROUTES = [
  { from: "Singapore", to: "Rotterdam", fx: 0.68, fy: 0.58, tx: 0.47, ty: 0.25, color: V.violet },
  { from: "Shanghai", to: "Los Angeles", fx: 0.76, fy: 0.38, tx: 0.12, ty: 0.35, color: V.blue },
  { from: "Dubai", to: "Mumbai", fx: 0.56, fy: 0.45, tx: 0.65, ty: 0.48, color: V.green },
  { from: "Hamburg", to: "New York", fx: 0.48, fy: 0.22, tx: 0.2, ty: 0.32, color: V.orange },
  { from: "Tokyo", to: "Sydney", fx: 0.82, fy: 0.36, tx: 0.85, fy2: 0.36, ty: 0.74, color: V.red },
  { from: "Cape Town", to: "London", fx: 0.5, fy: 0.74, tx: 0.46, ty: 0.2, color: V.yellow },
];

const PORTS = [
  { x: 0.68, y: 0.58, name: "Singapore" },
  { x: 0.76, y: 0.38, name: "Shanghai" },
  { x: 0.56, y: 0.45, name: "Dubai" },
  { x: 0.48, y: 0.22, name: "Hamburg" },
  { x: 0.82, y: 0.36, name: "Tokyo" },
  { x: 0.5, y: 0.74, name: "Cape Town" },
  { x: 0.47, y: 0.25, name: "Rotterdam" },
  { x: 0.12, y: 0.35, name: "Los Angeles" },
  { x: 0.65, y: 0.48, name: "Mumbai" },
  { x: 0.2, y: 0.32, name: "New York" },
  { x: 0.85, y: 0.74, name: "Sydney" },
  { x: 0.46, y: 0.2, name: "London" },
];

// ─── Trade Map ──────────────────────────────────────────────────────────────
const TradeMap = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();
  const [dim, setDim] = useState({ w: 800, h: 400 });
  const svgRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const r = svgRef.current.getBoundingClientRect();
        setDim({ w: r.width || 800, h: r.height || 400 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const px = (v) => v * dim.w;
  const py = (v) => v * dim.h;

  return (
    <section id="trade" ref={ref} style={{ background: t.surface, padding: "6rem 2rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span style={{
            fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600,
            background: V.gradientShort,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            LIVE NETWORK
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
            marginTop: "0.8rem",
          }}>
            Global{" "}
            <span style={{
              background: V.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Trade Routes</span>
          </h2>
          <p style={{ color: t.muted, maxWidth: 500, margin: "1rem auto 0", lineHeight: 1.7 }}>
            Real-time container movements connecting the world's busiest shipping hubs.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: "relative", borderRadius: 20,
            border: `1px solid ${t.border}`, overflow: "hidden",
            aspectRatio: "2 / 1",
            background: dark
              ? "linear-gradient(135deg, #0A0A0F 0%, #12121A 100%)"
              : "linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 100%)",
          }}
        >
          {/* Map image */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png"
            alt="World map"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: dark ? 0.06 : 0.08,
              filter: dark ? "invert(1) sepia(1) saturate(0)" : "sepia(1) saturate(0)",
            }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${V.violet}08 0%, transparent 70%)`,
          }} />

          {/* SVG routes */}
          <svg ref={svgRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {visible && TRADE_ROUTES.map((r, i) => {
              const x1 = px(r.fx), y1 = py(r.fy), x2 = px(r.tx), y2 = py(r.ty);
              const mx = (x1 + x2) / 2;
              const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.18;
              const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
              return (
                <g key={i}>
                  {/* Static faint path */}
                  <path d={d} fill="none" stroke={`${r.color}20`} strokeWidth="1" />
                  {/* Animated path */}
                  <motion.path
                    d={d} fill="none" stroke={r.color} strokeWidth="2"
                    strokeLinecap="round" opacity={0.7}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </g>
              );
            })}

            {/* Port dots */}
            {PORTS.map((p, i) => (
              <g key={i}>
                <motion.circle
                  cx={px(p.x)} cy={py(p.y)} r="7"
                  fill={`${V.violet}15`} stroke={V.violet} strokeWidth="1"
                  animate={{ r: [5, 8, 5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <circle cx={px(p.x)} cy={py(p.y)} r="3" fill={V.violet} />
                <text
                  x={px(p.x) + 10} y={py(p.y) + 4}
                  fill={t.muted} fontSize="9" fontFamily="Inter, sans-serif"
                  opacity={0.8}
                >
                  {p.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: 16, left: 16,
            display: "flex", alignItems: "center", gap: 8,
            background: dark ? "rgba(10,10,15,0.7)" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)", borderRadius: 10,
            padding: "8px 14px", border: `1px solid ${t.border}`,
          }}>
            <MapPin size={12} style={{ color: V.violet }} />
            <span style={{ fontSize: "0.65rem", color: t.muted, letterSpacing: "0.1em" }}>12 ACTIVE PORTS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── About ──────────────────────────────────────────────────────────────────
const ABOUT_DETAILS = [
  { Icon: MapPinned, label: "No.17 E, Neithal Street, Thiruvallur Nagar, Perungudi, Chennai - 600096", color: V.violet },
  { Icon: Mail, label: "info@bigteus-intermodal.com", color: V.blue },
  { Icon: Clock, label: "Mon – Sat, 09:00 – 19:00 IST", color: V.green },
];

const About = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();

  return (
    <section id="about" ref={ref} style={{ background: t.bg, padding: "6rem 2rem" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "4rem", alignItems: "center",
      }}>
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span style={{
            fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600,
            background: V.gradientShort,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            WHO WE ARE
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700,
            marginTop: "0.8rem", marginBottom: "1.5rem", lineHeight: 1.2,
          }}>
            Trusted Leaders in<br />
            <span style={{
              background: V.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Intermodal Trade</span>
          </h2>
          <p style={{ color: t.muted, lineHeight: 1.8, marginBottom: "1.2rem", fontSize: "0.95rem" }}>
            Bigteus Intermodal Private Limited, led by Managing Director Mr. Muthuvijay,
            is a trusted bridge between buyers and sellers across the world's most active shipping corridors.
          </p>
          <p style={{ color: t.muted, lineHeight: 1.8, marginBottom: "2.5rem", fontSize: "0.95rem" }}>
            From our Chennai headquarters, we orchestrate seamless container
            transactions and intermodal freight operations that power global commerce.
          </p>

          {/* Contact details */}
          {ABOUT_DETAILS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${item.color}10`, border: `1px solid ${item.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <item.Icon size={16} style={{ color: item.color }} />
              </div>
              <span style={{ color: t.text, fontSize: "0.9rem" }}>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Right — Image + Badge */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "relative" }}
        >
          <div style={{
            borderRadius: 20, overflow: "hidden",
            border: `1px solid ${t.border}`, position: "relative",
          }}>
            <img
              src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80"
              alt="Container ship"
              style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }}
            />
            {/* Gradient overlay on image */}
            <div style={{
              position: "absolute", inset: 0,
              background: dark
                ? "linear-gradient(to top, rgba(10,10,15,0.8) 0%, transparent 60%)"
                : "linear-gradient(to top, rgba(250,250,250,0.7) 0%, transparent 60%)",
            }} />
            {/* VIBGYOR gradient border glow */}
            <div style={{
              position: "absolute", inset: -1, borderRadius: 20,
              background: V.gradient, opacity: 0.15, zIndex: -1,
              filter: "blur(20px)", pointerEvents: "none",
            }} />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: -20, left: 24,
              background: dark ? "rgba(18,18,26,0.85)" : "rgba(255,255,255,0.9)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${t.border}`, borderRadius: 14,
              padding: "1rem 1.4rem",
              display: "flex", gap: "0.8rem", alignItems: "center",
              boxShadow: dark
                ? "0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1)"
                : "0 20px 50px rgba(0,0,0,0.08), 0 0 20px rgba(99,102,241,0.08)",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${V.yellow}12`, border: `1px solid ${V.yellow}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Award size={20} style={{ color: V.yellow }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", fontFamily: "'Space Grotesk',sans-serif" }}>ISO 9001 Certified</div>
              <div style={{ color: t.muted, fontSize: "0.72rem" }}>Quality Management</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Media Gallery ──────────────────────────────────────────────────────────
const MEDIA_IMAGES = [
  { url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80", alt: "Container port aerial view", color: V.violet },
  { url: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80", alt: "Cargo ship at sea", color: V.blue },
  { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80", alt: "Stacked shipping containers", color: V.green },
  { url: "https://images.unsplash.com/photo-1504093376055-b3094b674dcb?w=800&q=80", alt: "Container crane operations", color: V.orange },
  { url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80", alt: "Port logistics", color: V.red },
  { url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80", alt: "Container ship at dusk", color: V.yellow },
];

const Media = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();

  return (
    <section id="media" ref={ref} style={{ background: t.surface, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span style={{
            fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600,
            background: V.gradientShort,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            GALLERY
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700,
            marginTop: "0.8rem",
          }}>
            Operations in{" "}
            <span style={{
              background: V.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Action</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.2rem",
        }}>
          {MEDIA_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover="hover"
              style={{
                position: "relative", borderRadius: 16, overflow: "hidden",
                aspectRatio: "4 / 3", cursor: "pointer",
                border: `1px solid ${t.border}`,
              }}
            >
              {/* Image */}
              <motion.img
                src={img.url} alt={img.alt}
                variants={{ hover: { scale: 1.08 } }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* Hover overlay */}
              <motion.div
                variants={{ hover: { opacity: 1 } }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute", inset: 0,
                  background: dark
                    ? `linear-gradient(to top, rgba(10,10,15,0.9) 0%, ${img.color}15 100%)`
                    : `linear-gradient(to top, rgba(0,0,0,0.7) 0%, ${img.color}10 100%)`,
                  display: "flex", alignItems: "flex-end", padding: "1.5rem",
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.88rem", fontWeight: 500 }}>
                  {img.alt}
                </span>
              </motion.div>

              {/* Gradient border on hover */}
              <motion.div
                variants={{ hover: { opacity: 1 } }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute", inset: 0, borderRadius: 16,
                  boxShadow: `inset 0 0 0 2px ${img.color}`,
                  pointerEvents: "none",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Contact ────────────────────────────────────────────────────────────────
const Contact = () => {
  const { dark } = useTheme();
  const t = theme(dark);
  const [ref, visible] = useInView();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSubmitted(true);
  };

  const inputBase = (field) => ({
    width: "100%",
    background: dark ? "rgba(10,10,15,0.6)" : "rgba(243,244,246,0.8)",
    border: `1px solid ${errors[field] ? V.red : t.border}`,
    borderRadius: 10, padding: "14px 16px",
    color: t.text, fontSize: "0.9rem",
    fontFamily: "'Inter',sans-serif", outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  });

  return (
    <section id="contact" ref={ref} style={{ background: t.bg, padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span style={{
            fontSize: "0.72rem", letterSpacing: "0.25em", fontWeight: 600,
            background: V.gradientShort,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            REACH OUT
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700,
            marginTop: "0.8rem",
          }}>
            Start a{" "}
            <span style={{
              background: V.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Conversation</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: "center", padding: "4rem 2rem",
                background: dark ? "rgba(18,18,26,0.6)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: 20, border: `1px solid ${V.green}40`,
                boxShadow: `0 0 40px ${V.green}15`,
              }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.6rem", marginBottom: "0.8rem" }}>Message Sent!</h3>
              <p style={{ color: t.muted, marginBottom: "2rem" }}>Our team will get back to you within 24 hours.</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                style={{
                  background: V.gradient, color: "#fff", border: "none",
                  padding: "12px 30px", borderRadius: 8, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                }}
              >
                SEND ANOTHER
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background: dark ? "rgba(18,18,26,0.6)" : "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: 20, border: `1px solid ${t.border}`,
                padding: "2.5rem",
              }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.2rem", marginBottom: "1.2rem",
              }}>
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label style={{
                      fontSize: "0.7rem", letterSpacing: "0.15em",
                      color: t.muted, textTransform: "uppercase",
                      display: "block", marginBottom: "0.5rem",
                    }}>{field}</label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      onFocus={(e) => { e.target.style.borderColor = V.violet; e.target.style.boxShadow = `0 0 0 3px ${V.violet}15`; }}
                      onBlur={(e) => { e.target.style.borderColor = errors[field] ? V.red : t.border; e.target.style.boxShadow = "none"; }}
                      placeholder={field === "name" ? "Your name" : field === "email" ? "you@company.com" : "+91 0000000000"}
                      style={inputBase(field)}
                    />
                    {errors[field] && <span style={{ color: V.red, fontSize: "0.72rem", marginTop: 4, display: "block" }}>{errors[field]}</span>}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  fontSize: "0.7rem", letterSpacing: "0.15em",
                  color: t.muted, textTransform: "uppercase",
                  display: "block", marginBottom: "0.5rem",
                }}>Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = V.violet; e.target.style.boxShadow = `0 0 0 3px ${V.violet}15`; }}
                  onBlur={(e) => { e.target.style.borderColor = errors.message ? V.red : t.border; e.target.style.boxShadow = "none"; }}
                  placeholder="Tell us about your container requirements..."
                  style={{ ...inputBase("message"), resize: "vertical", minHeight: 120 }}
                />
                {errors.message && <span style={{ color: V.red, fontSize: "0.72rem", marginTop: 4, display: "block" }}>{errors.message}</span>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${V.violet}30` }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                style={{
                  width: "100%", background: V.gradient, color: "#fff",
                  border: "none", padding: "16px", borderRadius: 10,
                  fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.1em",
                  cursor: "pointer", fontFamily: "'Inter',sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Send size={16} />
                SEND MESSAGE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// ─── Footer ─────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  { title: "Services", links: ["Buy Containers", "Sell Containers", "Logistics", "Customs Clearance"] },
  { title: "Company", links: ["About Us", "Careers", "Press", "Partners"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/bigteus_intermodal_pvt_ltd" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

const Footer = () => {
  const { dark } = useTheme();
  const t = theme(dark);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={{
      background: t.surface,
      borderTop: `1px solid ${t.border}`,
      padding: "4rem 2rem 2rem",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem", marginBottom: "3rem",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
              <img src={logo} alt="Bigteus Intermodal" style={{ height: 55, width: 180, objectFit: "contain", filter: dark ? "brightness(1.2)" : "none" }} />
            </div>
            <p style={{ color: t.muted, fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "0.8rem" }}>
              Bigteus Intermodal Pvt Ltd<br />No.17 E, Neithal Street, Perungudi, Chennai - 600096
            </p>
            <p style={{ color: t.muted, fontSize: "0.8rem" }}>info@bigteus-intermodal.com</p>
            <p style={{ color: t.muted, fontSize: "0.75rem", marginTop: "0.4rem", opacity: 0.7 }}>CIN: U77308TN2026PTC192021</p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div style={{
                fontSize: "0.68rem", letterSpacing: "0.2em", fontWeight: 600,
                marginBottom: "1rem", textTransform: "uppercase",
                background: V.gradientShort,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{col.title}</div>
              {col.links.map((link) => (
                <motion.a
                  key={link} href="#"
                  whileHover={{ x: 4, color: V.violet }}
                  style={{
                    display: "block", color: t.muted, fontSize: "0.85rem",
                    textDecoration: "none", marginBottom: "0.5rem",
                    transition: "color 0.2s",
                  }}
                >{link}</motion.a>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.border, marginBottom: "2rem" }} />

        {/* Bottom bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "1rem",
          justifyContent: "space-between", alignItems: "center",
        }}>
          <p style={{ color: t.muted, fontSize: "0.75rem" }}>
            © 2025 Bigteus Intermodal Private Limited. All rights reserved.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {/* Socials */}
            {SOCIALS.map(({ Icon, label, href }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.15, color: V.violet }}
                style={{
                  color: t.muted, transition: "color 0.2s",
                  display: "flex", alignItems: "center",
                }}
              >
                <Icon size={16} />
              </motion.a>
            ))}

            {/* Back to top */}
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: `0 0 15px ${V.violet}30` }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollTop}
              aria-label="Back to top"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: dark ? "rgba(139,92,246,0.1)" : "rgba(99,102,241,0.08)",
                border: `1px solid ${t.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: V.violet, marginLeft: "0.5rem",
              }}
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Root ────────────────────────────────────────────────────────────────────
export default function ContainerTradingUI() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

function AppShell() {
  const { dark } = useTheme();
  const t = theme(dark);

  return (
    <div style={{
      background: t.bg, color: t.text, minHeight: "100vh",
      transition: "background 0.4s, color 0.4s",
    }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <TradeMap />
      <About />
      <Media />
      <Contact />
      <Footer />
    </div>
  );
}
