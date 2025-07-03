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
      </Routes>
      <Route path="*" element={<NotFound />} />
    </div>
  );
}

export default App;
