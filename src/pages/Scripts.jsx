import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ScriptCreator from "@/components/scripts/ScriptCreator";
import ScriptCard from "@/components/scripts/ScriptCard";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Safe", value: "safe" },
  { label: "Flagged", value: "flagged" },
  { label: "Dangerous", value: "dangerous" },
];

export default function Scripts() {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreator, setShowCreator] = useState(true);

  const loadScripts = async () => {
    try {
      const list = await base44.entities.Script.list("-created_date", 100);
      setScripts(list);
    } catch (e) {
      setScripts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScripts();
    const unsubscribe = base44.entities.Script.subscribe((event) => {
      setScripts((prev) => {
        if (event.type === "create") return [event.data, ...prev];
        if (event.type === "update") return prev.map((s) => (s.id === event.data.id ? event.data : s));
        if (event.type === "delete") return prev.filter((s) => s.id !== event.data.id);
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const visible = filter === "all" ? scripts : scripts.filter((s) => s.safety_status === filter);

  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* header */}
        <div className="py-16" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>03 /</span>
            <h1
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}
            >
              SCRIPTS
            </h1>
          </div>
          <p className="mt-6 max-w-2xl" style={{ color: "#959595", fontSize: "15px", lineHeight: 1.7 }}>
            A community hub for Roblox scripts. Every shared script is scanned for
            malicious patterns — loadstring payloads, remote fetches, clipboard theft —
            before it reaches the hub. Create, share, and browse with confidence.
          </p>
        </div>

        {/* creator */}
        <div className="py-12" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <button
            onClick={() => setShowCreator(!showCreator)}
            className="font-mono text-xs uppercase mb-6 transition-sharp"
            style={{ color: "#959595", letterSpacing: "0.1em" }}
          >
            {showCreator ? "— HIDE CREATOR" : "+ NEW SCRIPT"}
          </button>
          {showCreator && <ScriptCreator onPublished={() => {}} />}
        </div>

        {/* filters + list */}
        <div className="py-12">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="font-mono text-xs uppercase transition-sharp"
                style={{
                  color: filter === f.value ? "#FFFFFF" : "#959595",
                  border: filter === f.value ? "1px solid #FFFFFF" : "1px solid #1A1A1A",
                  padding: "6px 14px",
                  letterSpacing: "0.1em",
                  backgroundColor: filter === f.value ? "#0D0D0D" : "transparent",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}>
              LOADING…
            </p>
          ) : visible.length === 0 ? (
            <p className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}>
              NO SCRIPTS YET — BE THE FIRST TO SHARE.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visible.map((s) => (
                <ScriptCard key={s.id} script={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}