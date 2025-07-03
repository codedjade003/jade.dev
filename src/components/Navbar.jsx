import { Moon, Sun, Heart, Copy, Menu, X } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";



export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-white text-blue-800 dark:bg-[#1b1b2f] dark:text-blue-300 transition-colors duration-300">
        <h1 className="text-xl font-bold tracking-tight">
          Jade<span className="text-red-500">.dev</span>
        </h1>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {["home", "about", "projects", "experience", "music", "contact"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="capitalize hover:text-red-500 transition-colors duration-200"
            >
              {section}
            </a>
          ))}

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
          >
            <Heart size={16} /> Tip Jar
          </button>

          <button onClick={toggleTheme} className="p-2" aria-label="Toggle Theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="Toggle Theme">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-blue-800 dark:text-blue-300"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1b1b2f] px-6 pb-6 text-sm font-medium text-blue-800 dark:text-blue-300 space-y-3">
          {["home", "about", "projects", "experience", "music", "contact"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="block capitalize hover:text-red-500 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              {section}
            </a>
          ))}

          <button
            onClick={() => {
              setIsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
          >
            <Heart size={16} /> Tip Jar
          </button>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-sm w-full bg-white dark:bg-[#1b1b2f] p-6 rounded-lg text-blue-800 dark:text-blue-200 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-3">Support My Journey 💻</Dialog.Title>
            <p className="mb-4 text-sm">
              Every tip helps me upgrade my dev tools and keep building. Thank you for your kindness 🙏
            </p>

            <div className="space-y-4 text-sm">
              {[
                { label: "Account Number (Access, Opay, Palmpay)", value: "9015845913" },
                { label: "Solana", value: "6Rzc4HJFQRwZphxbJKhUM82W41FniKwtwCDQqUMS6A7E" },
                { label: "BTC", value: "bc1qaq7gzxnm7shs99n0vg4gcxpd5mwq3ea5lxerfd" },
                { label: "ETH", value: "0xF57E2b4385dE662CA0d9ad666932Cef6E5e78E00" },
                { label: "USDT/USDC (Solana)", value: "6Rzc4HJFQRwZphxbJKhUM82W41FniKwtwCDQqUMS6A7E" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center gap-2 border border-blue-200 dark:border-blue-700 px-3 py-2 rounded-md"
                >
                  <div className="w-[70%]">
                    <strong>{label}:</strong>
                    <p className="truncate text-xs">{value}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(label, value)}
                    className="text-blue-600 dark:text-blue-300 hover:text-red-500 transition"
                    title="Copy"
                  >
                    {copied === label ? "Copied!" : <Copy size={16} />}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full bg-blue-700 dark:bg-blue-500 text-white rounded py-2 font-semibold hover:bg-red-500 dark:hover:bg-red-400 transition"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
