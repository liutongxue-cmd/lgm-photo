import { useReveal } from "@/hooks/use-reveal";

interface Props {
  name: string;
  en: string;
  count: number;
  desc?: string;
}

/* 板块通用头部 */
export default function SectionHead({ name, en, count, desc }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal px-[6vw] pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="text-[10px] tracking-[0.5em] txt-dim mb-4">{en}</div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-title text-[clamp(32px,5.6vw,58px)] tracking-lux text-[#f5efe4] leading-tight">
          {name}
        </h2>
        <div className="text-[11px] tracking-[0.28em] txt-dim pb-2">
          {count > 0 ? `${count} 帧` : "整理中"}
          {desc ? ` · ${desc}` : ""}
        </div>
      </div>
    </div>
  );
}
