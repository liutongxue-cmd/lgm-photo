import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as RPointerEvent,
  type MouseEvent as RMouseEvent,
} from "react";
import type { ViewerOpen } from "@/hooks/viewer";
import { fmtExif, type Exif } from "@/types/work";

interface Props {
  data: ViewerOpen;
  onClose: () => void;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Viewer({ data, onClose }: Props) {
  const { list } = data;
  const [idx, setIdx] = useState(data.index);
  const [dir, setDir] = useState<1 | -1>(1);
  const [grown, setGrown] = useState(false);
  const [closing, setClosing] = useState(false);

  // 缩放/平移
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef(0);

  // EXIF
  const [showExif, setShowExif] = useState(false);
  const [liveExif, setLiveExif] = useState<Exif | null>(null);

  // 视频
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(0.8);
  const [ctrl, setCtrl] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const work = list[idx];
  const isVideo = work.type === "video";

  /* ---------- 打开：光晕扩散 ---------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() =>
      requestAnimationFrame(() => setGrown(true))
    );
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = "";
    };
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setGrown(false);
    setTimeout(onClose, 480);
  }, [closing, onClose]);

  const step = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setIdx((i) => (i + d + list.length) % list.length);
      setScale(1);
      setPan({ x: 0, y: 0 });
      setLiveExif(null);
    },
    [list.length]
  );

  /* ---------- 键盘 ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  /* ---------- 滚轮缩放（非被动监听） ---------- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || isVideo) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => {
        const s2 = clamp(s * (e.deltaY < 0 ? 1.16 : 0.86), 1, 4);
        if (s2 === 1) setPan({ x: 0, y: 0 });
        else {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const f = s2 / s - 1;
          setPan((p) => ({ x: p.x - dx * f, y: p.y - dy * f }));
        }
        return s2;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isVideo, idx]);

  /* ---------- 拖拽平移 & 双指缩放 ---------- */
  const onPointerDown = (e: RPointerEvent) => {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = Math.hypot(a.x - b.x, a.y - b.y);
    } else if (scale > 1) {
      dragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: RPointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchRef.current > 0) {
        setScale((s) => clamp(s * (d / pinchRef.current), 1, 4));
      }
      pinchRef.current = d;
    } else if (dragRef.current && scale > 1) {
      setPan({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
    }
  };
  const onPointerUp = (e: RPointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = 0;
    if (pointersRef.current.size === 0) dragRef.current = null;
  };
  const onDblClick = (e: RMouseEvent) => {
    if (isVideo) return;
    if (scale > 1) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    } else {
      const el = stageRef.current!;
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      setScale(2.5);
      setPan({ x: -dx * 1.5, y: -dy * 1.5 });
    }
  };

  /* ---------- 触摸滑动切换 ---------- */
  const swipeX = useRef<number | null>(null);

  /* ---------- EXIF 现场读取 ---------- */
  useEffect(() => {
    if (!showExif || isVideo) return;
    const has = Object.values(work.exif).some(Boolean);
    if (has) {
      setLiveExif(work.exif);
      return;
    }
    const exifr = (window as unknown as { exifr?: { parse: (s: string, o?: object) => Promise<ExifRaw> } }).exifr;
    if (!exifr) return;
    exifr
      .parse(work.src, {
        pick: ["Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength"],
      })
      .then((d) => {
        if (!d) return;
        setLiveExif({
          camera: d.Model,
          lens: d.LensModel,
          aperture: d.FNumber ? `ƒ/${d.FNumber}` : undefined,
          shutter: d.ExposureTime
            ? d.ExposureTime >= 1
              ? `${d.ExposureTime}s`
              : `1/${Math.round(1 / d.ExposureTime)}s`
            : undefined,
          iso: d.ISO ? `ISO ${d.ISO}` : undefined,
          focal: d.FocalLength ? `${Math.round(d.FocalLength)}mm` : undefined,
        });
      })
      .catch(() => {});
  }, [showExif, work, isVideo]);

