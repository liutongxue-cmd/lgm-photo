import { SITE } from "@/config";
import { useReveal } from "@/hooks/use-reveal";

/* 关于 / 联系：左简介，右联系方式与社交链接 */
export default function About() {
  const leftRef = useReveal<HTMLDivElement>();
  const rightRef = useReveal<HTMLDivElement>();

  return (
    <section className="min-h-screen bg-[#060606] px-[6vw] pt-32 md:pt-44 pb-28">
      <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start">
        {/* 左：个人简介 */}
        <div ref={leftRef} className="reveal">
          <div className="text-[10px] tracking-[0.5em] txt-dim mb-6">ABOUT</div>
          <h2 className="font-title text-[clamp(30px,4.6vw,50px)] tracking-lux-sm text-[#f5efe4] leading-snug mb-10">
            {SITE.about.title}
          </h2>
          {SITE.about.bio.map((p, i) => (
            <p key={i} className="text-[15px] leading-loose text-[#b9b7b2] mb-5 max-w-lg">
              {p}
            </p>
          ))}

          {/* 工作氛围图 */}
          <div className="mt-12 grid grid-cols-2 gap-4 max-w-lg">
            <div className="thumb aspect-[4/5]">
              <span className="sweep" />
              <img
                src="https://picsum.photos/seed/about-work1/600/750"
                alt="工作氛围"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="thumb aspect-[4/5] mt-8">
              <span className="sweep" />
              <img
                src="https://picsum.photos/seed/about-work2/600/750"
                alt="工作氛围"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 右：联系方式 */}
        <div ref={rightRef} className="reveal md:pt-32">
          <div className="text-[10px] tracking-[0.5em] txt-dim mb-8">CONTACT</div>
          <div className="border-t border-white/8">
            {SITE.about.contact.map((c) => (
              <div
                key={c.label}
                className="group flex items-baseline justify-between py-5 border-b border-white/8"
              >
                <span className="text-[12px] tracking-lux-sm txt-dim">{c.label}</span>
                <a className="lux-link font-title text-lg tracking-wider text-[#e8e6e1]">
                  {c.value}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-10 text-[13px] leading-loose txt-dim max-w-sm">
            如果你也在学摄影，或者想约着一起出门拍照、聊聊照片——
            欢迎通过上面的方式找到我。
          </p>

          <div className="mt-16 text-[10px] tracking-[0.4em] txt-dim">
            {SITE.domain}
          </div>
        </div>
      </div>
    </section>
  );
}
