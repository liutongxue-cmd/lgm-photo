import { useMemo, useRef, useState } from "react";
import { useWorks } from "@/data/loader";
import { useViewer } from "@/hooks/viewer";
import SectionHead from "./SectionHead";

/* 人像：画廊式居中大图 + 横向滑动 + 系列分组 */
export default function Portrait() {
  const { works } = useWorks("portrait");
  const openViewer = useViewer();
  const [series, setSeries] = useState("全部");
  const [idx, setIdx] = useState(0);
  const videoRefs = useRef(new Map<string, HTMLVideoElement>());
  const swipeX = useRef<number | null>(null);

  const seriesList = useMemo(() => {
    const s = Array.from(new Set(works.map((w) => w.series).filter(Boolean)));
    return ["全部", ...s] as string[];
  }, [works]);

  const list = useMemo(
    () => (series === "全部" ? works : works.filter((w) => w.series === series)),
    [works, series]
  );
  const cur = Math.min(idx, Math.max(0, list.length - 1));
  const current = list[cur];

  const go = (d: 1 | -1) => {
    if (!list.length) return;
    setIdx((i) => (i + d + list.length) % list.length);
  };

  const hoverVideo = (id: string, play: boolean) => {
    const v = videoRefs.current.get(id);
    if (!v) return;
    if (play) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <section className="min-h-screen bg-black pb-24">
      <SectionHead name="人像" en="PORTRAIT" count={list.length} desc="镜头里的他们" />

      {/* 系列分组 */}
      {seriesList.length > 1 && (
        <div className="px-[6vw] mb-10 flex flex-wrap gap-x-7 gap-y-3">
          {seriesList.map((s) => (
            <a
              key={s}
              className={`lux-link text-[12px] tracking-lux-sm ${series === s ? "active" : ""}`}
              onClick={() => {
                setSeries(s);
                setIdx(0);
              }}
            >
              {s}
            </a>
          ))}
        </div>
      )}

      {/* 画廊舞台 */}
      {current && (
        <div className="relative px-[6vw]">
          <div
            className="relative h-[72vh] md:h-[78vh] overflow-hidden"
            onTouchStart={(e) => {
              if (e.touches.length === 1) swipeX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (swipeX.current === null) return;
              const dx = e.changedTouches[0].clientX - swipeX.current;
              if (Math.abs(dx) > 56) go(dx < 0 ? 1 : -1);
              swipeX.current = null;
            }}
          >
            {/* 背景暗化处理 */}
            <img
              src={current.poster ?? current.thumb}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-25"
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* 横向滑动轨道 */}
            <div
              className="absolute left-0 top-0 z-[2] h-full flex transition-transform duration-700"
              style={{
                width: `${list.length * 100}%`,
                transform: `translateX(-${cur * (100 / list.length)}%)`,
                transitionTimingFunction: "cubic-bezier(.22,.8,.3,1)",
              }}
            >
              {list.map((w, i) => (
                <div
                  key={w.id}
                  className="h-full flex items-center justify-center"
                  style={{ width: `${100 / list.length}%` }}
                >
                  {w.type === "video" ? (
                    <div
                      className="relative h-full max-w-[86%] cursor-pointer"
                      onMouseEnter={() => hoverVideo(w.id, true)}
                      onMouseLeave={() => hoverVideo(w.id, false)}
                      onClick={(e) =>
                        openViewer({ list, index: i, x: e.clientX, y: e.clientY })
                      }
                    >
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current.set(w.id, el);
                        }}
                        src={w.src}
                        poster={w.poster}
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="h-full w-auto object-contain shadow-[0_40px_120px_rgba(0,0,0,.8)]"
                      />
                      <span className="play-breath absolute inset-0 m-auto w-12 h-12 pointer-events-none flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-11 h-11 fill-[#f5efe4]/90">
                          <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <img
                      src={w.src}
                      alt={w.title}
                      loading={i === 0 ? "eager" : "lazy"}
                      onClick={(e) =>
                        openViewer({ list, index: i, x: e.clientX, y: e.clientY })
                      }
                      className="max-h-full max-w-[86%] object-contain cursor-zoom-in shadow-[0_40px_120px_rgba(0,0,0,.8)]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 左右切换 */}
            <button
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[5] text-4xl text-[#8f8d88] hover:text-[#f5efe4] transition-colors px-3 py-6"
              onClick={() => go(-1)}
              aria-label="上一张"
            >
              ‹
            </button>
            <button
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[5] text-4xl text-[#8f8d88] hover:text-[#f5efe4] transition-colors px-3 py-6"
              onClick={() => go(1)}
              aria-label="下一张"
            >
              ›
            </button>
          </div>

          {/* 信息栏 */}
          <div className="mt-6 flex items-baseline justify-between">
            <div>
              <div className="font-title tracking-lux-sm text-[#e8e6e1]">
                {current.title}
              </div>
              <div className="mt-1 text-[10px] tracking-[0.24em] txt-dim">
                {current.series ?? "人像"} · {current.date}
              </div>
            </div>
            <div className="text-[11px] tracking-[0.3em] txt-dim">
              {String(cur + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
