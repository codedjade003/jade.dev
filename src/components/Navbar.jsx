import { Moon, Sun, Heart, Copy, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { triggerInteractionFeedback } from "../utils/interactionFeedback";



export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [desktopMenuVisible, setDesktopMenuVisible] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const themeTimerRef = useRef(null);

  const toggleTheme = () => {
    triggerInteractionFeedback("tap");

    if (themeTimerRef.current) {
      clearTimeout(themeTimerRef.current);
    }

    document.documentElement.classList.add("theme-switching");
    setDarkMode(!darkMode);

    themeTimerRef.current = setTimeout(() => {
      document.documentElement.classList.remove("theme-switching");
      themeTimerRef.current = null;
    }, 420);
  };

  const clearDesktopTimers = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const queueDesktopShow = () => {
    if (isAtTop || window.innerWidth < 768) return;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (desktopMenuVisible || showTimerRef.current) return;

    showTimerRef.current = setTimeout(() => {
      setDesktopMenuVisible(true);
      showTimerRef.current = null;
    }, 170);
  };

  const queueDesktopHide = () => {
    if (isAtTop || window.innerWidth < 768) return;
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setDesktopMenuVisible(false);
      hideTimerRef.current = null;
    }, 360);
  };

  useEffect(() => {
    const handleScroll = () => {
      const atTop = window.scrollY <= 16;
      setIsAtTop((current) => (current === atTop ? current : atTop));
      if (atTop) {
        clearDesktopTimers();
        setDesktopMenuVisible(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearDesktopTimers();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (themeTimerRef.current) {
        clearTimeout(themeTimerRef.current);
      }
      document.documentElement.classList.remove("theme-switching");
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;
    const prevBodyOverflowX = document.body.style.overflowX;
    const prevDocOverflowX = document.documentElement.style.overflowX;

    // Prevent background scrolling and horizontal overflow while mobile menu is open
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;
      document.body.style.overflowX = prevBodyOverflowX;
      document.documentElement.style.overflowX = prevDocOverflowX;
    };
  }, [mobileMenuOpen]);

  const handleCopy = (label, value) => {
    triggerInteractionFeedback("tap");
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const desktopNavVisible = isAtTop || desktopMenuVisible;
  const mobileNavSurface = mobileMenuOpen
    ? "bg-white/95 dark:bg-[#1b1b2f]/95 border-b border-blue-100 dark:border-blue-900/60"
    : "bg-transparent dark:bg-transparent";
  const navShadow = mobileMenuOpen || !isAtTop ? "shadow-sm" : "shadow-none";

  return (
    <>
      <div
        aria-hidden="true"
        onMouseEnter={queueDesktopShow}
        onMouseLeave={queueDesktopHide}
        className={`hidden md:block fixed inset-x-0 top-0 z-[70] ${
          isAtTop ? "h-0 pointer-events-none" : "h-8"
        }`}
      />

      <nav
        onMouseEnter={queueDesktopShow}
        onMouseLeave={queueDesktopHide}
        style={{
          paddingLeft: `calc(1.5rem + env(safe-area-inset-left, 0px))`,
          paddingRight: `calc(1.5rem + env(safe-area-inset-right, 0px))`,
          paddingTop: `calc(1rem + env(safe-area-inset-top, 0px))`,
        }}
        className={`fixed top-0 inset-x-0 z-[80] w-full flex justify-between items-center px-6 py-4 ${mobileNavSurface} ${navShadow} text-blue-800 dark:text-blue-300 backdrop-blur-md transition-[background-color,color,border-color,box-shadow] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:sticky md:top-0 md:transition-transform md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAtTop
            ? ""
            : "md:fixed md:inset-x-0 md:top-0"
        } ${desktopNavVisible ? "md:translate-y-0" : "md:-translate-y-full"}`}
      >
        <a href="#home" data-reveal="left" className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-200">
          <h1 className="text-xl font-bold tracking-tight">
            Jade<span className="text-red-500">.dev</span>
          </h1>
        </a>

        {/* Desktop menu */}
        <div
          data-reveal="right"
          style={{ "--reveal-delay": "60ms" }}
          className="hidden md:flex items-center gap-6 font-medium"
        >
          {["home", "projects", "experience", "music", "about", "contact"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="capitalize hover:text-red-500 transition-colors duration-200"
            >
              {section}
            </a>
          ))}

          <button
            onClick={() => {
              triggerInteractionFeedback("tap");
              setIsOpen(true);
            }}
            className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
          >
            <Heart size={16} /> Tip Jar
          </button>

          <button onClick={toggleTheme} className="p-2 active:scale-75 active:rotate-12 transition-all duration-200" aria-label="Toggle Theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile menu button */}
        <div
          data-reveal="right"
          style={{ "--reveal-delay": "80ms" }}
          className="md:hidden flex items-center gap-3"
        >
          <button onClick={toggleTheme} aria-label="Toggle Theme" className="active:scale-75 active:rotate-12 transition-all duration-200">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => {
              triggerInteractionFeedback("tap");
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="text-blue-800 dark:text-blue-300 active:scale-75 active:rotate-12 transition-all duration-200"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay md:hidden fixed inset-0 z-[75] bg-white/95 dark:bg-[#1b1b2f]/95 backdrop-blur-md border-t border-blue-100 dark:border-blue-900/60 overflow-y-auto"
          style={{
            boxSizing: 'border-box',
            WebkitOverflowScrolling: 'touch',
            // avoid width:100vw which can cause horizontal overflow on some mobile browsers
          }}
        >
          <div
            className="px-6 pt-[84px] pb-6 text-sm font-medium text-blue-800 dark:text-blue-300 space-y-3"
            style={{
              paddingLeft: `calc(1.5rem + env(safe-area-inset-left, 0px))`,
              paddingRight: `calc(1.5rem + env(safe-area-inset-right, 0px))`,
              paddingTop: `calc(84px + env(safe-area-inset-top, 0px))`,
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {["home", "projects", "experience", "music", "about", "contact"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="block capitalize hover:text-red-500 transition"
                onClick={() => {
                  triggerInteractionFeedback("tap");
                  setMobileMenuOpen(false);
                }}
              >
                {section}
              </a>
            ))}

            <button
              onClick={() => {
                triggerInteractionFeedback("tap");
                setIsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-red-500 hover:scale-105 transition"
            >
              <Heart size={16} /> Tip Jar
            </button>
          </div>
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
              onClick={() => {
                triggerInteractionFeedback("tap");
                setIsOpen(false);
              }}
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
