import { useMemo } from "react";
import { useWorks } from "@/data/loader";
import { streetStories } from "@/data/demo";
import { useReveal } from "@/hooks/use-reveal";
import { useViewer } from "@/hooks/viewer";
import { fmtExif } from "@/types/work";
import SectionHead from "./SectionHead";
import WorkCard from "@/components/WorkCard";

/* 扫街：错落瀑布流 + 组图故事集 */
export default function Street() {
  const { works } = useWorks("street");
  const openViewer = useViewer();
  const wallRef = useReveal<HTMLDivElement>();

  // 按拍摄时间倒序
  const sorted = useMemo(
    () => [...works].sort((a, b) => b.date.localeCompare(a.date)),
    [works]
  );

  // 故事集分组
  const stories = useMemo(
    () =>
      streetStories
        .map((s) => ({
          ...s,
          list: sorted.filter((w) => w.story === s.id),
        }))
        .filter((s) => s.list.length > 0),
    [sorted]
  );

  return (
    <section className="min-h-screen bg-[#060606] pb-28">
      <SectionHead name="扫街" en="STREET" count={sorted.length} desc="街上走走拍拍" />

      {/* 组图故事集 */}
      {stories.length > 0 && (
        <div className="px-[6vw] mb-16">
          <div className="text-[10px] tracking-[0.4em] txt-dim mb-6">组图故事集</div>
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-1 px-1">
            {stories.map((s) => (
              <button
                key={s.id}
                className="group shrink-0 w-[300px] text-left"
                onClick={(e) =>
                  openViewer({ list: s.list, index: 0, x: e.clientX, y: e.clientY })
                }
              >
                <div className="thumb relative aspect-[4/3]">
                  <span className="sweep" />
                  <img
                    src={s.list[0].thumb}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {s.list[1] && (
                    <img
                      src={s.list[1].thumb}
                      alt=""
                      loading="lazy"
                      className="absolute right-3 bottom-3 w-[38%] border-2 border-[#060606] shadow-xl"
                    />
                  )}
                  <span className="absolute top-3 right-3 z-[4] text-[10px] tracking-[0.2em] bg-black/60 backdrop-blur px-2.5 py-1 text-[#e8e6e1]">
                    {s.list.length} 帧
                  </span>
                </div>
                <div className="mt-3 font-title text-sm tracking-lux-sm text-[#e8e6e1] group-hover:text-[#f5efe4] transition-colors">
                  {s.title}
                </div>
                <div className="mt-1 text-[11px] txt-dim leading-relaxed">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 错落瀑布流：紧凑间距，保留原始比例 */}
      <div ref={wallRef} className="reveal px-[6vw]">
        <div className="columns-2 md:columns-3 xl:columns-4 gap-3">
          {sorted.map((w, i) => (
            <div key={w.id} className="break-inside-avoid mb-3">
              <WorkCard work={w} list={sorted} index={i}>
                <figcaption className="absolute inset-x-0 bottom-0 z-[4] p-4 pt-12 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="text-[13px] font-title tracking-widest text-[#f5efe4]">
                    {w.title}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.14em] txt-dim">
                    {w.date}
                    {fmtExif(w.exif) ? ` · ${fmtExif(w.exif)}` : ""}
                  </div>
                </figcaption>
              </WorkCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
