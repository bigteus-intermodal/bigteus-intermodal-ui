import { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import {
  Menu, X, Sun, Moon, ChevronDown, Package, RefrigeratorIcon,
  Wrench, Truck, TrendingUp, ShoppingCart, MapPin, Mail, Clock,
  Phone, Send, Linkedin, Twitter, Facebook, Instagram, ArrowUp,
  Shield, Star, Users, Globe, CheckCircle, ChevronRight
} from "lucide-react";
 
// ─── Image Paths (update to match your actual asset imports) ─────────────────
// In your project, replace these with: import logoImg from "./assets/logo.png"; etc.
const ASSETS = {
  logo: "/assets/logo.png",                            // BTi logo
  heroContainers: "/assets/container_leasing.jpeg",      // stacked blue sky containers
  containersRoad: "/assets/containers_road.jpeg",       // road flanked by containers
  containersSunset: "/assets/containers_sunset.jpeg",   // sunset golden containers
  containersStack: "/assets/containers_stack.jpeg",     // industrial stacked
  cabinGreen: "/assets/cabin_green.jpeg",               // green office cabin
  kioskBlue: "/assets/kiosk_blue.jpeg",                 // blue open kiosk
  portacabinWhite: "/assets/portacabin_white.jpeg",     // white portacabin
  background: "/assets/background.jpeg",       // road flanked by containers
  bgVideo: "/assets/video/bgvideo.mp4",         // hero background video
};
 
// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);
const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};
 
// ─── Brand Colors — Steel Navy + Gold (matches BTi logo) ─────────────────────
const B = {
  navy:    "#1B2B4B",
  navyDk:  "#0F1A2E",
  gold:    "#C8860A",
  goldLt:  "#E8A020",
  steel:   "#2E4070",
  accent:  "#D4972A",
  gradH:   "linear-gradient(135deg, #1B2B4B 0%, #2E4070 40%, #C8860A 100%)",
  gradG:   "linear-gradient(90deg, #1B2B4B, #C8860A)",
  gradGLt: "linear-gradient(90deg, #2E4070, #E8A020)",
};
 
// ─── Theme Tokens ─────────────────────────────────────────────────────────────
const T = (dark) => ({
  bg:      dark ? "#0B0F1A" : "#F7F8FC",
  surface: dark ? "#111827" : "#FFFFFF",
  surface2:dark ? "#1A2235" : "#EEF1F8",
  text:    dark ? "#EDF0F7" : "#0F172A",
  muted:   dark ? "#8B9AB5" : "#5A6785",
  border:  dark ? "rgba(200,134,10,0.18)" : "rgba(27,43,75,0.12)",
  navBg:   dark ? "rgba(11,15,26,0.88)" : "rgba(247,248,252,0.88)",
  card:    dark ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.85)",
});
 
// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["Home", "Services", "About", "Media", "Contact"];
 
const SERVICES = [
  {
    icon: ShoppingCart,
    tag: "TRADING",
    title: "Container Trading",
    subtitle: "Sell & Buy",
    desc: "We offer a wide range of new and used shipping containers — dry and refrigerated units in multiple sizes. Reliable, cost-effective container solutions across India and overseas.",
    color: B.gold,
    img: ASSETS.containersStack,
  },
  {
    icon: Package,
    tag: "LEASING",
    title: "Container Leasing",
    subtitle: "Export & Domestic",
    desc: "Dependable leasing solutions for dry and refrigerated containers — new and used units with flexible options, timely service, and a focus on quality and customer satisfaction.",
    color: B.steel,
    img: ASSETS.heroContainers,
  },
  {
    icon: Wrench,
    tag: "FABRICATION",
    title: "Container Fabrication",
    subtitle: "Office, Industrial & Storage",
    desc: "Professional fabrication services creating customised container solutions for offices, industrial use, and storage. Quality, innovation, and durability in every project.",
    color: B.accent,
    img: ASSETS.cabinGreen,
  },
  {
    icon: Truck,
    tag: "TRANSPORTATION",
    title: "Container Transport",
    subtitle: "Door-to-Door Road Services",
    desc: "Reliable road transportation of loaded and empty containers across India. Safe, timely delivery to client locations with efficiency and care.",
    color: "#2E7D52",
    img: ASSETS.containersRoad,
  },
];
 
const PORTS_INDIA = ["Chennai", "Mundra", "Mumbai NSA", "Tuticorin", "Delhi ICD", "Kolkata", "Vizag"];
const PORTS_OVERSEAS = ["China", "Singapore", "Malaysia", "Indonesia", "Dubai", "Europe", "Colombo"];
 
const MEDIA_ITEMS = [
  { src: ASSETS.containersRoad,   alt: "Container yard road view",       color: B.navy },
  { src: ASSETS.containersSunset, alt: "Containers at sunset",           color: B.gold },
  { src: ASSETS.containersStack,  alt: "Stacked containers at port",     color: B.steel },
  { src: ASSETS.cabinGreen,       alt: "Modified office cabin container", color: "#2E7D52" },
  { src: ASSETS.kioskBlue,        alt: "Open-side kiosk container",      color: B.accent },
  { src: ASSETS.portacabinWhite,  alt: "Portable cabin container",       color: B.navy },
];
 
