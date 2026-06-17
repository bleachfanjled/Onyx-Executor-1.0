import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

export default function Changelog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVersion, setActiveVersion] = useState(null);
  const entryRefs = useRef({});

  useEffect(() => {
    base44.entities.ChangelogEntry.list("-release_date", 50).then((data) => {
      setEntries(data);
      if (data.length > 0) setActiveVersion(data[0].id);
      setLoading(false);
    });
  }, []);

  // Sticky version tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      for (const entry of entries) {
        const el = entryRefs.current[entry.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          setActiveVersion(entry.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [entries]);

  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="py-16" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>03 /</span>
            <h1
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}
            >
              CHANGELOG
            </h1>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div
              className="font-mono text-xs animate-pulse"
              style={{ color: "#3A3A3A", letterSpacing: "0.14em" }}
            >
              LOADING VERSION ARCHIVE...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && entries.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>
              NO ENTRIES YET.
            </p>
          </div>
        )}

        {/* Split-screen timeline */}
        {!loading && entries.length > 0 && (
          <div className="flex">
            {/* Left: Sticky version index */}
            <div
              className="hidden lg:block flex-shrink-0 w-64 pt-16 pr-8"
              style={{ borderRight: "1px solid #1A1A1A" }}
            >
              <div className="sticky top-24 space-y-2">
                <p
                  className="font-mono text-xs mb-6"
                  style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}
                >
                  VERSION INDEX
                </p>
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      entryRefs.current[entry.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="block w-full text-left transition-sharp focus:outline-white"
                    style={{ padding: "8px 0" }}
                  >
                    <span
                      className="font-mono text-xs block"
                      style={{
                        color: activeVersion === entry.id ? "#FFFFFF" : "#3A3A3A",
                        letterSpacing: "0.08em",
                        fontWeight: activeVersion === entry.id ? 500 : 400,
                        transition: "color 0.08s",
                      }}
                    >
                      v{entry.version}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Entries */}
            <div className="flex-1 min-w-0 pl-0 lg:pl-16 pt-16">
              {entries.map((entry, idx) => (
                <div
                  key={entry.id}
                  ref={(el) => { entryRefs.current[entry.id] = el; }}
                  className="pb-20"
                  style={{ borderBottom: idx < entries.length - 1 ? "1px solid #1A1A1A" : "none", marginBottom: idx < entries.length - 1 ? "0" : "0", paddingTop: idx > 0 ? "80px" : "0" }}
                >
                  {/* Version header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-10">
                    <div className="flex items-center gap-4">
                      {entry.is_latest && (
                        <span
                          className="font-mono text-xs"
                          style={{
                            border: "1px solid #FFFFFF",
                            color: "#FFFFFF",
                            padding: "2px 10px",
                            letterSpacing: "0.1em",
                            fontSize: "10px",
                          }}
                        >
                          LATEST
                        </span>
                      )}
                      <h2
                        className="font-heading text-white"
                        style={{ fontWeight: 900, fontSize: "clamp(32px, 5vw, 64px)", letterSpacing: "-0.05em", lineHeight: 1 }}
                      >
                        v{entry.version}
                      </h2>
                    </div>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "#3A3A3A", letterSpacing: "0.1em", marginLeft: "auto", paddingBottom: "8px" }}
                    >
                      {new Date(entry.release_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).toUpperCase()}
                    </span>
                  </div>

                  {/* Notes */}
                  <ul className="space-y-4">
                    {(entry.notes || []).map((note, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div
                          aria-hidden="true"
                          className="flex-shrink-0 mt-2.5"
                          style={{ width: "4px", height: "4px", backgroundColor: "#3A3A3A" }}
                        />
                        <span
                          style={{ color: "#959595", fontSize: "15px", lineHeight: 1.7 }}
                        >
                          {note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-24" />
      </div>
    </div>
  );
}