import { useEffect, useRef, useState } from "react";
import { useWorks } from "@/data/loader";
import { useViewer } from "@/hooks/viewer";
import SectionHead from "./SectionHead";
import WorkCard from "@/components/WorkCard";

type Mode = "grid" | "immersive";

/* 风景：宽幅全景混排，网格 / 沉浸视差双视图 */
export default function Landscape() {
  const { works } = useWorks("landscape");
  const openViewer = useViewer();
  const [mode, setMode] = useState<Mode>("immersive");
  const parallaxRef = useRef<HTMLDivElement>(null);

  /* 沉浸模式：滚动视差 */
  useEffect(() => {
    if (mode !== "immersive") return;
    const box = parallaxRef.current;
    if (!box) return;
    const imgs = Array.from(box.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    const tick = () => {
      const vh = window.innerHeight;
      imgs.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 ~ 0.5
        const img = el.querySelector("img");
        if (img) img.style.transform = `translateY(${progress * -9}%)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, works]);

  return (
    <section className="min-h-screen bg-[#060606] pb-28">
      <SectionHead name="风景" en="LANDSCAPE" count={works.length} desc="出门遇见的风景" />

      {/* 视图切换 */}
      <div className="px-[6vw] mb-10 flex gap-7">
        <a
          className={`lux-link text-[12px] tracking-lux-sm ${mode === "immersive" ? "active" : ""}`}
          onClick={() => setMode("immersive")}
        >
          沉浸滚动
        </a>
        <a
          className={`lux-link text-[12px] tracking-lux-sm ${mode === "grid" ? "active" : ""}`}
          onClick={() => setMode("grid")}
        >
          网格视图
        </a>
      </div>

      {mode === "grid" ? (
        /* 网格：宽幅全景与常规画幅混排 */
        <div className="px-[6vw] grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((w, i) => (
            <div key={w.id} className={w.pano ? "md:col-span-2" : ""}>
              <WorkCard work={w} list={works} index={i}>
                <figcaption className="absolute left-0 bottom-0 z-[4] p-5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="text-[13px] font-title tracking-widest text-[#f5efe4]">
                    {w.title}
                  </div>
                  <div className="text-[10px] tracking-[0.18em] txt-dim mt-0.5">{w.date}</div>
                </figcaption>
              </WorkCard>
            </div>
          ))}
        </div>
      ) : (
        /* 沉浸：全宽大图竖向滚动 + 视差 */
        <div ref={parallaxRef}>
          {works.map((w, i) => (
            <div
              key={w.id}
              data-parallax
              className="parallax-box relative w-full mb-[10vh] cursor-zoom-in"
              style={{ height: w.pano ? "62vh" : "88vh" }}
              onClick={(e) =>
                openViewer({ list: works, index: i, x: e.clientX, y: e.clientY })
              }
            >
              <img src={w.src} alt={w.title} loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />
              <div className="absolute left-[6vw] bottom-8 pointer-events-none">
                <div className="font-title text-lg md:text-xl tracking-lux-sm text-[#f5efe4]">
                  {w.title}
                </div>
                <div className="text-[10px] tracking-[0.24em] txt-dim mt-1.5">
                  {w.date}
                  {w.pano ? " · 宽幅全景" : ""}
                </div>
              </div>
              <div className="absolute right-[6vw] bottom-8 text-[11px] tracking-[0.3em] txt-dim pointer-events-none">
                {String(i + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
