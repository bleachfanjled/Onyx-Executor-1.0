import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-obsidian text-white" style={{ backgroundColor: "#050505" }}>
      <Nav />
      <main>
        <Outlet />
      </main>
      <footer
        className="mt-auto"
        style={{ borderTop: "1px solid #1A1A1A", padding: "32px 24px" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="font-mono text-xs"
            style={{ color: "#959595", letterSpacing: "0.08em" }}
          >
            © 2026 ONYX. ALL RIGHTS RESERVED.
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "#3A3A3A", letterSpacing: "0.06em" }}
          >
            USE AT YOUR OWN RISK.
          </span>
        </div>
      </footer>
    </div>
  );
}