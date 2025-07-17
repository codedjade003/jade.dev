import { useState } from "react";

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen px-4 sm:px-6 py-16 bg-white text-blue-800 dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-right">Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.title} proj={proj} />
          ))}
        </div>

        <p className="text-right mt-8 text-sm text-slate-600 dark:text-slate-400 italic">
          So much more on my{" "}
          <a
            href="https://github.com/codedjade003"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-500"
          >
            GitHub
          </a>
          , I'm just not proud of it yet.
        </p>
      </div>
    </section>
  );
}

function ProjectCard({ proj }) {
  const [showIframe, setShowIframe] = useState(false);
  let touchTimer = null;

  const handleTouchStart = () => {
    touchTimer = setTimeout(() => {
      setShowIframe(true);
    }, 500); // long press threshold
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer);
  };

  return (
    <div className="fade-up bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow transition-colors text-sm">
      <div
        className="relative aspect-video rounded-md overflow-hidden mb-3 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={`https://img.youtube.com/vi/${proj.youtubeId}/hqdefault.jpg`}
          alt={`${proj.title} Preview`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            showIframe ? "opacity-0" : "group-hover:opacity-0"
          }`}
        />
        <iframe
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            showIframe ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          src={`https://www.youtube.com/embed/${proj.youtubeId}`}
          title={`${proj.title} Demo`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <h3 className="text-lg font-semibold mb-1">{proj.title}</h3>
      <p className="text-slate-700 dark:text-slate-400 mb-3">{proj.description}</p>

      <div className="flex gap-3 flex-wrap">
        <a
          href={proj.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded font-semibold hover:bg-red-500 transition dark:bg-blue-500 dark:hover:bg-red-400"
        >
          View Demo
        </a>
        <a
          href={proj.code}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm border border-blue-700 text-blue-700 rounded font-semibold hover:border-red-500 hover:text-red-500 transition dark:border-blue-300 dark:text-blue-300 dark:hover:border-red-400 dark:hover:text-red-400"
        >
          {proj.codeLabel}
        </a>
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Bookstore Inventory App",
    description:
      "Full-stack app with inventory management using React, Node.js, and MongoDB.",
    youtubeId: "rc4yrCSd2Hw",
    demo: "https://youtu.be/rc4yrCSd2Hw",
    code: "https://github.com/codedjade003/bookstore_project",
    codeLabel: "Source Code",
  },
  {
    title: "NFT Marketplace",
    description: "A clean and fast NFT trading platform built with React & Web3.js.",
    youtubeId: "6PPzeRrN1zw",
    demo: "https://youtu.be/6PPzeRrN1zw",
    code: "https://github.com/codedjade003/move-on-aptos-IV",
    codeLabel: "Source Code",
  },
  {
    title: "Text-to-Image Search",
    description:
      "Python app for vector search of image captions using ChromaDB and Hugging Face.",
    youtubeId: "h9b2tqMaHcQ",
    demo: "https://youtu.be/h9b2tqMaHcQ",
    code: "https://github.com/codedjade003/Chromadb",
    codeLabel: "Source Code",
  },
  {
    title: "Sentiment-Aware Chatbot",
    description:
      "Chatbot powered by LLaMA 2 and Hugging Face, enhanced with real-time sentiment detection.",
    youtubeId: "kxE8g5dEQ84",
    demo: "https://youtu.be/kxE8g5dEQ84",
    code: "https://drive.google.com/file/d/1iyBKacgGq7sUrBi7D86eoV5l_pUg1vl5/view?usp=sharing",
    codeLabel: "View Notebook",
  },
];
