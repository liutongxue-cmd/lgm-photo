export interface Exif {
  camera?: string;
  lens?: string;
  aperture?: string; // ƒ/1.8
  shutter?: string; // 1/250s
  iso?: string; // ISO 100
  focal?: string; // 85mm
}

export interface Work {
  id: string;
  type: "image" | "video";
  src: string; // 大图 / 视频地址
  thumb: string; // 缩略图地址
  poster?: string; // 视频封面
  title: string;
  date: string; // YYYY-MM-DD，用于排序
  exif: Exif;
  series?: string; // 人像：系列分组
  note?: string; // 生活记录：文字备注
  story?: string; // 扫街：组图故事集 id
  pano?: boolean; // 风景：宽幅全景
  ratio?: number; // 宽/高，用于布局预留空间
}

export const fmtExif = (e: Exif) =>
  [e.camera, e.lens, e.aperture, e.shutter, e.iso, e.focal]
    .filter(Boolean)
    .join(" · ");
