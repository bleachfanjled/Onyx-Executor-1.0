import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

const STATUS = {
  pending: { label: "PENDING", color: "#959595", dot: "#3A3A3A" },
  safe: { label: "SAFE", color: "#FFFFFF", dot: "#FFFFFF" },
  flagged: { label: "FLAGGED", color: "#959595", dot: "#959595" },
  dangerous: { label: "DANGEROUS", color: "#FF3B30", dot: "#FF3B30" },
};

export default function ScriptCard({ script }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = STATUS[script.safety_status] || STATUS.pending;

  const copy = () => {
    navigator.clipboard.writeText(script.code || "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
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

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={copy}
            className="flex items-center gap-2 font-mono text-xs uppercase transition-sharp"
            style={{ color: copied ? "#FFFFFF" : "#959595", letterSpacing: "0.1em", border: "1px solid #1A1A1A", padding: "6px 12px" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "COPIED" : "COPY"}
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
    </div>
  );
}