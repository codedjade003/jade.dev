export default function Home() {
  return (
    <section
      id="home"
      className="min-h-[calc(100svh-72px)] md:min-h-screen scroll-mt-20 flex items-center justify-center text-center px-4 sm:px-6 
      bg-transparent text-blue-800
      dark:text-blue-300 transition-colors duration-300"
    >
      <div data-reveal="zoom" className="max-w-3xl">
        <h1 data-reveal="left" className="text-4xl md:text-6xl font-extrabold mb-4 flex items-center justify-center gap-3">
          Hi, I’m Jade
          <span
            className="inline-block animate-pulse hover:animate-none cursor-pointer active:scale-75 active:rotate-12 transition-transform duration-200"
            onClick={() => {
              import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('tap'));
            }}
            onTouchEnd={() => {
              import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('tap'));
            }}
            tabIndex={0}
            aria-label="Wave hello"
            role="button"
          >
            👋
          </span>
        </h1>

        <p
          data-reveal="right"
          style={{ "--reveal-delay": "120ms" }}
          className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-xl mx-auto"
        >
          I build modern full-stack web apps and AI projects. Let me show you.
        </p>

        <div
          data-reveal="up"
          style={{ "--reveal-delay": "220ms" }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
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
