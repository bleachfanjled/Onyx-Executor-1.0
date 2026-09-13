import { Link } from "react-router-dom";

// Onyx — GitHub 2-way sync test marker (safe to remove)

const features = [
  {
    label: "Safety-First Verification",
    description: "Every launch is scanned for malware — SHA-256 hashing, Authenticode signature checks, certificate pinning, and chain verification run before the editor even appears.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Clean, Focused Editor",
    description: "A distraction-free script editor with multi-tab support, one-click save/load, and an integrated AI assistant that teaches Lua concepts — without writing scripts for you.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    label: "Modest by Design",
    description: "Level 4–6 capabilities — enough to have fun and explore, not enough to break games or ruin lobbies. Onyx is a tool, not a weapon.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="bg-obsidian" style={{ backgroundColor: "#050505" }}>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ paddingTop: "56px" }}
      >
        {/* Vertical center line */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-1/2"
          style={{
            width: "1px",
            backgroundColor: "#1A1A1A",
            transform: "translateX(-50%)",
            zIndex: 0,
          }}
        />

        {/* Horizontal center line */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0"
          style={{
            top: "50%",
            height: "1px",
            backgroundColor: "#111111",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          {/* Version badge */}
          <div
            className="inline-flex items-center gap-3 mb-12"
            style={{
              border: "1px solid #1A1A1A",
              padding: "6px 16px",
              backgroundColor: "#0D0D0D",
            }}
          >
            <span
              className="font-mono text-xs"
              style={{ color: "#959595", letterSpacing: "0.1em" }}
            >
              LEVEL 4–6 — COMMUNITY PROJECT
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#FFFFFF" }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: "#FFFFFF", letterSpacing: "0.1em" }}
            >
              SAFETY FIRST
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-white block leading-none mb-8"
            style={{
              fontWeight: 900,
              fontSize: "clamp(52px, 10vw, 140px)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            EXECUTE.
            <br />
            EXPLORE.
            <br />
            <span style={{ color: "#959595" }}>ONYX.</span>
          </h1>

          {/* Sub */}
          <p
            className="mx-auto mb-12 leading-relaxed"
            style={{
              color: "#959595",
              fontSize: "16px",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            A community-built educational executor with safety-first verification.
            Write, debug, and learn Lua — without the malware, the key systems, or the catch.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/download"
              className="inline-flex items-center justify-center font-heading font-700 text-sm uppercase transition-sharp focus:outline-white"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#050505",
                padding: "16px 48px",
                letterSpacing: "0.12em",
                fontWeight: 700,
                minHeight: "44px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E0E0E0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              Download Now
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: "linear-gradient(to bottom, transparent, #050505)",
          }}
        />
      </section>

      {/* Feature Matrix */}
      <section style={{ borderTop: "1px solid #1A1A1A" }}>
        {/* Section header */}
        <div
          className="max-w-7xl mx-auto px-6 py-16"
          style={{ borderBottom: "1px solid #1A1A1A" }}
        >
          <div className="flex items-center gap-6">
            <span
              className="font-mono text-xs"
              style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}
            >
              01 /
            </span>
            <h2
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}
            >
              CAPABILITIES
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ borderBottom: "1px solid #1A1A1A" }}
          >
            {features.map((feat, i) => (
              <div
                key={feat.label}
                className="p-10 transition-sharp cursor-default"
                style={{
                  borderRight: i < features.length - 1 ? "1px solid #1A1A1A" : "none",
                  backgroundColor: "#050505",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0D0D0D";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#050505";
                }}
              >
                <div style={{ color: "#FFFFFF", marginBottom: "20px" }}>{feat.icon}</div>
                <h3
                  className="font-heading text-white mb-3"
                  style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}
                >
                  {feat.label}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#959595", lineHeight: 1.7, fontSize: "14px" }}
                >
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}