// ─── useInView ────────────────────────────────────────────────────────────────
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
const SR = ({ children, delay = 0, direction = "up", distance = 40, duration = 0.7, once = true, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); if (once) obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);
  const dirs = { up: { y: distance }, down: { y: -distance }, left: { x: distance }, right: { x: -distance } };
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={visible ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ delay, duration, ease: "easeOut" }}
      style={style}>
      {children}
    </motion.div>
  );
};
 
// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { dark, toggle } = useTheme();
  const t = T(dark);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
 
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
 
  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          height: 80,          background: scrolled ? t.navBg : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
          transition: "all 0.4s",
          padding: "0 clamp(1rem, 5vw, 3rem)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.a href="#home" whileHover={{ scale: 1.04 }}
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src={ASSETS.logo} alt="BTi"
            style={{ height: 48, width: 160, objectFit: "contain",
              filter: dark ? "drop-shadow(0 0 8px rgba(200,134,10,0.3))" : "none" }} />
        </motion.a>
 
        {/* Desktop links */}
        <div className="bti-nav-links" style={{ display: "flex", gap: "2.2rem", alignItems: "center" }}>
          {NAV_LINKS.map(link => (
            <motion.a key={link} href={`#${link.toLowerCase()}`}
              whileHover={{ y: -2 }}
              style={{ color: t.muted, textDecoration: "none", fontSize: "0.8rem",
                fontWeight: 600, letterSpacing: "0.1em", transition: "color 0.2s",
                fontFamily: "'Barlow Condensed', sans-serif" }}
              onMouseEnter={e => e.target.style.color = B.goldLt}
              onMouseLeave={e => e.target.style.color = t.muted}
            >{link.toUpperCase()}</motion.a>
          ))}
        </div>
 
        {/* Right controls */}
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggle}
            style={{ width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
              background: t.surface2, border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: dark ? B.goldLt : B.navy }}>
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>
 
          <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            className="bti-nav-cta"
            style={{ background: B.gradG, color: "#fff", border: "none",
              padding: "10px 22px", borderRadius: 6, fontWeight: 700,
              fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", textDecoration: "none",
              display: "inline-flex", alignItems: "center" }}>
            GET A QUOTE
          </motion.a>
 
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(o => !o)}
            className="bti-hamburger"
            style={{ display: "none", background: "transparent", border: "none",
              color: t.text, cursor: "pointer", padding: 4 }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>
 
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
            style={{
              position: "fixed", top: 80, left: 0, right: 0, bottom: 0, zIndex: 999,
              background: dark ? "rgba(11,15,26,0.97)" : "rgba(247,248,252,0.97)",
              backdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "2rem",
            }}>
            {NAV_LINKS.map((link, i) => (
              <motion.a key={link} href={`#${link.toLowerCase()}`}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setOpen(false)}
                style={{ color: T(dark).text, textDecoration: "none",
                  fontSize: "1.6rem", fontWeight: 700,
                  fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}>
                {link.toUpperCase()}
              </motion.a>
            ))}
            <motion.a href="#contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }} onClick={() => setOpen(false)}
              style={{ background: B.gradG, color: "#fff", padding: "14px 44px",
                borderRadius: 8, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em",
                fontFamily: "'Barlow Condensed', sans-serif", textDecoration: "none",
                marginTop: "1rem" }}>
              GET A QUOTE
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&family=Oswald:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .bti-nav-links { display: none !important; }
          .bti-nav-cta { display: none !important; }
          .bti-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
};
 
// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { dark } = useTheme();
  const t = T(dark);
 
  return (
    <section id="home" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background video */}
      <video autoPlay muted loop playsInline style={{
        position: "absolute", inset: 0, zIndex: 0,
        width: "100%", height: "100%", objectFit: "cover",
      }}>
        <source src={ASSETS.bgVideo} type="video/mp4" />
      </video>
 
      {/* Dark overlay — strong so text is readable */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: dark
          ? "linear-gradient(160deg, rgba(11,15,26,0.92) 0%, rgba(15,23,42,0.75) 50%, rgba(11,15,26,0.90) 100%)"
          : "linear-gradient(160deg, rgba(11,15,26,0.85) 0%, rgba(15,23,42,0.65) 50%, rgba(11,15,26,0.80) 100%)",
      }} />
 
      {/* Gold accent stripe top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4, zIndex: 5,
        background: B.gradG,
      }} />
 
      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center",
        maxWidth: 860, padding: "0 1.5rem", width: "100%" }}>
 
        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(0.8rem, 6vw, 4rem)",
            lineHeight: 1.0, fontWeight: 700, marginBottom: "0.4rem",
            letterSpacing: "-0.01em",
           // color: dark ? "#FFFFFF" : "#0F172A",
            color: "#FFFFFF",
            textShadow: "0 2px 20px rgba(200,134,10,0.4), 0 4px 40px rgba(0,0,0,0.5), 0 0 80px rgba(200,134,10,0.15)",
          }}>
          WELCOME TO
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(0.8rem, 6vw, 4rem)",
            lineHeight: 1.0, fontWeight: 700, marginBottom: "1.4rem",
            color: "#FFFFFF",
            textShadow: "0 2px 20px rgba(200,134,10,0.5), 0 4px 50px rgba(0,0,0,0.6), 0 0 100px rgba(200,134,10,0.2), 0 0 150px rgba(200,134,10,0.1)",
          }}>
          BIGTEUS INTERMODAL
        </motion.div>
 
        {/* Tagline */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
            color: "#B0BDD0",
            fontFamily: "'Barlow', sans-serif", fontWeight: 300,
            letterSpacing: "0.05em", marginBottom: "2.5rem",
            maxWidth: 520, margin: "0 auto 2.5rem" }}>
          Your Trusted Partner In Container Solution
        </motion.p>
 
        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a href="#services" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{ background: B.gradG, color: "#fff", border: "none",
              padding: "15px 40px", borderRadius: 6, fontWeight: 700,
              fontSize: "0.88rem", letterSpacing: "0.12em", cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif", textDecoration: "none",
              display: "inline-block" }}>
            EXPLORE SERVICES
          </motion.a>
          <motion.a href="#contact"
            whileHover={{ background: `rgba(200,134,10,0.1)`, borderColor: B.goldLt }}
            style={{ background: "transparent", color: "#EDF0F7",
              border: `1.5px solid rgba(200,134,10,0.45)`,
              padding: "15px 40px", borderRadius: 6, fontWeight: 600,
              fontSize: "0.88rem", letterSpacing: "0.12em", cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
              transition: "all 0.3s", backdropFilter: "blur(8px)",
              textDecoration: "none", display: "inline-block" }}>
            GET A QUOTE
          </motion.a>
        </motion.div>
 
        {/* 3 pillars */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ display: "flex", justifyContent: "center", gap: "clamp(1.5rem, 4vw, 3rem)",
            marginTop: "3.5rem", flexWrap: "wrap" }}>
          {[
            { icon: Shield, label: "Better Services" },
            { icon: Star,   label: "Trusted Partner" },
            { icon: CheckCircle, label: "In-Time Delivery" },
          ].map(({ icon: Icon, label }, i) => (
            <motion.div key={label}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 8,
                background: "rgba(200,134,10,0.1)",
                border: "1px solid rgba(200,134,10,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}>
                <Icon size={18} style={{ color: B.goldLt }} />
              </div>
              <span style={{ fontSize: "0.7rem", letterSpacing: "0.14em",
                color: "#E8A020",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                textShadow: "none",
              }}>
                {label.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
 
      {/* Scroll hint */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: "2rem", left: "50%",
          transform: "translateX(-50%)", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: "0.58rem", letterSpacing: "0.3em",
          color: "#5A6785", fontFamily: "'Barlow Condensed', sans-serif" }}>
          SCROLL
        </span>
        <ChevronDown size={15} style={{ color: B.gold, opacity: 0.8 }} />
      </motion.div>
    </section>
  );
};
 
// ─── Services ─────────────────────────────────────────────────────────────────
const Services = () => {
  const { dark } = useTheme();
  const t = T(dark);
  const [ref, visible] = useInView();
 
  return (
    <section id="services" ref={ref} style={{ background: t.bg, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
 
        {/* Section header */}
        <SR delay={0} direction="up">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 3, background: B.gradG, borderRadius: 2 }} />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.3em", fontWeight: 700,
              color: B.gold, fontFamily: "'Barlow Condensed', sans-serif",
              textShadow: "0 0 20px rgba(200,134,10,0.3)" }}>
              WHAT WE OFFER
            </span>
          </div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600,
            lineHeight: 1.1, color: t.text,
            textShadow: dark ? "0 2px 15px rgba(200,134,10,0.25), 0 4px 30px rgba(0,0,0,0.3)" : "0 2px 10px rgba(27,43,75,0.15), 0 4px 20px rgba(0,0,0,0.08)" }}>
            Our Core{" "}
            <span style={{ background: B.gradH,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Services
            </span>
          </h2>
          <p style={{ color: t.muted, marginTop: "1rem", maxWidth: 560, lineHeight: 1.7,
            fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem" }}>
            At BIGTEUS INTERMODAL, we deliver dependable container sales, leasing, fabrication, and transportation services. Get in touch to support your business needs.
          </p>
        </motion.div>
        </SR>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {SERVICES.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.65 }}
              whileHover={{ y: -12, scale: 1.03, boxShadow: dark
                ? `0 35px 70px rgba(0,0,0,0.6), 0 0 0 1px ${s.color}50, 0 0 40px ${s.color}15`
                : `0 25px 60px rgba(0,0,0,0.12), 0 0 0 1px ${s.color}40, 0 0 30px ${s.color}10` }}
              style={{
                background: t.card, backdropFilter: "blur(16px)",
                border: `1px solid ${t.border}`, borderRadius: 12,
                overflow: "hidden", cursor: "pointer",
                transition: "box-shadow 0.4s, border-color 0.4s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              {/* Image strip */}
              <div style={{ height: 190, overflow: "hidden", position: "relative" }}>
                <img src={s.img} alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.6s ease, filter 0.6s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.filter = "brightness(1.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(1)"; }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to top, ${dark ? "rgba(11,15,26,0.85)" : "rgba(27,43,75,0.6)"} 0%, transparent 60%)`,
                }} />
                {/* Tag pill */}
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: `${s.color}CC`, borderRadius: 4,
                  padding: "4px 10px",
                  fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em",
                  color: "#fff", fontFamily: "'Barlow Condensed', sans-serif",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = `0 4px 15px ${s.color}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                  {s.tag}
                </div>
              </div>
 
              {/* Body */}
              <div style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.6rem" }}>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10, background: `${s.color}30`, transition: { duration: 0.3 } }}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: `${s.color}18`, border: `1px solid ${s.color}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.3s",
                    }}>
                    <s.icon size={16} style={{ color: s.color }} />
                  </motion.div>
                  <div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.05rem",
                      fontWeight: 600, color: t.text, letterSpacing: "0.03em" }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: s.color, fontWeight: 600,
                      letterSpacing: "0.12em", fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {s.subtitle}
                    </div>
                  </div>
                </div>
                <p style={{ color: t.muted, lineHeight: 1.7, fontSize: "0.86rem",
                  fontFamily: "'Barlow', sans-serif" }}>
                  {s.desc}
                </p>
              </div>
 
              {/* Bottom accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                style={{ height: 3, background: `linear-gradient(90deg, ${s.color}, ${B.gold}, transparent)`, transformOrigin: "left", transition: "transform 0.4s" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
 
// ─── About ────────────────────────────────────────────────────────────────────
const About = () => {
  const { dark } = useTheme();
  const t = T(dark);
  const [ref, visible] = useInView();
 
  return (
    <section id="about" ref={ref} style={{ background: t.surface, padding: "7rem 2rem",
      borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "5rem", alignItems: "start" }}>
 
        {/* Left — text */}
        <motion.div initial={{ opacity: 0, x: -40 }}
          animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 3, background: B.gradG, borderRadius: 2 }} />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.3em", fontWeight: 700,
              color: B.gold, fontFamily: "'Barlow Condensed', sans-serif",
              textShadow: "0 0 20px rgba(200,134,10,0.3)" }}>WHO WE ARE</span>
          </div>
 
          <h2 style={{ fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600,
            lineHeight: 1.1, marginBottom: "1.5rem", color: t.text,
            textShadow: dark ? "0 2px 15px rgba(200,134,10,0.25), 0 4px 30px rgba(0,0,0,0.3)" : "0 2px 10px rgba(27,43,75,0.15), 0 4px 20px rgba(0,0,0,0.08)" }}>
            Trusted Partner in<br />
            <span style={{ background: B.gradH,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Intermodal Trade
            </span>
          </h2>
 
          <p style={{ color: t.muted, lineHeight: 1.8, marginBottom: "1.2rem",
            fontSize: "0.93rem", fontFamily: "'Barlow', sans-serif" }}>
            Established in 2026, BIGTEUS INTERMODAL specializes in shipping container solutions — container sales, leasing, and custom fabrication. We provide high-quality containers for export, import, commercial, industrial, and storage purposes.
          </p>
          <p style={{ color: t.muted, lineHeight: 1.8, marginBottom: "2rem",
            fontSize: "0.93rem", fontFamily: "'Barlow', sans-serif" }}>
            From our Chennai headquarters, we orchestrate seamless container transactions and intermodal freight operations that power global commerce — with a focus on durability, customization, and efficient logistics.
          </p>
 
          {/* Tagline pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
            {["Better Services", "Trusted Partner", "In-Time Delivery"].map(tag => (
              <motion.span key={tag}
                whileHover={{ scale: 1.08, y: -2, background: "rgba(200,134,10,0.2)", boxShadow: "0 4px 15px rgba(200,134,10,0.2)", transition: { duration: 0.25 } }}
                style={{
                  background: "rgba(200,134,10,0.1)",
                  border: "1px solid rgba(200,134,10,0.3)",
                  color: B.goldLt, padding: "5px 14px", borderRadius: 4,
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  cursor: "pointer", display: "inline-block",
                }}>{tag.toUpperCase()}</motion.span>
            ))}
          </div>
 
          {/* Contact info */}
          {/* Address highlight card */}
          <motion.div initial={{ opacity: 0, x: -15 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              background: `rgba(200,134,10,0.06)`,
              border: `1.5px solid rgba(200,134,10,0.3)`,
              borderRadius: 10, padding: "1.2rem 1.4rem", marginBottom: "1.2rem",
              borderLeft: `4px solid ${B.gold}`,
              cursor: "pointer",
              transition: "background 0.3s, box-shadow 0.3s, transform 0.3s",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: `0 10px 30px rgba(200,134,10,0.12), 0 0 0 1px rgba(200,134,10,0.2)`,
              background: `rgba(200,134,10,0.1)`,
              transition: { duration: 0.3 },
            }}>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: `rgba(200,134,10,0.15)`,
                border: `1px solid rgba(200,134,10,0.35)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MapPin size={16} style={{ color: B.goldLt }} />
              </div>
              <div>
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ fontSize: "0.62rem", letterSpacing: "0.2em", fontWeight: 700,
                    color: B.goldLt, fontFamily: "'Barlow Condensed', sans-serif",
                    display: "inline-block", marginBottom: "0.3rem" }}
                  whileHover={{ letterSpacing: "0.35em", transition: { duration: 0.3 } }}>
                  OUR OFFICE
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  whileHover={{
                    scale: 1.02,
                    x: 8,
                    color: B.goldLt,
                    textShadow: `0 0 20px rgba(200,134,10,0.15)`,
                    transition: { duration: 0.3 },
                  }}
                  style={{ color: t.text, fontSize: "0.93rem", fontWeight: 500,
                    fontFamily: "'Barlow', sans-serif", lineHeight: 1.7,
                    display: "block", cursor: "pointer",
                    borderLeft: `2px solid transparent`,
                    paddingLeft: 0,
                    transition: "padding-left 0.3s, border-color 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = "12px"; e.currentTarget.style.borderColor = B.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0px"; e.currentTarget.style.borderColor = "transparent"; }}>
                  No.17 E, Neithal Street, Thiruvallur Nagar,<br />
                  Near World Trade Center, Perungudi,<br />
                  Chennai – 600096
                </motion.span>
              </div>
            </div>
          </motion.div>

          {[
            { Icon: Users, text: "Mr. Muthuvijay — Managing Director" },
            { Icon: Phone, text: "+91 6369760485 · +91 7010484023" },
            { Icon: Mail,  text: "info@bigteus-intermodal.com" },
            { Icon: Mail,  text: "Sales@bigteus-intermodal.com" },
            { Icon: Clock, text: "Mon – Sat, 09:00 – 19:00 IST" },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -15 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{
                x: 6,
                scale: 1.02,
                transition: { duration: 0.25 },
              }}
              style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start",
                marginBottom: "0.9rem", cursor: "pointer" }}>
              <motion.div
                whileHover={{
                  scale: 1.2,
                  rotate: 8,
                  background: `rgba(200,134,10,0.2)`,
                  borderColor: B.gold,
                  transition: { duration: 0.25 },
                }}
                style={{
                  width: 34, height: 34, borderRadius: 7, flexShrink: 0, marginTop: 1,
                  background: `rgba(200,134,10,0.1)`,
                  border: `1px solid rgba(200,134,10,0.25)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <item.Icon size={14} style={{ color: B.gold }} />
              </motion.div>
              <motion.span
                whileHover={{ color: B.goldLt, textShadow: "0 0 12px rgba(200,134,10,0.12)", transition: { duration: 0.25 } }}
                style={{ color: t.muted, fontSize: "0.87rem",
                  fontFamily: "'Barlow', sans-serif", lineHeight: 1.6 }}>
                {item.text}
              </motion.span>
            </motion.div>
          ))}
 
          {/* CIN */}
          <p style={{ color: dark ? "#3D4F6A" : "#9AABBF", fontSize: "0.72rem", marginTop: "0.5rem",
            fontFamily: "'Barlow', sans-serif", letterSpacing: "0.05em" }}>
            CIN: U77308TN2026PTC192021
          </p>
        </motion.div>
 
        {/* Right — image + ports */}
        <motion.div initial={{ opacity: 0, x: 40 }}
          animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }}>
 
          {/* About image */}
          <SR delay={0.2} direction="right" distance={30}>
          <div style={{ borderRadius: 12, overflow: "hidden",
            border: `1px solid ${t.border}`, marginBottom: "2rem", position: "relative",
            transition: "box-shadow 0.4s, transform 0.4s", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 20px 50px rgba(200,134,10,0.15)"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}>
            <img src={ASSETS.containersSunset} alt="Container operations at sunset"
              style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: dark
                ? "linear-gradient(to top, rgba(11,15,26,0.75) 0%, transparent 55%)"
                : "linear-gradient(to top, rgba(27,43,75,0.55) 0%, transparent 55%)",
            }} />
            {/* Gold border glow */}
            <div style={{ position: "absolute", inset: -1, borderRadius: 12,
              background: `linear-gradient(135deg, ${B.navy}, ${B.gold})`,
              opacity: 0.2, zIndex: -1, filter: "blur(12px)", pointerEvents: "none" }} />
          </div>
          </SR>
 
          {/* Ports grid */}
          <SR delay={0.3} direction="up" distance={25}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* India ports */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03, boxShadow: "0 15px 40px rgba(200,134,10,0.12)" }}
              style={{ background: t.surface2, border: `1px solid ${t.border}`,
              borderRadius: 10, padding: "1.2rem", cursor: "pointer",
              transition: "border-color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${B.gold}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.22em", fontWeight: 700,
                color: B.gold, marginBottom: "0.8rem",
                fontFamily: "'Barlow Condensed', sans-serif" }}>
                🇮🇳 INDIA HUBS
              </div>
              {PORTS_INDIA.map((p, i) => (
                <SR key={p} delay={i * 0.06} direction="left" distance={20} duration={0.4}>
                <div style={{ display: "flex", alignItems: "center", gap: 6,
                  marginBottom: "0.45rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%",
                    background: B.gold, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: t.muted,
                    fontFamily: "'Barlow', sans-serif" }}>{p}</span>
                </div>
                </SR>
              ))}
            </motion.div>
 
            {/* Overseas ports */}
            <motion.div
              whileHover={{ y: -6, scale: 1.03, boxShadow: "0 15px 40px rgba(46,64,112,0.12)" }}
              style={{ background: t.surface2, border: `1px solid ${t.border}`,
              borderRadius: 10, padding: "1.2rem", cursor: "pointer",
              transition: "border-color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${B.steel}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
              <div style={{ fontSize: "0.62rem", letterSpacing: "0.22em", fontWeight: 700,
                color: B.steel, marginBottom: "0.8rem",
                fontFamily: "'Barlow Condensed', sans-serif" }}>
                🌍 OVERSEAS
              </div>
              {PORTS_OVERSEAS.map((p, i) => (
                <SR key={p} delay={i * 0.06} direction="right" distance={20} duration={0.4}>
                <div style={{ display: "flex", alignItems: "center", gap: 6,
                  marginBottom: "0.45rem" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%",
                    background: B.steel, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: t.muted,
                    fontFamily: "'Barlow', sans-serif" }}>{p}</span>
                </div>
                </SR>
              ))}
            </motion.div>
          </div>
          </SR>
        </motion.div>
      </div>
    </section>
  );
};
 
