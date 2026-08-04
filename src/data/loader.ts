import { useEffect, useState } from "react";
import { SITE } from "@/config";
import type { Work } from "@/types/work";
import { demoByCategory } from "./demo";

/* ============================================================
 * 作品加载：github.user 留空 → 演示数据；
 * 填写后 → 运行时读取 GitHub 仓库 photos/<分类>/ 文件夹，
 * 传图即更新（新增照片无需改代码）
 * ============================================================ */

const IMG_RE = /\.(jpe?g|png|webp)$/i;
const VID_RE = /\.(mp4|webm|mov)$/i;

async function fetchFolder(folder: string): Promise<Work[]> {
  const { user, repo, branch } = SITE.github;
  const api = `https://api.github.com/repos/${user}/${repo}/contents/photos/${folder}?ref=${branch}`;
  const res = await fetch(api);
  if (!res.ok) return [];
  const list: Array<{ name: string; type: string; download_url: string }> =
    await res.json();
  if (!Array.isArray(list)) return [];

  const works = list
    .filter(
      (f) => f.type === "file" && (IMG_RE.test(f.name) || VID_RE.test(f.name))
    )
    .map((f) => {
      const isVideo = VID_RE.test(f.name);
      const base = f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
      return {
        id: `${folder}-${f.name}`,
        type: isVideo ? "video" : "image",
        src: f.download_url,
        thumb: f.download_url,
        poster: isVideo ? f.download_url : undefined,
        title: base,
        date: base.slice(0, 10),
        exif: {}, // 真实照片由查看器现场读取 EXIF
      } as Work;
    });

  // 文件名日期倒序：新作品在前
  works.sort((a, b) => b.title.localeCompare(a.title, "zh-CN"));
  return works;
}

export function useWorks(categoryId: keyof typeof demoByCategory): {
  works: Work[];
  loading: boolean;
} {
  const [works, setWorks] = useState<Work[]>(demoByCategory[categoryId] ?? []);
  const [loading, setLoading] = useState(!!SITE.github.user);

  useEffect(() => {
    if (!SITE.github.user) return;
    let alive = true;
    const cat = SITE.categories.find((c) => c.id === categoryId);
    if (!cat) return;
    setLoading(true);
    fetchFolder(cat.folder)
      .then((list) => {
        if (alive && list.length) setWorks(list);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [categoryId]);

  return { works, loading };
}
