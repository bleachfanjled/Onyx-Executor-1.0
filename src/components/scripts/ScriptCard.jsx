import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp, Star, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import SignInPrompt from "@/components/scripts/SignInPrompt";

const STATUS = {
  pending: { label: "PENDING", color: "#959595", dot: "#3A3A3A" },
  safe: { label: "SAFE", color: "#FFFFFF", dot: "#FFFFFF" },
  flagged: { label: "FLAGGED", color: "#959595", dot: "#959595" },
  dangerous: { label: "DANGEROUS", color: "#FF3B30", dot: "#FF3B30" },
};

const ratedKey = (id) => `onyx_rated_${id}`;

function Stars({ value, size = 12, interactive = false, onRate, hover = 0, setHover }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const shown = interactive ? (hover || value) >= n : value >= n;
        return (
          <button
            key={n}
            type="button"
            onClick={interactive && onRate ? () => onRate(n) : undefined}
            onMouseEnter={interactive && setHover ? () => setHover(n) : undefined}
            onMouseLeave={interactive && setHover ? () => setHover(0) : undefined}
            style={{ lineHeight: 0, cursor: interactive ? "pointer" : "default" }}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star size={size} fill={shown ? "#FFFFFF" : "none"} stroke={shown ? "#FFFFFF" : "#3A3A3A"} />
          </button>
        );
      })}
    </div>
  );
}

