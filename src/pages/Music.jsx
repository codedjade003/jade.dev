import React from "react";
import { SiSpotify, SiApplemusic } from "react-icons/si";
import EnduranceCover from "../assets/music/endurance.jpg";
import ToxicCover from "../assets/music/youre-toxic.jpg";
import GameOnCover from "../assets/music/game-on.jpg";

const musicData = [
  {
    title: "Endurance",
    type: "Album",
    cover: EnduranceCover,
    apple: "https://music.apple.com/us/album/endurance-remastered/1676775497",
    spotify: "https://open.spotify.com/album/07MzJHEPbqk4ak7kHUCAZf",
  },
  {
    title: "You're Toxic",
    type: "Single",
    cover: ToxicCover,
    apple: "https://music.apple.com/us/album/youre-toxic-feat-seven-vrse-single/1676697598",
    spotify: "https://open.spotify.com/album/2apEwB0IjYy4MxADe6h4qF",
  },
  {
    title: "Game On",
    type: "EP",
    cover: GameOnCover,
    apple: "https://music.apple.com/us/album/game-on-ep/1681581290",
    spotify: "https://open.spotify.com/album/3Uh3PiESfvrkEJOrLukPTv",
  },
];

export default function Music() {
  return (
    <section
      id="music"
      className="min-h-screen scroll-mt-20 px-4 sm:px-6 py-16 bg-white text-blue-900 dark:bg-[#1b1b2f] dark:text-blue-200 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto pr-0 md:pr-16">
        <h2 className="text-3xl font-bold mb-2 text-right">🎵 Music</h2>
        <p className="text-right text-sm text-slate-600 dark:text-slate-400 mb-10 italic">
          Yeah, I make those too. Going pro someday.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {musicData.map(({ title, type, cover, apple, spotify }) => (
            <div
              key={title}
              className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={cover}
                alt={`${title} cover`}
                loading="lazy"
                className="rounded mb-4 w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{type}</p>
              <div className="flex justify-center gap-5 text-2xl">
                <a
                  href={spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-500 transition"
                  title="Listen on Spotify"
                >
                  <SiSpotify />
                </a>
                <a
                  href={apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition"
                  title="Listen on Apple Music"
                >
                  <SiApplemusic />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
