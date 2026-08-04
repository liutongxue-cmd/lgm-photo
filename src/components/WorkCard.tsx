import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import type { Work } from "@/types/work";
import { useViewer } from "@/hooks/viewer";

interface Props {
  work: Work;
  list: Work[];
  index: number;
  className?: string;
  children?: ReactNode; // 悬停叠加层内容
}

/* 通用作品缩略图：悬停高光描边 + 斜向柔光扫过 + 轻微放大 + 视频静音预览 */
export default function WorkCard({ work, list, index, className = "", children }: Props) {
  const openViewer = useViewer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clear, setClear] = useState(false);

  const open = (e: MouseEvent) => {
    openViewer({ list, index, x: e.clientX, y: e.clientY });
  };

  const hoverIn = () => {
    if (work.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const hoverOut = () => {
    if (work.type === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <figure
      className={`thumb cursor-zoom-in ${className}`}
      style={work.ratio ? { aspectRatio: `${work.ratio}` } : undefined}
      onClick={open}
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
    >
      <span className="sweep" />
      {work.type === "video" ? (
        <>
          <video
            ref={videoRef}
            className={`w-full h-full object-cover develop ${clear ? "clear" : ""}`}
            src={work.src}
            poster={work.poster}
            muted
            loop
            playsInline
            preload="none"
            onLoadedData={() => setClear(true)}
          />
          <span className="play-breath absolute inset-0 m-auto w-10 h-10 z-[4] pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-[#f5efe4]/90">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </>
      ) : (
        <img
          src={work.thumb}
          alt={work.title}
          loading="lazy"
          decoding="async"
          className={`w-full ${work.ratio ? "absolute inset-0 h-full object-cover" : ""} develop ${clear ? "clear" : ""}`}
          onLoad={() => setClear(true)}
        />
      )}
      {children}
    </figure>
  );
}
