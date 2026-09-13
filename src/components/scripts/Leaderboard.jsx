import { useState } from "react";
import { Star, Download } from "lucide-react";

export default function Leaderboard({ scripts }) {
  const [mode, setMode] = useState("downloads");

  const ranked = [...scripts]
    .filter((s) => (mode === "downloads" ? (s.downloads || 0) > 0 : (s.rating_count || 0) > 0))
    .sort((a, b) => {
      if (mode === "downloads") return (b.downloads || 0) - (a.downloads || 0);
      const aAvg = a.rating_count > 0 ? a.rating_sum / a.rating_count : 0;
      const bAvg = b.rating_count > 0 ? b.rating_sum / b.rating_count : 0;
      return bAvg - aAvg;
    })
    .slice(0, 5);

  return (
    <div className="py-12" style={{ borderBottom: "1px solid #1A1A1A" }}>
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>
          LEADERBOARD
        </span>
        <div className="flex items-center" style={{ border: "1px solid #1A1A1A" }}>
          {[
            { value: "downloads", label: "MOST DOWNLOADED" },
            { value: "rated", label: "TOP RATED" },
          ].map((o) => (
            <button
              key={o.value}
              onClick={() => setMode(o.value)}
              className="font-mono text-xs uppercase transition-sharp"
              style={{
                color: mode === o.value ? "#FFFFFF" : "#959595",
                backgroundColor: mode === o.value ? "#0D0D0D" : "transparent",
                padding: "6px 12px",
                letterSpacing: "0.1em",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {ranked.length === 0 ? (
        <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}>
          NO COMMUNITY ACTIVITY YET — DOWNLOAD OR RATE A SCRIPT TO POPULATE THE BOARD.
        </p>
      ) : (
        <div style={{ border: "1px solid #1A1A1A" }}>
          {ranked.map((s, i) => {
            const avg = s.rating_count > 0 ? s.rating_sum / s.rating_count : 0;
            return (
              <div
                key={s.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  borderBottom: i < ranked.length - 1 ? "1px solid #1A1A1A" : "none",
                  backgroundColor: i === 0 ? "#0D0D0D" : "transparent",
                }}
              >
                <span
                  className="font-mono text-xs flex-shrink-0"
                  style={{ width: "28px", color: i === 0 ? "#FFFFFF" : "#3A3A3A", letterSpacing: "0.06em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-heading text-white truncate"
                    style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "-0.02em" }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="font-mono text-xs mt-0.5"
                    style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}
                  >
                    by {s.author_name || "Anonymous"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Download size={12} style={{ color: "#959595" }} />
                  <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.06em" }}>
                    {s.downloads || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" style={{ minWidth: "70px" }}>
                  <Star
                    size={12}
                    fill={avg > 0 ? "#FFFFFF" : "none"}
                    stroke={avg > 0 ? "#FFFFFF" : "#3A3A3A"}
                  />
                  <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.06em" }}>
                    {s.rating_count > 0 ? avg.toFixed(1) : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}