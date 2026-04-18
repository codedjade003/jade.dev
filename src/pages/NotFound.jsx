// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div data-reveal="up" className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 data-reveal="zoom" className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p data-reveal="up" style={{ "--reveal-delay": "80ms" }} className="text-xl mb-6">Oops! Page not found.</p>
      <Link to="/" className="text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
}
