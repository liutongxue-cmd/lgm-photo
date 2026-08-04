import { useEffect } from "react";

/* ============================================================
 * 全局光标聚光：暗房手电效果
 * 桌面端：光标位置为光源中心，带 ~120ms 缓动延迟的丝滑跟随
 * 移动端：触摸点短暂光晕反馈
 * ============================================================ */
export default function Spotlight() {
  useEffect(() => {
    const veil = document.getElementById("veil");
    const spot = document.getElementById("spotlight");
    if (!veil || !spot) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      /* 移动端：单点 → 光晕；滑动 → 流光轨迹 */
      let startX = 0, startY = 0, moved = false;
      let lastX = 0, lastY = 0, lastDot = 0;

      const spawnRipple = (x: number, y: number) => {
        const r = document.createElement("div");
        r.className = "touch-ripple";
        r.style.left = `${x}px`;
        r.style.top = `${y}px`;
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 750);
      };

      const spawnTrail = (x: number, y: number) => {
        const d = document.createElement("div");
        d.className = "touch-trail";
        d.style.left = `${x}px`;
        d.style.top = `${y}px`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 700);
      };

      const onStart = (e: TouchEvent) => {
        const t = e.touches[0];
        startX = lastX = t.clientX;
        startY = lastY = t.clientY;
        moved = false;
      };
      const onMove = (e: TouchEvent) => {
        const t = e.touches[0];
        const dx = t.clientX - lastX;
        const dy = t.clientY - lastY;
        const dist = Math.hypot(dx, dy);
        if (Math.hypot(t.clientX - startX, t.clientY - startY) > 10) moved = true;
        // 沿滑动路径撒光点，形成流光拖尾
        const now = performance.now();
        if (moved && (dist >= 16 || now - lastDot >= 32)) {
          spawnTrail(t.clientX, t.clientY);
          lastX = t.clientX;
          lastY = t.clientY;
          lastDot = now;
        }
      };
      const onEnd = (e: TouchEvent) => {
        if (!moved) {
          const t = e.changedTouches[0];
          spawnRipple(t.clientX, t.clientY);
        }
      };

      window.addEventListener("touchstart", onStart, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd, { passive: true });
      return () => {
        window.removeEventListener("touchstart", onStart);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
    }

    let tx = -800, ty = -800; // 目标
    let cx = -800, cy = -800; // 当前（缓动跟随）
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // 约 120ms 缓动延迟
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      veil.style.setProperty("--mx", `${cx}px`);
      veil.style.setProperty("--my", `${cy}px`);
      spot.style.setProperty("--mx", `${cx}px`);
      spot.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="veil" aria-hidden />
      <div id="spotlight" aria-hidden />
    </>
  );
}
