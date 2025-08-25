import { useEffect, useState } from "react";

export default function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen px-4 sm:px-6 py-16 bg-white text-blue-800 dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl font-bold mb-8 text-right">Projects</h2>

        {/* Live Projects */}
        <h3 className="text-2xl font-semibold mb-6">Live Projects</h3>
        <ProjectGrid projects={liveProjects} type="live" />

        {/* Personal Projects */}
        <h3 className="text-2xl font-semibold mt-12 mb-6 text-right">Personal Projects</h3>
        <ProjectGrid projects={personalProjects} type="personal" />

        {/* Upcoming Projects */}
        <h3 className="text-2xl font-semibold mt-12 mb-6">Upcoming Projects</h3>
        <ProjectGrid projects={upcomingProjects} type="upcoming" />

        {/* Footer note */}
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

/* ------------------ Shared Project Grid ------------------ */
function ProjectGrid({ projects, type }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((proj) => (
        <div
          key={proj.title}
          className="fade-up bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow transition-colors text-sm"
        >
          <div className="relative aspect-video rounded-md overflow-hidden mb-3 group">
            {/* Thumbnail with hover → video */}
            {proj.youtubeId ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${proj.youtubeId}/hqdefault.jpg`}
                  alt={`${proj.title} Preview`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <iframe
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  src={`https://www.youtube.com/embed/${proj.youtubeId}`}
                  title={`${proj.title} Demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                Coming Soon
              </div>
            )}
          </div>

          {/* Title + description */}
          <h3 className="text-lg font-semibold mb-1">{proj.title}</h3>
          <p className="text-slate-700 dark:text-slate-400 mb-3">{proj.description}</p>

          {/* Buttons or Progress */}
          <div className="flex gap-3 flex-wrap">
            {type === "live" && proj.demo && proj.code && (
              <>
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
                  Visit Site
                </a>
              </>
            )}

            {type === "personal" && proj.demo && proj.code && (
              <>
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
              </>
            )}

            {type === "upcoming" && proj.progress && (
              <div className="w-full space-y-2">
                {proj.progress.map((bar) => (
                  <ProgressBar key={bar.label} label={bar.label} value={bar.value} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------ Progress Bar ------------------ */
function ProgressBar({ label, value }) {
  return (
    <div>
      <span className="text-xs font-medium">{label}</span>
      <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------ Data ------------------ */
const liveProjects = [
  {
    title: "Arewa Film Festival",
    description:
      "Official website for the Arewa Film Festival, built to highlight film screenings, schedules, and cultural initiatives across Northern Nigeria. Responsive and designed for accessibility, the platform helps amplify creative voices in the region.",
    youtubeId: "4MJpAHUfUaQ",
    demo: "https://youtu.be/4MJpAHUfUaQ",
    code: "https://arewafilmfestival.com",
    codeLabel: "Visit Site",
  },
  {
    title: "Stelle Homes",
    description:
      "Real estate platform for showcasing luxury properties. This was my first collaboration project with designer Are Moses, blending design and functionality to create a clean user experience.",
    youtubeId: "62AW9IENSHo",
    demo: "https://youtu.be/62AW9IENSHo",
    code: "https://stellehomes.com",
    codeLabel: "Visit Site",
  },
];

const personalProjects = [
  {
    title: "Bookstore Inventory App",
    description: "Full-stack app with inventory management using React, Node.js, and MongoDB.",
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
    description: "Python app for vector search of image captions using ChromaDB and Hugging Face.",
    youtubeId: "h9b2tqMaHcQ",
    demo: "https://youtu.be/h9b2tqMaHcQ",
    code: "https://github.com/codedjade003/Chromadb",
    codeLabel: "Source Code",
  },
  {
    title: "Sentiment-Aware Chatbot",
    description: "Chatbot powered by LLaMA 2 and Hugging Face, enhanced with real-time sentiment detection.",
    youtubeId: "kxE8g5dEQ84",
    demo: "https://youtu.be/kxE8g5dEQ84",
    code: "https://drive.google.com/file/d/1iyBKacgGq7sUrBi7D86eoV5l_pUg1vl5/view?usp=sharing",
    codeLabel: "View Notebook",
  },
];

const upcomingProjects = [
  {
    title: "Samish Homes",
    description:
      "A modern property-listing concept for a potential client, designed with a focus on clarity and interactive browsing.",
    youtubeId: "fCJSpsrc1TY",
    demo: "https://youtu.be/fCJSpsrc1TY",
    progress: [
      { label: "Design", value: 80 },
      { label: "Development", value: 40 },
    ],
  },
  {
    title: "Tech Learning",
    description:
      "A platform in development for the technical department of my church, aiming to organize and share learning resources.",
    youtubeId: "ePfemKcC02s",
    demo: "https://youtu.be/ePfemKcC02s",
    progress: [
      { label: "Frontend", value: 50 },
      { label: "Backend", value: 30 },
    ],
  },
  {
    title: "New Portfolio Website",
    description: "My new portfolio website — currently in development. Stay tuned!",
    progress: [{ label: "Coming Soon", value: 0 }],
  },
];
