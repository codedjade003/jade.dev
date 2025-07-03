import { useState, useEffect } from 'react';
import ProfileImage from '../assets/profile.jpg';

export default function About() {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleProfileClick = () => {
    setClickCount(prev => prev + 1);
  };

  useEffect(() => {
    if (clickCount === 5) {
      setShowModal(true);
    }
  }, [clickCount]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      window.location.reload();
    }
  }, [showCountdown, countdown]);

  const handleYes = () => {
    window.location.href = 'https://animepahe.ru';
  };

  const handleNo = () => {
    setShowCountdown(true);
  };

  return (
    <section
      id="about"
      className="min-h-screen px-6 py-16 flex flex-col justify-center items-center text-center 
      bg-white text-blue-800 
      dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <img
        src={ProfileImage}
        alt="Jade profile"
        onClick={handleProfileClick}
        className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover 
        border-4 border-blue-800 dark:border-blue-300 mb-6 cursor-pointer transition-transform hover:scale-105"
        title="Click me 5 times 😉"
      />

      <h2 className="text-2xl sm:text-3xl font-bold mb-4">About Me</h2>

      <p className="max-w-xl text-slate-700 dark:text-blue-300 mb-6 text-sm sm:text-base px-2 sm:px-0">
        I’m Jade, a passionate Full-Stack Developer and Machine Learning enthusiast.
        I build modern web apps with React, Node, and Python — and I’m all about clean design,
        fast performance, and solving real problems.
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-semibold">
        {['React', 'Tailwind CSS', 'Node.js', 'Python', 'LLaMA Chatbots'].map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full 
            dark:bg-blue-900 dark:text-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Easter Egg Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2b2b3c] text-center p-6 rounded-lg shadow-lg max-w-sm w-[90%]">
            <h3 className="text-xl font-bold mb-4">🎉 Wow, you found my easter egg!</h3>
            {!showCountdown ? (
              <>
                <p className="mb-4">Do you like anime?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleYes}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleNo}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  >
                    No
                  </button>
                </div>
              </>
            ) : (
              <p className="text-red-500 font-semibold">
                Boohoo 😢 Redirecting in {countdown}...
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
