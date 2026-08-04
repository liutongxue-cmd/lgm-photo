import type { Work } from "@/types/work";

/* 演示模式数据：高质量摄影占位图（picsum），部署后自动替换为真实作品 */

const Z52 = "NIKON Z5Ⅱ";
const L85 = "Z 85mm f/1.8 S";
const L24120 = "Z 24-120mm f/4 S";

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

let n = 0;
const mk = (
  cat: string,
  w: number,
  h: number,
  partial: Partial<Work> = {}
): Work => {
  n += 1;
  const seed = `${cat}-${n}`;
  return {
    id: seed,
    type: "image",
    src: img(seed, Math.min(w * 2, 2400), Math.min(h * 2, 2400)),
    thumb: img(seed, w, h),
    title: partial.title ?? `作品 ${String(n).padStart(2, "0")}`,
    date: partial.date ?? "2026-07-01",
    ratio: w / h,
    exif: partial.exif ?? {
      camera: Z52,
      lens: L85,
      aperture: "ƒ/1.8",
      shutter: "1/250s",
      iso: "ISO 100",
      focal: "85mm",
    },
    ...partial,
  };
};

/* ---------------- 扫街 ---------------- */
export const streetWorks: Work[] = [
  mk("street", 800, 1000, { title: "巷口早点摊", date: "2026-07-20", story: "s1", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "1/320s", iso: "ISO 400", focal: "35mm" } }),
  mk("street", 800, 1200, { title: "雨后的斑马线", date: "2026-07-18", exif: { camera: Z52, lens: L24120, aperture: "ƒ/5.6", shutter: "1/500s", iso: "ISO 800", focal: "50mm" } }),
  mk("street", 800, 600, { title: "市集·挑拣", date: "2026-07-15", story: "s1", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "1/250s", iso: "ISO 640", focal: "42mm" } }),
  mk("street", 800, 1100, { title: "檐下躲雨的人", date: "2026-07-12", story: "s2", exif: { camera: Z52, lens: L85, aperture: "ƒ/2", shutter: "1/400s", iso: "ISO 1000", focal: "85mm" } }),
  mk("street", 800, 800, { title: "市集·吆喝", date: "2026-07-15", story: "s1", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4.5", shutter: "1/200s", iso: "ISO 500", focal: "38mm" } }),
  mk("street", 800, 1300, { title: "老城台阶", date: "2026-07-08", exif: { camera: Z52, lens: L24120, aperture: "ƒ/8", shutter: "1/125s", iso: "ISO 100", focal: "24mm" } }),
  mk("street", 800, 700, { title: "雨夜霓虹", date: "2026-07-05", story: "s2", exif: { camera: Z52, lens: L85, aperture: "ƒ/1.8", shutter: "1/160s", iso: "ISO 3200", focal: "85mm" } }),
  mk("street", 800, 1000, { title: "修表匠", date: "2026-06-30", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "1/200s", iso: "ISO 900", focal: "60mm" } }),
  mk("street", 800, 900, { title: "市集·收摊", date: "2026-07-15", story: "s1", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "1/320s", iso: "ISO 450", focal: "35mm" } }),
  mk("street", 800, 1200, { title: "雨夜归途", date: "2026-07-05", story: "s2", exif: { camera: Z52, lens: L85, aperture: "ƒ/2", shutter: "1/200s", iso: "ISO 2500", focal: "85mm" } }),
  mk("street", 800, 650, { title: "晨光里的公交站台", date: "2026-06-22", exif: { camera: Z52, lens: L24120, aperture: "ƒ/5.6", shutter: "1/640s", iso: "ISO 200", focal: "48mm" } }),
  mk("street", 800, 1050, { title: "巷尾的猫", date: "2026-06-18", exif: { camera: Z52, lens: L85, aperture: "ƒ/2.8", shutter: "1/500s", iso: "ISO 160", focal: "85mm" } }),
];

export const streetStories = [
  { id: "s1", title: "市集一日", desc: "从挑拣到收摊，一个集市的完整呼吸" },
  { id: "s2", title: "雨夜记事", desc: "霓虹、檐下与归途，城市的另一面" },
];

