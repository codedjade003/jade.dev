import { Mail, Phone, Download } from 'lucide-react';
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaXTwitter
} from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-transparent text-blue-800 dark:text-blue-300 px-6 py-16 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 items-start">
        {/* Contact Info */}
        <div data-reveal="left">
          <h2 data-reveal="left" className="text-2xl font-bold mb-4">Let’s Connect</h2>
          <p
            data-reveal="left"
            style={{ "--reveal-delay": "80ms" }}
            className="mb-6 text-slate-700 dark:text-blue-300 sm:text-base text-sm"
          >
            Whether you have a question, idea, or just want to say hi — my inbox is always open.
          </p>

          <div data-reveal="left" style={{ "--reveal-delay": "140ms" }} className="space-y-3 text-sm sm:text-base">
            <p className="flex items-center gap-3">
              <Mail size={18} />
              <span>codedjade003@gmail.com</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} />
              <a href="https://wa.me/2349015845913" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">+2349015845913 (WhatsApp)</a>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} />
              <span>+2348149720004 (Work)</span>
            </p>
          </div>

          <div data-reveal="up" style={{ "--reveal-delay": "180ms" }} className="mt-6 flex gap-4 text-xl">
            <a aria-label="GitHub" href="https://github.com/codedjade003" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaGithub /></a>
            <a aria-label="LinkedIn" href="https://www.linkedin.com/in/jade-david-joseph-0274a0272/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaLinkedin /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/edaj_ma_i/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaInstagram /></a>
            <a aria-label="WhatsApp" href="https://wa.me/2349015845913" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaWhatsapp /></a>
            <a aria-label="Twitter/X" href="https://x.com/JadeDavidJ94432" target="_blank" rel="noopener noreferrer" className="hover:text-red-500"><FaXTwitter /></a>
          </div>

          {/* Full URLs for print */}
          <div className="hidden print:block mt-6 text-sm space-y-1">
            <p>GitHub: https://github.com/codedjade003</p>
            <p>LinkedIn: https://www.linkedin.com/in/jade-david-joseph-0274a0272</p>
          </div>

          <a
            href="/Jade_resume.pdf"
            download
            data-reveal="up"
            style={{ "--reveal-delay": "230ms" }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-red-500 transition dark:bg-blue-500 dark:hover:bg-red-400"
          >
            <Download size={18} />
            Download CV
          </a>
        </div>

        {/* Contact Form */}
        <form
          action="https://formsubmit.co/codedjade003@gmail.com"
          method="POST"
          data-reveal="right"
          style={{ "--reveal-delay": "120ms" }}
          className="bg-slate-100 dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow space-y-4 text-sm sm:text-base"
        >
          <h3 className="text-xl font-semibold">Send a Message</h3>

          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New message from portfolio site" />
          <input type="hidden" name="_template" value="table" />

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full p-3 bg-white dark:bg-slate-700 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full p-3 bg-white dark:bg-slate-700 rounded"
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            required
            className="w-full p-3 bg-white dark:bg-slate-700 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white dark:bg-blue-500 hover:bg-red-500 dark:hover:bg-red-400 transition py-2 font-semibold rounded"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Copyright and Credit */}
      <div
        data-reveal="up"
        style={{ "--reveal-delay": "260ms" }}
        className="mt-16 text-center text-sm text-slate-600 dark:text-slate-400"
      >
        <p>&copy; {new Date().getFullYear()} Jade David Joseph. All rights reserved.</p>
        <p className="mt-1">Designed & built with 💻 by Jade David Joseph</p>
      </div>
    </footer>
  );
}