// ─── Media Gallery ────────────────────────────────────────────────────────────
const Media = () => {
  const { dark } = useTheme();
  const t = T(dark);
  const [ref, visible] = useInView();
 
  return (
    <section id="media" ref={ref} style={{ background: t.bg, padding: "7rem 2rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
 
        <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 3, background: B.gradG, borderRadius: 2 }} />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.3em", fontWeight: 700,
              color: B.gold, fontFamily: "'Barlow Condensed', sans-serif",
              textShadow: "0 0 20px rgba(200,134,10,0.3)" }}>GALLERY</span>
          </div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600, color: t.text,
            textShadow: dark ? "0 2px 15px rgba(200,134,10,0.25), 0 4px 30px rgba(0,0,0,0.3)" : "0 2px 10px rgba(27,43,75,0.15), 0 4px 20px rgba(0,0,0,0.08)" }}>
            Operations in{" "}
            <span style={{ background: B.gradH,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Action
            </span>
          </h2>
        </motion.div>
 
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: "1.2rem",
        }}>
          {MEDIA_ITEMS.map((img, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover="hover"
              style={{ position: "relative", borderRadius: 10, overflow: "hidden",
                aspectRatio: "4/3", cursor: "pointer", border: `1px solid ${t.border}`,
                transition: "border-color 0.4s, box-shadow 0.4s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${img.color}60`; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 25px ${img.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = "none"; }}>
              <motion.img src={img.src} alt={img.alt}
                variants={{ hover: { scale: 1.1, filter: "brightness(1.1)" } }} transition={{ duration: 0.6 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <motion.div variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to top, rgba(11,15,26,0.88) 0%, ${img.color}18 100%)`,
                  display: "flex", alignItems: "flex-end", padding: "1.2rem",
                }}>
                <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 500,
                  fontFamily: "'Barlow', sans-serif" }}>{img.alt}</span>
              </motion.div>
              <motion.div variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }}
                style={{ position: "absolute", inset: 0, borderRadius: 10,
                  boxShadow: `inset 0 0 0 2px ${img.color}`, pointerEvents: "none" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
 
// ─── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const { dark } = useTheme();
  const t = T(dark);
  const [ref, visible] = useInView();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
 
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) e.phone = "Valid phone required";
    if (!form.message.trim()) e.message = "Message required";
    return e;
  };
 
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSending(true);
    emailjs.send(
      "service_y0ou7f1",
      "template_cx1bjja",
      { from_name: form.name, from_email: form.email, phone: form.phone, message: form.message },
      "PfaxyctKNWys3ZvlK"
    ).then(() => {
      setSending(false);
      setSubmitted(true);
      toast.success("Message sent successfully!", { duration: 4000, style: { background: "#111827", color: "#EDF0F7", border: "1px solid rgba(200,134,10,0.3)" }, iconTheme: { primary: "#10B981", secondary: "#fff" } });
    }).catch(() => {
      setSending(false);
      toast.error("Failed to send. Please try again.", { duration: 4000, style: { background: "#111827", color: "#EDF0F7", border: "1px solid #EF4444" }, iconTheme: { primary: "#EF4444", secondary: "#fff" } });
    });
  };
 
  const inputStyle = (field) => ({
    width: "100%", background: dark ? "rgba(11,15,26,0.7)" : "#EEF1F8",
    border: `1px solid ${errors[field] ? "#EF4444" : t.border}`,
    borderRadius: 6, padding: "13px 14px", color: t.text,
    fontSize: "0.88rem", fontFamily: "'Barlow', sans-serif",
    outline: "none", transition: "border-color 0.25s, box-shadow 0.25s",
    boxSizing: "border-box",
  });
 
  return (
    <section id="contact" ref={ref} style={{ background: t.surface, padding: "7rem 2rem",
      borderTop: `1px solid ${t.border}` }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
 
        <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 3, background: B.gradG, borderRadius: 2 }} />
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.3em", fontWeight: 700,
              color: B.gold, fontFamily: "'Barlow Condensed', sans-serif",
              textShadow: "0 0 20px rgba(200,134,10,0.3)" }}>REACH OUT</span>
          </div>
          <h2 style={{ fontFamily: "'Oswald', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: t.text,
            textShadow: dark ? "0 2px 15px rgba(200,134,10,0.25), 0 4px 30px rgba(0,0,0,0.3)" : "0 2px 10px rgba(27,43,75,0.15), 0 4px 20px rgba(0,0,0,0.08)" }}>
            Start a{" "}
            <span style={{ background: B.gradH,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Conversation
            </span>
          </h2>
        </motion.div>
 
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "4rem 2rem",
                background: t.card, borderRadius: 12,
                border: `1px solid rgba(46,127,82,0.4)`,
                boxShadow: "0 0 40px rgba(46,127,82,0.1)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "1.7rem",
                marginBottom: "0.7rem", color: t.text,
                textShadow: dark ? "0 2px 12px rgba(200,134,10,0.2), 0 4px 20px rgba(0,0,0,0.2)" : "0 2px 8px rgba(27,43,75,0.1)" }}>Message Sent!</h3>
              <p style={{ color: t.muted, marginBottom: "2rem",
                fontFamily: "'Barlow', sans-serif" }}>
                Our team will contact you within 24 hours.
              </p>
              <motion.button whileHover={{ scale: 1.04 }}
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                style={{ background: B.gradG, color: "#fff", border: "none",
                  padding: "12px 30px", borderRadius: 6, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.9rem",
                  letterSpacing: "0.08em" }}>
                SEND ANOTHER
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{ background: t.card, backdropFilter: "blur(16px)",
                border: `1px solid ${t.border}`, borderRadius: 12, padding: "2.5rem" }}>
              <div style={{ display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.2rem", marginBottom: "1.2rem" }}>
                {["name", "email", "phone"].map(field => (
                  <div key={field}>
                    <label style={{ fontSize: "0.65rem", letterSpacing: "0.18em",
                      color: t.muted, textTransform: "uppercase", display: "block",
                      marginBottom: "0.45rem", fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700 }}>{field}</label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={e => setForm({ ...form, [field]: e.target.value })}
                      onFocus={e => { e.target.style.borderColor = B.gold; e.target.style.boxShadow = `0 0 0 3px rgba(200,134,10,0.12)`; }}
                      onBlur={e => { e.target.style.borderColor = errors[field] ? "#EF4444" : t.border; e.target.style.boxShadow = "none"; }}
                      placeholder={field === "name" ? "Your name" : field === "email" ? "you@company.com" : "+91 0000000000"}
                      style={inputStyle(field)}
                    />
                    {errors[field] && <span style={{ color: "#EF4444", fontSize: "0.7rem",
                      marginTop: 3, display: "block",
                      fontFamily: "'Barlow', sans-serif" }}>{errors[field]}</span>}
                  </div>
                ))}
              </div>
 
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.65rem", letterSpacing: "0.18em",
                  color: t.muted, textTransform: "uppercase", display: "block",
                  marginBottom: "0.45rem", fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700 }}>Message</label>
                <textarea rows={5} value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={e => { e.target.style.borderColor = B.gold; e.target.style.boxShadow = `0 0 0 3px rgba(200,134,10,0.12)`; }}
                  onBlur={e => { e.target.style.borderColor = errors.message ? "#EF4444" : t.border; e.target.style.boxShadow = "none"; }}
                  placeholder="Tell us about your container requirements..."
                  style={{ ...inputStyle("message"), resize: "vertical", minHeight: 110 }}
                />
                {errors.message && <span style={{ color: "#EF4444", fontSize: "0.7rem",
                  marginTop: 3, display: "block",
                  fontFamily: "'Barlow', sans-serif" }}>{errors.message}</span>}
              </div>
 
              <motion.button whileHover={{ scale: 1.02, boxShadow: `0 0 30px rgba(200,134,10,0.25)` }}
                whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                style={{ width: "100%", background: B.gradG, color: "#fff",
                  border: "none", padding: "15px", borderRadius: 8,
                  fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.14em",
                  cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Send size={15} />
                {sending ? "SENDING..." : "SEND MESSAGE"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
 
// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_COLS = [
  {
    title: "Services",
    links: ["Container Trading", "Container Leasing", "Container Fabrication", "Container Transport"],
  },
  {
    title: "Company",
    links: ["About Us", "Media Gallery", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];
 
const Footer = () => {
  const { dark } = useTheme();
  const t = T(dark);
 
  return (
    <footer style={{ background: dark ? "#080C15" : "#0F172A",
      borderTop: `2px solid ${B.gold}40`, padding: "4rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        {/* Top gold stripe accent */}
        <div style={{ height: 2, background: B.gradG, borderRadius: 1, marginBottom: "3rem" }} />
 
        <div style={{ display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2.5rem", marginBottom: "3rem" }}>
 
          {/* Brand col */}
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <img src={ASSETS.logo} alt="BTi"
                style={{ height: 60, width: 160, objectFit: "contain", display: "block",
                  filter: "brightness(1.1) drop-shadow(0 0 8px rgba(200,134,10,0.2))" }} />
            </div>
            <p style={{ color: "#5A6785", fontSize: "0.83rem", lineHeight: 1.7,
              marginBottom: "0.8rem", fontFamily: "'Barlow', sans-serif" }}>
              BIGTEUS INTERMODAL PVT. LTD.<br />
              No.17 E, Neithal Street, Near World Trade Center,<br />
              Perungudi, Chennai – 600096
            </p>
            <p style={{ color: "#5A6785", fontSize: "0.78rem",
              fontFamily: "'Barlow', sans-serif", marginBottom: "0.3rem" }}>
              +91 6369760485 · +91 7010484023
            </p>
            <p style={{ color: "#5A6785", fontSize: "0.78rem",
              fontFamily: "'Barlow', sans-serif", marginBottom: "0.3rem" }}>
              info@bigteus-intermodal.com
            </p>
            <p style={{ color: "#3D4F6A", fontSize: "0.68rem", marginTop: "0.6rem",
              fontFamily: "'Barlow', sans-serif" }}>
              CIN: U77308TN2026PTC192021
            </p>
          </div>
 
          {FOOTER_COLS.map((col, ci) => (
            <SR key={col.title} delay={0.1 + ci * 0.12} direction="up" distance={25}>
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", fontWeight: 700,
                color: B.gold, marginBottom: "1.2rem", textTransform: "uppercase",
                fontFamily: "'Barlow Condensed', sans-serif" }}>{col.title}</div>
              {col.links.map(link => (
                <motion.a key={link} href="#" whileHover={{ x: 4, color: B.goldLt }}
                  style={{ display: "block", color: "#5A6785", fontSize: "0.83rem",
                    textDecoration: "none", marginBottom: "0.55rem",
                    transition: "color 0.2s",
                    fontFamily: "'Barlow', sans-serif" }}>
                  {link}
                </motion.a>
              ))}
            </div>
            </SR>
          ))}
        </div>
 
        <div style={{ height: 1, background: "rgba(200,134,10,0.15)", marginBottom: "1.8rem" }} />
 
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem",
          justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#3D4F6A", fontSize: "0.75rem",
            fontFamily: "'Barlow', sans-serif" }}>
            © 2026 Bigteus Intermodal Private Limited. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <motion.a href="https://www.instagram.com/bigteus_intermodal_pvt_ltd"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: B.goldLt }}
              style={{ color: "#3D4F6A", display: "flex", transition: "color 0.2s" }}>
              <Instagram size={16} />
            </motion.a>
            {[Linkedin, Facebook, Twitter].map((Icon, i) => (
              <motion.a key={i} href="#"
                whileHover={{ scale: 1.2, color: B.goldLt }}
                style={{ color: "#3D4F6A", display: "flex", transition: "color 0.2s" }}>
                <Icon size={16} />
              </motion.a>
            ))}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ width: 34, height: 34, borderRadius: 6,
                background: "rgba(200,134,10,0.1)",
                border: "1px solid rgba(200,134,10,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: B.gold, marginLeft: "0.4rem" }}>
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BigteusSite() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
 
function Shell() {
  const { dark } = useTheme();
  const t = T(dark);
  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh",
      transition: "background 0.4s, color 0.4s",
      fontFamily: "'Barlow', sans-serif" }}>
      <Navbar />
      <Toaster position="top-right" />
      <Hero />
      <SR delay={0.1} direction="up"><Services /></SR>
      <SR delay={0.1} direction="up"><About /></SR>
      <SR delay={0.1} direction="up"><Media /></SR>
      <SR delay={0.1} direction="up"><Contact /></SR>
      <SR delay={0.1} direction="up"><Footer /></SR>
    </div>
  );
}
