import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import Lenis from "@studio-freight/lenis";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  AtSign,
  BarChart3,
  Braces,
  BriefcaseBusiness,
  Code2,
  Gauge,
  Globe2,
  Languages,
  Layers3,
  Mail,
  MessageSquareMore,
  MessageSquareText,
  MousePointer2,
  PenTool,
  Send,
  ShoppingBag,
  Sparkles as SparklesIcon,
  Terminal,
  TimerReset,
  UserRound,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { Locale, resources } from "./i18n";

type WorkItem = { name: string; type: string; year: string };
type ServiceItem = { title: string; text: string };
type FieldErrors = Partial<Record<"name" | "email" | "brief", string>>;

const navKeys = ["about", "services", "work", "contact"] as const;
const serviceIcons = [Code2, PenTool, Gauge];
const workIcons = [BarChart3, ShoppingBag, Activity, Layers3];
const workLogos = [
  { src: "/projects/klu-logo.png", className: "logo-klu" },
  { src: "/projects/wsc-logo.jpg", className: "logo-wsc" },
  { src: "/projects/5-stars-rc-logo.webp", className: "logo-five-stars" },
];
const fieldIcons = { name: UserRound, email: AtSign, brief: MessageSquareText };

function useLocale(locale: Locale) {
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [dir, locale]);

  return { dir };
}

function useTyping(words: readonly string[]) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const word = words[index] ?? "";
    const atEnd = count === word.length;
    const atStart = count === 0;
    const delay = atEnd && !removing ? 1100 : removing ? 32 : 58;

    const timeout = window.setTimeout(() => {
      if (atEnd && !removing) {
        setRemoving(true);
        return;
      }
      if (atStart && removing) {
        setRemoving(false);
        setIndex((current) => (current + 1) % words.length);
        return;
      }
      setCount((current) => current + (removing ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [count, index, removing, words]);

  return (words[index] ?? "").slice(0, count);
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cursorX = useSpring(x, { stiffness: 420, damping: 34 });
  const cursorY = useSpring(y, { stiffness: 420, damping: 34 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX - 17);
      y.set(event.clientY - 17);
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, input, textarea")));
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div className="fluid-cursor" style={{ x: cursorX, y: cursorY }} data-active={active} />;
}

function MagneticButton({ children, href }: { children: ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16 });
  const springY = useSpring(y, { stiffness: 220, damping: 16 });

  return (
    <motion.a
      ref={ref}
      href={href}
      className="magnetic-button"
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        x.set((event.clientX - box.left - box.width / 2) * 0.22);
        y.set((event.clientY - box.top - box.height / 2) * 0.22);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      <ArrowUpRight size={20} aria-hidden />
    </motion.a>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div ref={ref} className={`reveal-mask ${className}`}>
      <motion.div
        initial={{ y: "120%", rotate: 2 }}
        animate={inView ? { y: 0, rotate: 0 } : undefined}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function CoreMesh({ dir }: { dir: "ltr" | "rtl" }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const sign = dir === "rtl" ? -1 : 1;

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * sign;
      pointer.y = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [pointer, sign]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = elapsed * 0.18 + pointer.x * 0.75;
      group.current.rotation.x = -pointer.y * 0.42;
    }
    if (inner.current) {
      inner.current.rotation.z = -elapsed * 0.35 * sign;
      inner.current.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.035);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.75} floatIntensity={1.1}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.48, 5]} />
          <MeshDistortMaterial
            color="#ff6b3d"
            emissive="#ff2f12"
            emissiveIntensity={0.6}
            roughness={0.18}
            metalness={0.72}
            distort={0.34}
            speed={1.8}
          />
        </mesh>
        <mesh scale={1.72}>
          <torusKnotGeometry args={[1.05, 0.012, 220, 8, 2, 5]} />
          <meshStandardMaterial color="#b7e7ff" emissive="#4fc3ff" emissiveIntensity={1.2} />
        </mesh>
        <mesh scale={2.38} rotation={[0.7, 0.2, 0.1]}>
          <torusGeometry args={[1, 0.005, 12, 180]} />
          <meshBasicMaterial color="#fff4e8" transparent opacity={0.42} />
        </mesh>
      </Float>
      <Sparkles count={86} scale={5.2} size={2.2} speed={0.45} color="#ffb39b" />
    </group>
  );
}

function HeroCanvas({ dir }: { dir: "ltr" | "rtl" }) {
  return (
    <div className="hero-canvas" aria-hidden>
      <Canvas camera={{ position: [0, 0, 5.2], fov: 44 }} dpr={[1, 1.8]}>
        <color attach="background" args={["#061426"]} />
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 2.5, 3]} intensity={16} color="#ff6b3d" />
        <pointLight position={[-4, -2, -3]} intensity={6} color="#53c7ff" />
        <CoreMesh dir={dir} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}

