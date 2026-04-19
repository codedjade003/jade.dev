import { useEffect, useState } from 'react';
import { triggerInteractionFeedback } from '../utils/interactionFeedback';

export default function ScrollToggle() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    let frame = null;

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = null;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;
        const nextAtBottom = scrollY + windowHeight >= fullHeight - 100;

        setAtBottom((current) => (current === nextAtBottom ? current : nextAtBottom));
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const handleClick = () => {
    triggerInteractionFeedback('tap');

    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      data-reveal="zoom"
      style={{ "--reveal-delay": "200ms" }}
      className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full shadow-lg text-white
      bg-blue-800 hover:bg-red-600 dark:bg-blue-500 dark:hover:bg-red-400 transition-colors duration-300"
    >
      {atBottom ? '⬆️ Top' : '⬇️ Contact'}
    </button>
  );
}
