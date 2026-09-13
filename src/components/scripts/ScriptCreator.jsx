import { useState } from "react";
import { ShieldCheck, Search, Loader2, Upload, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS = {
  safe: { label: "SAFE", color: "#FFFFFF", dot: "#FFFFFF" },
  flagged: { label: "FLAGGED", color: "#959595", dot: "#959595" },
  dangerous: { label: "DANGEROUS", color: "#FF3B30", dot: "#FF3B30" },
};

const inputStyle = {
  backgroundColor: "#050505",
  border: "1px solid #1A1A1A",
  color: "#FFFFFF",
  padding: "12px 14px",
  fontSize: "13px",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: "10px",
  color: "#3A3A3A",
  letterSpacing: "0.12em",
  marginBottom: "8px",
  display: "block",
};

export default function ScriptCreator({ onPublished }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");
  const [scan, setScan] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [attrs, setAttrs] = useState({ isFree: false, isKeySystem: false, isUniversal: false });

  const handleScan = async () => {
    if (!code.trim() || scanning) return;
    setScanning(true);
    setScan(null);
    setError("");
    try {
      const res = await base44.functions.invoke("scanScript", { code });
      setScan(res.data);
    } catch (e) {
      setScan({
        status: "flagged",
        score: 0,
        findings: [{ id: "error", severity: "warning", message: "Scan failed: " + (e.message || "unknown error"), count: 1 }],
      });
    } finally {
      setScanning(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !code.trim() || publishing) return;
    setPublishing(true);
    setError("");
    try {
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      await base44.entities.Script.create({
        title: title.trim(),
        description: description.trim(),
        code,
        author_name: author.trim() || "Anonymous",
        tags: tagArray,
        is_free: attrs.isFree,
        is_key_system: attrs.isKeySystem,
        is_universal: attrs.isUniversal,
        safety_status: "pending",
        safety_score: 0,
        findings: [],
      });
      setTitle("");
      setDescription("");
      setAuthor("");
      setTags("");
      setCode("");
      setScan(null);
      setAttrs({ isFree: false, isKeySystem: false, isUniversal: false });
      if (onPublished) onPublished();
    } catch (e) {
      setError(e.message || "Failed to publish. You may need to sign in.");
    } finally {
      setPublishing(false);
    }
  };

  const scanStatus = scan ? STATUS[scan.status] : null;

  return (
    <div style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D" }}>
      {/* header */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid #1A1A1A" }}>
        <ShieldCheck size={16} style={{ color: "#FFFFFF" }} />
        <span className="font-mono text-xs" style={{ color: "#FFFFFF", letterSpacing: "0.14em" }}>
          SHARE A SCRIPT
        </span>
      </div>

      <div className="px-6 py-6 space-y-5">
        {/* title + author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>TITLE</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Infinite Jump"
            />
          </div>
          <div>
            <label style={labelStyle}>YOUR NAME</label>
            <input
              style={inputStyle}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Anonymous"
            />
          </div>
        </div>

        {/* description */}
        <div>
          <label style={labelStyle}>DESCRIPTION</label>
          <input
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this script do?"
          />
        </div>

        {/* tags */}
        <div>
          <label style={labelStyle}>TAGS (comma separated)</label>
          <input
            style={inputStyle}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="fun, gui, utility"
          />
        </div>

        {/* attribute toggles */}
        <div>
          <label style={labelStyle}>ATTRIBUTES</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "isFree", label: "FREE", hint: "No paid key required" },
              { key: "isKeySystem", label: "KEY SYSTEM", hint: "Requires a key to use" },
              { key: "isUniversal", label: "UNIVERSAL", hint: "Works on any game" },
            ].map((t) => {
              const active = attrs[t.key];
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setAttrs((p) => ({ ...p, [t.key]: !p[t.key] }))}
                  className="text-left transition-sharp"
                  style={{
                    border: active ? "1px solid #FFFFFF" : "1px solid #1A1A1A",
                    backgroundColor: active ? "#0D0D0D" : "#050505",
                    padding: "12px 14px",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs" style={{ color: active ? "#FFFFFF" : "#959595", letterSpacing: "0.1em" }}>
                      {t.label}
                    </span>
                    <span className="flex items-center justify-center" style={{ width: "14px", height: "14px", border: active ? "1px solid #FFFFFF" : "1px solid #3A3A3A", backgroundColor: active ? "#FFFFFF" : "transparent" }}>
                      {active && <Check size={10} style={{ color: "#050505" }} />}
                    </span>
                  </div>
                  <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.02em" }}>
                    {t.hint}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* code */}
        <div>
          <label style={labelStyle}>LUA SCRIPT</label>
          <textarea
            style={{ ...inputStyle, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: "12px", minHeight: "180px", resize: "vertical", lineHeight: 1.6 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={"-- paste your Lua script here\nprint('Hello from Onyx')"}
            spellCheck={false}
          />
        </div>

        {/* scan result */}
        {scan && scanStatus && (
          <div style={{ border: "1px solid #1A1A1A", backgroundColor: "#050505", padding: "16px" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scanStatus.dot }} />
                <span className="font-mono text-xs" style={{ color: scanStatus.color, letterSpacing: "0.12em" }}>
                  {scanStatus.label}
                </span>
                <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.08em" }}>
                  · SCORE {scan.score}
                </span>
              </div>
              <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.08em" }}>
                {scan.findings.length} FINDING{scan.findings.length === 1 ? "" : "S"}
              </span>
            </div>
            {scan.findings.length === 0 ? (
              <p className="font-mono text-xs" style={{ color: "#959595", lineHeight: 1.6 }}>
                No malicious patterns detected. This script looks clean — but always review code before running it.
              </p>
            ) : (
              <ul className="space-y-2">
                {scan.findings.map((f, i) => (
                  <li key={i} className="font-mono text-xs flex gap-2" style={{ lineHeight: 1.6 }}>
                    <span style={{ color: f.severity === "danger" ? "#FF3B30" : f.severity === "warning" ? "#959595" : "#3A3A3A", flexShrink: 0 }}>
                      {f.severity === "danger" ? "✕" : f.severity === "warning" ? "!" : "i"}
                    </span>
                    <span style={{ color: "#959595" }}>
                      {f.message}
                      {f.count > 1 ? ` (${f.count}×)` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {error && (
          <p className="font-mono text-xs" style={{ color: "#FF3B30", letterSpacing: "0.02em" }}>{error}</p>
        )}

        {/* actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleScan}
            disabled={!code.trim() || scanning}
            className="flex-1 flex items-center justify-center gap-2 font-heading uppercase transition-sharp"
            style={{
              backgroundColor: "transparent",
              color: code.trim() ? "#FFFFFF" : "#3A3A3A",
              border: "1px solid #1A1A1A",
              padding: "14px 20px",
              fontSize: "12px",
              letterSpacing: "0.12em",
              fontWeight: 700,
              cursor: code.trim() && !scanning ? "pointer" : "not-allowed",
            }}
          >
            {scanning ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {scanning ? "SCANNING…" : "SCAN FOR MALWARE"}
          </button>
          <button
            onClick={handlePublish}
            disabled={!title.trim() || !code.trim() || publishing}
            className="flex-1 flex items-center justify-center gap-2 font-heading uppercase transition-sharp"
            style={{
              backgroundColor: title.trim() && code.trim() ? "#FFFFFF" : "#0D0D0D",
              color: title.trim() && code.trim() ? "#050505" : "#3A3A3A",
              border: title.trim() && code.trim() ? "1px solid #FFFFFF" : "1px solid #1A1A1A",
              padding: "14px 20px",
              fontSize: "12px",
              letterSpacing: "0.12em",
              fontWeight: 700,
              cursor: title.trim() && code.trim() && !publishing ? "pointer" : "not-allowed",
            }}
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {publishing ? "PUBLISHING…" : "PUBLISH SCRIPT"}
          </button>
        </div>

        <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.04em", lineHeight: 1.6 }}>
          Publishing shares this script publicly. Every script is auto-scanned again after publishing — the safety badge updates within a few seconds.
        </p>
      </div>
    </div>
  );
}