export default function ScriptCard({ script }) {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [rated, setRated] = useState(() =>
    typeof window !== "undefined" && !!localStorage.getItem(ratedKey(script.id))
  );
  const [hoverRating, setHoverRating] = useState(0);
  const s = STATUS[script.safety_status] || STATUS.pending;

  const avg = script.rating_count > 0 ? script.rating_sum / script.rating_count : 0;
  const interactive = !rated;

  const copy = () => {
    navigator.clipboard.writeText(script.code || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const download = () => {
    if (!isAuthenticated) { setShowSignIn(true); return; }
    setDownloaded(true);
    base44.entities.Script.updateMany({ id: script.id }, { $inc: { downloads: 1 } }).catch(() => {});
    const blob = new Blob([script.code || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(script.title || "script").replace(/[^a-z0-9_-]+/gi, "_")}.lua`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const rate = (n) => {
    if (!isAuthenticated) { setShowSignIn(true); return; }
    if (!interactive) return;
    localStorage.setItem(ratedKey(script.id), String(n));
    setRated(true);
    setHoverRating(0);
    base44.entities.Script.updateMany({ id: script.id }, { $inc: { rating_sum: n, rating_count: 1 } }).catch(() => {});
  };

  return (
    <div style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D" }}>
      <div className="px-6 py-5" style={{ borderBottom: expanded ? "1px solid #1A1A1A" : "none" }}>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h3
              className="font-heading text-white truncate"
              style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.02em" }}
            >
              {script.title}
            </h3>
            <p
              className="font-mono text-xs mt-1"
              style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}
            >
              by {script.author_name || "Anonymous"}
            </p>
          </div>
          <div
            className="flex items-center gap-2 flex-shrink-0"
            style={{ border: "1px solid #1A1A1A", padding: "4px 10px", backgroundColor: "#050505" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
            <span className="font-mono text-xs" style={{ color: s.color, letterSpacing: "0.1em" }}>
              {s.label}
            </span>
          </div>
        </div>

        {script.description && (
          <p className="text-sm mb-3" style={{ color: "#959595", lineHeight: 1.6 }}>
            {script.description}
          </p>
        )}

        {((script.is_free || script.is_key_system || script.is_universal) || (script.tags && script.tags.length > 0)) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {script.is_free && (
              <span className="font-mono text-xs" style={{ color: "#FFFFFF", border: "1px solid #FFFFFF", padding: "2px 8px", letterSpacing: "0.08em", backgroundColor: "#0D0D0D" }}>
                FREE
              </span>
            )}
            {script.is_key_system && (
              <span className="font-mono text-xs" style={{ color: "#959595", border: "1px solid #1A1A1A", padding: "2px 8px", letterSpacing: "0.08em" }}>
                KEY SYSTEM
              </span>
            )}
            {script.is_universal && (
              <span className="font-mono text-xs" style={{ color: "#959595", border: "1px solid #1A1A1A", padding: "2px 8px", letterSpacing: "0.08em" }}>
                UNIVERSAL
              </span>
            )}
            {script.tags && script.tags.map((t, i) => (
              <span
                key={i}
                className="font-mono text-xs"
                style={{ color: "#959595", border: "1px solid #1A1A1A", padding: "2px 8px", letterSpacing: "0.04em" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {script.findings && script.findings.length > 0 && (
          <div className="space-y-1.5">
            {(expanded ? script.findings : script.findings.slice(0, 2)).map((f, i) => (
              <p
                key={i}
                className="font-mono text-xs flex gap-2"
                style={{ lineHeight: 1.5 }}
              >
                <span style={{ color: f.severity === "danger" ? "#FF3B30" : "#959595", flexShrink: 0 }}>
                  {f.severity === "danger" ? "✕" : f.severity === "warning" ? "!" : "i"}
                </span>
                <span style={{ color: "#959595" }}>
                  {f.message}
                  {f.count > 1 ? ` (${f.count}×)` : ""}
                </span>
              </p>
            ))}
            {!expanded && script.findings.length > 2 && (
              <p className="font-mono text-xs" style={{ color: "#3A3A3A" }}>
                + {script.findings.length - 2} more
              </p>
            )}
          </div>
        )}

        {script.safety_status === "pending" && (
          <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.04em" }}>
            Scanning…
          </p>
        )}

        {/* community stats */}
        <div className="flex items-center gap-4 mt-4 mb-4" style={{ borderTop: "1px solid #1A1A1A", paddingTop: "12px" }}>
          <div className="flex items-center gap-2">
            <Download size={12} style={{ color: "#959595" }} />
            <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.06em" }}>
              {script.downloads || 0} {(script.downloads || 0) === 1 ? "download" : "downloads"}
            </span>
          </div>
          <div style={{ width: "1px", height: "12px", backgroundColor: "#1A1A1A" }} />
          <div className="flex items-center gap-2">
            <Stars
              value={Math.round(avg)}
              interactive={interactive}
              onRate={rate}
              hover={hoverRating}
              setHover={setHoverRating}
            />
            <span className="font-mono text-xs" style={{ color: "#959595", letterSpacing: "0.06em" }}>
              {script.rating_count > 0 ? avg.toFixed(1) : "—"} ({script.rating_count || 0})
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={copy}
            className="flex items-center gap-2 font-mono text-xs uppercase transition-sharp"
            style={{ color: copied ? "#FFFFFF" : "#959595", letterSpacing: "0.1em", border: "1px solid #1A1A1A", padding: "6px 12px" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "COPIED" : "COPY"}
          </button>
          <button
            onClick={download}
            className="flex items-center gap-2 font-mono text-xs uppercase transition-sharp"
            style={{ color: downloaded ? "#FFFFFF" : "#959595", letterSpacing: "0.1em", border: "1px solid #1A1A1A", padding: "6px 12px" }}
          >
            <Download size={12} />
            {downloaded ? "DOWNLOADED" : "DOWNLOAD"}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 font-mono text-xs uppercase transition-sharp"
            style={{ color: "#959595", letterSpacing: "0.1em", border: "1px solid #1A1A1A", padding: "6px 12px" }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "HIDE" : "VIEW CODE"}
          </button>
        </div>
      </div>

      {expanded && (
        <pre
          className="overflow-auto px-6 py-5 font-mono text-xs"
          style={{
            color: "#959595",
            backgroundColor: "#050505",
            maxHeight: "320px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.6,
          }}
        >
          {script.code}
        </pre>
      )}

      <SignInPrompt
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={navigateToLogin}
      />
    </div>
  );
}