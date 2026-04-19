import { useEffect, useRef, useState } from "react";
import { triggerInteractionFeedback } from "../utils/interactionFeedback";

const getYouTubeThumbnailSources = (youtubeId) => [
  `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
  `https://i.ytimg.com/vi/${youtubeId}/sddefault.jpg`,
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
];

export default function Projects() {
  const projectSectionConfig = getProjectSectionConfig();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sectionDirection, setSectionDirection] = useState(1);
  const [cardFlipDirection, setCardFlipDirection] = useState(-1);
  const [pauseAutoSlide, setPauseAutoSlide] = useState(false);
  const [sectionDragOffset, setSectionDragOffset] = useState(0);
  const [isSectionDragging, setIsSectionDragging] = useState(false);
  const [projectDragOffset, setProjectDragOffset] = useState(0);
  const [isProjectDragging, setIsProjectDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFlippedSectionKey, setMobileFlippedSectionKey] = useState(null);
  const [projectIndices, setProjectIndices] = useState(() =>
    Object.fromEntries(projectSectionConfig.map((section) => [section.key, 0]))
  );
  const projectDragRef = useRef({ active: false, dragging: false, startX: 0, startY: 0 });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const activeSection = projectSectionConfig[activeSectionIndex];
  const activeProjectCount = activeSection.projects.length;
  const activeProjectIndex = projectIndices[activeSection.key] ?? 0;
  const activeProject = activeSection.projects[activeProjectIndex];

  const moveSection = (direction, { feedback = "swipe" } = {}) => {
    setSectionDirection(direction);
    setMobileFlippedSectionKey(null);
    setSectionDragOffset(0);
    setIsSectionDragging(false);
    setActiveSectionIndex((current) => {
      const totalSections = projectSectionConfig.length;
      return (current + direction + totalSections) % totalSections;
    });

    if (feedback) {
      triggerInteractionFeedback(feedback);
    }
  };

  const jumpToSection = (index) => {
    if (index === activeSectionIndex) return;
    setSectionDirection(index > activeSectionIndex ? 1 : -1);
    setMobileFlippedSectionKey(null);
    setActiveSectionIndex(index);
    triggerInteractionFeedback("tap");
  };

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const moveProject = (direction, { feedback = "swipe" } = {}) => {
    if (activeProjectCount < 2) return;

    setCardFlipDirection(direction > 0 ? -1 : 1);
    setProjectDragOffset(0);
    setIsProjectDragging(false);
    setProjectIndices((current) => {
      const next = { ...current };
      const currentIndex = next[activeSection.key] ?? 0;
      next[activeSection.key] = (currentIndex + direction + activeProjectCount) % activeProjectCount;
      return next;
    });

    if (feedback) {
      triggerInteractionFeedback(feedback);
    }
  };

  useEffect(() => {
    if (activeProjectCount < 2 || pauseAutoSlide) return undefined;

    const timer = setInterval(() => {
      moveProject(1, { feedback: null });
    }, 7200);

    return () => clearInterval(timer);
  }, [activeProjectCount, activeSection.key, pauseAutoSlide]);

  const handleSectionDragStart = () => {
    setIsSectionDragging(true);
  };

  const handleSectionDragMove = (deltaX) => {
    setSectionDragOffset(clamp(deltaX, -190, 190));
  };

  const handleSectionDragEnd = (deltaX, wasDragging) => {
    setIsSectionDragging(false);
    setSectionDragOffset(0);

    if (!wasDragging) return false;

    if (Math.abs(deltaX) > 62) {
      moveSection(deltaX < 0 ? 1 : -1, { feedback: "swipe" });
      return true;
    }

    return true;
  };

  const isInteractiveTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest("a, button, iframe, input, textarea, select"));
  };

  const resetProjectDrag = () => {
    projectDragRef.current = { active: false, dragging: false, startX: 0, startY: 0 };
    setProjectDragOffset(0);
    setIsProjectDragging(false);
  };

  const handleProjectPointerDown = (event) => {
    if (isInteractiveTarget(event.target)) return;

    projectDragRef.current = {
      active: true,
      dragging: false,
      startX: event.clientX,
      startY: event.clientY,
    };

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  // Touch fallbacks for browsers that don't support Pointer Events (older iOS Safari)
  const handleProjectTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    if (isInteractiveTarget(t.target)) return;

    projectDragRef.current = {
      active: true,
      dragging: false,
      startX: t.clientX,
      startY: t.clientY,
    };
  };

  const handleProjectTouchMove = (e) => {
    const state = projectDragRef.current;
    if (!state.active || !e.touches || !e.touches[0]) return;

    const t = e.touches[0];
    const deltaX = t.clientX - state.startX;
    const deltaY = t.clientY - state.startY;

    if (!state.dragging) {
      if (Math.abs(deltaX) < 8) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;
      state.dragging = true;
      setIsProjectDragging(true);
    }

    setProjectDragOffset(clamp(deltaX, -180, 180));
  };

  const handleProjectTouchEnd = (e) => {
    const state = projectDragRef.current;
    if (!state.active) return;

    const ct = e.changedTouches && e.changedTouches[0];
    const deltaX = ct ? ct.clientX - state.startX : 0;
    const wasDragging = state.dragging;
    resetProjectDrag();

    if (!wasDragging) return;

    if (Math.abs(deltaX) > 65) {
      moveProject(deltaX < 0 ? 1 : -1, { feedback: "swipe" });
    }
  };

  const handleProjectPointerMove = (event) => {
    const state = projectDragRef.current;
    if (!state.active) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    if (!state.dragging) {
      if (Math.abs(deltaX) < 8) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;
      state.dragging = true;
      setIsProjectDragging(true);
    }

    setProjectDragOffset(clamp(deltaX, -180, 180));
  };

  const handleProjectPointerEnd = (event) => {
    const state = projectDragRef.current;
    if (!state.active) return;

    const deltaX = event.clientX - state.startX;
    const wasDragging = state.dragging;
    resetProjectDrag();

    if (!wasDragging) return;

    if (Math.abs(deltaX) > 65) {
      moveProject(deltaX < 0 ? 1 : -1, { feedback: "swipe" });
    }
  };

  return (
    <section
      id="projects"
      className="scroll-mt-20 py-12 bg-transparent text-blue-800 dark:text-blue-300 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-7">
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
          className="pt-3 sm:pt-4"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Project Carousel
            </p>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => moveSection(-1, { feedback: "tap" })}
                type="button"
                aria-label="Previous project category"
                className="h-8 w-8 rounded-full border border-blue-300 dark:border-blue-600 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
              >
                {"<"}
              </button>
              <button
                onClick={() => moveSection(1, { feedback: "tap" })}
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
            className="project-flick-surface relative mt-4 h-56 sm:h-64 outline-none"
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
              const previewProject = section.projects[projectIndices[section.key] ?? 0] ?? section.projects[0];

              return (
                <SectionFlipCategoryCard
                  key={`${section.key}-${offset}`}
                  section={section}
                  previewProject={previewProject}
                  isCenter={isCenter}
                  offset={offset}
                  sectionDragOffset={sectionDragOffset}
                  isSectionDragging={isSectionDragging}
                  isMobile={isMobile}
                  isMobileFlipped={mobileFlippedSectionKey === section.key}
                  onDragStart={handleSectionDragStart}
                  onDragMove={handleSectionDragMove}
                  onDragEnd={handleSectionDragEnd}
                  onTapFlip={() => {
                    if (!isMobile) return;
                    triggerInteractionFeedback("tap");
                    setMobileFlippedSectionKey((current) =>
                      current === section.key ? null : section.key
                    );
                  }}
                  onSelect={() => {
                    if (offset === 0) return;
                    moveSection(offset > 0 ? 1 : -1);
                  }}
                />
              );
            })}
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 md:hidden">
            <span role="img" aria-label="swipe" className="mr-1">👉</span>
            Tap to flip. <strong>Swipe sideways</strong> to change category or project.
          </p>

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

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => moveProject(-1, { feedback: "tap" })}
                  type="button"
                  aria-label={`Previous ${activeSection.title} project`}
                  className="px-3 py-1.5 rounded-full border border-blue-300 dark:border-blue-600 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => moveProject(1, { feedback: "tap" })}
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
                resetProjectDrag();
              }}
            >
              <div
                tabIndex={0}
                role="region"
                aria-label={`${activeSection.title} project carousel`}
                onPointerDown={handleProjectPointerDown}
                onPointerMove={handleProjectPointerMove}
                onPointerUp={handleProjectPointerEnd}
                onPointerCancel={resetProjectDrag}
                onPointerLeave={(event) => {
                  if (projectDragRef.current.active && projectDragRef.current.dragging) {
                    handleProjectPointerEnd(event);
                    return;
                  }

                  if (projectDragRef.current.active) {
                    resetProjectDrag();
                  }
                }}
                onTouchStart={handleProjectTouchStart}
                onTouchMove={handleProjectTouchMove}
                onTouchEnd={handleProjectTouchEnd}
                onTouchCancel={resetProjectDrag}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") moveProject(1, { feedback: "tap" });
                  if (event.key === "ArrowLeft") moveProject(-1, { feedback: "tap" });
                }}
                className="outline-none"
              >
                <div
                  className={`transition-transform ${isProjectDragging ? "duration-75" : "duration-300"}`}
                  style={{
                    transform: `translate3d(${projectDragOffset}px, 0, 0) rotate(${projectDragOffset * 0.025}deg)`,
                  }}
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

