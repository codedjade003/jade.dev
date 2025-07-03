// components/Loader.jsx
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#1b1b2f] text-white flex items-center justify-center z-[9999]">
      <h1 className="text-4xl font-bold">
        <Typewriter
          words={['Jade.dev']}
          loop={1}
          cursor
          cursorStyle="_"
          typeSpeed={100}
          deleteSpeed={50}
          delaySpeed={500}
        />
      </h1>
    </div>
  );
}
