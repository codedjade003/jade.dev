import { useEffect, useState } from "react";

export default function Projects() {
  const projectSectionConfig = getProjectSectionConfig();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionDirection, setSectionDirection] = useState(1);
  const [cardFlipDirection, setCardFlipDirection] = useState(-1);
  const [pauseAutoSlide, setPauseAutoSlide] = useState(false);
  const [headingDragStartX, setHeadingDragStartX] = useState(null);
  const [cardDragStartX, setCardDragStartX] = useState(null);
  const [projectIndices, setProjectIndices] = useState(() =>
    Object.fromEntries(projectSectionConfig.map((section) => [section.key, 0]))
  );

  const activeSection = projectSectionConfig[activeSectionIndex];
  const activeProjectCount = activeSection.projects.length;
  const activeProjectIndex = projectIndices[activeSection.key] ?? 0;
  const activeProject = activeSection.projects[activeProjectIndex];

  const moveSection = (direction) => {
    setSectionDirection(direction);
    setActiveSectionIndex((current) => {
      const totalSections = projectSectionConfig.length;
      return (current + direction + totalSections) % totalSections;
    });
  };

  const jumpToSection = (index) => {
    if (index === activeSectionIndex) return;
    setSectionDirection(index > activeSectionIndex ? 1 : -1);
    setActiveSectionIndex(index);
  };

  const moveProject = (direction) => {
    if (activeProjectCount < 2) return;

    setCardFlipDirection(direction > 0 ? -1 : 1);
    setProjectIndices((current) => {
      const next = { ...current };
      const currentIndex = next[activeSection.key] ?? 0;
      next[activeSection.key] = (currentIndex + direction + activeProjectCount) % activeProjectCount;
      return next;
    });
  };

  useEffect(() => {
    if (activeProjectCount < 2 || pauseAutoSlide) return undefined;

    const timer = setInterval(() => {
      setCardFlipDirection(-1);
      setProjectIndices((current) => {
        const next = { ...current };
        const currentIndex = next[activeSection.key] ?? 0;
        next[activeSection.key] = (currentIndex + 1) % activeProjectCount;
        return next;
      });
    }, 7200);

    return () => clearInterval(timer);
  }, [activeProjectCount, activeSection.key, pauseAutoSlide]);

  const handleHeadingPointerUp = (event) => {
    if (headingDragStartX === null) return;

    const delta = event.clientX - headingDragStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        moveSection(1);
      } else {
        moveSection(-1);
      }
    }
    setHeadingDragStartX(null);
  };

  const handleCardPointerUp = (event) => {
    if (cardDragStartX === null) return;

    const delta = event.clientX - cardDragStartX;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        moveProject(1);
      } else {
        moveProject(-1);
      }
    }
    setCardDragStartX(null);
  };

  return (
    <section
      id="projects"
      data-reveal="up"
      className="scroll-mt-20 px-4 sm:px-6 py-12 bg-white text-blue-800 dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2 data-reveal="left" className="text-3xl font-bold">
            Projects
          </h2>
          <p
            data-reveal="right"
            style={{ "--reveal-delay": "120ms" }}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            Swipe categories sideways. One project card per view.
          </p>
        </div>

        <div
          data-reveal="up"
          style={{ "--reveal-delay": "140ms" }}
          className="rounded-3xl border border-blue-100 dark:border-blue-900/60 bg-slate-50/70 dark:bg-[#21213a] p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Project Carousel
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => moveSection(-1)}
                type="button"
                aria-label="Previous project category"
                className="h-8 w-8 rounded-full border border-blue-300 dark:border-blue-600 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
              >
                {"<"}
              </button>
              <button
                onClick={() => moveSection(1)}
                type="button"
                aria-label="Next project category"
                className="h-8 w-8 rounded-full bg-blue-700 dark:bg-blue-500 text-white text-sm hover:bg-red-500 dark:hover:bg-red-400 transition-colors"
              >
                {">"}
              </button>
            </div>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Project category carousel"
            className="project-flick-surface relative mt-4 h-40 sm:h-44 outline-none"
            onPointerDown={(event) => setHeadingDragStartX(event.clientX)}
            onPointerUp={handleHeadingPointerUp}
            onPointerCancel={() => setHeadingDragStartX(null)}
            onPointerLeave={() => setHeadingDragStartX(null)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") moveSection(1);
              if (event.key === "ArrowLeft") moveSection(-1);
            }}
          >
            {[-1, 0, 1].map((offset) => {
              const sectionIndex =
                (activeSectionIndex + offset + projectSectionConfig.length) % projectSectionConfig.length;
              const section = projectSectionConfig[sectionIndex];
              const isCenter = offset === 0;

              return (
                <button
                  key={`${section.key}-${offset}`}
                  type="button"
                  onClick={() => {
                    if (offset === 0) return;
                    moveSection(offset > 0 ? 1 : -1);
                  }}
                  aria-current={isCenter ? "true" : undefined}
                  className={`absolute left-1/2 top-1/2 w-[clamp(11rem,42vw,18rem)] rounded-2xl border px-4 py-3 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isCenter
                      ? "bg-blue-700 text-white border-blue-700 dark:bg-blue-500 dark:border-blue-500"
                      : "bg-white/85 text-blue-800 border-blue-200 dark:bg-slate-800/95 dark:text-blue-200 dark:border-blue-900 hover:border-red-400"
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(calc(${offset} * clamp(7rem, 24vw, 13rem))) scale(${isCenter ? 1.05 : 0.82})`,
                    zIndex: isCenter ? 30 : 20,
                    opacity: isCenter ? 1 : 0.62,
                    filter: isCenter ? "none" : "saturate(0.76)",
                  }}
                >
                  <p className={`text-[10px] uppercase tracking-[0.2em] ${isCenter ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {section.type}
                  </p>
                  <p className={`mt-1 font-semibold ${isCenter ? "text-lg" : "text-sm"}`}>{section.title}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCenter ? "text-blue-100" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {section.hint}
                  </p>
                  <p
                    className={`mt-2 text-xs font-medium ${
                      isCenter ? "text-blue-100" : "text-blue-600 dark:text-blue-300"
                    }`}
                  >
                    {section.projects.length} projects
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-center gap-2">
            {projectSectionConfig.map((section, index) => (
              <button
                key={section.key}
                type="button"
                onClick={() => jumpToSection(index)}
                aria-label={`Go to ${section.title}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeSectionIndex
                    ? "w-7 bg-blue-700 dark:bg-blue-400"
                    : "w-2.5 bg-blue-200 dark:bg-blue-900"
                }`}
              />
            ))}
          </div>

          <div
            key={activeSection.key}
            className="mt-4 rounded-2xl border border-blue-100 dark:border-slate-700 bg-white/90 dark:bg-slate-900/25 p-4 sm:p-5 flip-enter"
            style={{ "--flip-angle": `${sectionDirection > 0 ? -14 : 14}deg` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold">{activeSection.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{activeSection.hint}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveProject(-1)}
                  type="button"
                  aria-label={`Previous ${activeSection.title} project`}
                  className="px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-600 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => moveProject(1)}
                  type="button"
                  aria-label={`Next ${activeSection.title} project`}
                  className="px-3 py-1.5 rounded-full bg-blue-700 dark:bg-blue-500 text-white text-sm hover:bg-red-500 dark:hover:bg-red-400 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

            <div
              className="project-flick-surface mt-5"
              onMouseEnter={() => setPauseAutoSlide(true)}
              onMouseLeave={() => {
                setPauseAutoSlide(false);
                setCardDragStartX(null);
              }}
            >
              <div
                tabIndex={0}
                role="region"
                aria-label={`${activeSection.title} project carousel`}
                onPointerDown={(event) => setCardDragStartX(event.clientX)}
                onPointerUp={handleCardPointerUp}
                onPointerCancel={() => setCardDragStartX(null)}
                onPointerLeave={() => setCardDragStartX(null)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") moveProject(1);
                  if (event.key === "ArrowLeft") moveProject(-1);
                }}
                className="outline-none"
              >
                <div
                  key={`${activeSection.key}-${activeProject.title}-${activeProjectIndex}`}
                  style={{ "--flip-angle": `${cardFlipDirection < 0 ? -18 : 18}deg` }}
                  className="flip-enter"
                >
                  <ProjectCard
                    project={activeProject}
                    type={activeSection.type}
                    originIndex={activeProjectIndex}
                    totalProjects={activeProjectCount}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {activeProjectIndex + 1} of {activeProjectCount}
                </span>
                <span>Swipe card to loop</span>
              </div>
            </div>

            <div className="mt-5 flex justify-start sm:justify-end">
              <a
                href={activeSection.viewMoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-700 text-white hover:bg-red-500 dark:bg-blue-500 dark:hover:bg-red-400 transition-colors"
              >
                {activeSection.viewMoreLabel}
              </a>
            </div>
          </div>
        </div>

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
  if (type === "live" || type === "personal" || type === "recent") {
    const hasSeparateSiteAndCode = Boolean(project.site && project.code);
    const siteHref = project.site ?? (type === "live" && project.codeLabel === "Visit Site" ? project.code : null);
    const codeHref = hasSeparateSiteAndCode
      ? project.code
      : type === "personal" || type === "recent"
      ? project.code
      : null;

    if (!project.demo && !siteHref && !codeHref) return null;

    return (
      <div className="flex gap-2 flex-wrap">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded font-semibold hover:bg-red-500 transition-colors dark:bg-blue-500 dark:hover:bg-red-400"
          >
            View Demo
          </a>
        )}

        {siteHref && (
          <a
            href={siteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm border border-blue-700 text-blue-700 rounded font-semibold hover:border-red-500 hover:text-red-500 transition-colors dark:border-blue-300 dark:text-blue-300 dark:hover:border-red-400 dark:hover:text-red-400"
          >
            Visit Site
          </a>
        )}

        {codeHref && (
          <a
            href={codeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm border border-blue-700 text-blue-700 rounded font-semibold hover:border-red-500 hover:text-red-500 transition-colors dark:border-blue-300 dark:text-blue-300 dark:hover:border-red-400 dark:hover:text-red-400"
          >
            {project.codeLabel ?? "Source Code"}
          </a>
        )}
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
      key: "recent",
      title: "Recent Projects",
      hint: "Fresh launches and newly shipped builds.",
      type: "recent",
      projects: recentProjects,
      align: "left",
      viewMoreLabel: "View More Recent Work",
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

const recentProjects = [
  {
    title: "LFC Jahi Multimedia Repository",
    description:
      "A multimedia archive platform for preserving and organizing video content with a clean browse experience for members and media teams.",
    youtubeId: "JPOaCAFA_Fw",
    demo: "https://youtu.be/JPOaCAFA_Fw",
    site: "https://lfcjahimediaarchive.xyz",
    code: "https://github.com/codedjade003/LFCJahiMediaArchive",
    codeLabel: "Source Code",
  },
  {
    title: "Goodness Birthday Website",
    description:
      "A personalized birthday microsite built as a playful celebration page, blending heartfelt storytelling with polished visual presentation.",
    youtubeId: "VW2FaJHQAAM",
    demo: "https://youtu.be/VW2FaJHQAAM",
    site: "https://goodnessosim.vercel.app",
    code: "https://github.com/codedjade003/goodness",
    codeLabel: "Source Code",
  },
  {
    title: "Tech Learn (Updated)",
    description:
      "An updated release of the Tech Learn platform focused on technical training resources, guided learning paths, and community-friendly access.",
    youtubeId: "QK3Nx6iPiI4",
    demo: "https://youtu.be/QK3Nx6iPiI4",
    site: "https://lfctechlearn.com",
    code: "https://github.com/codedjade003/LFCJahiTechLearn",
    codeLabel: "Source Code",
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
    title: "New Portfolio Website",
    description: "My new portfolio website — currently in development. Stay tuned!",
    progress: [{ label: "Coming Soon", value: 0 }],
  },
];
