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
import { unlockAudioContext } from './utils/interactionFeedback';

// Safe localStorage read that won't throw on iOS private mode or old Safari
function safeLocalStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    let forceLoader = false;
    try {
      const params = new URLSearchParams(window.location.search);
      forceLoader =
        params.get('forceLoader') === '1' || safeLocalStorage('forceLoader') === '1';
    } catch (e) {
      // If URL parsing fails for any reason, proceed normally
    }

    if (forceLoader) {
      console.log('Debug: forceLoader enabled; keeping loader visible until param removed');
      return undefined;
    }

    // Keep loader visible for 7s to match original behavior and UX expectations
    const timer = setTimeout(() => setLoading(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      console.log('App startup info', {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        // Fixed: 'pointer: coarse' needs a space — older iOS Safari is strict about this
        pointerCoarse: window.matchMedia('(pointer: coarse)').matches,
        ua: navigator.userAgent,
        displayModeStandalone: window.matchMedia('(display-mode: standalone)').matches,
        standaloneFlag: window.navigator.standalone,
      });
    } catch (e) {
      // ignore in odd environments
    }
  }, []);

  useEffect(() => {
    if (loading) return undefined;

    const revealElements = Array.from(
      document.querySelectorAll('[data-reveal]')
    ).filter((el) => !el.matches('main > section, main > footer'));

    if (!revealElements.length) return undefined;

    let prefersReducedMotion = false;
    try {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}

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
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 60}ms`);
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    // iOS requires AudioContext to be created/resumed synchronously inside
    // the gesture handler itself — not in a wrapper or setTimeout.
    // Using a raw DOM listener here (not a React synthetic event) keeps it
    // as close to the gesture as possible.
    function handleFirstGesture() {
      unlockAudioContext();
    }

    document.addEventListener('touchstart', handleFirstGesture, {
      passive: true,
      once: true,
    });
    document.addEventListener('mousedown', handleFirstGesture, {
      once: true,
    });

    return () => {
      document.removeEventListener('touchstart', handleFirstGesture);
      document.removeEventListener('mousedown', handleFirstGesture);
    };
  }, []);

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
              <main>
                <Home />
                <Projects />
                <Experience />
                <Music />
                <About />
                <Contact />
                <ScrollToggle />
              </main>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;