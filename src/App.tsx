import { useCallback, useState } from "react";
import Navbar, { type ViewKey } from "@/components/Navbar";
import Spotlight from "@/components/Spotlight";
import Viewer from "@/components/Viewer";
import Hero from "@/sections/Hero";
import HomeCards from "@/sections/HomeCards";
import Street from "@/sections/Street";
import Portrait from "@/sections/Portrait";
import Landscape from "@/sections/Landscape";
import Life from "@/sections/Life";
import About from "@/sections/About";
import { ViewerCtx, type ViewerOpen } from "@/hooks/viewer";
import { SITE } from "@/config";

export default function App() {
  const [view, setView] = useState<ViewKey>("home");
  const [veil, setVeil] = useState(false);
  const [viewer, setViewer] = useState<ViewerOpen | null>(null);

  /* 跨板块切换：短暂暗化转场，再亮起呈现新板块 */
  const go = useCallback(
    (v: ViewKey) => {
      if (v === view) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setVeil(true);
      setTimeout(() => {
        setView(v);
        window.scrollTo(0, 0);
        setTimeout(() => setVeil(false), 90);
      }, 340);
    },
    [view]
  );

  const openViewer = useCallback((o: ViewerOpen) => setViewer(o), []);

  return (
    <ViewerCtx.Provider value={openViewer}>
      <Spotlight />
      <Navbar view={view} go={go} />

      <main>
        {view === "home" && (
          <>
            <Hero go={go} />
            <HomeCards go={go} />
          </>
        )}
        {view === "street" && <Street />}
        {view === "portrait" && <Portrait />}
        {view === "landscape" && <Landscape />}
        {view === "life" && <Life />}
        {view === "about" && <About />}

        <footer className="border-t border-white/8 px-[6vw] py-10 mt-16 flex flex-wrap items-baseline justify-between gap-3">
          <span className="font-title text-[12px] tracking-lux text-[#e8e6e1]">
            {SITE.name}
          </span>
          <span className="text-[10px] tracking-[0.26em] txt-dim">
            © {new Date().getFullYear()} {SITE.owner} · {SITE.domain}
          </span>
        </footer>
      </main>

      {/* 章节暗化转场幕布 */}
      <div id="chapter-veil" className={veil ? "on" : ""} aria-hidden />

      {/* 全屏查看器 */}
      {viewer && <Viewer data={viewer} onClose={() => setViewer(null)} />}
    </ViewerCtx.Provider>
  );
}