function SectionFlipCategoryCard({
  section,
  previewProject,
  isCenter,
  offset,
  sectionDragOffset,
  isSectionDragging,
  isMobile,
  isMobileFlipped,
  onDragStart,
  onDragMove,
  onDragEnd,
  onTapFlip,
  onSelect,
}) {
  const thumbnailSources = previewProject?.youtubeId
    ? getYouTubeThumbnailSources(previewProject.youtubeId)
    : [];
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const pointerStartRef = useRef(null);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  useEffect(() => {
    setThumbnailIndex(0);
  }, [previewProject?.youtubeId]);

  const previewImage = thumbnailSources.length ? thumbnailSources[thumbnailIndex] : null;
  const dragProgress = clamp(sectionDragOffset / 190, -1, 1);
  const virtualOffset = offset + dragProgress;
  const absOffset = Math.abs(virtualOffset);
  const scale = clamp(1.1 - absOffset * 0.34, 0.66, 1.11);
  const opacity = clamp(1 - absOffset * 0.35, 0.2, 1);
  const saturation = clamp(1 - absOffset * 0.24, 0.56, 1);
  const cardDistance = "clamp(9.5rem, 31vw, 22rem)";

  const handlePointerDown = (event) => {
    if (!isMobile || event.pointerType !== "touch") return;

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      dragging: false,
    };

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    // Always trigger feedback on touch start
    import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('tap'));
  };

  // Touch fallbacks for SectionFlipCategoryCard (for browsers without Pointer Events)
  const handleTouchStart = (e) => {
    if (!isMobile || !e.touches || !e.touches[0]) return;
    const t = e.touches[0];

    pointerStartRef.current = {
      x: t.clientX,
      y: t.clientY,
      dragging: false,
    };

    // Feedback for touch start
    import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('tap'));
  };

  const handleTouchMove = (e) => {
    if (!isMobile || !e.touches || !e.touches[0] || !pointerStartRef.current) return;
    const t = e.touches[0];

    const deltaX = t.clientX - pointerStartRef.current.x;
    const deltaY = t.clientY - pointerStartRef.current.y;

    if (!pointerStartRef.current.dragging) {
      if (Math.abs(deltaX) < 8) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      pointerStartRef.current.dragging = true;
      onDragStart();
      import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('swipe'));
    }

    if (pointerStartRef.current.dragging) {
      onDragMove(deltaX);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    const ct = e.changedTouches && e.changedTouches[0];
    if (!ct) {
      pointerStartRef.current = null;
      return;
    }

    const deltaX = ct.clientX - (pointerStartRef.current?.x ?? 0);
    const deltaY = ct.clientY - (pointerStartRef.current?.y ?? 0);
    const wasDragging = pointerStartRef.current?.dragging;
    pointerStartRef.current = null;

    const dragConsumed = onDragEnd(deltaX, wasDragging);
    if (dragConsumed) {
      import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('swipe'));
      return;
    }

    if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) {
      if (isCenter) {
        onTapFlip();
      }
    }
  };

  const handlePointerMove = (event) => {
    if (!isMobile || event.pointerType !== "touch" || !pointerStartRef.current) return;

    const deltaX = event.clientX - pointerStartRef.current.x;
    const deltaY = event.clientY - pointerStartRef.current.y;

    if (!pointerStartRef.current.dragging) {
      if (Math.abs(deltaX) < 8) return;
      if (Math.abs(deltaX) < Math.abs(deltaY)) return;

      pointerStartRef.current.dragging = true;
      onDragStart();
      // Feedback for swipe start
      import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('swipe'));
    }

    if (pointerStartRef.current.dragging) {
      onDragMove(deltaX);
    }
  };

  const handlePointerUp = (event) => {
    if (!isMobile || event.pointerType !== "touch" || !pointerStartRef.current) return;

    const deltaX = event.clientX - pointerStartRef.current.x;
    const deltaY = event.clientY - pointerStartRef.current.y;
    const wasDragging = pointerStartRef.current.dragging;
    pointerStartRef.current = null;

    const dragConsumed = onDragEnd(deltaX, wasDragging);
    if (dragConsumed) {
      // Feedback for swipe end
      import('../utils/interactionFeedback').then(m => m.triggerInteractionFeedback('swipe'));
      return;
    }

    if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) {
      if (isCenter) {
        onTapFlip();
      }
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (isMobile) return;
        triggerInteractionFeedback("tap");
        onSelect();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
        onDragEnd(0, false);
      }}
      onPointerLeave={() => {
        pointerStartRef.current = null;
        onDragEnd(0, false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        pointerStartRef.current = null;
        onDragEnd(0, false);
      }}
      aria-current={isCenter ? "true" : undefined}
      className="group absolute left-1/2 top-1/2 w-[clamp(12rem,45vw,21rem)] h-[10.5rem] sm:h-[12rem] text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        transform: `translate(-50%, -50%) translateX(calc(${virtualOffset} * ${cardDistance})) scale(${scale})`,
        zIndex: 40 - Math.round(absOffset * 12),
        opacity,
        filter: `saturate(${saturation})`,
        transition: isSectionDragging
          ? "transform 0ms linear, opacity 220ms ease, filter 220ms ease"
          : undefined,
      }}
    >
      <div className={`section-flip-card h-full w-full ${isMobileFlipped ? "is-flipped" : ""}`}>
        <div className="section-flip-card-inner">
          <div
            className={`section-flip-face border ${
              isCenter
                ? "border-blue-400 dark:border-blue-300"
                : "border-blue-200 dark:border-blue-900"
            }`}
          >
            <div className="relative h-full rounded-2xl overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={`${section.title} preview`}
                  loading="lazy"
                  onError={() => {
                    setThumbnailIndex((current) =>
                      Math.min(current + 1, Math.max(thumbnailSources.length - 1, 0))
                    );
                  }}
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700" />
              )}

              <div
                className={`absolute inset-0 ${
                  isCenter
                    ? "bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"
                    : "bg-gradient-to-t from-slate-900/75 via-slate-900/35 to-transparent"
                }`}
              />

              <div className="relative z-10 flex h-full flex-col justify-end p-3 sm:p-4 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100">{section.type}</p>
                <h4 className={`font-semibold leading-tight ${isCenter ? "text-lg" : "text-sm"}`}>{section.title}</h4>
                <p className="text-xs text-blue-100/95 truncate">{previewProject?.title ?? "No preview available"}</p>
              </div>
            </div>
          </div>

          <div className="section-flip-face section-flip-back rounded-2xl border border-blue-200 dark:border-blue-800 bg-white/95 dark:bg-[#1f233c] p-3 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-blue-500 dark:text-blue-300">{section.type}</p>
            <h4 className="mt-1 font-semibold text-base text-blue-800 dark:text-blue-100">{section.title}</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{section.hint}</p>
            <p className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-300">{section.projects.length} projects</p>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Hover to flip. Swipe to rotate.</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProjectCard({ project, type, originIndex, totalProjects }) {
  return (
    <div className="project-stack h-full lg:max-w-[72rem] xl:max-w-[68rem] mx-auto">
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
  const thumbnailSources = project.youtubeId ? getYouTubeThumbnailSources(project.youtubeId) : [];
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  useEffect(() => {
    setThumbnailIndex(0);
  }, [project.youtubeId]);

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
      className="relative aspect-video lg:aspect-[16/7.4] 2xl:aspect-[16/7] rounded-xl overflow-hidden mb-4 group"
      onMouseEnter={() => setIsPlaying(true)}
      onMouseLeave={() => setIsPlaying(false)}
      onClick={() => setIsPlaying((playing) => !playing)}
    >
      <img
        src={thumbnailSources[thumbnailIndex]}
        alt={`${project.title} preview`}
        loading="lazy"
        onError={() => {
          setThumbnailIndex((current) =>
            Math.min(current + 1, Math.max(thumbnailSources.length - 1, 0))
          );
        }}
        referrerPolicy="strict-origin-when-cross-origin"
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
