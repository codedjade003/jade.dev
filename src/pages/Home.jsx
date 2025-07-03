export default function Home() {
  return (
    <section
      id="home"
      className="min-h-screen scroll-mt-20 flex items-center justify-center text-center px-4 sm:px-6 
      bg-white text-blue-800 
      dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Hi, I’m Jade <span className="animate-pulse">👋</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
          I build modern full-stack web apps and AI projects. Let me show you.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 
              bg-blue-800 text-white rounded-lg font-semibold shadow 
              hover:bg-red-600 
              transition-colors duration-300 
              dark:bg-blue-500 dark:hover:bg-red-400"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="px-6 py-3 
              border border-blue-800 text-blue-800 rounded-lg font-semibold 
              hover:border-red-600 hover:text-red-600 
              transition-colors duration-300 
              dark:border-blue-300 dark:text-blue-300 
              dark:hover:border-red-400 dark:hover:text-red-400"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
