import { useEffect, useState } from "react";
import { SITE } from "@/config";

export type ViewKey = "home" | "street" | "portrait" | "landscape" | "life" | "about";

interface Props {
  view: ViewKey;
  go: (v: ViewKey) => void;
}

export default function Navbar({ view, go }: Props) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  /* 导航栏随滚动自动隐藏/淡入：向上滚动显现，向下滚动隐藏 */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 120);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: { key: ViewKey; label: string }[] = [
    { key: "home", label: "首页" },
    ...SITE.categories.map((c) => ({ key: c.id as ViewKey, label: c.name })),
    { key: "about", label: "关于" },
  ];

  const jump = (v: ViewKey) => {
    setMenu(false);
    go(v);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-500 ${
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        } ${scrolled ? "bg-black/60 backdrop-blur-md border-b border-white/5" : ""}`}
      >
        <div className="flex items-center justify-between px-[5vw] py-5">
          <button onClick={() => jump("home")} className="text-left group">
            <div className="font-title text-lg tracking-lux text-[#f5efe4] group-hover:translate-y-[-1px] transition-transform duration-500">
              {SITE.name}
            </div>
            <div className="text-[9px] tracking-[0.3em] txt-dim mt-1">
              {SITE.nameEn}
            </div>
          </button>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-9">
            {items.map((it) => (
              <a
                key={it.key}
                className={`lux-link text-[13px] tracking-lux-sm ${
                  view === it.key ? "active" : ""
                }`}
                onClick={() => jump(it.key)}
              >
                {it.label}
              </a>
            ))}
          </nav>

          {/* 移动端汉堡 */}
          <button
            className="md:hidden relative w-7 h-5 z-[95]"
            aria-label="菜单"
            onClick={() => setMenu(!menu)}
          >
            <span
              className={`absolute left-0 w-full h-px bg-[#e8e6e1] transition-all duration-400 ${
                menu ? "top-1/2 rotate-45" : "top-1"
              }`}
            />
            <span
              className={`absolute left-0 w-full h-px bg-[#e8e6e1] transition-all duration-400 ${
                menu ? "top-1/2 -rotate-45" : "top-3.5"
              }`}
            />
          </button>
        </div>
      </header>

      {/* 移动端全屏菜单 */}
      <div
        className={`fixed inset-0 z-[85] bg-[#060606] flex flex-col items-center justify-center gap-8 transition-opacity duration-500 md:hidden ${
          menu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {items.map((it, i) => (
          <a
            key={it.key}
            className={`lux-link font-title text-2xl tracking-lux transition-all duration-700 ${
              menu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menu ? `${i * 70 + 100}ms` : "0ms" }}
            onClick={() => jump(it.key)}
          >
            {it.label}
          </a>
        ))}
      </div>
    </>
  );
}
