/* ============================================================
 * 流光录 · 网站配置文件
 * 部署时只需要改这一处：把 githubUser 和 githubRepo 填上即可
 * （现在留空 = 演示模式，网站会显示示例照片）
 * ============================================================ */
window.SITE = {

  /* ---- 部署时必填（详见 README.md 第5步） ---- */
  githubUser: "",          // 你的 GitHub 用户名，例如 "liuguangming"
  githubRepo: "",          // 存放本网站的仓库名，例如 "liuguanglu"
  branch: "main",

  /* ---- 网站信息（想改名字/简介就改这里） ---- */
  siteName: "流光录",
  owner: "刘广明",
  domain: "liuguanglu.com",
  slogan: "记录日常的光与影",

  /* ---- 作品系列：id 不能随便改，要和 photos/ 下的文件夹对应 ---- */
  categories: [
    { id: "portrait",  folder: "portrait",  name: "人像",      desc: "光影里的人" },
    { id: "street",    folder: "street",    name: "街拍·人文", desc: "街头的瞬间" },
    { id: "cosplay",   folder: "cosplay",   name: "漫展·COS",  desc: "次元的角色" },
    { id: "landscape", folder: "landscape", name: "风光",      desc: "山河与天色" }
  ],

  /* ---- 关于我（随时可改） ---- */
  about: {
    title: "你好，我是刘广明",
    bio: [
      "一名生活在贵阳的摄影爱好者，用镜头记录日常里的光与影。",
      "从人像到街头，从漫展到山野，我相信最好的照片永远来自真实的瞬间。",
      "器材：尼康 Z5Ⅱ ｜ 镜头：Z 85mm f/1.8 S、Z 24-120mm f/4 S"
    ],
    contact: "小红书 / 抖音 / 微博 全网同名：流光录"
  }
};