function ServiceCard({ item, index }: { item: ServiceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = serviceIcons[index % serviceIcons.length];
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  return (
    <motion.article
      ref={ref}
      className="service-card"
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(event) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        rotateY.set((px - 0.5) * 14);
        rotateX.set((0.5 - py) * 14);
        glareX.set(px * 100);
        glareY.set(py * 100);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <motion.span className="glare" style={{ background: useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.28), transparent 34%)`) }} />
      <div className="service-topline">
        <span className="service-index">0{index + 1}</span>
        <motion.span className="service-icon" whileHover={{ rotate: -8, scale: 1.08 }}>
          <Icon size={34} strokeWidth={1.55} aria-hidden />
        </motion.span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </motion.article>
  );
}

function ContactForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", brief: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: FieldErrors = {};
    if (!values.name.trim()) next.name = t("contact.required");
    if (!values.brief.trim()) next.brief = t("contact.required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t("contact.emailError");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(false);
    if (validate()) setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      {(["name", "email", "brief"] as const).map((field) => (
        <label key={field} className="field" data-filled={Boolean(values[field])}>
          {(() => {
            const FieldIcon = fieldIcons[field];
            return <FieldIcon className="field-icon" size={18} aria-hidden />;
          })()}
          {field === "brief" ? (
            <textarea
              value={values[field]}
              onChange={(event) => setValues({ ...values, [field]: event.target.value })}
              onBlur={validate}
              rows={4}
            />
          ) : (
            <input
              value={values[field]}
              onChange={(event) => setValues({ ...values, [field]: event.target.value })}
              onBlur={validate}
              type={field === "email" ? "email" : "text"}
            />
          )}
          <span>{t(`contact.${field}`)}</span>
          {errors[field] ? <small>{errors[field]}</small> : null}
        </label>
      ))}
      <button className="submit-button" type="submit">
        <Send size={18} aria-hidden />
        {t("contact.send")}
      </button>
      {sent ? <p className="success">{t("contact.success")}</p> : null}
    </form>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<Locale>("en");
  const { dir } = useLocale(locale);
  const typed = useTyping(t("hero.typed", { returnObjects: true }) as string[]);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -180]);
  const railX = useTransform(scrollYProgress, [0.42, 0.82], dir === "rtl" ? ["-10%", "10%"] : ["10%", "-10%"]);
  const services = t("services.items", { returnObjects: true }) as ServiceItem[];
  const works = t("work.items", { returnObjects: true }) as WorkItem[];
  const [heroName, heroBrand] = t("hero.title").split("|").map((part) => part.trim());

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="site-shell" dir={dir}>
      <Cursor />
      <header className="topbar">
        <a href="#home" className="brand" aria-label="CoreLogic home">
          <img src="/corelogic-symbol.jpg" alt="" />
        </a>
        <nav aria-label="Primary">
          {navKeys.map((key) => (
            <a href={`#${key}`} key={key}>
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>
        <button className="locale-toggle" onClick={() => setLocale(locale === "en" ? "ar" : "en")}>
          <Globe2 size={17} aria-hidden />
          {locale === "en" ? "AR" : "EN"}
        </button>
      </header>

      <section id="home" className="hero-section">
        <HeroCanvas dir={dir} />
        <motion.div className="hero-copy" style={{ y: heroY }}>
          <Reveal>
            <p className="eyebrow icon-label"><Terminal size={16} aria-hidden />{t("hero.kicker")}</p>
          </Reveal>
          <Reveal>
            <h1>
              <span>{heroName}</span>
              <span className="hero-brand-line">
                <span className="hero-divider" aria-hidden="true" />
                <span>{heroBrand}</span>
              </span>
            </h1>
          </Reveal>
          <p className="typing-line">
            <span>{typed}</span>
            <i />
          </p>
          <div className="hero-actions">
            <MagneticButton href="#contact">{t("hero.cta")}</MagneticButton>
            <a href="#work" className="ghost-link">
              {t("hero.secondary")}
            </a>
          </div>
        </motion.div>
        <div className="orbital-stats">
          <span><TimerReset size={21} aria-hidden />{t("hero.statA")}</span>
          <span><MousePointer2 size={21} aria-hidden />{t("hero.statB")}</span>
          <span><Languages size={21} aria-hidden />{t("hero.statC")}</span>
        </div>
      </section>

      <section id="about" className="about-section section-pad">
        <div className="section-number"><Braces size={17} aria-hidden />01</div>
        <div className="about-grid">
          <Reveal>
            <p className="eyebrow icon-label"><SparklesIcon size={16} aria-hidden />{t("about.eyebrow")}</p>
          </Reveal>
          <Reveal className="about-title">
            <h2>{t("about.title")}</h2>
          </Reveal>
          <motion.p
            className="about-body"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {t("about.body")}
          </motion.p>
        </div>
      </section>

      <section id="services" className="services-section section-pad">
        <div className="section-heading">
          <p className="eyebrow icon-label"><Code2 size={17} aria-hidden />{t("services.eyebrow")}</p>
          <h2>{t("services.title")}</h2>
        </div>
        <div className="services-grid">
          {services.map((item, index) => (
            <ServiceCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="section-heading">
          <p className="eyebrow icon-label"><BriefcaseBusiness size={17} aria-hidden />{t("work.eyebrow")}</p>
          <h2>{t("work.title")}</h2>
        </div>
        <motion.div className="work-rail" style={{ x: railX }}>
          {works.map((item, index) => (
            <motion.article className="work-card" key={item.name} whileHover={{ scale: 1.035 }} transition={{ duration: 0.35 }}>
              <div className="work-thumb">
                <span>{item.year}</span>
                <div className={`work-logo-frame ${workLogos[index].className}`}>
                  <img src={workLogos[index].src} alt={`${item.name} logo`} />
                </div>
                {(() => {
                  const WorkIcon = workIcons[index % workIcons.length];
                  return <WorkIcon size={34} strokeWidth={1.5} aria-hidden />;
                })()}
              </div>
              <h3>{item.name}</h3>
              <p>{item.type}</p>
              <span className="work-count">0{index + 1}</span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="contact" className="contact-section section-pad">
        <div className="contact-copy">
          <p className="eyebrow icon-label"><MessageSquareMore size={17} aria-hidden />{t("contact.eyebrow")}</p>
          <h2>{t("contact.title")}</h2>
          <a className="mail-link" href="mailto:hello@corelogic.dev">
            <Mail size={18} aria-hidden />
            hello@corelogic.dev
          </a>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}

export default App;
