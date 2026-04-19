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
import MotionBackdrop from './components/MotionBackdrop';

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const revealElements = Array.from(document.querySelectorAll('[data-reveal]')).filter(
      (el) => !el.matches('main > section, main > footer')
    );
    if (!revealElements.length) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px',
      }
    );

    revealElements.forEach((el, index) => {
      // Only set delay for the first few items to prevent long initial loads
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 60}ms`);
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <Loader />;

  return (
    <div className="relative text-base leading-relaxed font-sans bg-transparent text-blue-900 dark:text-blue-200">
      <MotionBackdrop />

      <div className="relative z-10">
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
    </div>
  );
}

export default App;
