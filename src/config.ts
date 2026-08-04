/* ============================================================
 * 流光小记 · 网站配置
 * 部署后只需要改 github.user / github.repo 两处，
 * 网站即自动读取仓库 photos/ 下对应文件夹的真实作品
 * ============================================================ */

export const SITE = {
  name: "流光小记",
  nameEn: "LUMIÈRE · PHOTO JOURNAL",
  owner: "刘广明",
  domain: "liumiere.cn",
  slogan: "随手记录日常",

  /* 部署时填写（留空 = 演示模式，显示高质量占位图） */
  github: {
    user: "liutongxue-cmd",
    repo: "lgm-photo",
    branch: "main",
  },

  categories: [
    { id: "street", folder: "street", name: "扫街", en: "STREET", desc: "街上走走拍拍" },
    { id: "portrait", folder: "portrait", name: "人像", en: "PORTRAIT", desc: "镜头里的他们" },
    { id: "landscape", folder: "landscape", name: "风景", en: "LANDSCAPE", desc: "出门遇见的风景" },
    { id: "life", folder: "life", name: "生活记录", en: "LIFE", desc: "日子里的碎片" },
  ] as const,

  about: {
    title: "你好，我是刘广明",
    bio: [
      "坐标贵阳，一个刚拿起相机不久的摄影新手。",
      "这个网站是我的摄影手记：没有什么宏大的主题，就是走到哪拍到哪——街上的人、朋友的脸、出门遇见的风景，还有日子里那些不值一提却舍不得忘的小事。",
      "技术还在慢慢学，拍得不好请多包涵；如果你也在学摄影，欢迎一起交流进步。",
      "相机：尼康 Z5Ⅱ ｜ 镜头：Z 85mm f/1.8 S、Z 24-120mm f/4 S",
    ],
    contact: [
      { label: "小红书", value: "6979919820" },
      { label: "微信", value: "Liu_tongxue_" },
      { label: "抖音", value: "dyu57gcc0hh0" },
    ],
  },
};

export type CategoryId = (typeof SITE.categories)[number]["id"];
