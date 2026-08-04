/* ==========================================================
 * 流光录 · 前端逻辑
 * 传图即更新：读取 GitHub 仓库 photos/ 下各分类文件夹的图片
 * config.js 中 githubUser 留空时进入演示模式（显示示例照片）
 * ========================================================== */
(function () {
  "use strict";
  var CFG = window.SITE || {};
  var CATS = CFG.categories || [];
  var app = document.getElementById("app");

  var state = { photos: [], idx: 0 };

  /* ---------------- 数据 ---------------- */

  // 演示模式：使用在线示例图，让网站框架效果可见
  function demoPhotos(cat) {
    var out = [];
    var ratios = [[900, 1200], [900, 1350], [900, 1100], [900, 640], [900, 1400], [900, 900]];
    for (var i = 1; i <= 12; i++) {
      var r = ratios[i % ratios.length];
      out.push({
        src: "https://picsum.photos/seed/" + cat.id + "-" + i + "/" + r[0] + "/" + r[1],
        name: "作品 " + (i < 10 ? "0" + i : i)
      });
    }
    return out;
  }

  // 正式模式：调用 GitHub API 列出 photos/分类文件夹 中的图片
  function fetchCategory(cat) {
    if (!CFG.githubUser) return Promise.resolve(demoPhotos(cat));
    var cacheKey = "lgl_" + cat.id;
    try {
      var cached = sessionStorage.getItem(cacheKey);
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (e) {}
    var api = "https://api.github.com/repos/" + CFG.githubUser + "/" + CFG.githubRepo +
              "/contents/photos/" + cat.folder + "?ref=" + (CFG.branch || "main");
    return fetch(api).then(function (r) {
      if (!r.ok) return [];
      return r.json();
    }).then(function (list) {
      if (!Array.isArray(list)) return [];
      var imgs = list.filter(function (f) {
        return f.type === "file" && /\.(jpe?g|png|webp)$/i.test(f.name);
      }).map(function (f) {
        return {
          src: "photos/" + cat.folder + "/" + encodeURIComponent(f.name),
          name: f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ")
        };
      });
      // 按文件名倒序：文件名用日期开头时，新作品排在前面
      imgs.sort(function (a, b) { return b.name.localeCompare(a.name, "zh-CN"); });
      try { sessionStorage.setItem(cacheKey, JSON.stringify(imgs)); } catch (e) {}
      return imgs;
    }).catch(function () { return []; });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- 视图 ---------------- */

  // 首页
  function renderHome() {
    document.title = CFG.siteName + " · " + CFG.owner + "摄影集";
    app.innerHTML =
      '<section class="hero">' +
        '<div class="hero-kicker">PHOTOGRAPHY BY ' + esc(CFG.owner) + '</div>' +
        '<h1 class="hero-title"><em>' + esc(CFG.siteName) + '</em></h1>' +
        '<div class="hero-rule"></div>' +
        '<p class="hero-slogan">' + esc(CFG.slogan) + '</p>' +
        '<p class="hero-sub">' + esc(CFG.domain) + '</p>' +
        '<div class="scroll-hint">向下浏览</div>' +
      '</section>' +
      '<div class="wrap">' +
        '<div class="section-head reveal">' +
          '<h2 class="section-title">系列作品</h2>' +
          '<span class="section-note">SERIES</span>' +
        '</div>' +
        '<div class="cat-grid" id="cat-grid"></div>' +
      '</div>';

    var grid = document.getElementById("cat-grid");
    CATS.forEach(function (cat) {
      fetchCategory(cat).then(function (photos) {
        var cover = photos.length ? photos[0].src : "";
        var count = photos.length ? photos.length + " 帧" : "整理中";
        var card = document.createElement("a");
        card.className = "cat-card reveal";
        card.href = "#/g/" + cat.id;
        card.innerHTML =
          '<div class="cat-frame">' +
            (cover ? '<img loading="lazy" src="' + cover + '" alt="' + esc(cat.name) + '">' : "") +
            '<div class="veil"></div>' +
          '</div>' +
          '<div class="cat-meta">' +
            '<div><div class="cat-name">' + esc(cat.name) + '</div>' +
            '<div class="cat-desc">' + esc(cat.desc || "") + '</div></div>' +
            '<div class="cat-count">' + count + '</div>' +
          '</div>';
        grid.appendChild(card);
        observeReveals();
      });
    });
    observeReveals();
  }

  // 画廊页
  function renderGallery(cat) {
    document.title = cat.name + " · " + CFG.siteName;
    app.innerHTML =
      '<div class="wrap">' +
        '<div class="gallery-head">' +
          '<div class="gallery-kicker">SERIES</div>' +
          '<h1 class="gallery-title">' + esc(cat.name) + '</h1>' +
          '<div class="gallery-count" id="g-count">正在整理照片…</div>' +
        '</div>' +
        '<div class="masonry" id="masonry"></div>' +
      '</div>';

    fetchCategory(cat).then(function (photos) {
      var wall = document.getElementById("masonry");
      var countEl = document.getElementById("g-count");
      if (!photos.length) {
        countEl.textContent = "";
        wall.innerHTML =
          '<div class="empty">' +
            '<div class="glyph">待</div>' +
            '<p>这一系列还在整理中，敬请期待</p>' +
          '</div>';
        return;
      }
      countEl.textContent = "共 " + photos.length + " 帧";
      photos.forEach(function (p, i) {
        var fig = document.createElement("figure");
        fig.className = "shot";
        var img = document.createElement("img");
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = p.name;
        img.src = p.src;
        img.onload = function () { img.classList.add("loaded"); };
        var cap = document.createElement("figcaption");
        cap.className = "cap";
        cap.textContent = p.name;
        fig.appendChild(img);
        fig.appendChild(cap);
        fig.addEventListener("click", function () { openLightbox(photos, i); });
        wall.appendChild(fig);
      });
    });
  }

  // 关于我
  function renderAbout() {
    document.title = "关于我 · " + CFG.siteName;
    var bio = (CFG.about.bio || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    app.innerHTML =
      '<div class="wrap about">' +
        '<div class="about-grid">' +
          '<div class="about-photo reveal"><img id="about-img" alt="' + esc(CFG.owner) + '"></div>' +
          '<div class="reveal">' +
            '<div class="about-kicker">ABOUT</div>' +
            '<h1 class="about-title">' + esc(CFG.about.title) + '</h1>' +
            '<div class="about-bio">' + bio + '</div>' +
            '<div class="about-contact">' + esc(CFG.about.contact) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    var img = document.getElementById("about-img");
    // 正式模式优先读取 photos/about.jpg，失败则用示例图
    var probe = new Image();
    probe.onload = function () { img.src = probe.src; };
    probe.onerror = function () {
      img.src = "https://picsum.photos/seed/about-me/800/1000";
    };
    probe.src = CFG.githubUser ? "photos/about.jpg" : "https://picsum.photos/seed/about-me/800/1000";
    observeReveals();
  }

  /* ---------------- 灯箱 ---------------- */

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbTitle = document.getElementById("lb-title");
  var lbExif = document.getElementById("lb-exif");
  var lbCounter = document.getElementById("lb-counter");

  function openLightbox(photos, idx) {
    state.photos = photos;
    state.idx = idx;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    showPhoto();
  }
  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(d) {
    var n = state.photos.length;
    if (!n) return;
    state.idx = (state.idx + d + n) % n;
    showPhoto();
  }
  function showPhoto() {
    var p = state.photos[state.idx];
    lbImg.src = p.src;
    lbTitle.textContent = p.name;
    lbCounter.textContent = (state.idx + 1) + " / " + state.photos.length;
    lbExif.textContent = "";
    showExif(p.src);
  }
  function showExif(src) {
    if (!window.exifr || !exifr.parse) return;
    exifr.parse(src, { pick: ["Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength"] })
      .then(function (d) {
        if (!d) return;
        var parts = [];
        if (d.Model) parts.push(d.Model);
        if (d.LensModel && d.LensModel !== d.Model) parts.push(d.LensModel);
        if (d.FNumber) parts.push("ƒ/" + d.FNumber);
        if (d.ExposureTime) parts.push(d.ExposureTime >= 1 ? d.ExposureTime + "s" : "1/" + Math.round(1 / d.ExposureTime) + "s");
        if (d.ISO) parts.push("ISO " + d.ISO);
        if (d.FocalLength) parts.push(Math.round(d.FocalLength) + "mm");
        lbExif.textContent = parts.join(" · ");
      }).catch(function () {});
  }

  document.querySelector(".lb-close").addEventListener("click", closeLightbox);
  document.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  document.querySelector(".lb-next").addEventListener("click", function () { step(1); });
  document.querySelector(".lb-backdrop").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  // 触屏滑动
  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  /* ---------------- 路由 & 全局 ---------------- */

  function setNav(key) {
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === key);
    });
  }

  function route() {
    var h = location.hash || "#/";
    window.scrollTo(0, 0);
    document.body.classList.remove("nav-open");
    closeLightbox();
    if (h.indexOf("#/g/") === 0) {
      var id = h.slice(4);
      var cat = CATS.find(function (c) { return c.id === id; });
      if (cat) { setNav(id); return renderGallery(cat); }
    }
    if (h === "#/about") { setNav("about"); return renderAbout(); }
    setNav("home");
    renderHome();
  }

  // 滚动显现动画
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  function observeReveals() {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  }

  // 顶栏滚动态 & 移动菜单
  window.addEventListener("scroll", function () {
    document.getElementById("site-header").classList.toggle("scrolled", window.scrollY > 24);
  }, { passive: true });
  document.getElementById("menu-btn").addEventListener("click", function () {
    document.body.classList.toggle("nav-open");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();
})();
