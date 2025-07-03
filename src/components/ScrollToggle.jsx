import { useEffect, useState } from 'react';

export default function ScrollToggle() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      // if we're within 100px of bottom
      setAtBottom(scrollY + windowHeight >= fullHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
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
      className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full shadow-lg text-white
      bg-blue-800 hover:bg-red-600 dark:bg-blue-500 dark:hover:bg-red-400 transition-colors duration-300"
    >
      {atBottom ? '⬆️ Top' : '⬇️ Contact'}
    </button>
  );
}
