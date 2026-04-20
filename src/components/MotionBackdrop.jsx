import { useEffect, useMemo, useRef, useState } from "react";

const SECTION_IDS = ["home", "projects", "experience", "music", "about", "contact"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildClouds() {
  return Array.from({ length: 7 }, (_, index) => ({
    id: `cloud-${index}`,
    top: 12 + ((index * 13) % 62),
    width: 18 + ((index * 9) % 20),
    duration: 17 + (index % 4) * 3.2,
    delay: (index % 5) * -2.1,
  }));
}

function buildDrops() {
  return Array.from({ length: 11 }, (_, index) => ({
    id: `drop-${index}`,
    left: 8 + index * 8,
    delay: (index % 6) * -0.4,
    length: 20 + (index % 5) * 7,
    duration: 3.9 + (index % 4) * 0.65,
  }));
}

function buildGusts() {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `gust-${index}`,
    top: 10 + index * 11,
    width: 14 + (index % 4) * 7,
    duration: 6.2 + (index % 3) * 1.1,
    delay: (index % 4) * -0.85,
  }));
}

// Safe rAF wrapper — iOS Safari pre-12 exposed it only as a prefixed global.
// Falls back to a 16ms setTimeout so scroll handling never silently dies.
const raf =
  (typeof window !== "undefined" &&
    (window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame)) ||
  ((cb) => setTimeout(cb, 16));

const caf =
  (typeof window !== "undefined" &&
    (window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame)) ||
  clearTimeout;

