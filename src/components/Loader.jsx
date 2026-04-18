// components/Loader.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';

const PRIORITY_FACT = 'Refresh a couple of times to read more fun facts.';

const FUN_FACTS = [
  'I like anime, a lot.',
  'I make music when I am not shipping code.',
  'This color theme is inspired by Sasuke Uchiha.',
  'Favorite anime character: Sasuke Uchiha.',
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

    // Avoid consecutive duplicates while still keeping weighted randomness.
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
    <div className="fixed inset-0 bg-[#1b1b2f] text-white flex items-center justify-center z-[9999] px-4">
      <div className="w-[min(92vw,48rem)] text-center">
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-blue-200/75 mb-3">
          Loading Portfolio Universe
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          <Typewriter
            words={['Jade.dev']}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={90}
            deleteSpeed={40}
            delaySpeed={650}
          />
        </h1>

        <div className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-400/10 backdrop-blur-sm px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-blue-200/80">
            Fun Fact {factIndex + 1}/{factSequence.length}
          </p>
          <p
            className={`mt-2 text-sm sm:text-base text-blue-50 transition-all duration-300 ${
              factVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {factSequence[factIndex]}
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {factSequence.map((fact, index) => (
            <span
              key={`${fact}-${index}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === factIndex ? 'w-7 bg-blue-300' : 'w-2 bg-blue-300/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