  /* ---------- 视频控件 ---------- */
  const pokeCtrl = () => {
    setCtrl(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setCtrl(false), 2600);
  };
  useEffect(() => {
    if (!isVideo) return;
    pokeCtrl();
    const v = videoRef.current;
    if (v) v.volume = vol;
    return () => clearTimeout(hideTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideo, idx]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  const toFull = () => {
    const el = boxRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  const exifText = fmtExif(liveExif ?? work.exif);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal>
      {/* 光晕背景 */}
      <div
        className={`viewer-bg ${grown ? "grow" : ""} ${closing ? "shrink" : ""}`}
        style={{ "--ox": `${data.x}px`, "--oy": `${data.y}px` } as React.CSSProperties}
      />

      {/* 舞台 */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDblClick}
        onTouchStart={(e) => {
          if (e.touches.length === 1) swipeX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (swipeX.current === null) return;
          const dx = e.changedTouches[0].clientX - swipeX.current;
          if (Math.abs(dx) > 56 && scale === 1) step(dx < 0 ? 1 : -1);
          swipeX.current = null;
        }}
      >
        {grown && !closing && (
          <figure
            key={`${idx}-${dir}`}
            className={`viewer-stage ${dir === 1 ? "swap-r" : "swap-l"} max-w-[92vw] max-h-[82vh] flex items-center justify-center`}
          >
            {isVideo ? (
              <div
                ref={boxRef}
                className="relative bg-black"
                onMouseMove={pokeCtrl}
                onClick={pokeCtrl}
              >
                <video
                  ref={videoRef}
                  src={work.src}
                  poster={work.poster}
                  className="max-w-[92vw] max-h-[82vh]"
                  playsInline
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
                />
                {/* 视频控件：默认隐藏，悬停/触屏淡入 */}
                <div
                  className={`absolute bottom-0 left-0 right-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 ${
                    ctrl ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="range"
                    min={0}
                    max={dur || 0}
                    step={0.1}
                    value={cur}
                    onChange={(e) => {
                      const t = Number(e.target.value);
                      if (videoRef.current) videoRef.current.currentTime = t;
                      setCur(t);
                    }}
                    className="w-full h-1 accent-[#f5efe4] cursor-pointer"
                  />
                  <div className="flex items-center gap-4 mt-2 text-[#e8e6e1]">
                    <button onClick={togglePlay} className="hover:opacity-70 transition-opacity" aria-label="播放/暂停">
                      {playing ? (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
                      )}
                    </button>
                    <span className="text-xs tracking-widest txt-dim">
                      {fmtTime(cur)} / {fmtTime(dur)}
                    </span>
                    <span className="flex-1" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={vol}
                      onChange={(e) => {
                        const v2 = Number(e.target.value);
                        setVol(v2);
                        if (videoRef.current) videoRef.current.volume = v2;
                      }}
                      className="w-20 h-1 accent-[#f5efe4] cursor-pointer"
                      aria-label="音量"
                    />
                    <button onClick={toFull} className="hover:opacity-70 transition-opacity" aria-label="全屏">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M4 4h6v2H6v4H4zM14 4h6v6h-2V6h-4zM4 14h2v4h4v2H4zM18 14h2v6h-6v-2h4z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={work.src}
                alt={work.title}
                draggable={false}
                className="max-w-[92vw] max-h-[82vh] object-contain shadow-[0_30px_90px_rgba(0,0,0,.7)]"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                  transition: dragRef.current ? "none" : "transform .25s cubic-bezier(.22,.8,.3,1)",
                  cursor: scale > 1 ? "grab" : "zoom-in",
                }}
              />
            )}
          </figure>
        )}

        {/* 左右点击切换区 */}
        {idx > -1 && (
          <>
            <button className="absolute left-0 top-0 bottom-0 w-[16%] z-[5] cursor-w-resize" onClick={() => step(-1)} aria-label="上一张" />
            <button className="absolute right-0 top-0 bottom-0 w-[16%] z-[5] cursor-e-resize" onClick={() => step(1)} aria-label="下一张" />
          </>
        )}
      </div>

      {/* 顶部按钮 */}
      <div className="absolute top-5 right-[4vw] z-[10] flex items-center gap-6">
        {!isVideo && (
          <button
            className={`lux-link text-[11px] tracking-[0.26em] ${showExif ? "active" : ""}`}
            onClick={() => setShowExif(!showExif)}
          >
            EXIF
          </button>
        )}
        <button
          className="text-[#8f8d88] hover:text-[#f5efe4] text-3xl leading-none transition-colors duration-300"
          onClick={close}
          aria-label="关闭"
        >
          ×
        </button>
      </div>

      {/* 底部信息 */}
      <div className="absolute bottom-6 left-[4vw] z-[10] pointer-events-none">
        <div className="font-title text-sm tracking-lux-sm text-[#e8e6e1]">{work.title}</div>
        <div className="text-[10px] tracking-[0.2em] txt-dim mt-1.5">
          {work.date}{exifText && !showExif ? ` · ${exifText}` : ""}
        </div>
      </div>
      <div className="absolute bottom-6 right-[4vw] z-[10] text-[11px] tracking-[0.3em] txt-dim">
        {String(idx + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
      </div>

      {/* EXIF 侧栏 */}
      {showExif && !isVideo && (
        <aside className="absolute top-1/2 -translate-y-1/2 right-[4vw] z-[9] w-56 bg-black/70 backdrop-blur-md border border-white/10 p-5 viewer-stage">
          <div className="text-[10px] tracking-[0.3em] txt-dim mb-4">拍摄参数</div>
          {(
            [
              ["相机", liveExif?.camera ?? work.exif.camera],
              ["镜头", liveExif?.lens ?? work.exif.lens],
              ["光圈", liveExif?.aperture ?? work.exif.aperture],
              ["快门", liveExif?.shutter ?? work.exif.shutter],
              ["感光度", liveExif?.iso ?? work.exif.iso],
              ["焦距", liveExif?.focal ?? work.exif.focal],
            ] as [string, string | undefined][]
          ).map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-[11px] txt-dim tracking-widest">{k}</span>
              <span className="text-[11px] text-[#e8e6e1] tracking-wider">{v ?? "—"}</span>
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}

interface ExifRaw {
  Model?: string;
  LensModel?: string;
  FNumber?: number;
  ExposureTime?: number;
  ISO?: number;
  FocalLength?: number;
}
