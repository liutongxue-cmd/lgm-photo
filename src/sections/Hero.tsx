import { useEffect, useState } from "react";
import { SITE } from "@/config";
import { featuredWorks } from "@/data/demo";
import type { ViewKey } from "@/components/Navbar";

const DURATION = 6800;

export default function Hero({ go }: { go: (v: ViewKey) => void }) {
  const [cur, setCur] = useState(0);
  const [loaded, setLoaded] = useState<number[]>([]);

  useEffect(() => {
    const t = setInterval(
      () => setCur((c) => (c + 1) % featuredWorks.length),
      DURATION
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* 精选照片轮播：缓慢淡入 + 轻微推移 */}
      {featuredWorks.map((w, i) => (
        <div
          key={w.id}
          className="absolute inset-0 fade-swap"
          style={{ opacity: i === cur ? 1 : 0, zIndex: i === cur ? 1 : 0 }}
        >
          <img
            src={w.src}
            alt={w.title}
            className={`w-full h-full object-cover ${i === cur ? "kenburns" : ""} ${
              loaded.includes(i) ? "" : "opacity-0"
            }`}
            onLoad={() => setLoaded((l) => (l.includes(i) ? l : [...l, i]))}
          />
        </div>
      ))}
      {/* 压暗渐变，烘托文字 */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/20 to-black/40" />

      {/* 署名 + 分类入口 + 滚动提示（同一流式容器，永不重叠） */}
      <div className="absolute z-[3] left-[6vw] right-[6vw] bottom-[5vh]">
        <div className="text-[10px] tracking-[0.5em] txt-dim mb-4">
          A PHOTO JOURNAL
        </div>
        <h1 className="font-title text-[#f5efe4] text-[clamp(40px,8vw,92px)] leading-none tracking-lux">
          {SITE.name}
        </h1>
        <div className="mt-4 text-[11px] tracking-[0.32em] txt-dim">
          {SITE.owner} · {SITE.slogan}
        </div>

        {/* 四大分类入口：手机端 2×2 大间距，桌面端横排 */}
        <nav className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-9">
          {SITE.categories.map((c) => (
            <a
              key={c.id}
              className="lux-link text-[14px] sm:text-[13px] tracking-lux-sm py-1.5"
              onClick={() => go(c.id as ViewKey)}
            >
              {c.name}
              <span className="ml-2 text-[9px] tracking-[0.24em] opacity-60">
                {c.en}
              </span>
            </a>
          ))}
        </nav>

        {/* 滚动提示：跟随内容流排布 */}
        <div className="mt-10 flex items-center gap-3 text-[#8f8d88]">
          <span className="text-[9px] tracking-[0.4em]">向下滑动看看</span>
          <div className="scroll-hint-line" style={{ height: "26px" }} />
        </div>
      </div>

      {/* 轮播序号 */}
      <div className="absolute z-[3] right-[6vw] top-[10vh] sm:top-auto sm:bottom-[6vh] hidden sm:flex items-end gap-2 text-[#8f8d88]">
        <span className="font-title text-2xl text-[#f5efe4]">
          {String(cur + 1).padStart(2, "0")}
        </span>
        <span className="text-xs tracking-[0.3em] mb-1">
          / {String(featuredWorks.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
