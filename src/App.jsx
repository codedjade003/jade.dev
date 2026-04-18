import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Experience from './pages/Experience';
import Music from './pages/Music';
import Loader from './components/Loader';
import ScrollToggle from './components/ScrollToggle';
import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!revealElements.length) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -64px 0px',
      }
    );

    revealElements.forEach((el, index) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index, 7) * 60}ms`);
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <Loader />;

  return (
    <div className="text-base leading-relaxed font-sans bg-white dark:bg-[#1b1b2f] text-blue-900 dark:text-blue-200">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <main>
                <Home />
                <Projects />
                <Experience />
                <Music />
                <About />
                <Contact />
                <ScrollToggle />
              </main>
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