/* ---------------- 人像 ---------------- */
export const portraitWorks: Work[] = [
  mk("portrait", 1000, 1300, { title: "青岩·向日葵与你", date: "2026-07-26", series: "自然光人像", exif: { camera: Z52, lens: L85, aperture: "ƒ/1.8", shutter: "1/800s", iso: "ISO 64", focal: "85mm" } }),
  mk("portrait", 1000, 1250, { title: "侧脸·窗光", date: "2026-07-19", series: "自然光人像", exif: { camera: Z52, lens: L85, aperture: "ƒ/2", shutter: "1/320s", iso: "ISO 200", focal: "85mm" } }),
  mk("portrait", 1000, 1400, { title: "花田逆光", date: "2026-07-26", series: "自然光人像", exif: { camera: Z52, lens: L85, aperture: "ƒ/2.2", shutter: "1/1000s", iso: "ISO 100", focal: "85mm" } }),
  mk("portrait", 1000, 1250, { title: "影棚·单灯", date: "2026-07-10", series: "光影实验", exif: { camera: Z52, lens: L85, aperture: "ƒ/8", shutter: "1/160s", iso: "ISO 64", focal: "85mm" } }),
  mk("portrait", 1000, 1350, { title: "轮廓光", date: "2026-07-10", series: "光影实验", exif: { camera: Z52, lens: L85, aperture: "ƒ/5.6", shutter: "1/200s", iso: "ISO 100", focal: "85mm" } }),
  mk("portrait", 1000, 1300, { title: "漫展·剑与光", date: "2026-07-25", series: "COS人像", exif: { camera: Z52, lens: L85, aperture: "ƒ/1.8", shutter: "1/400s", iso: "ISO 800", focal: "85mm" } }),
  mk("portrait", 1000, 1200, { title: "漫展·回眸", date: "2026-07-25", series: "COS人像", exif: { camera: Z52, lens: L85, aperture: "ƒ/2", shutter: "1/500s", iso: "ISO 640", focal: "85mm" } }),
  mk("portrait", 1000, 1250, { title: "街角偶遇", date: "2026-06-28", series: "自然光人像", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "1/320s", iso: "ISO 320", focal: "70mm" } }),
  {
    ...mk("portrait", 1000, 1250, { title: "特写·呼吸", date: "2026-07-21", series: "光影实验" }),
    id: "portrait-video-1",
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: img("portrait-v1", 1000, 1250),
    thumb: img("portrait-v1", 1000, 1250),
  },
];

/* ---------------- 风景 ---------------- */
export const landscapeWorks: Work[] = [
  mk("land", 1600, 700, { title: "云海日出", date: "2026-07-14", pano: true, exif: { camera: Z52, lens: L24120, aperture: "ƒ/8", shutter: "1/60s", iso: "ISO 64", focal: "24mm" } }),
  mk("land", 900, 1200, { title: "山涧", date: "2026-07-06", exif: { camera: Z52, lens: L24120, aperture: "ƒ/11", shutter: "1/4s", iso: "ISO 64", focal: "28mm" } }),
  mk("land", 1200, 800, { title: "落日熔金", date: "2026-06-25", exif: { camera: Z52, lens: L24120, aperture: "ƒ/8", shutter: "1/125s", iso: "ISO 100", focal: "85mm" } }),
  mk("land", 1600, 640, { title: "群山之脊", date: "2026-06-15", pano: true, exif: { camera: Z52, lens: L24120, aperture: "ƒ/9", shutter: "1/250s", iso: "ISO 64", focal: "35mm" } }),
  mk("land", 900, 1100, { title: "雾中松", date: "2026-06-08", exif: { camera: Z52, lens: L24120, aperture: "ƒ/5.6", shutter: "1/100s", iso: "ISO 200", focal: "50mm" } }),
  mk("land", 1200, 750, { title: "湖面星光", date: "2026-05-30", exif: { camera: Z52, lens: L24120, aperture: "ƒ/4", shutter: "15s", iso: "ISO 1600", focal: "24mm" } }),
  mk("land", 1600, 680, { title: "梯田晨光", date: "2026-05-18", pano: true, exif: { camera: Z52, lens: L24120, aperture: "ƒ/8", shutter: "1/200s", iso: "ISO 64", focal: "30mm" } }),
  mk("land", 900, 1150, { title: "瀑布慢门", date: "2026-05-11", exif: { camera: Z52, lens: L24120, aperture: "ƒ/16", shutter: "1s", iso: "ISO 64", focal: "35mm" } }),
  mk("land", 1200, 800, { title: "雪原孤树", date: "2026-04-20", exif: { camera: Z52, lens: L24120, aperture: "ƒ/10", shutter: "1/400s", iso: "ISO 100", focal: "60mm" } }),
];

/* ---------------- 生活记录 ---------------- */
export const lifeWorks: Work[] = [
  mk("life", 900, 1100, { title: "清晨的咖啡", date: "2026-07-27", note: "周末的第一杯，拉花又失败了，但光很好。" }),
  {
    ...mk("life", 900, 600, { title: "傍晚的云", date: "2026-07-22" }),
    id: "life-video-1",
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: img("life-v1", 900, 600),
    thumb: img("life-v1", 900, 600),
    note: "阳台上看云走过去了，录了一小段。",
  },
  mk("life", 900, 900, { title: "楼下的绣球", date: "2026-07-16", note: "雨后颜色特别浓。" }),
  mk("life", 900, 1200, { title: "加班夜的窗外", date: "2026-07-09", note: "整改材料终于补完，纪念一下。" }),
  mk("life", 900, 700, { title: "露营早餐", date: "2026-06-29", note: "山里信号不好，正好。" }),
  mk("life", 900, 1150, { title: "猫咪监工", date: "2026-06-20", note: "它觉得我修图太慢。" }),
  mk("life", 900, 800, { title: "菜场的烟火气", date: "2026-06-13", note: "周末早起的人有新鲜杨梅吃。" }),
  mk("life", 900, 1000, { title: "书桌一角", date: "2026-06-05", note: "新到的补光灯，先拍张证件照。" }),
];

/* ---------------- 首页精选 ---------------- */
export const featuredWorks: Work[] = [
  portraitWorks[0],
  landscapeWorks[0],
  streetWorks[3],
  portraitWorks[5],
  landscapeWorks[5],
].map((w, i) => ({ ...w, id: `feat-${i}` }));

export const demoByCategory: Record<string, Work[]> = {
  street: streetWorks,
  portrait: portraitWorks,
  landscape: landscapeWorks,
  life: lifeWorks,
};
