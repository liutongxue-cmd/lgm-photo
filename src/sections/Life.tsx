import { useMemo } from "react";
import { useWorks } from "@/data/loader";
import SectionHead from "./SectionHead";
import WorkCard from "@/components/WorkCard";
import { useReveal } from "@/hooks/use-reveal";
import type { Work } from "@/types/work";

/* 生活记录：手账式时间轴，照片与短视频穿插 */
export default function Life() {
  const { works } = useWorks("life");

  // 时间倒序
  const list = useMemo(
    () => [...works].sort((a, b) => b.date.localeCompare(a.date)),
    [works]
  );

  return (
    <section className="min-h-screen bg-[#060606] pb-32">
      <SectionHead name="生活记录" en="LIFE JOURNAL" count={list.length} desc="日子里的碎片" />

      <div className="relative px-[6vw]">
        {/* 时间轴中线 */}
        <div className="absolute left-[6vw] md:left-1/2 top-0 bottom-0 w-px bg-white/8 md:-translate-x-1/2" />

        <div className="space-y-16 md:space-y-24">
          {list.map((w, i) => (
            <TimelineItem key={w.id} work={w} list={list} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  work,
  list,
  index,
}: {
  work: Work;
  list: Work[];
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  const left = index % 2 === 0;
  // 画幅大小错落
  const widthCls = ["md:w-[42%]", "md:w-[34%]", "md:w-[46%]", "md:w-[38%]"][index % 4];

  return (
    <div
      ref={ref}
      className={`reveal relative pl-8 md:pl-0 md:flex ${
        left ? "md:justify-start" : "md:justify-end"
      }`}
    >
      {/* 时间节点 */}
      <span className="absolute left-[6vw] md:left-1/2 top-6 w-2 h-2 rounded-full bg-[#8f8d88] -translate-x-1/2 shadow-[0_0_12px_rgba(255,243,224,.4)]" />

      <div className={`${widthCls} ${left ? "md:pr-10" : "md:pl-10"} md:-mt-2`}>
        <div className="text-[10px] tracking-[0.34em] txt-dim mb-3">{work.date}</div>
        <WorkCard work={work} list={list} index={index} />
        <div className="mt-4">
          <div className="font-title text-[15px] tracking-lux-sm text-[#e8e6e1]">
            {work.title}
          </div>
          {work.note && (
            <p className="mt-2 text-[13px] leading-relaxed txt-dim">{work.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}
