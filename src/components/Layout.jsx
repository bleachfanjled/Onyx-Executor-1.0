import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-obsidian text-white" style={{ backgroundColor: "#050505" }}>
      <Nav />
      <main>
        <Outlet />
      </main>
      

















      
    </div>);

}