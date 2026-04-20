import React, { useEffect, useMemo, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';

const PRIORITY_FACT = 'Refresh a couple of times to read more fun facts.';

const FUN_FACTS = [
  'I like anime, a lot.',
  'I make music when I am not shipping code.',
  'This color theme is inspired by Sasuke Uchiha.',
  'Favorite anime character: Sasuke Uchiha.',
  'Be honest, how many times have you refreshed now?',
  'In another universe, I am an artist.',
  'I write... sometimes.',
  'I also draw... sometimes.',
  'Try dark mode.',
  'AAAAAARGHHHHH.',
  "I slowed it down on purpose, it's not broken don't worry.",
  'Hint: my profile photo hides a 5-click easter egg.',
  'I want to become a motion designer someday.',
  'I could really use a new laptop, no jokes.',
  'I have a tip jar. Use it if you want to support the journey.',
  'I once built chess into this site, offline mode style.',
  'Challenge me on Lichess: hazardkid.',
  'Chess.com username: codedjade003.',
  'My username for almost everything is codedjade003.',
  'I went to Covenant University.',
  'I love Minecraft.',
  'I build full-stack products and experiment with AI ideas.',
];

const WEIGHTED_FACT_POOL = [
  PRIORITY_FACT,
  PRIORITY_FACT,
  PRIORITY_FACT,
  PRIORITY_FACT,
  ...FUN_FACTS,
];

const FACTS_TO_SHOW = 3;
const FACT_CHANGE_EVERY_MS = 2200;
const FACT_FADE_MS = 280;

function buildFactSequence(length) {
  const sequence = [];
  let lastFact = '';

  for (let index = 0; index < length; index += 1) {
    let nextFact = WEIGHTED_FACT_POOL[Math.floor(Math.random() * WEIGHTED_FACT_POOL.length)];
    let attempts = 0;

    while (nextFact === lastFact && attempts < 6) {
      nextFact = WEIGHTED_FACT_POOL[Math.floor(Math.random() * WEIGHTED_FACT_POOL.length)];
      attempts += 1;
    }

    sequence.push(nextFact);
    lastFact = nextFact;
  }

  return sequence;
}

export default function Loader() {
  const factSequence = useMemo(() => buildFactSequence(FACTS_TO_SHOW), []);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  // Safe localStorage check — avoids optional chaining syntax that breaks old iOS Safari,
  // and guards against private mode where localStorage.getItem() can throw
  const debugLoader = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('debugLoader') === '1';
      const fromStorage = window.localStorage.getItem('debugLoader') === '1';
      return fromQuery || fromStorage;
    } catch (e) {
      return false;
    }
  }, []);

  useEffect(() => {
    try {
      console.log('Loader mounted', {
        debugLoader,
        clientWidth: document.documentElement.clientWidth,
        innerWidth: window.innerWidth,
        ua: navigator.userAgent,
        htmlTransform: getComputedStyle(document.documentElement).transform,
      });
    } catch (e) {}

    return () => {
      try {
        console.log('Loader unmounted');
      } catch (e) {}
    };
  }, [debugLoader]);

  useEffect(() => {
    if (factSequence.length <= 1) return undefined;

    let nextIndex = 1;
    let fadeTimer;

    const interval = setInterval(() => {
      if (nextIndex >= factSequence.length) {
        clearInterval(interval);
        return;
      }

      setFactVisible(false);

      fadeTimer = setTimeout(() => {
        setFactIndex(nextIndex);
        setFactVisible(true);
        nextIndex += 1;
      }, FACT_FADE_MS);
    }, FACT_CHANGE_EVERY_MS);

    return () => {
      clearInterval(interval);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, [factSequence]);

  return (
    <div
      className="fixed inset-0 bg-[#1b1b2f] text-white flex items-center justify-center z-[9999] px-4"
      // Removed overflow-hidden: on iOS, overflow:hidden on a position:fixed element
      // can prevent the layer from painting entirely, causing a blank white screen.
      // Also removed backdrop-blur-sm from the pill below for the same reason —
      // backdrop-filter inside fixed containers is buggy on iOS Safari.
      style={
        debugLoader
          ? { backgroundColor: '#ff00ff', zIndex: 2147483647, color: '#000000' }
          : undefined
      }
    >
      {debugLoader && (
        <div className="absolute left-3 top-3 px-2 py-1 rounded text-xs font-semibold bg-yellow-400 text-black z-[99999]">
          DEBUG LOADER
        </div>
      )}

      <div
        className="text-center relative flex flex-col items-center justify-center"
        // Replaced w-[min(92vw,56rem)] — CSS min() is not supported below iOS 15.4
        // and can cause the container to collapse to zero width on older iPhones.
        style={{ width: '92vw', maxWidth: '56rem', minHeight: '72vh' }}
      >
        {/* Removed backdrop-blur-sm — backdrop-filter inside fixed containers
            causes blank rendering on iOS Safari. The border + bg-opacity give
            a similar frosted feel without the bug. */}
        <div className="loader-pill inline-flex items-center gap-2 rounded-full border border-blue-300/35 bg-blue-400/10 px-4 py-2">
          <span className="loader-pill-dot h-2.5 w-2.5 rounded-full bg-blue-300" />
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-blue-100/85">
            Loading Portfolio Universe
          </p>
        </div>

        <h1 className="mt-5 text-4xl sm:text-5xl font-bold">
          <Typewriter
            words={['Jade.dev']}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={120}
            deleteSpeed={50}
            delaySpeed={750}
          />
        </h1>

        <div className="absolute inset-x-0 bottom-8 sm:bottom-10 px-2 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-blue-200/65">
            Fun Fact {factIndex + 1}/{factSequence.length}
          </p>
          <p
            className={`mt-2 text-sm sm:text-base text-blue-50/90 transition-all duration-300 ${
              factVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {factSequence[factIndex]}
          </p>

          <div className="mt-3 flex justify-center gap-2">
            {factSequence.map((fact, index) => (
              <span
                key={`${fact}-${index}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === factIndex ? 'w-6 bg-blue-300/95' : 'w-1.5 bg-blue-300/35'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}