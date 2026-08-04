import { SITE } from "@/config";
import { demoByCategory } from "@/data/demo";
import { useReveal } from "@/hooks/use-reveal";
import type { ViewKey } from "@/components/Navbar";

/* 首页下半部分：手记简介 + 四个分类入口卡片（让首页可以下滑浏览） */
export default function HomeCards({ go }: { go: (v: ViewKey) => void }) {
  const introRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>();

  return (
    <section className="bg-[#060606] px-[6vw] pt-24 pb-8 md:pt-32">
      {/* 手记式简介 */}
      <div ref={introRef} className="reveal max-w-2xl mx-auto text-center mb-20">
        <div className="text-[10px] tracking-[0.5em] txt-dim mb-6">HELLO</div>
        <p className="font-title text-[clamp(19px,2.8vw,27px)] leading-relaxed tracking-wider text-[#e8e6e1]">
          这里是我的摄影手记。
        </p>
        <p className="mt-5 text-[14px] leading-loose txt-dim">
          刚拿起相机不久，还在慢慢学。
          <br className="hidden sm:block" />
          没有宏大的主题，就是把日常看到的、路过的、舍不得忘的，随手拍下来。
        </p>
      </div>

      {/* 分类卡片 */}
      <div ref={gridRef} className="reveal">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-title text-[15px] tracking-lux text-[#e8e6e1]">随手拍的四类</h2>
          <span className="text-[10px] tracking-[0.3em] txt-dim">点进去看看</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 md:gap-6">
          {SITE.categories.map((c) => {
            const cover = demoByCategory[c.id]?.[0];
            return (
              <a
                key={c.id}
                className="group block cursor-pointer"
                onClick={() => go(c.id as ViewKey)}
              >
                <div className="thumb aspect-[4/5]">
                  <span className="sweep" />
                  {cover && (
                    <img
                      src={cover.thumb}
                      alt={c.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute left-4 bottom-4 z-[4] pointer-events-none">
                    <div className="font-title text-lg tracking-lux-sm text-[#f5efe4]">
                      {c.name}
                    </div>
                    <div className="text-[9px] tracking-[0.26em] text-[#e8e6e1]/70 mt-1">
                      {c.en}
                    </div>
                  </div>
                </div>
                <div className="mt-3.5 flex items-baseline justify-between">
                  <span className="text-[12px] txt-dim tracking-wider">{c.desc}</span>
                  <span className="text-[#8f8d88] group-hover:text-[#f5efe4] group-hover:translate-x-1 transition-all duration-500">
                    →
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