export default function MotionBackdrop() {
  const clouds = useMemo(() => buildClouds(), []);
  const drops = useMemo(() => buildDrops(), []);
  const gusts = useMemo(() => buildGusts(), []);

  const [scene, setScene] = useState({
    activeIndex: 0,
    nextIndex: 1,
    blend: 0,
  });
  const previousScrollY = useRef(0);

  useEffect(() => {
    let frame = null;

    const measure = () => {
      // pageYOffset is the iOS-safe alias; scrollY can be undefined on very old WebKit
      const scrollY = window.pageYOffset || window.scrollY || 0;
      const viewportHeight = window.innerHeight || 1;
      const midpoint = scrollY + viewportHeight * 0.52;

      const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
      if (!sections.length) return;

      let activeIndex = sections.length - 1;
      let activeTop = 0;
      let activeHeight = viewportHeight;

      for (let index = 0; index < sections.length; index += 1) {
        const rect = sections[index].getBoundingClientRect();
        const top = rect.top + scrollY;
        const height = Math.max(rect.height, viewportHeight * 0.6);
        const bottom = top + height;

        if (midpoint >= top && midpoint < bottom) {
          activeIndex = index;
          activeTop = top;
          activeHeight = height;
          break;
        }

        if (index === sections.length - 1 && midpoint >= bottom) {
          activeTop = top;
          activeHeight = height;
        }
      }

      const localProgress = clamp((midpoint - activeTop) / activeHeight, 0, 1);
      const direction = scrollY >= previousScrollY.current ? 1 : -1;
      previousScrollY.current = scrollY;

      const nextIndex =
        direction >= 0
          ? Math.min(activeIndex + 1, sections.length - 1)
          : Math.max(activeIndex - 1, 0);

      const blend =
        nextIndex === activeIndex
          ? 0
          : direction >= 0
            ? clamp((localProgress - 0.58) / 0.32, 0, 1)
            : clamp((0.42 - localProgress) / 0.32, 0, 1);

      const quantizedBlend = Math.round(blend * 100) / 100;

      setScene((current) => {
        const hasSameScene =
          current.activeIndex === activeIndex &&
          current.nextIndex === nextIndex &&
          Math.abs(current.blend - quantizedBlend) < 0.015;

        if (hasSameScene) return current;

        return { activeIndex, nextIndex, blend: quantizedBlend };
      });
    };

    const requestMeasure = () => {
      if (frame) return;
      frame = raf(() => {
        frame = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      if (frame) caf(frame);
    };
  }, []);

  const sceneOpacity = SECTION_IDS.map((_, index) => {
    if (index === scene.activeIndex && index === scene.nextIndex) return 1;
    if (index === scene.activeIndex) return 1 - scene.blend;
    if (index === scene.nextIndex) return scene.blend;
    return 0;
  });

  return (
    <div aria-hidden="true" className="section-motion-backdrop">
      <div className="section-motion-backdrop__base" />

      <div className="motion-global motion-twinkle absolute inset-0" />
      <div className="motion-global motion-orbs absolute inset-0">
        <span className="motion-orb motion-orb-1" />
        <span className="motion-orb motion-orb-2" />
        <span className="motion-orb motion-orb-3" />
      </div>
      {/* Removed overflow-hidden from this wrapper — on iOS it can suppress painting
          of child elements inside fixed/absolute stacking contexts */}
      <div className="motion-global motion-wind absolute inset-0">
        <span className="motion-wind-line" style={{ top: "15%", animationDelay: "0s" }} />
        <span className="motion-wind-line" style={{ top: "45%", animationDelay: "2.3s" }} />
        <span className="motion-wind-line" style={{ top: "75%", animationDelay: "5.1s" }} />
      </div>
      <div className="motion-global motion-kirin absolute inset-0" />

      {/* will-change: opacity tells iOS to promote each scene to its own compositor
          layer so cross-fades are handled by the GPU instead of re-painting on the
          main thread. Without this, scroll-driven opacity changes can stutter or
          drop frames on older iPhones. Android benefits from this too. */}
      <section
        className="motion-scene motion-scene--home"
        style={{ opacity: sceneOpacity[0] ?? 0, willChange: "opacity" }}
      >
        {clouds.map((cloud, index) => (
          <span
            key={cloud.id}
            className="motion-cloud"
            style={{
              "--cloud-width": `${cloud.width}vw`,
              "--cloud-top": `${cloud.top}%`,
              "--cloud-duration": `${cloud.duration}s`,
              "--cloud-delay": `${cloud.delay}s`,
              opacity: 0.2 + (index % 3) * 0.07,
            }}
          />
        ))}
      </section>

      <section
        className="motion-scene motion-scene--projects"
        style={{ opacity: sceneOpacity[1] ?? 0, willChange: "opacity" }}
      >
        {drops.map((drop) => (
          <span
            key={drop.id}
            className="motion-drop"
            style={{
              "--drop-left": `${drop.left}%`,
              "--drop-height": `${drop.length}px`,
              "--drop-duration": `${drop.duration}s`,
              "--drop-delay": `${drop.delay}s`,
            }}
          />
        ))}
        <span className="motion-ripple" />
      </section>

      <section
        className="motion-scene motion-scene--experience"
        style={{ opacity: sceneOpacity[2] ?? 0, willChange: "opacity" }}
      >
        <div className="motion-windmill">
          <span className="motion-windmill__hub" />
          <span className="motion-windmill__arm motion-windmill__arm--a" />
          <span className="motion-windmill__arm motion-windmill__arm--b" />
          <span className="motion-windmill__arm motion-windmill__arm--c" />
          <span className="motion-windmill__arm motion-windmill__arm--d" />
        </div>
      </section>

      <section
        className="motion-scene motion-scene--music"
        style={{ opacity: sceneOpacity[3] ?? 0, willChange: "opacity" }}
      >
        <div className="motion-wave motion-wave--one" />
        <div className="motion-wave motion-wave--two" />
        <div className="motion-wave motion-wave--three" />
      </section>

      <section
        className="motion-scene motion-scene--about"
        style={{ opacity: sceneOpacity[4] ?? 0, willChange: "opacity" }}
      >
        {[0, 1, 2].map((index) => (
          <span
            key={`spring-${index}`}
            className={`motion-spring motion-spring--${index + 1}`}
          />
        ))}
      </section>

      <section
        className="motion-scene motion-scene--contact"
        style={{ opacity: sceneOpacity[5] ?? 0, willChange: "opacity" }}
      >
        {gusts.map((gust) => (
          <span
            key={gust.id}
            className="motion-gust"
            style={{
              "--gust-top": `${gust.top}%`,
              "--gust-width": `${gust.width}vw`,
              "--gust-duration": `${gust.duration}s`,
              "--gust-delay": `${gust.delay}s`,
            }}
          />
        ))}
      </section>
    </div>
  );
}