import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", path: "/" },
    { label: "Download", path: "/download" },
    { label: "Changelog", path: "/changelog" },
    { label: "Requirements", path: "/requirements" },
    { label: "Code", path: "/code" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-sharp"
      style={{
        backgroundColor: scrolled ? "rgba(5,5,5,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid #1A1A1A" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          to="/"
          className="text-white font-heading font-800 text-sm tracking-brutal uppercase"
          style={{ letterSpacing: "-0.04em", fontWeight: 800 }}
        >
          ONYX
        </Link>

        {/* Center vertical line indicator */}
        <div aria-hidden="true" className="hidden lg:block absolute left-1/2 top-14 w-px bg-hairline" style={{ height: "24px", transform: "translateX(-50%)" }} />

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs uppercase tracking-widest transition-sharp"
                style={{
                  color: active ? "#FFFFFF" : "#959595",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.12em",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}