const REQUIREMENT_GROUPS = [
  {
    label: "OPERATING SYSTEM",
    items: [
      { name: "Windows 11 (64-bit)", supported: true },
      { name: "Windows 10 (64-bit, build 19041+)", supported: true },
      { name: "macOS 11 Big Sur or newer", supported: true },
      { name: "Windows 8.1 / 8 / 7", supported: false },
      { name: "Linux", supported: false },
    ],
  },
  {
    label: "HARDWARE",
    items: [
      { name: "Processor", detail: "Dual-core 1.6 GHz or faster", supported: true },
      { name: "Memory (RAM)", detail: "2 GB minimum · 4 GB recommended", supported: true },
      { name: "Storage", detail: "50 MB free disk space", supported: true },
      { name: "Display", detail: "1024 × 768 minimum resolution", supported: true },
    ],
  },
  {
    label: "SOFTWARE DEPENDENCIES",
    items: [
      { name: ".NET Framework 4.8+", detail: "Required for UI runtime (Windows only)", supported: true },
      { name: "Visual C++ 2019 Redistributable", detail: "Required for core libraries (Windows only)", supported: true },
      { name: "Roblox Client", detail: "Latest version installed (Windows & macOS)", supported: true },
      { name: "Active internet connection", detail: "For version checks and updates", supported: true },
    ],
  },
];

export default function Requirements() {
  return (
    <div className="bg-obsidian min-h-screen" style={{ backgroundColor: "#050505", paddingTop: "56px" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="py-16" style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs" style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}>05 /</span>
            <h1
              className="font-heading text-white"
              style={{ fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.04em" }}
            >
              SYSTEM REQUIREMENTS
            </h1>
          </div>
          <p
            className="mt-6 max-w-2xl"
            style={{ color: "#959595", fontSize: "15px", lineHeight: 1.7 }}
          >
            Verify your system meets the minimum specifications below before installing Onyx.
            Running on unsupported configurations may result in instability or failure to launch.
          </p>
        </div>

        {/* Requirement groups */}
        <div>
          {REQUIREMENT_GROUPS.map((group, gIdx) => (
            <div
              key={group.label}
              className="py-12"
              style={{ borderBottom: gIdx < REQUIREMENT_GROUPS.length - 1 ? "1px solid #1A1A1A" : "none" }}
            >
              <p
                className="font-mono text-xs mb-8"
                style={{ color: "#3A3A3A", letterSpacing: "0.12em" }}
              >
                {group.label}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-4 pb-6"
                    style={{ borderBottom: "1px solid #1A1A1A" }}
                  >
                    {/* Status indicator */}
                    <div
                      aria-hidden="true"
                      className="flex-shrink-0 mt-1.5"
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: item.supported ? "#FFFFFF" : "#1A1A1A",
                        border: item.supported ? "none" : "1px solid #3A3A3A",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h3
                          className="font-heading text-white"
                          style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "-0.01em" }}
                        >
                          {item.name}
                        </h3>
                        <span
                          className="font-mono text-xs flex-shrink-0"
                          style={{
                            color: item.supported ? "#FFFFFF" : "#3A3A3A",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {item.supported ? "SUPPORTED" : "NOT SUPPORTED"}
                        </span>
                      </div>
                      {item.detail && (
                        <p
                          className="mt-2"
                          style={{ color: "#959595", fontSize: "13px", lineHeight: 1.6 }}
                        >
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="py-12">
          <div style={{ border: "1px solid #1A1A1A", backgroundColor: "#0D0D0D", padding: "24px" }}>
            <p className="font-mono text-xs mb-3" style={{ color: "#3A3A3A", letterSpacing: "0.1em" }}>
              NOTE
            </p>
            <p style={{ color: "#959595", fontSize: "14px", lineHeight: 1.7 }}>
              Onyx supports Windows 10/11 (64-bit) and macOS 11 Big Sur or newer. Linux is not supported.
              Administrator privileges are required only during installation on Windows, not for daily execution.
            </p>
          </div>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}