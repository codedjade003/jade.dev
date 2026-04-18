import { useEffect, useMemo, useState } from "react";

export default function Projects() {
  const projectSectionConfig = getProjectSectionConfig();

  return (
    <section
      id="projects"
      data-reveal="up"
      className="scroll-mt-20 px-4 sm:px-6 py-16 bg-white text-blue-800 dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2 data-reveal="left" className="text-3xl font-bold">
            Projects
          </h2>
          <p
            data-reveal="right"
            style={{ "--reveal-delay": "120ms" }}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            Flick each rail to browse. Two cards at a time, always looping.
          </p>
        </div>

        {projectSectionConfig.map((section, sectionIndex) => (
          <ProjectCarouselSection
            key={section.key}
            section={section}
            revealDelay={sectionIndex * 90}
          />
        ))}

        <p
          data-reveal="up"
          style={{ "--reveal-delay": "220ms" }}
          className="text-right text-sm text-slate-600 dark:text-slate-400 italic"
        >
          Still more on my{" "}
          <a
            href="https://github.com/codedjade003"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-red-500"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function ProjectCarouselSection({ section, revealDelay }) {
  const { title, hint, type, projects, align, viewMoreLabel, viewMoreHref } = section;
  const totalProjects = projects.length;
  const cardsPerView = Math.min(2, totalProjects);

  const [startIndex, setStartIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState(-1);
  const [dragStartX, setDragStartX] = useState(null);
  const [pauseAutoSlide, setPauseAutoSlide] = useState(false);

  const shiftNext = () => {
    if (totalProjects < 2) return;
    setFlipDirection(-1);
    setStartIndex((current) => (current + 1) % totalProjects);
  };

  const shiftPrev = () => {
    if (totalProjects < 2) return;
    setFlipDirection(1);
    setStartIndex((current) => (current - 1 + totalProjects) % totalProjects);
  };

  useEffect(() => {
    if (totalProjects < 2 || pauseAutoSlide) return undefined;

    const timer = setInterval(() => {
      setFlipDirection(-1);
      setStartIndex((current) => (current + 1) % totalProjects);
    }, 6800);

    return () => clearInterval(timer);
  }, [pauseAutoSlide, totalProjects]);

  const visibleProjects = useMemo(() => {
    return Array.from({ length: cardsPerView }, (_, offset) => {
      const nextIndex = (startIndex + offset) % totalProjects;
      return {
        project: projects[nextIndex],
        originIndex: nextIndex,
      };
    });
  }, [cardsPerView, projects, startIndex, totalProjects]);

  const handlePointerDown = (event) => {
    if (totalProjects < 2) return;
    setDragStartX(event.clientX);
  };

  const handlePointerUp = (event) => {
    if (totalProjects < 2 || dragStartX === null) return;

    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        shiftNext();
      } else {
        shiftPrev();
      }
    }
    setDragStartX(null);
  };

  return (
    <div
      data-reveal={align === "right" ? "right" : "left"}
      style={{ "--reveal-delay": `${revealDelay}ms` }}
      className="rounded-3xl border border-blue-100 dark:border-blue-900/60 bg-slate-50/70 dark:bg-[#21213a] p-5 sm:p-6"
    >
      <div
        className={`flex flex-col sm:flex-row gap-3 sm:items-end ${
          align === "right" ? "sm:flex-row-reverse" : ""
        }`}
      >
        <div className={align === "right" ? "text-left sm:text-right" : "text-left"}>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{hint}</p>
        </div>

        <div className={`flex items-center gap-2 ${align === "right" ? "sm:mr-auto" : "sm:ml-auto"}`}>
          <button
            onClick={shiftPrev}
            type="button"
            aria-label={`Previous ${title} projects`}
            className="px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-600 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={shiftNext}
            type="button"
            aria-label={`Next ${title} projects`}
            className="px-3 py-1.5 rounded-full bg-blue-700 dark:bg-blue-500 text-white text-sm hover:bg-red-500 dark:hover:bg-red-400 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <div
        className="project-flick-surface mt-6"
        onMouseEnter={() => setPauseAutoSlide(true)}
        onMouseLeave={() => {
          setPauseAutoSlide(false);
          setDragStartX(null);
        }}
      >
        <div
          tabIndex={0}
          role="region"
          aria-label={`${title} project carousel`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragStartX(null)}
          onPointerLeave={() => setDragStartX(null)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") shiftNext();
            if (event.key === "ArrowLeft") shiftPrev();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 outline-none"
        >
          {visibleProjects.map(({ project, originIndex }, slotIndex) => (
            <div
              key={`${project.title}-${startIndex}-${slotIndex}`}
              style={{
                "--flip-angle": `${flipDirection < 0 ? -18 : 18}deg`,
              }}
              className="flip-enter"
            >
              <ProjectCard
                project={project}
                type={type}
                originIndex={originIndex}
                totalProjects={totalProjects}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing {cardsPerView} of {totalProjects}
          </span>
          <span>Flick left or right to loop</span>
        </div>
      </div>

      <div className={`mt-5 flex ${align === "right" ? "justify-end" : "justify-start"}`}>
        <a
          href={viewMoreHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-700 text-white hover:bg-red-500 dark:bg-blue-500 dark:hover:bg-red-400 transition-colors"
        >
          {viewMoreLabel}
        </a>
      </div>
    </div>
  );
}

function ProjectCard({ project, type, originIndex, totalProjects }) {
  return (
    <div className="project-stack h-full">
      <article className="h-full bg-slate-100 dark:bg-slate-800/95 p-4 rounded-2xl border border-blue-100 dark:border-slate-700 shadow text-sm flex flex-col">
        <HoverVideoPreview project={project} />

        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-lg font-semibold leading-tight">{project.title}</h4>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-blue-600 dark:text-blue-300 whitespace-nowrap">
            {originIndex + 1}/{totalProjects}
          </span>
        </div>

        <p className="text-slate-700 dark:text-slate-300 mb-4">{project.description}</p>

        <div className="mt-auto">
          <ProjectActions project={project} type={type} />
        </div>
      </article>
    </div>
  );
}

function HoverVideoPreview({ project }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!project.youtubeId) {
    return (
      <div className="flex items-center justify-center w-full aspect-video rounded-xl mb-4 bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
        Coming Soon
      </div>
    );
  }

  const embedSrc = `https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${project.youtubeId}`;

  return (
    <div
      className="relative aspect-video rounded-xl overflow-hidden mb-4 group"
      onMouseEnter={() => setIsPlaying(true)}
      onMouseLeave={() => setIsPlaying(false)}
      onClick={() => setIsPlaying((playing) => !playing)}
    >
      <img
        src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
        alt={`${project.title} preview`}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {isPlaying && (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedSrc}
          title={`${project.title} demo video`}
          loading="lazy"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}

      <div
        className={`absolute inset-x-0 bottom-0 px-3 py-2 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-200 pointer-events-none ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      >
        Hover to play
      </div>
    </div>
  );
}

function ProjectActions({ project, type }) {
  if ((type === "live" || type === "personal") && project.demo && project.code) {
    return (
      <div className="flex gap-2 flex-wrap">
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded font-semibold hover:bg-red-500 transition-colors dark:bg-blue-500 dark:hover:bg-red-400"
        >
          View Demo
        </a>
        <a
          href={project.code}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm border border-blue-700 text-blue-700 rounded font-semibold hover:border-red-500 hover:text-red-500 transition-colors dark:border-blue-300 dark:text-blue-300 dark:hover:border-red-400 dark:hover:text-red-400"
        >
          {type === "live" ? "Visit Site" : project.codeLabel}
        </a>
      </div>
    );
  }

  if (type === "upcoming" && project.progress) {
    return (
      <div className="space-y-3">
        {project.progress.map((bar) => (
          <ProgressBar key={bar.label} label={bar.label} value={bar.value} />
        ))}

        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-3 py-1.5 text-sm border border-blue-700 text-blue-700 rounded font-semibold hover:border-red-500 hover:text-red-500 transition-colors dark:border-blue-300 dark:text-blue-300 dark:hover:border-red-400 dark:hover:text-red-400"
          >
            Watch Teaser
          </a>
        )}
      </div>
    );
  }

  return null;
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getProjectSectionConfig() {
  return [
    {
      key: "live",
      title: "Live Projects",
      hint: "Shipped and currently active.",
      type: "live",
      projects: liveProjects,
      align: "left",
      viewMoreLabel: "View More Live Work",
      viewMoreHref: "https://github.com/codedjade003",
    },
    {
      key: "personal",
      title: "Personal Projects",
      hint: "Built to explore and push ideas.",
      type: "personal",
      projects: personalProjects,
      align: "right",
      viewMoreLabel: "View More Personal Builds",
      viewMoreHref: "https://github.com/codedjade003?tab=repositories",
    },
    {
      key: "upcoming",
      title: "Upcoming Projects",
      hint: "Currently cooking with visible progress.",
      type: "upcoming",
      projects: upcomingProjects,
      align: "left",
      viewMoreLabel: "View More Roadmap",
      viewMoreHref: "https://github.com/codedjade003",
    },
  ];
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
